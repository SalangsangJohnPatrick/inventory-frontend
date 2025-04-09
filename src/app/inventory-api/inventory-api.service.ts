import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InventoryItem } from '../types/inventory.type';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  private _inventories: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<InventoryItem[]>([]);
  private _isLoading: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  get inventories$(): Observable<InventoryItem[]> {
    return this._inventories.asObservable();
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
    sortOrder = ''
  ): Observable<{ data: InventoryItem[], pagination: any }> {
    let params = new HttpParams({ fromObject: {
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
      ...(search && { search }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder })
    }});
  
    return this.http.get<{ data: InventoryItem[], pagination: any }>('http://localhost:8000/GetAllInventoryItems', { params }).pipe(
      tap(response => this._inventories.next(response.data)),
      finalize(() => this._isLoading.next(false))
    );
  }
  
  getValuationReportByType(type: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/InventoryValuationReport/${type}`);
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

  getTopSellingProducts(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/GetTopSellingProducts');
  }

  getLowStockItems(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/GetLowStockItems');
  }
}
