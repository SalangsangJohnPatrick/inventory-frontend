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

  search = '';
  sortField: string = 'id';
  sortOrder: 'ASC' | 'DESC' | '' = 'ASC';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private inventoryApiService: InventoryApiService,
    private _modal: NgbModal
  ) { }

  ngOnInit() {
    this.inventories$ = this.inventoryApiService.inventories$;
    this.isLoading$ = this.inventoryApiService.isLoading$;
    this.getInventoryItems();
  }

  getInventoryItems() {
    this.inventoryApiService.getInventoryItems(this.currentPage, this.itemsPerPage, this.search, this.sortField, this.sortOrder).subscribe(
      response => {
        this.totalItems = response.pagination.total;
      }
    );

    console.log(this.currentPage);
  }
  
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getInventoryItems();
  }

  changeItemsPerPage() {
    this.currentPage = 1;
    this.getInventoryItems();
  }

  onSort(sortEvent: Sort) {
    const sortField = sortEvent.active;
    const sortOrder = sortEvent.direction === 'asc' ? 'ASC' : 'DESC';

    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.getInventoryItems();
  }


  openModal(item: InventoryItem | null = null) {
    const modal = this._modal.open(CreateUpdateModalComponent, { backdrop: 'static', size: 'lg' });
    modal.componentInstance.item = item;
    modal.result.then(
      () => {
        this.getInventoryItems();
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
            this.getInventoryItems();
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
    this.search = event.target.value;
    this.getInventoryItems();
  }
}
