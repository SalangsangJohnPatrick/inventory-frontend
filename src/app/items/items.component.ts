import { Component } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import Swal from 'sweetalert2';

interface InventoryItem {
  id: number;
  brand_name: string;
  type: string;
  quantity_on_hand: number;
  price: number;
  inventory_value: number;
  products_sold: number;
  sales_value: number;
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  showAddModal = false;
  showImportModal = false;
  showUpdateModal = false;
  isLoadingInventories = true;

  selectedItem: InventoryItem | null = null;
  inventories: InventoryItem[] = [];
  filteredInventories: InventoryItem[] = [];
  paginatedInventories: InventoryItem[] = [];

  searchQuery = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  math = Math;

  constructor(private inventoryApiService: InventoryApiService) {}

  ngOnInit() {
    this.loadInventoryItems();
  }

  loadInventoryItems() {
    this.inventoryApiService.getInventoryItems().subscribe(data => {
      this.isLoadingInventories = false;
      this.inventories = data;
      this.filteredInventories = this.inventories;
      this.totalItems = this.filteredInventories.length;
      this.paginateInventories();
    },
    error => {
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

  onAddClick() {
    this.showAddModal = true;
  }

  onImportClick() {
    this.showImportModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  closeImportModal() {
    this.showImportModal = false;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedItem = null;
  }

  onModify(item: InventoryItem) {
    this.showUpdateModal = true;
    this.selectedItem = item;
  }

  onAddItem(item: any) {
    this.inventoryApiService.addInventoryItem(item).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Item has been added successfully',
          confirmButtonColor: '#3085d6'
        });
        this.loadInventoryItems();
        this.showAddModal = false;
      },
      error => {
        console.error('Error adding inventory item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error adding the item. Please try again.',
          confirmButtonColor: '#d33'
        });
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

  onUpdateItem(updatedItem: InventoryItem) {
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we update the item',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.inventoryApiService.updateInventoryItem(updatedItem.id, updatedItem).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Item has been updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        this.loadInventoryItems();
        this.showUpdateModal = false;
      },
      error => {
        console.error('Error updating inventory item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an error updating the item. Please try again.',
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
