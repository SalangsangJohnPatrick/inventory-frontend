import { Component, OnInit } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUpdateModalComponent } from '../create-update-modal/create-update-modal.component';
import { InventoryItem } from '../types/inventory.type';
import Swal from 'sweetalert2';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  isLoadingInventories = true;
  showImportModal = false;

  selectedItem: InventoryItem | null = null;
  inventories: InventoryItem[] = [];
  filteredInventories: InventoryItem[] = [];
  paginatedInventories: InventoryItem[] = [];

  searchQuery = '';
  sortField: string = 'id';
  sortOrder: 'ASC' | 'DESC' | '' = 'ASC';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  math = Math;

  constructor(
    private inventoryApiService: InventoryApiService,
    private _modal: NgbModal
  ) { }

  ngOnInit() {
    this.loadInventoryItems();

  }

  loadInventoryItems() {
    this.inventoryApiService.getInventoryItems(this.sortField, this.sortOrder).subscribe(data => {
      this.inventories = data;
      this.filteredInventories = this.inventories;
      this.paginateInventories();
      this.totalItems = this.filteredInventories.length;
      this.isLoadingInventories = false;
    },
      error => {
        this.isLoadingInventories = false;
        console.error('Error fetching inventory items:', error);
      });
  }

  paginateInventories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInventories = this.filteredInventories.slice(startIndex, endIndex);
  }
  
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.paginateInventories();
  }

  changeItemsPerPage(event: any) {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1;
    this.paginateInventories();
  }

  onSort(sortEvent: Sort) {
    const sortField = sortEvent.active;
    const sortOrder = sortEvent.direction === 'asc' ? 'ASC' : 'DESC';

    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.loadInventoryItems();
  }


  openModal(item: InventoryItem | null = null) {
    const modal = this._modal.open(CreateUpdateModalComponent, { backdrop: 'static', size: 'lg' });
    modal.componentInstance.item = item;
    modal.result.then(
      () => {
        this.loadInventoryItems();
      },
      (reason) => {

      }
    );
  }

  onImportFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'Importing...',
      text: 'Please wait while we process your file',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    this.inventoryApiService.importInventoryItems(formData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Import Successful',
          text: 'Your file has been imported successfully',
          confirmButtonColor: '#3085d6'
        });
        this.loadInventoryItems();
        this.showImportModal = false;
      },
      error => {
        console.error('Error importing file:', error);
        Swal.fire({
          icon: 'error',
          title: 'Import Failed',
          text: 'There was an error importing the file. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  onDelete(item: InventoryItem) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete item ${item.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventoryApiService.deleteInventoryItem(item.id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Item has been deleted successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadInventoryItems();
          },
          error => {
            console.error('Error deleting inventory item:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the item. Please try again.',
              confirmButtonColor: '#d33'
            });
          }
        );
      }
    });
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filteredInventories = this.inventories.filter(inventory =>
      inventory.brand_name.toLowerCase().includes(this.searchQuery) ||
      inventory.type.toLowerCase().includes(this.searchQuery) ||
      inventory.id.toString().includes(this.searchQuery)
    );
    this.totalItems = this.filteredInventories.length;
    this.currentPage = 1;
    this.paginateInventories();
  }
}
