import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  ViewChild,
} from '@angular/core';
import { ThreeViewer, IObject3D } from 'threepipe';
import { STLLoadPlugin } from 'threepipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css',
  imports: [LucideAngularModule],
})
export class ModelViewerComponent implements AfterViewInit {
  readonly X = X;
  readonly dialogRef = inject(MatDialogRef<ModelViewerComponent>);
  @ViewChild('canvas3d') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { file: File; modelUrl: string }
  ) {}

  viewer!: ThreeViewer;

  ngAfterViewInit() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      this.viewer = new ThreeViewer({
        canvas,
        msaa: true,
        dropzone: {
          allowedExtensions: ['stl', 'hdr', 'gltf'],
          addOptions: {
            disposeSceneObjects: true,
            autoSetEnvironment: true,
            autoSetBackground: true,
          },
        },
      });

      this.viewer.addPluginSync(STLLoadPlugin);

      this.setupEnvironment();
      if (this.data?.file) {
        this.loadModel(this.data.file);
      } else {
        console.warn('No se proporcionó ningún archivo para cargar.');
      }
    } else {
      console.error('Canvas no encontrado');
    }
  }

  // Cargar el entorno
  async setupEnvironment() {
    try {
      await this.viewer.setEnvironmentMap(
        'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr',
        {}
      );
    } catch (error) {
      console.error('Error al cargar el entorno HDR:', error);
    }
  }

  async loadModel(file: File) {
    try {
      await this.viewer.load<IObject3D>(file, {
        autoCenter: true,
        autoScale: true,
      });
    } catch (error) {
      console.error('Error al cargar el modelo STL:', error);
    }
  }

}
