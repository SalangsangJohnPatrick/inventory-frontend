import { Component, OnInit } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';

interface InventoryItem {
  type: string;
  totalQuantity: number;
  totalInventoryValue: number;
  totalProductsSold: number;
  totalSalesValue: number;
}

interface TopProducts {
  brand_name: string;
  products_sold: number;
  sales_value: number;
}

interface LowStock {
  brand_name: string;
  type: string;
  quantity_on_hand: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  items: InventoryItem[] = [];
  topProducts: TopProducts[] = [];
  lowStockItems: LowStock[] = [];

  isLoadingValuation: boolean = true;
  isLoadingTopProducts: boolean = true;
  isLoadingLowStockItems: boolean = true;

  threshold: number = 0;
  inventoryType: string = 'mouse';

  constructor(private inventoryApiService: InventoryApiService) { }

  ngOnInit(): void {
    this.getInventoryValuationReport();
    this.getTopSellingProducts();
    this.getLowStockItems();
  }

  // Method to fetch the inventory valuation report based on the selected type
  getInventoryValuationReport() {
    this.inventoryApiService.getValuationReportByType(this.inventoryType)
      .subscribe((data: any) => {
        console.log(data);
        this.items = Array.isArray(data) ? data : [data];
        this.isLoadingValuation = false;
      }, error => {
        console.error('Error fetching inventory data:', error);
        this.items = [];
        this.isLoadingValuation = false;
      });
  }

  // Method to change the inventory type and fetch new data
  onInventoryTypeChange(type: string) {
    this.inventoryType = type;
    this.getInventoryValuationReport(); // Fetch the data for the new type
  }

  // Fetch top-selling products from API
  getTopSellingProducts() {
    this.inventoryApiService.getTopSellingProducts()
      .subscribe((data: any) => {
        console.log('Top-selling products:', data);
        this.topProducts = Array.isArray(data) ? data : [];
        this.isLoadingTopProducts = false;
      }, error => {
        console.error('Error fetching top-selling products:', error);
        this.topProducts = [];
        this.isLoadingTopProducts = false;
      });
  }

  // Fetch low-stock items from API
  getLowStockItems() {
    this.inventoryApiService.getLowStockItems()
      .subscribe((data: any) => {
        console.log('Low-stock items:', data);

        // Extract lowStockItems from the response
        this.lowStockItems = data.lowStockItems || []; // Safely extract lowStockItems if present
        this.threshold = data.threshold;
        this.isLoadingLowStockItems = false;

      }, error => {
        console.error('Error fetching low-stock items:', error);
        this.lowStockItems = [];
        this.threshold = 0;
        this.isLoadingLowStockItems = false;
      });
  }

}
