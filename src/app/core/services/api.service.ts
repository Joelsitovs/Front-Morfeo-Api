import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialBase } from '../../interfaces/material';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  getMaterials(): Observable<MaterialBase[]> {
    return this.http.get<MaterialBase[]>(`${this.apiUrl}/api/materials`);
  }
}
