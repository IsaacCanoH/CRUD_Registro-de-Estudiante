import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3900/api/estudiante';

  constructor( private http: HttpClient ) { }

  registrarEstudiante(estudiante: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearEstudiante`, estudiante);
  }

  obtenerEstudiantes(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllEstudiantes`);
  }

  buscarPorMatricula(matricula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPorMatricula/${matricula}`);
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPorNombre/${nombre}`);
  }
}
