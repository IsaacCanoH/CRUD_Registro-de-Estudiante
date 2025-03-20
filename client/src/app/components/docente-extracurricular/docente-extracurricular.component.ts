import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../services/actividad.service';
import { NotificacionService } from '../../services/notificacion.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { EstudianteService } from '../../services/estudiante.service';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-docente-extracurricular',
  standalone: false,
  templateUrl: './docente-extracurricular.component.html',
  styleUrl: './docente-extracurricular.component.css',
})
export class DocenteExtracurricularComponent implements OnInit {
  busqueda: string = '';
  matricula: string = '';
  docente: string = '';
  actividad: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  resultado: string = '';
  actividades: any[] = [];
  docentes: any[] = [];
  notificacionMensaje: string | null = null;
  isError: boolean = false;
  archivo: File | null = null;
  resultados: any[] = [];
  estudiante: string = '';
  errorMensaje: { [key: string]: string } = {};

  private busquedaSubject = new BehaviorSubject<string>('');

  constructor(
    private actividadService: ActividadService,
    private notificacionService: NotificacionService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
    this.cargarDocentes();
    this.busquedaSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((texto) =>
          texto
            ? this.buscarEnServicio(texto).pipe(catchError(() => of([])))
            : of([])
        )
      )
      .subscribe((resultados) => (this.resultados = resultados));
    this.notificacionService.notificacionMensaje$.subscribe((message) => {
      this.notificacionMensaje = message;
    });
  }

  cargarActividades(): void {
    this.actividadService.obtenerActividades().subscribe(
      (res) => {
        this.actividades = res;
      },
      (error) => {
        console.error('Error al obtener actividades:', error);
      }
    );
  }

  cargarDocentes(): void {
    this.actividadService.obtenerDocentes().subscribe(
      (res) => {
        this.docentes = res;
      },
      (error) => {
        console.error('Error al obtener docentes', error);
      }
    );
  }

  registrarActividad() {
    if (this.validarFormulario()) {
      const actividadData = {
        MatriculaAlumno: this.matricula,
        NombreDocente: this.docente,
        NombreActividadExtracurricular: this.actividad,
        FechaInicio: new Date(this.fechaInicio),
        FechaTermino: new Date(this.fechaFin),
        Resultado: this.resultado,
      };

      this.actividadService.registrarActividad(actividadData).subscribe(
        (res) => {
          console.log('Actividad registrada:', res);
          this.limpiarFormulario();
          this.isError = false;
          this.notificacionService.showNotification(
            'Actividad asignada correctamente'
          );
        },
        (error) => {
          console.error('Error al registrar actividad:', error);
          this.isError = true;
          this.notificacionService.showNotification(
            'Error al asignar actividad'
          );
        }
      );
    }
  }

  limpiarFormulario() {
    this.matricula =
      this.docente =
      this.actividad =
      this.fechaInicio =
      this.fechaFin =
      this.resultado =
        '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
    }
  }

  subirArchivo(): void {
    if (this.validarArchivo()) {
      this.actividadService.subirArchivo(this.archivo!).subscribe(
        (res) => {
          console.log('Archivo subido con éxito', res);
          this.isError = false;
          this.notificacionService.showNotification(
            'Archivo subido correctamente'
          );
          this.archivo = null; // Limpia el archivo después de la carga
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          this.isError = true;
          this.notificacionService.showNotification(
            'Error al subir el archivo'
          );
        }
      );
    }
  }

  descargarPalntilla(): void {
    this.actividadService.descargarPlantilla();
  }

  buscarEstudiante(): void {
    if (this.busqueda.trim() !== '') {
      this.busquedaSubject.next(this.busqueda);
    } else {
      this.resultados = [];
    }
  }

  buscarEnServicio(texto: string) {
    return texto.match(/^\d+$/)
      ? this.estudianteService.buscarPorMatricula(texto)
      : this.estudianteService.buscarPorNombre(texto);
  }

  seleccionarEstudiante(estudiante: any): void {
    this.matricula = estudiante.Matricula;
    this.estudiante = `${estudiante.Nombre} ${estudiante.ApellidoPaterno} ${estudiante.ApellidoMaterno}`;
    this.busqueda = this.estudiante;
    this.resultados = [];
  }

  validarFormulario(): boolean {
    this.errorMensaje = {};

    if (!this.matricula) {
      this.errorMensaje['matricula'] = 'Es obligatorio la matricula';
    }
    if (!this.docente) {
      this.errorMensaje['docente'] = 'Es obligatorio el docente';
    }
    if (!this.actividad) {
      this.errorMensaje['actividad'] = 'Es obligatoria la actividad';
    }
    if (!this.fechaInicio) {
      this.errorMensaje['fechaInicio'] = 'Es obligatoria la fecha de inicio';
    }
    if (!this.fechaFin) {
      this.errorMensaje['fechaFin'] = 'Es obligatoria la fecha de fin';
    }

    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      if (fechaInicio > fechaFin) {
        this.errorMensaje['fechaFin'] =
          'La fecha de fin no puede ser menor a la fecha de inicio';
      }
    }
    if (!this.resultado) {
      this.errorMensaje['resultado'] = 'Es obligatorio el resultado';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }

  validarArchivo(): boolean {
    this.errorMensaje = {};

    if (!this.archivo) {
      this.errorMensaje['fileInput'] = 'Es obligatorio cargar el archivo';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }
}
