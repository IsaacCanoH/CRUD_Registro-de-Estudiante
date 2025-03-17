import { Component } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante',
  standalone: false,
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent {
  matricula: string = '';
  estudiante: any;
  actividades: any[] = [];
  observaciones: any[] = [];

  constructor(
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  buscarEstudiante() {
    if (this.matricula) {
      this.estudianteService.obtenerPerfilPorMatricula(this.matricula).subscribe(
        (data) => {
          this.estudiante = data.estudiante;
          this.actividades = data.actividades;
          this.observaciones = data.observaciones;
        },
        (error) => {
          console.error('Error al obtener el perfil del estudiante:', error);
          // Manejo de errores, puedes mostrar un mensaje al usuario
        }
      );
    }
  }

  getPhotoUrl(photoPath: string): string {
    if (!photoPath) {
      return '/assets/images/default-profile.jpg'; // Imagen por defecto si no hay foto
    }
    return `http://localhost:3900/${photoPath.replace(/\\/g, '/')}`;
  } 

  editarEstudiante() {
    if (this.estudiante) {
      this.router.navigate(['/ed-ed-dt', this.estudiante.Matricula]);
    }
  }

}
