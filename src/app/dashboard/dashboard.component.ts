import { Component, OnInit } from '@angular/core';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import { InventoryItem, InventoryValuation } from '../types/inventory.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  inventoryValuation$: Observable<InventoryValuation[]> = new Observable<InventoryValuation[]>();
  lowStockInventories$: Observable<InventoryItem[]> = new Observable<InventoryItem[]>();
  topSellingInventories$: Observable<InventoryItem[]> = new Observable<InventoryItem[]>();

  isLoading$: Observable<Boolean> = new Observable<Boolean>();
  isLoadingValuation$: Observable<Boolean> = new Observable<Boolean>();

  threshold: number = 100;
  inventoryType: string = 'mouse';

  constructor(private inventoryApiService: InventoryApiService) { }

  ngOnInit(): void {
    this.isLoading$ = this.inventoryApiService.isLoading$;
    this.isLoadingValuation$ = this.inventoryApiService.isLoadingValuation$;
    this.inventoryValuation$ = this.inventoryApiService.inventoryValuation$;
    this.lowStockInventories$ = this.inventoryApiService.lowStockInventories$;
    this.topSellingInventories$ = this.inventoryApiService.topSellingInventories$;

    this.getInventoryValuationReport();
    this.getTopSellingProducts();
    this.getLowStockItems();
  }

  getInventoryValuationReport() {
    this.inventoryApiService.getValuationReportByType(this.inventoryType).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Failed to load:', error);
      }
    });;
  }

  onInventoryTypeChange(type: string) {
    this.inventoryType = type;
    this.getInventoryValuationReport();
  }

  getTopSellingProducts() {
    this.inventoryApiService.getTopSellingProducts().subscribe({
      next: () => {},
      error: (error) => {
        console.error('Failed to load:', error);
      }
    });
  }

  getLowStockItems() {
    this.inventoryApiService.getLowStockItems().subscribe({
      next: (data: any) => {
        this.threshold = data.threshold;
      },
      error: (error) => {
        console.error('Failed to load:', error);
      }
    });
  }

}
