import { Component, OnInit } from '@angular/core';
import { ObservacionService } from '../../services/observacion.service';
import { NotificacionService } from '../../services/notificacion.service';
import { error, timeStamp } from 'console';

@Component({
  selector: 'app-observacion-docente',
  standalone: false,
  templateUrl: './observacion-docente.component.html',
  styleUrl: './observacion-docente.component.css'
})
export class ObservacionDocenteComponent implements OnInit{
  matricula: string = ''; 
  estudiante: string = '';
  docente: string = '';
  asignatura: string = '';
  anio: number = 0;
  semestre: number = 0;
  descripcion: string = '';
  docentes: any[] = [];
  asignaturas: string[] = [];
  notificacionMensaje: string | null = null;

  constructor(
    private observacionService: ObservacionService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarDocentes();
    this.notificacionService.notification.subscribe(message => {
      this.notificacionMensaje = message;  
    });
  }

  cargarDocentes(): void {
    this.observacionService.obtenerDocentes().subscribe(
      (res) => {
        this.docentes = res;
      },
      (error) => {
        console.error('Error al obtener docentes');
      }
    );
  }

  actualizarAsignaturas(): void {
    const docenteSeleccionado = this.docentes.find(d => d.NombreCompletoDocente === this.docente);
    this.asignaturas = docenteSeleccionado ? docenteSeleccionado.Asignatura : [];
  }

  registrarObservacion() {
    const observacionData = {
      MatriculaAlumno: this.matricula,
      NombreCompletoAlumno: this.estudiante,
      NombreCompletoDocente: this.docente,
      NombreAsignatura: this.asignatura,
      Semestre: this.semestre,
      Año: this.anio,
      Descripcion: this.descripcion,
    }

    this.observacionService.crearObservacion(observacionData).subscribe(
      (res) => {
        console.log('Observacion registrada:', res);
        this.limpiarFormulario();
        this.notificacionService.showNotification('Observacion registrada correctamente');
      },
      (error) => {
        console.error('Error al registrar observacion', error);
        this.notificacionService.showNotification('Erro al registrar observacion');
      }
    );
  }

  limpiarFormulario() {
    this.matricula = '';
    this.estudiante = '';
    this.docente = '';
    this.asignatura = '';
    this.anio = 0; // Debe ser un número
    this.semestre = 0; // Debe ser un número
    this.descripcion = '';
  }
  
}
