import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3900/api/estudiante';

  constructor( private http: HttpClient ) { }

  registrarEstudiante(estudiante: any, foto: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('foto', foto, foto.name);
    formData.append('estudiante', JSON.stringify(estudiante)); // Asegúrate de que el backend pueda manejar este formato

    return this.http.post(`${this.apiUrl}/crearEstudiante`, formData);
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

  obtenerPerfilPorMatricula(matricula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil/${matricula}`);
  }

  actualizarEstudiante(matricula: string, estudiante: any, foto?: File): Observable<any> {
    if (foto) {
      const formData: FormData = new FormData();
      formData.append('foto', foto, foto.name);
      formData.append('estudiante', JSON.stringify(estudiante)); 
  
      return this.http.put(`${this.apiUrl}/updateEstudiante/${matricula}`, formData);
    } else {
      return this.http.put(`${this.apiUrl}/updateEstudiante/${matricula}`, estudiante);
    }
  }

  filtroPorEstatus(estatus: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/getPorEstatus/${estatus}`);
  }


  filtroPorCarrera(carrera: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/getPorCarrera/${carrera}`);
  }


  filtroPorEspecialidad(especialidad: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/getPorEspecialidad/${especialidad}`);
  }

  obtenerCatalogoCarreras(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogoCarreras`);
  }  

  obtenerCatalogoCiudades(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogoCiudades`);
  }  
}