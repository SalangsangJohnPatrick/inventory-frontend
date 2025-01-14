import { Component } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';

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
  items: InventoryItem[] = [];

  constructor(private inventoryApiService: InventoryApiService) { }

  ngOnInit() {
    this.inventoryApiService.getInventoryItems().subscribe(data => {
      this.items = data;
    },
      error => {
        console.error('Error fetching inventory items:', error);
      }
    );
  }

  onModify(item: any) {
    // Handle modify action
    console.log('Modifying item:', item);
  }

  onDelete(item: any) {
    // Handle delete action
    console.log('Deleting item:', item);
  }
}
