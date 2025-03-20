import { Component, OnInit } from '@angular/core';
import { ObservacionService } from '../../services/observacion.service';
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
  selector: 'app-observacion-docente',
  standalone: false,
  templateUrl: './observacion-docente.component.html',
  styleUrl: './observacion-docente.component.css',
})
export class ObservacionDocenteComponent implements OnInit {
  busqueda: string = '';
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
  isError: boolean = false;
  archivo: File | null = null;
  resultados: any[] = [];
  errorMensaje: { [key: string]: string } = {};

  private busquedaSubject = new BehaviorSubject<string>('');

  constructor(
    private observacionService: ObservacionService,
    private notificacionService: NotificacionService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarDocentes();
    const fechaActual = new Date();
    this.anio = fechaActual.getFullYear();
    this.semestre = fechaActual.getMonth() < 6 ? 1 : 2;
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
    const docenteSeleccionado = this.docentes.find(
      (d) => d.NombreCompletoDocente === this.docente
    );
    this.asignaturas = docenteSeleccionado
      ? docenteSeleccionado.Asignatura
      : [];
  }

  registrarObservacion() {
    if (this.validarFormulario()) {
      const observacionData = {
        MatriculaAlumno: this.matricula,
        NombreCompletoAlumno: this.estudiante,
        NombreCompletoDocente: this.docente,
        NombreAsignatura: this.asignatura,
        Semestre: this.semestre,
        Anio: this.anio,
        Descripcion: this.descripcion,
      };

      this.observacionService.crearObservacion(observacionData).subscribe(
        (res) => {
          console.log('Observacion registrada:', res);
          this.limpiarFormulario();
          this.isError = false;
          this.notificacionService.showNotification(
            'Observacion registrada correctamente'
          );
        },
        (error) => {
          console.error('Error al registrar observacion', error);
          this.isError = true;
          this.notificacionService.showNotification(
            'Error al registrar observacion'
          );
        }
      );
    }
  }

  limpiarFormulario() {
    this.busqueda = '';
    this.matricula = '';
    this.estudiante = '';
    this.docente = '';
    this.asignatura = '';
    this.descripcion = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
    }
  }

  subirArchivo(): void {
    if (this.validarArchivo()) {
      this.observacionService.subirArchivo(this.archivo!).subscribe(
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

  descargarPlantilla(): void {
    this.observacionService.descargarPlantilla();
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
      this.errorMensaje['matricula'] = 'Es obligatoria la matricula';
    }
    if (!this.estudiante) {
      this.errorMensaje['estudiante'] =
        'Es obligatorio el nombre del estudiante';
    }
    if (!this.docente) {
      this.errorMensaje['docente'] = 'Es obligatorio el docente';
    }
    if (!this.asignatura) {
      this.errorMensaje['asignatura'] = 'Es obligatoria la asignauta';
    }
    if (!this.anio) {
      this.errorMensaje['año'] = 'Es obligatorio el año';
    }
    if (!this.semestre) {
      this.errorMensaje['semestre'] = 'Es obligatorio el semestre';
    }
    if(!this.descripcion) {
      this.errorMensaje['descripcion'] = 'Es obligatoria la descripcion'
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
