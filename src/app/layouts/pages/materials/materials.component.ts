import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, Plus ,Search} from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { MaterialBase } from '../../../interfaces/material';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materials',
  imports: [LucideAngularModule, NgOptimizedImage, FormsModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css',
})
export class MaterialsComponent implements OnInit {
  readonly Plus = Plus;
  readonly Search = Search;

  private apiService = inject(ApiService);
  private router = inject(Router);
  materials: MaterialBase[] = [];
  filterText: string | null = '';

  filteredMaterials: MaterialBase[] = [];

  ngOnInit(): void {
    this.apiService.getMaterials().subscribe((res) => {
      console.log(res);
      this.materials = res;
      this.filteredMaterials = res;
    });
  }

  onFilterChange(): void {
    const text = (this.filterText || '').toLowerCase();
    this.filteredMaterials = this.materials.filter((mat) =>
      mat.name.toLowerCase().includes(text) ||
      mat.short_description?.toLowerCase().includes(text)
    );
  }
  goToMaterial(slug: string | undefined) {
    if (slug) {
      this.router.navigate(['/materiales', slug]);
    }
  }


}
