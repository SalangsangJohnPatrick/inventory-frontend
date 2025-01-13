import { Component } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  items = [
    {
      id: 1,
      brandName: 'Gas Kitting',
      type: 'G-7893',
      quantity: 2,
      price: 0.00,
      inventoryValue: 0.00,
      productSold: 0,
      salesValue: 0.00
    },
    {
      id: 2,
      brandName: 'Gas Kitting',
      type: 'G-7893',
      quantity: 2,
      price: 0.00,
      inventoryValue: 0.00,
      productSold: 0,
      salesValue: 0.00
    }
  ]

  onModify(item: any) {
    // Handle modify action
    console.log('Modifying item:', item);
  }

  onDelete(item: any) {
    // Handle delete action
    console.log('Deleting item:', item);
  }
}
