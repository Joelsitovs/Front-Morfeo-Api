import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { BasicUser } from '../../../interfaces/user.interface';
import { DatePipe } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { LucideAngularModule, Settings, Trash } from 'lucide-angular';

@Component({
  selector: 'app-user',
  imports: [
    DatePipe,
    MatTable,
    RouterLink,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatTableModule,
    LucideAngularModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  readonly Settings = Settings;
  readonly Trash = Trash;
  private apiService = inject(ApiService);
  usuarios: BasicUser[] = [];

  ngOnInit(): void {
    this.apiService.getUsers().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      },
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Querés eliminar este usuario?')) return;

    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
      },
      error: (err) => console.error('Error al eliminar', err),
    });
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'roles',
    'created_at',
    'actions',
  ];
}
