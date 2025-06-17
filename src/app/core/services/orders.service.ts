import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/orders`, {
      withCredentials: true,
    });
  }
}
