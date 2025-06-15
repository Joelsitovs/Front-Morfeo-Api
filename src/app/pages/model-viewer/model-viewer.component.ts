import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css'
})
export class ModelViewerComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas3d') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() modelUrl: string | null = null;
  @Input() file: File | null = null;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private modelAdded = false;
  private lastUrl: string | null = null;
  private modelCache = new Map<string, THREE.Object3D>();

  ngAfterViewInit() {
    this.initScene();

    if (this.modelUrl && this.file) {
      this.tryLoadModel();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['modelUrl'] &&
      this.scene &&
      this.modelUrl &&
      this.file &&
      this.modelUrl !== this.lastUrl
    ) {
      this.tryLoadModel();
    }
  }
  private tryLoadModel() {
    const extension = this.file!.name.split('.').pop()?.toLowerCase();
    if (!extension) return;

    this.lastUrl = this.modelUrl;
    this.loadModel(this.modelUrl!, extension);
  }


  initScene() {


    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0); // Fondo gris claro

    const axesHelper = new THREE.AxesHelper(1);
    this.scene.add(axesHelper);

    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, -2, 2);


    this.scene.add(fillLight, ambientLight, directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
  private clearPreviousModel() {
    const toRemove = this.scene.children.filter(obj => obj.userData['dynamic']);
    toRemove.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      this.scene.remove(obj);
    });
    this.modelAdded = false;
  }

  loadModel(url: string, extension: string | undefined) {
    if (!extension) return;

    const cached = this.modelCache.get(url);
    if (cached) {
      this.clearPreviousModel();
      this.scene.add(cached.clone());
      this.modelAdded = true;
      console.log('⚡ Modelo cargado desde cache');
      return;
    }

    this.clearPreviousModel();
    if (extension === 'glb' || extension === 'gltf') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        url,
        (gltf) => {
          const sceneClone = gltf.scene.clone();
          sceneClone.userData['dynamic'] = true;
          this.modelCache.set(url, sceneClone);
          this.scene.add(sceneClone);
          this.modelAdded = true;
          console.log('✅ Modelo GLTF cargado');
        },
        undefined,
        (error) => console.error('❌ Error al cargar .glb/.gltf:', error)
      );
    } else if (extension === 'stl') {
      const stlLoader = new STLLoader();
      stlLoader.load(
        url,
        (geometry) => {
          geometry = geometry.clone().toNonIndexed();
          geometry.computeVertexNormals();
          const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
          const mesh = new THREE.Mesh(geometry, material);

          const edges = new THREE.EdgesGeometry(geometry);
          const edgeLines = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000 })
          );

          // Agrupar ambos
          const group = new THREE.Group();
          group.add(mesh, edgeLines);


          // Escalar el grupo entero
          const box = new THREE.Box3().setFromObject(group);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1 / maxDim;
          group.scale.setScalar(scale);

         /* const scaledBox = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          scaledBox.getCenter(center);
          group.position.sub(center);*/
          const center = new THREE.Vector3();
          new THREE.Box3().setFromObject(group).getCenter(center);
          group.position.sub(center);

          group.userData['dynamic'] = true;
          this.scene.add(group);
          this.modelAdded = true;

          const groupClone = group.clone(true);
          this.modelCache.set(url, groupClone);

          // Reajustar cámara y controles
          this.controls.target.set(0, 0, 0);
          this.camera.position.set(0, 0, 2);
          this.camera.lookAt(0, 0, 0);
          this.camera.updateProjectionMatrix();
          this.controls.update();

          console.log('✅ Modelo STL cargado, escalado y centrado');
        },
        undefined,
        (error) => console.error('❌ Error al cargar .stl:', error)
      );
    } else {
      console.warn('⚠️ Formato no soportado:', extension);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
