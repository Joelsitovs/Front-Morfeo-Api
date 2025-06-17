import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../../core/services/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { MaterialDetail } from '../../../../interfaces/material';

@Component({
  selector: 'app-material-id',
  imports: [FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './material-id.component.html',
  styleUrl: './material-id.component.css',
})
export class MaterialIdComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(ActivatedRoute);
  private slug = this.router.snapshot.paramMap.get('slug');
  material?: MaterialDetail;

  ngOnInit() {
    if (!this.slug) return;
    this.apiService
      .getMaterial(this.slug)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.material = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
