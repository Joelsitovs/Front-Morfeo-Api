import { Injectable } from '@angular/core';
import { ThreeViewer, IObject3D } from 'threepipe';
import { STLLoadPlugin } from 'threepipe';
import { GLTFLoader, OBJLoader, STLLoader } from 'three-stdlib';
import { Box3, Vector3, BufferGeometry, Mesh, Object3D } from 'three';

@Injectable({
  providedIn: 'root',
})
export class Visor3dService {
  private calcularVolumen(geometry: BufferGeometry): number {
    const position = geometry.attributes['position'];
    let volumen = 0;

    for (let i = 0; i < position.count; i += 3) {
      const ax = position.getX(i);
      const ay = position.getY(i);
      const az = position.getZ(i);

      const bx = position.getX(i + 1);
      const by = position.getY(i + 1);
      const bz = position.getZ(i + 1);

      const cx = position.getX(i + 2);
      const cy = position.getY(i + 2);
      const cz = position.getZ(i + 2);

      volumen +=
        (ax * (by * cz - bz * cy) -
          ay * (bx * cz - bz * cx) +
          az * (bx * cy - by * cx)) /
        6;
    }

    return Math.abs(volumen); // mm³
  }

  async calcularPropiedades(file: File): Promise<{
    dimensiones: string;
    volumen: number; // en cm³
  }> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    let object3D: Object3D;
    let volumenMm3 = 0;

    if (extension === 'stl') {
      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer) as BufferGeometry;
      const mesh = new Mesh(geometry);
      object3D = mesh;

      volumenMm3 = this.calcularVolumen(geometry);
    } else if (extension === 'obj') {
      const text = new TextDecoder().decode(arrayBuffer);
      const loader = new OBJLoader();
      object3D = loader.parse(text);

      object3D.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          const geometry = mesh.geometry as BufferGeometry;
          if (geometry && geometry.attributes['position']) {
            volumenMm3 += this.calcularVolumen(geometry);
          }
        }
      });
    } else if (extension === 'glb' || extension === 'gltf') {
      const loader = new GLTFLoader();
      const blob = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      const gltf = await loader.loadAsync(url);
      object3D = gltf.scene;
      URL.revokeObjectURL(url);
    } else {
      throw new Error(`Formato no soportado: .${extension}`);
    }

    const bbox = new Box3().setFromObject(object3D);
    const size = new Vector3();
    bbox.getSize(size);

    const dimensiones = `${size.x.toFixed(1)} × ${size.y.toFixed(
      1
    )} × ${size.z.toFixed(1)} mm`;

    const volumenCm3 = +(volumenMm3 / 1000).toFixed(2);

    return { dimensiones, volumen: volumenCm3 };
  }

  async generateThumbnail(file: File): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.position = 'absolute';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);

    const viewer = new ThreeViewer({ canvas, msaa: true });
    viewer.addPluginSync(STLLoadPlugin);

    try {
      await viewer.setEnvironmentMap(
        'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr',
        {}
      );

      const object = await viewer.load<IObject3D>(file, {
        autoCenter: true,
        autoScale: true,
      });

      await new Promise((r) => requestAnimationFrame(r)); // Asegurar render

      const thumbnail = canvas.toDataURL('image/png');

      return thumbnail;
    } catch (err) {
      console.error('❌ Error generando thumbnail', err);
      throw err;
    } finally {
      viewer.dispose();
      document.body.removeChild(canvas); // Limpiar
    }
  }
}
