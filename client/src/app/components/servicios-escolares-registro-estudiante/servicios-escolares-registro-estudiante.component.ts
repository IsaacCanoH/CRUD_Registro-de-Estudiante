import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-servicios-escolares-registro-estudiante',
  standalone: true,
  templateUrl: './servicios-escolares-registro-estudiante.component.html',
  styleUrls: ['./servicios-escolares-registro-estudiante.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ServiciosEscolaresRegistroEstudianteComponent implements OnInit {
  formData = {
    Matricula: '',
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    FechaNacimiento: '',
    Sexo: '',
    Telefonos: [],
    CorreosElectronicos: [],
    Foto: null,
    RFC: '',
    Calle: '',
    NumeroExterior: null,
    NumeroInterior: 0,
    Colonia: '',
    CodigoPostal: '',
    Ciudad: '',
    CertificadoBachillerato: 0,
    EspecialidadBachillerato: null,
    PromedioBachillerato: null,
    Anio: null,
    Semestre: null,
    NombreTutor: '',
    ApellidoPaternoTutor: '',
    ApellidoMaternoTutor: '',
    CalleTutor: '',
    NumeroExteriorTutor: null,
    NumeroInteriorTutor: 0,
    ColoniaTutor: '',
    CodigoPostalTutor: '',
    CiudadTutor: '',
    TelefonosTutor: [],
    CorreosElectronicosTutor: [],
    NombreCarrera: '',
    Especialidad: '',
  };
  consecutivo = 1; 
  successMessage = '';
  errorMessage = '';
  catalogoCarreras: any[] = []; // Aquí guardamos carreras desde el backend
  especialidadesDisponibles: string[] = []; // Aquí las especialidades filtradas por carrera seleccionada
  catalogoCiudades: any[] = []; // Aquí guardamos ciudades desde el backend


  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.obtenerCatalogoCarreras();
    this.obtenerCatalogoCiudades();
  }
  
  obtenerCatalogoCiudades() {
    this.estudianteService.obtenerCatalogoCiudades().subscribe(
      (data) => {
        this.catalogoCiudades = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
        this.errorMessage = 'Error al cargar catálogo de carreras.';
      }
    );
  }

  obtenerCatalogoCarreras() {
    this.estudianteService.obtenerCatalogoCarreras().subscribe(
      (data) => {
        this.catalogoCarreras = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
        this.errorMessage = 'Error al cargar catálogo de ciudades.';
      }
    );
  }

  onCarreraChange() {
    const carreraSeleccionada = this.catalogoCarreras.find(
      carrera => carrera.NombreCarrera === this.formData.NombreCarrera
    );

    if (carreraSeleccionada) {
      this.especialidadesDisponibles = carreraSeleccionada.Especialidades;
    } else {
      this.especialidadesDisponibles = [];
    }

    // Limpiar especialidad seleccionada si se cambia la carrera
    this.formData.Especialidad = '';
  }

  onFileChange(event: any, type: 'Foto') {
    const file = event.target.files[0];
    if (file) {
      this.formData[type] = file;
    }
  }

  generarRFC() {
    if (
      this.formData.Nombre &&
      this.formData.ApellidoPaterno &&
      this.formData.ApellidoMaterno &&
      this.formData.FechaNacimiento
    ) {
      const nombre = this.formData.Nombre.trim().toUpperCase();
      const paterno = this.formData.ApellidoPaterno.trim().toUpperCase();
      const materno = this.formData.ApellidoMaterno.trim().toUpperCase();
      const fecha = new Date(this.formData.FechaNacimiento);

      const rfc =
        paterno.charAt(0) +
        this.getFirstVowel(paterno) +
        materno.charAt(0) +
        nombre.charAt(0) +
        '-' +
        fecha.getFullYear().toString().slice(-2) +
        this.padZero(fecha.getMonth() + 1) +
        this.padZero(fecha.getDate());

      this.formData.RFC = rfc;
    }
  }

  getFirstVowel(text: string): string {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    for (let i = 1; i < text.length; i++) {
      if (vowels.includes(text[i])) {
        return text[i];
      }
    }
    return 'X';
  }

  padZero(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  generarMatricula() {
    if (this.formData.Anio != null && this.formData.ApellidoPaterno && this.formData.Semestre != null) {
      const year = String(this.formData.Anio).slice(-2);
      const semestre = this.formData.Semestre;
      const inicialPaterno = this.formData.ApellidoPaterno.charAt(0).toUpperCase();
      const consecutivoStr = this.consecutivo.toString().padStart(4, '0');

      this.formData.Matricula = `${year}${semestre}${inicialPaterno}${consecutivoStr}`;
    }
  }

  onInputChange() {
    this.generarRFC();
    this.generarMatricula();
  }

  validarNumeroInterior() {
    if (this.formData.NumeroInterior == null) {
      this.formData.NumeroInterior = 0;
    }
  }

  submitForm(form: NgForm) {
    // limpiamos mensajes anteriores
    this.successMessage = '';
    this.errorMessage = '';

    if (!form.valid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.errorMessage = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    this.validarNumeroInterior();

    const foto = this.formData.Foto ? this.formData.Foto : new File([], '');

    this.estudianteService.registrarEstudiante(this.formData, foto).subscribe(
      (response) => {
        console.log('Estudiante registrado exitosamente:', response);
        this.successMessage = '¡Estudiante registrado exitosamente!';
        form.resetForm(); // Limpiar formulario
      },
      (error) => {
        console.error('Error al registrar estudiante:', error);
        this.errorMessage = 'Hubo un error al registrar al estudiante. Inténtalo de nuevo.';
      }
    );
  }
}
