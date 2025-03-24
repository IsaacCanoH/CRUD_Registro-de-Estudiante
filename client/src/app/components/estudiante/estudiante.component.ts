import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-estudiante',
  standalone: false,
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent implements OnInit{
  matricula: string = '';
  estudiante: any;
  actividades: any[] = [];
  observaciones: any[] = [];
  notificacionMensaje: string | null = null;
  isError: boolean = false;
  

  constructor(
    private estudianteService: EstudianteService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.notificacionService.notificacionMensaje$.subscribe(mensaje => {
      this.notificacionMensaje = mensaje;
    });
  }

  buscarEstudiante() {
    if (this.matricula) {
      this.estudianteService.obtenerPerfilPorMatricula(this.matricula).subscribe(
        (data) => {
          if (data.message === 'El estudiante está inactivo. No se pueden mostrar los datos.') {
            this.isError = false
            this.notificacionService.showNotification('El estudiante está inactivo. No se pueden mostrar los datos.') ;
            this.estudiante = null; // Limpiar los datos del estudiante
            this.actividades = [];
            this.observaciones = [];
          } else {
            this.estudiante = data.estudiante;
            this.actividades = data.actividades;
            this.observaciones = data.observaciones;
          }
        },
        (error) => {
          console.error('Error al obtener el perfil del estudiante:', error);
          this.isError = true
          this.notificacionService.showNotification('El estudiante está inactivo. No se pueden mostrar los datos.');
          this.estudiante = null;
          this.actividades = [];
          this.observaciones = [];
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
