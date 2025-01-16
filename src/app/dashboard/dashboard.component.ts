import { Component, OnInit } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';

interface InventoryItem {
  type: string;
  totalQuantity: number;
  totalInventoryValue: number;
  totalProductsSold: number;
  totalSalesValue: number;
}

interface Product {
  name: string;
  quantity: number;
  saleValue: number;
}

interface LowStockItem {
  name: string;
  currentStock: number;
  threshold: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  items: InventoryItem[] = [];
  inventoryType: string = 'mouse';

  constructor(private inventoryApiService: InventoryApiService) {}

  ngOnInit(): void {
    this.getInventoryValuationReport();
  }

  // Method to fetch the inventory valuation report based on the selected type
  getInventoryValuationReport() {
    this.inventoryApiService.getValuationReportByType(this.inventoryType)
      .subscribe((data: any) => {
        console.log(data);
        this.items = Array.isArray(data) ? data : [data];
      }, error => {
        console.error('Error fetching inventory data:', error);
        this.items = [];
      });
  }

  // Method to change the inventory type and fetch new data
  onInventoryTypeChange(type: string) {
    this.inventoryType = type;
    this.getInventoryValuationReport(); // Fetch the data for the new type
  }

  // Top Selling Products
  topSellingProducts: Product[] = [
    { name: 'Keyboard', quantity: 50, saleValue: 1200 },
    { name: 'Mouse', quantity: 30, saleValue: 800 },
    // Add more products as needed
  ];

  // Low Stock Alerts
  lowStockItems: LowStockItem[] = [
    { name: 'Keyboard', currentStock: 2, threshold: 5 },
    { name: 'Mouse', currentStock: 1, threshold: 3 },
    // Add more items as needed
  ];
}
