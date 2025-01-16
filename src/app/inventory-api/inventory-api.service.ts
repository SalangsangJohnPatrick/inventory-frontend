import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  constructor(private http: HttpClient) {}

  getInventoryItems(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/GetAllInventoryItems');
  }

  getValuationReportByType(type: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/InventoryValuationReport/${type}`);
  }
}
