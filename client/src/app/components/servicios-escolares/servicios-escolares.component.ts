import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';

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
  estudiantesFiltrados: any[] = [];

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.obtenerEstudiantes();
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



  activaTab(tab: string): void {
    this.activeTab = tab;
  }

  handleEdit(): void {
    console.log('Editar alumno:', this.selectedStudent);
    alert('Función de edición de alumno');
  }

  handleDelete(): void {
    console.log('Dar de baja alumno:', this.selectedStudent);
    if (confirm('¿Está seguro que desea dar de baja a este alumno?')) {
      alert('Alumno dado de baja');
      this.selectedStudent = null;
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
        estudiante.Estatus.toLowerCase().includes(this.estatus.toLowerCase())
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
  
    this.estudiantesFiltrados = estudiantesFiltrados; 
    this.cerrarModal();
  }

  restaurarDatos(): void {
    this.estatus = '';
    this.carrera = '';
    this.especialidad = '';
    this.estudiantesFiltrados = [...this.estudiantes]; 
    this.cerrarModal();
  }
}
