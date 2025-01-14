import { Component } from '@angular/core';

interface InventoryItem {
  type: string;
  image: string;
  price: string;
  quantity: number;
  status: string;
}

interface Product {
  name: string;
  quantity: number;
  saleValue: number;
}

interface Transaction {
  date: string;
  type: string;
  quantity: number;
  value: number;
}

interface Supplier {
  name: string;
  itemsSupplied: number;
  avgDeliveryTime: number; // In days
  recentOrders: number;
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
export class DashboardComponent {

  // Top Selling Products
  topSellingProducts: Product[] = [
    { name: 'Gas Fitting', quantity: 50, saleValue: 1200 },
    { name: 'Conduit', quantity: 30, saleValue: 800 },
    // Add more products as needed
  ];

  // Low Stock Alerts
  lowStockItems: LowStockItem[] = [
    { name: 'Gas Fitting', currentStock: 2, threshold: 5 },
    { name: 'Conduit', currentStock: 1, threshold: 3 },
    // Add more items as needed
  ];

  constructor() { }

  ngOnInit(): void { }
}
