import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-servicios-escolares',
  standalone: false,
  templateUrl: './servicios-escolares.component.html',
  styleUrl: './servicios-escolares.component.css'
})
export class ServiciosEscolaresComponent implements OnInit{
  searchQuery: string = '';
  activeTab: string = 'personal';
  searchPerformed: boolean = false;
  selectedStudent: any = null; 
  filtersVisible: boolean = false;
  estudiantes = [
    {
      matricula: '2024001',
      nombre: 'Juan Pérez García',
      grupo: 'A1',
      carrera: 'Ingeniería en Sistemas',
      fechaAlta: '22 de febrero de 2024',
      contacto: '4231654789'
    },
    {
      matricula: '2024002',
      nombre: 'María López Sánchez',
      grupo: 'B2',
      carrera: 'Administración',
      fechaAlta: '22 de febrero de 2024',
      contacto: '4136985236'
    }
  ];
  filter = {
    grupo: '',
    carrera: ''
  };

  ngOnInit() {

  }

  onSearchChange(): void {
    this.searchPerformed = true;
    if (this.searchQuery.trim()) {
      // Aquí puedes implementar la lógica para buscar un estudiante real
      console.log('Buscando estudiante con:', this.searchQuery);
      // Lógica para buscar el estudiante en la base de datos o servicio
      // Por ejemplo:
      // this.selectedStudent = await this.studentService.searchStudent(this.searchQuery);
    } else {
      this.selectedStudent = null;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleEdit(): void {
    console.log("Editar alumno:", this.selectedStudent);
    alert("Función de edición de alumno");
  }

  handleDelete(): void {
    console.log("Dar de baja alumno:", this.selectedStudent);
    if (confirm("¿Está seguro que desea dar de baja a este alumno?")) {
      alert("Alumno dado de baja");
      this.selectedStudent = null; 
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  getInitials(name: string, lastName: string): string {
    return (name.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getPhotoUrl(photoId: number): string {
    return `/assets/images/student-${photoId}.jpg`;
  }

  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }

  aplicarFiltros(): void {
    this.toggleFilters();
    this.estudiantes = this.estudiantes.filter(estudiante => {
      return (
        (this.filter.grupo === '' || estudiante.grupo.toLowerCase().includes(this.filter.grupo.toLowerCase())) &&
        (this.filter.carrera === '' || estudiante.carrera.toLowerCase().includes(this.filter.carrera.toLowerCase()))
      );
    });
  }

}
