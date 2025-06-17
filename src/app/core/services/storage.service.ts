import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = inject(Storage);

  subirArchivo(file: File): Observable<{ url: string }> {
    return new Observable((observer) => {
      const ruta = `morfeo3d/archivos/${Date.now()}_${file.name}`; // Evitás conflictos si suben el mismo nombre
      const archivoRef = ref(this.storage, ruta);

      uploadBytes(archivoRef, file)
        .then(() => getDownloadURL(archivoRef))
        .then((url) => {
          observer.next({ url });
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  subirBlob(path: string, blob: Blob): Promise<string> {
    const archivoRef = ref(this.storage, path);
    return uploadBytes(archivoRef, blob)
      .then(() => getDownloadURL(archivoRef));
  }

}
