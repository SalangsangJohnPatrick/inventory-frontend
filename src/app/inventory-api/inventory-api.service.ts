import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Filter, InventoryItem, InventoryValuation } from '../types/inventory.type';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  private _inventories: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<InventoryItem[]>([]);
  private _inventoryValuation: BehaviorSubject<InventoryValuation[]> = new BehaviorSubject<InventoryValuation[]>([]);
  private _topSellingInventories: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<InventoryItem[]>([]);
  private _lowStockInventories: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<InventoryItem[]>([]);
  private _inventoriesDropdown: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<InventoryItem[]>([]);
  private _isLoading: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);
  private _isLoadingValuation: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  get inventories$(): Observable<InventoryItem[]> {
    return this._inventories.asObservable();
  }

  get inventoryValuation$(): Observable<InventoryValuation[]> {
    return this._inventoryValuation.asObservable();
  }

  get topSellingInventories$(): Observable<InventoryItem[]> {
    return this._topSellingInventories.asObservable();
  }

  get lowStockInventories$(): Observable<InventoryItem[]> {
    return this._lowStockInventories.asObservable();
  }

  get inventoriesDropdown$(): Observable<InventoryItem[]> {
    return this._inventoriesDropdown.asObservable();
  }

  get isLoadingValuation$(): Observable<Boolean> {
    return this._isLoadingValuation.asObservable();
  }

  get isLoading$(): Observable<Boolean> {
    return this._isLoading.asObservable();
  }

  constructor(private http: HttpClient) {}

  getInventoryItems(
    currentPage: number,
    itemsPerPage: number,
    search = '',
    sortField = '',
    sortOrder = '',
    filterForm: Filter
  ): Observable<{ data: InventoryItem[], pagination: any }> {
    const params = {
      currentPage,
      itemsPerPage,
      search,
      sortField,
      sortOrder,
      filterForm
    };
  
    return this.http.post<{ data: InventoryItem[], pagination: any }>('http://localhost:8000/GetAllInventoryItems', params).pipe(
      tap(response => this._inventories.next(response.data)),
      finalize(() => this._isLoading.next(false))
    );
  }

  getInventoryDropdown(): void {
    this.http.get<InventoryItem[]>('http://localhost:8000/GetInventoryDropdown')
      .subscribe((data: InventoryItem[]) => {
        this._inventoriesDropdown.next(data);
      });
  }

  addInventoryItem(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8000/CreateInventoryItem', formData);
  }

  importInventoryItems(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8000/ImportInventoryItems', formData);
  }

  deleteInventoryItem(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8000/DeleteInventoryItem/${id}`);
  }

  updateInventoryItem(id: number, updatedItem: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8000/UpdateInventoryItem/${id}`, updatedItem);
  }

  getValuationReportByType(type: string): Observable<InventoryValuation> {
    this._isLoadingValuation.next(true);
    return this.http.get<{ data: InventoryValuation }>(`http://localhost:8000/InventoryValuationReport/${type}`)
      .pipe(
        map(response => {
          const data = response.data;
          return {
            type: data.type,
            totalQuantity: Number(data.totalQuantity),
            totalInventoryValue: Number(data.totalInventoryValue),
            totalProductsSold: Number(data.totalProductsSold),
            totalSalesValue: Number(data.totalSalesValue),
          };
        }),
        tap(response => this._inventoryValuation.next([response])),
        finalize(() => this._isLoadingValuation.next(false))
      )
  }

  getTopSellingProducts(): Observable<InventoryItem[]> {
    this._isLoading.next(true);
    return this.http.get<InventoryItem[]>('http://localhost:8000/GetTopSellingProducts')
      .pipe(
        tap(response => this._topSellingInventories.next(response)),
        finalize(() => this._isLoading.next(false))
      )
  }

  getLowStockItems(): Observable<InventoryItem[]> {
    this._isLoading.next(true);
    return this.http.get<{ data: InventoryItem[] }>('http://localhost:8000/GetLowStockItems')
      .pipe(
        tap(response => {
          this._lowStockInventories.next(response.data)
        }),
        map(response => response.data),
        finalize(() => this._isLoading.next(false))
      )
  }
}
