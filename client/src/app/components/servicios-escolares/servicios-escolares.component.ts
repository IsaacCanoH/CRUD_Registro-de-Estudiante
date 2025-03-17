import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
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

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.obtenerEstudiantes();
  }

  onSearchChange(): void {
    this.searchPerformed = true;
    if (this.searchQuery.trim()) {
        if (!isNaN(Number(this.searchQuery))) {
            this.estudianteService.buscarPorMatricula(this.searchQuery).subscribe(
                (data) => {
                    this.selectedStudent = data;
                },
                (error) => {
                    console.error('Error al buscar por matrícula', error);
                    this.selectedStudent = null; 
                }
            );
        } else {
            this.estudianteService.buscarPorNombre(this.searchQuery).subscribe(
                (data) => {
                    // Asumiendo que data es un array, seleccionamos el primer estudiante
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

  setActiveTab(tab: string): void {
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

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  getPhotoUrl(photoPath: string): string {
    if (!photoPath) {
      return '/assets/images/default-profile.jpg'; // Imagen por defecto si no hay foto
    }
    return `http://localhost:3900/${photoPath.replace(/\\/g, '/')}`;
  }  

  obtenerEstudiantes(): void {
    this.estudianteService.obtenerEstudiantes().subscribe(
      (data) => {
        this.estudiantes = data;
      },
      (error) => {
        console.error('Error al obtener estudiantes', error);
      }
    );
  }
}
