import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservacionService {
  private apiUrl = 'http://localhost:3900/api/observacion'

  constructor(private http: HttpClient) { }

  crearObservacion(observacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-observacion`, observacion);
  }

  obtenerDocentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtener-docentes`);
  }

  subirArchivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  descargarPlantilla(): void {
    const url = `${this.apiUrl}/generar-plantilla`;
  
    this.http.get(url, { responseType: 'blob' }).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Registro_Observaciones.xlsx';
      link.click();
    }, error => {
      console.error('Error al descargar la plantilla:', error);
    });
  }
}
