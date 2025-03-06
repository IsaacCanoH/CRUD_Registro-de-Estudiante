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
}
