import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';
import * as XLSX from 'xlsx';
import { NotificacionService } from '../../services/notificacion.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-servicios-escolares',
  standalone: false,
  templateUrl: './servicios-escolares.component.html',
  styleUrl: './servicios-escolares.component.css',
})
export class ServiciosEscolaresComponent implements OnInit {
  searchQuery: string = '';
  activeTab: string = 'personal';
  searchPerformed: boolean = false;
  selectedStudent: any = null;
  estudiantes: any[] = [];
  isModalOpen: boolean = false;
  estatus: string = '';
  carrera: string = '';
  especialidad: string = '';
  semestre: number | null = null;
  anio: number | null = null;
  estudiantesFiltrados: any[] = [];
  notificacionMensaje: string | null = null;
  isError: boolean = false;
  matricula: string = '';
  catalogoCarreras: any[] = [];
  especialidadesDisponibles: string[] = [];

  constructor(
    private estudianteService: EstudianteService, 
    private notificacionService: NotificacionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificacionService.notificacionMensaje$.subscribe(mensaje => {
      this.notificacionMensaje = mensaje;
    });
    this.obtenerEstudiantes();
    this.obtenerCatalogoCarreras();
  }

  busqueda(): void {
    this.searchPerformed = true;
    if (this.searchQuery.trim()) {
        const esSoloNumeros = /^[0-9]+$/.test(this.searchQuery); // Solo números
        const esFormatoMatricula = /^[0-9A-Za-z]+$/.test(this.searchQuery) && /\d/.test(this.searchQuery);
        const esNombre = /\s/.test(this.searchQuery) || /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/.test(this.searchQuery); 

        if (esSoloNumeros || esFormatoMatricula) {
            this.estudianteService.buscarPorMatricula(this.searchQuery).subscribe(
                (data) => {
                    this.selectedStudent = data;
                    this.matricula = this.selectedStudent.Matricula;
                },
                (error) => {
                    console.error('Error al buscar por matrícula', error);
                    this.selectedStudent = null; 
                }
            );
        } else if (esNombre) {
            this.estudianteService.buscarPorNombre(this.searchQuery).subscribe(
                (data) => {
                    this.selectedStudent = data.length > 0 ? data[0] : null;
                    this.matricula = this.selectedStudent.Matricula;
                },
                (error) => {
                    console.error('Error al buscar por nombre', error);
                    this.selectedStudent = null; 
                }
            );
        }
    } else {
        this.selectedStudent = null;
    }
  }

  obtenerCatalogoCarreras() {
    this.estudianteService.obtenerCatalogoCarreras().subscribe(
      (data) => {
        this.catalogoCarreras = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
      }
    );
  }

  onCarreraChange() {
    const carreraSeleccionada = this.catalogoCarreras.find(
      (carrera) => carrera.NombreCarrera == this.carrera
    );

    if (carreraSeleccionada) {
      this.especialidadesDisponibles = carreraSeleccionada.Especialidades;
    } else {
      this.especialidadesDisponibles = [];
    }
  }

  activaTab(tab: string): void {
    this.activeTab = tab;
  }

  editarEstudiante() {
    console.log("La matricula es: "+this.matricula);
    if (this.matricula) {
      console.log("La matricula es esta: "+this.matricula);
      this.router.navigate(['/se-ed-ed', this.matricula]);
    }
  }

  formatoFecha(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  obtenerFotoUrl(photoPath: string): string {
    if (!photoPath) {
      return '/assets/images/default-profile.jpg';
    }
    return `http://localhost:3900/${photoPath.replace(/\\/g, '/')}`;
  }

  obtenerEstudiantes(): void {
    this.estudianteService.obtenerEstudiantes().subscribe(
      (data) => {
        this.estudiantes = data;
        this.estudiantesFiltrados = data; 
      },
      (error) => {
        console.error('Error al obtener estudiantes', error);
      }
    );
  }  

  abrirModal(): void {
    this.isModalOpen = true;
  }
  
  cerrarModal(): void {
    this.isModalOpen = false;
  }

  aplicarFiltros(): void {
    let estudiantesFiltrados = this.estudiantes;
  
    if (this.estatus.trim()) {
      estudiantesFiltrados = estudiantesFiltrados.filter(estudiante =>
        estudiante.Estatus.toLowerCase() === this.estatus.toLowerCase()
      );
    }
  
    if (this.carrera.trim()) {
      estudiantesFiltrados = estudiantesFiltrados.filter(estudiante =>
        estudiante.NombreCarrera.toLowerCase().includes(this.carrera.toLowerCase())
      );
    }
  
    if (this.especialidad.trim()) {
      estudiantesFiltrados = estudiantesFiltrados.filter(estudiante =>
        estudiante.Especialidad.toLowerCase().includes(this.especialidad.toLowerCase())
      );
    }

    if (this.semestre != null) {
      estudiantesFiltrados = estudiantesFiltrados.filter(estudiante => 
        estudiante.Semestre === this.semestre   
      )
    }

    if (this.anio != null) {
      estudiantesFiltrados = estudiantesFiltrados.filter(estudiante => 
        estudiante.Anio === this.anio   
      )
    }
  
    this.estudiantesFiltrados = estudiantesFiltrados; 
    this.cerrarModal();
  }

  restaurarDatos(): void {
    this.estatus = '';
    this.carrera = '';
    this.especialidad = '';
    this.semestre = null;
    this.anio = null;
    this.estudiantesFiltrados = [...this.estudiantes]; 
    this.cerrarModal();
  }

  exportarExcel() {
    const datos = this.estudiantesFiltrados.map((estudiante) => ({
      Matrícula: estudiante.Matricula,
      Nombre: `${estudiante.Nombre} ${estudiante.ApellidoPaterno} ${estudiante.ApellidoMaterno}`,
      Carrera: estudiante.NombreCarrera,
      Especialidad: estudiante.Especialidad,
      FechaAlta: estudiante.FechaAlta ? new Date(estudiante.FechaAlta).toLocaleDateString('es-MX') : '',
      Estatus: estudiante.Estatus
    }));
  
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Estudiantes');
  
    XLSX.writeFile(libro, 'Lista_Estudiantes.xlsx');
  }  

  bajaTemporal(matricula: string) {
    const estudiante = this.estudiantes.find(e => e.Matricula === matricula);

    if (estudiante && estudiante.Estatus === 'Inactivo') {
      this.cerrarBajaModal();
      this.isError = true;
      this.notificacionService.showNotification('El estudiante ya está inactivo.');
      return; 
    }

    this.estudianteService.bajaTemporal(matricula).subscribe(
      (response) => {
        console.log('Estudiante dado de baja temporalmente:', response);
        this.isError = false
        this.notificacionService.showNotification('El estudiante ha sido dado de baja temporalmente.');
        if (this.selectedStudent && this.selectedStudent.Matricula === matricula) {
          this.selectedStudent = null;
        }
        this.obtenerEstudiantes(); 
        this.busqueda();
        this.cerrarBajaModal(); 
      },
      (error) => {
        this.isError = true
        this.notificacionService.showNotification('Error al intentar dar de baja al estudiante.');
        console.error('Error al dar de baja temporalmente al estudiante:', error);
      }
    );
  }

  reactivarEstudiante(matricula: string) {
    this.estudianteService.getEstatus(matricula).subscribe(
      (estatus) => {
        if (estatus && estatus.Estatus === "Activo") {
          this.isError = true;
          this.notificacionService.showNotification('El estudiante ya está activo.');
          this.cerrarReactivacionModal();
          return; 
        }
  
        this.estudianteService.reactivarEstudiante(matricula).subscribe(
          (response) => {
            console.log('Estudiante reactivado exitosamente:', response);
            this.isError = false;
            this.notificacionService.showNotification('El estudiante ha sido reactivado.');
            
            this.obtenerEstudiantes(); 
            this.busqueda();
            this.cerrarReactivacionModal();
          },
          (error) => {
            this.isError = true;
            this.notificacionService.showNotification('Error al intentar reactivar al estudiante.');
            console.error('Error al reactivar al estudiante:', error);
          }
        )
      },
      (error) => {
        console.error('Error al obtener estatus del estudiante:', error);
        this.isError = true;
        this.notificacionService.showNotification('Error al obtener el estatus del estudiante.');
      }
    );
  }
  

  bajaDefinitiva(matricula: string) {
    this.estudianteService.bajaDefinitiva(matricula).subscribe(
      (response) => {
        console.log('Estudiante dado de baja definitivamente:', response);
        this.isError = false;
        this.notificacionService.showNotification('El estudiante ha sido dado de baja definitivamente.');
        if (this.selectedStudent && this.selectedStudent.Matricula === matricula) {
          this.selectedStudent = null;
        }
        this.obtenerEstudiantes(); // Actualizar lista
        this.cerrarBajaModal(); // Cerrar modal después de actualizar
      },
      (error) => {
        this.isError = true;
        this.notificacionService.showNotification('Error al intentar dar de baja al estudiante.');
      }
    );
  }
  
  isBajaModalOpen: boolean = false;

abrirBajaModal(): void {
  this.isBajaModalOpen = true;
}

cerrarBajaModal(): void {
  this.isBajaModalOpen = false;
}

isReactivacionModalOpen: boolean = false;

abrirReactivacionModal(): void {
  this.isReactivacionModalOpen = true;
}

cerrarReactivacionModal(): void {
  this.isReactivacionModalOpen = false;
}


confirmarBajaTemporal(): void {
  if (this.selectedStudent) {
    this.bajaTemporal(this.selectedStudent.Matricula);
  } else {
    alert('No se ha seleccionado un estudiante.');
  }
}

confirmarBajaDefinitiva(): void {
  if (this.selectedStudent) {
    this.bajaDefinitiva(this.selectedStudent.Matricula);
  } else {
    alert('No se ha seleccionado un estudiante.');
  }
}

confirmarReactivacion(): void {
  if (this.selectedStudent) {
    this.reactivarEstudiante(this.selectedStudent.Matricula);
  } else {
    alert('No se ha seleccionado un estudiante.');
  }
}
}