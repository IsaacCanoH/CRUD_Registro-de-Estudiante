import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-estudiante-editar-datos',
  standalone: false,
  templateUrl: './estudiante-editar-datos.component.html',
  styleUrl: './estudiante-editar-datos.component.css',
})
export class EstudianteEditarDatosComponent implements OnInit {
  matricula: string = '';
  estudiante: any = {};
  notificacionMensaje: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private router: Router,
    private notificacionService: NotificacionService,
  ) {}

  ngOnInit() {
    this.matricula = this.route.snapshot.paramMap.get('matricula') || '';
    this.obtenerEstudiante();
    this.notificacionService.notification.subscribe(message => {
      this.notificacionMensaje = message;  
    });
  }

  obtenerEstudiante() {
    this.estudianteService.obtenerPerfilPorMatricula(this.matricula).subscribe(
      (data) => {
        this.estudiante = data.estudiante;
      },
      (error) => {
        console.error('Error al obtener el perfil del estudiante:', error);
      }
    );
  }

  actualizarEstudiante() {
    this.estudianteService
      .actualizarEstudiante(this.matricula, this.estudiante)
      .subscribe(
        (response) => {
          console.log('Estudiante actualizado:', response);
          this.notificacionService.showNotification('Actualizacion exitosa')
          this.router.navigate(['/ed']);
        },
        (error) => {
          console.error('Error al actualizar el estudiante:', error);
        }
      );
  }
}
