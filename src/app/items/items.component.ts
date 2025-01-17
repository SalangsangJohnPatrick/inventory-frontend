import { Component, ViewChild } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import { ModalsComponent } from '../modals/modals.component';

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
  @ViewChild(ModalsComponent) modalsComponent: ModalsComponent | undefined;

  showAddModal = false;
  showImportModal = false;
  items: InventoryItem[] = [];

  constructor(private inventoryApiService: InventoryApiService) {}

  ngOnInit() {
    this.loadInventoryItems();
  }

  loadInventoryItems() {
    this.inventoryApiService.getInventoryItems().subscribe(data => {
      this.items = data;
    },
    error => {
      console.error('Error fetching inventory items:', error);
    });
  }

  onModify(item: InventoryItem) {
    console.log('Modifying item:', item);
  }

  onDelete(item: InventoryItem) {
    console.log('Deleting item:', item);
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

  onAddItem(item: any) {
    this.inventoryApiService.addInventoryItem(item).subscribe(() => {
      this.loadInventoryItems(); // Reload the inventory list after adding the item
      this.modalsComponent?.closeAddModalHandler(); // Close the Add Item Modal
    }, error => {
      console.error('Error adding inventory item:', error);
      alert('There was an error adding the item. Please try again.');
    });
  }

  onImportFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.inventoryApiService.importInventoryItems(formData).subscribe(() => {
      this.loadInventoryItems();
      this.modalsComponent?.closeImportModalHandler();
    }, error => {
      console.error('Error importing file:', error);
    });
  }
}
