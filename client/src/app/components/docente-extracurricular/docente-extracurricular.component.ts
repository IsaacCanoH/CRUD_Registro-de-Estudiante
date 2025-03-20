import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../services/actividad.service';
import { NotificacionService } from '../../services/notificacion.service';
import { EstudianteService } from '../../services/estudiante.service';


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
  errorMensaje: { [key: string]: string } = {}; // Codigo utilizado para las validaciones

  constructor(
    private actividadService: ActividadService,
    private notificacionService: NotificacionService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
    this.cargarDocentes();
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

  buscarEstudiante(): void {
    if (this.busqueda.trim() === '') {
      this.resultados = [];
      return;
    }
  
    if (/\d/.test(this.busqueda)) { 
      this.estudianteService.buscarPorMatricula(this.busqueda).subscribe(
        (res) => {
          this.resultados = [res]; 
        },
        (error) => {
          console.error('Error al buscar por matrícula:', error);
          this.resultados = [];
        }
      );
    } else {
      this.estudianteService.buscarPorNombre(this.busqueda).subscribe(
        (res) => {
          this.resultados = res; 
        },
        (error) => {
          console.error('Error al buscar por nombre:', error);
          this.resultados = [];
        }
      );
    }
  }
  
  
  seleccionarEstudiante(estudiante: any): void {
    this.matricula = estudiante.Matricula;
    this.busqueda = estudiante.nombre;
    this.resultados = [];
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
    }
  }

  subirArchivo(): void {
    if (this.validarArchivo()) { // Codigo utilizado para las validaciones
      this.actividadService.subirArchivo(this.archivo!).subscribe(
        (res) => {
          console.log('Archivo subido con éxito', res);
          this.isError = false;
          this.notificacionService.showNotification(
            'Archivo subido correctamente'
          );
          this.archivo = null; 
          this.limpiarCampoArchivo();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
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

  limpiarCampoArchivo(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  descargarPalntilla(): void {
    this.actividadService.descargarPlantilla();
  }

  // Codigo utilizado para las validaciones 
  validarFormulario(): boolean {  
    this.errorMensaje = {};

    if (!this.matricula) {
      this.errorMensaje['matricula'] = 'Es obligatoria la matrícula.';
    }
    if (!this.docente) {
      this.errorMensaje['docente'] = 'Por favor, seleccione el docente.';
    }
    if (!this.actividad) {
      this.errorMensaje['actividad'] = 'Por favor, seleccione la actividad.';
    }
    if (!this.fechaInicio) {
      this.errorMensaje['fechaInicio'] = 'Por favor, seleccione la fecha de inicio.';
    }
    if (!this.fechaFin) {
      this.errorMensaje['fechaFin'] = 'Por favor, seleccione la fecha de fin.';
    }

    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      if (fechaInicio > fechaFin) {
        this.errorMensaje['fechaFin'] =
          'La fecha de fin no puede ser menor a la fecha de inicio.';
      }
    }
    if (!this.resultado) {
      this.errorMensaje['resultado'] = 'Por favor, seleccione el resultado.';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }

  validarArchivo(): boolean {
    this.errorMensaje = {};

    if (!this.archivo) {
      this.errorMensaje['fileInput'] = 'Por favor, cargue el archivo.';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }
}
