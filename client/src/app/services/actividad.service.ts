import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = 'http://localhost:3900/api/actividad'

  constructor( private http: HttpClient ) { }

  registrarActividad(actividad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-actividad`, actividad);
  }

  obtenerActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtener-actividades`);
  }

  obtenerDocentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtener-docente`);
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
      link.download = 'Registro_Actividades.xlsx';
      link.click();
    }, error => {
      console.error('Error al descargar la plantilla:', error);
    });
  }
  
}
