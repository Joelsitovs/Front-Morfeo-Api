import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialBase, MaterialDetail } from '../../interfaces/material';
import { Observable } from 'rxjs';
import { BasicUser, User } from '../../interfaces/user.interface';

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

  getMaterial(slug: string | null): Observable<MaterialDetail> {
    return this.http.get<MaterialDetail>(
      `${this.apiUrl}/api/materials/${slug}`
    );
  }

  getUsers(): Observable<BasicUser[]> {
    return this.http.get<BasicUser[]>(`${this.apiUrl}/api/users`, {
      withCredentials: true,
    });
  }
  updateUser(id: number, data: Partial<BasicUser>): Observable<BasicUser> {
    return this.http.put<BasicUser>(`${this.apiUrl}/api/users/${id}`, data, {
      withCredentials: true,
    });
  }
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/users/${id}`, {
      withCredentials: true,
    });
  }

}
