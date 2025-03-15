import { Component, OnInit  } from '@angular/core';
import { ActividadService } from '../../services/actividad.service';
import { NotificacionService } from '../../services/notificacion.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { EstudianteService } from '../../services/estudiante.service';
import { BehaviorSubject, of } from 'rxjs'

@Component({
  selector: 'app-docente-extracurricular',
  standalone: false,
  templateUrl: './docente-extracurricular.component.html',
  styleUrl: './docente-extracurricular.component.css',
})
export class DocenteExtracurricularComponent implements OnInit{
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
  archivo: File | null = null;
  resultados: any[] = [];
  estudiante: string = '';

  private busquedaSubject = new BehaviorSubject<string>('');

  constructor(
    private actividadService: ActividadService,
    private notificacionService: NotificacionService,
    private estudianteService: EstudianteService
  ) {}


  ngOnInit(): void {
    this.cargarActividades();
    this.cargarDocentes();
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((texto) => 
        texto ? this.buscarEnServicio(texto).pipe(catchError(() => of([]))) : of([])
      )
    ).subscribe(resultados => this.resultados = resultados);
    this.notificacionService.notification.subscribe(message => {
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
        this.notificacionService.showNotification('Actividad asignada correctamente');
      },
      (error) => {
        console.error('Error al registrar actividad:', error);
        this.notificacionService.showNotification('Error al asignar actividad');
      }
    );
  }

  limpiarFormulario() {
    this.matricula = this.docente = this.actividad = this.fechaInicio = this.fechaFin = this.resultado = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
    }
  }

  subirArchivo(): void {
    if (this.archivo) {  
      this.actividadService.subirArchivo(this.archivo).subscribe(
        (res) => {
          console.log('Archivo subido con éxito:', res);
          this.notificacionService.showNotification('Archivo subido correctamente.');
          this.archivo = null;
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          this.notificacionService.showNotification('Error al subir el archivo.');
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
    this.busqueda = this.estudiante; // Muestra el nombre en el input
    this.resultados = []; // Oculta la lista después de seleccionar
  }
}
