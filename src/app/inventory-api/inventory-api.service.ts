import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  constructor(private http: HttpClient) {}

  getInventoryItems(sortField: string = '', sortOrder: string = ''): Observable<any> {
    const params = new HttpParams()
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    return this.http.get<any>('http://localhost:8000/GetAllInventoryItems', { params });
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
