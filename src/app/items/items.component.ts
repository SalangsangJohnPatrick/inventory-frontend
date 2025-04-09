import { Component, OnInit } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUpdateModalComponent } from '../create-update-modal/create-update-modal.component';
import { InventoryItem } from '../types/inventory.type';
import Swal from 'sweetalert2';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  showImportModal = false;
  isLoading$: Observable<Boolean> = new Observable<Boolean>();

  selectedItem: InventoryItem | null = null;
  inventories$: Observable<InventoryItem[]> = new Observable<InventoryItem[]>();

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
    this.inventories$ = this.inventoryApiService.inventories$;
    this.isLoading$ = this.inventoryApiService.isLoading$;

    console.log(this.inventories$.pipe());
    console.log(this.isLoading$.pipe());
    this.inventoryApiService.getInventoryItems(this.sortField, this.sortOrder).subscribe();
  }

  // paginateInventories() {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedInventories = this.filteredInventories.slice(startIndex, endIndex);
  // }
  
  // changePage(pageNumber: number) {
  //   this.currentPage = pageNumber;
  //   this.paginateInventories();
  // }

  // changeItemsPerPage(event: any) {
  //   this.itemsPerPage = +event.target.value;
  //   this.currentPage = 1;
  //   this.paginateInventories();
  // }

  onSort(sortEvent: Sort) {
    const sortField = sortEvent.active;
    const sortOrder = sortEvent.direction === 'asc' ? 'ASC' : 'DESC';

    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.inventoryApiService.getInventoryItems(this.sortField, this.sortOrder).subscribe();
  }


  openModal(item: InventoryItem | null = null) {
    const modal = this._modal.open(CreateUpdateModalComponent, { backdrop: 'static', size: 'lg' });
    modal.componentInstance.item = item;
    modal.result.then(
      () => {
        this.inventoryApiService.getInventoryItems(this.sortField, this.sortOrder).subscribe();
      },
      (reason) => {

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
            this.inventoryApiService.getInventoryItems(this.sortField, this.sortOrder).subscribe();
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

  // onSearch(event: any) {
  //   this.searchQuery = event.target.value.toLowerCase();
  //   this.filteredInventories = this.inventories.filter(inventory =>
  //     inventory.brand_name.toLowerCase().includes(this.searchQuery) ||
  //     inventory.type.toLowerCase().includes(this.searchQuery) ||
  //     inventory.id.toString().includes(this.searchQuery)
  //   );
  //   this.totalItems = this.filteredInventories.length;
  //   this.currentPage = 1;
  //   this.paginateInventories();
  // }
}
