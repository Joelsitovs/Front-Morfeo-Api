import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-vision',
  imports: [FormsModule, LucideAngularModule, NgOptimizedImage],
  templateUrl: './vision.component.html',
  styleUrl: './vision.component.css',
})
export class VisionComponent {}
