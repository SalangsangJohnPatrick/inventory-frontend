import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Auth } from '../types/auth.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000';
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this._isAuthenticated.next(true);
      }),
      catchError(error => {
        this._isAuthenticated.next(false);
        throw error;
      })
    );
  }

  signup(name: string, email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/signup`, { name, email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this._isAuthenticated.next(true);
      }),
      catchError(error => {
        this._isAuthenticated.next(false);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
