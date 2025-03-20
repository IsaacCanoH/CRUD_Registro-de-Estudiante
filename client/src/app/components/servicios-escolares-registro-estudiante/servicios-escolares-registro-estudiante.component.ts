import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../services/estudiante.service';

interface EstudianteForm {
  Matricula: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  Sexo: string;
  Telefonos: { id: number, numero: string }[];
  CorreosElectronicos: { id: number, correo: string }[];
  Foto: File | null;
  RFC: string;
  Domicilio: {
    Calle: string;
    NumeroInterior: number;
    NumeroExterior: number | null;
    Colonia: string;
    CodigoPostal: string;
    Ciudad: string;
  },
  CertificadoBachillerato: number;
  EspecialidadBachillerato: string | null;
  PromedioBachillerato: number | null;
  Anio: number | null;
  Semestre: number | null;
  Tutor: {
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Domicilio: {
      Calle: string;
      NumeroInterior: number;
      NumeroExterior: number | null;
      Colonia: string;
      CodigoPostal: string;
      Ciudad: string;
    }
    Telefonos: { id: number, numeroT: string }[];
    CorreosElectronicos: { id: number, correoT: string }[];
  }
  NombreCarrera: string;
  Especialidad: string;
  [key: string]: any;
}

@Component({
  selector: 'app-servicios-escolares-registro-estudiante',
  standalone: true,
  templateUrl: './servicios-escolares-registro-estudiante.component.html',
  styleUrls: ['./servicios-escolares-registro-estudiante.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ServiciosEscolaresRegistroEstudianteComponent implements OnInit {

  formData: EstudianteForm = {
    Matricula: '',
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    FechaNacimiento: '',
    Sexo: '',
    Telefonos: [{ id: 1, numero: '' }],
    CorreosElectronicos: [{ id: 1, correo: '' }],
    Foto: null,
    RFC: '',
    Domicilio: {
      Calle: '',
      NumeroInterior: 0,
      NumeroExterior: null,
      Colonia: '',
      CodigoPostal: '',
      Ciudad: ''
    },
    CertificadoBachillerato: 0,
    EspecialidadBachillerato: null,
    PromedioBachillerato: null,
    Anio: null,
    Semestre: null,
    Tutor: {
      Nombre: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Domicilio: {
        Calle: '',
        NumeroInterior: 0,
        NumeroExterior: null,
        Colonia: '',
        CodigoPostal: '',
        Ciudad: ''
      },
      Telefonos: [{ id: 1, numeroT: '' }],
      CorreosElectronicos: [{ id: 1, correoT: '' }],
    },
    NombreCarrera: '',
    Especialidad: '',
  };
  consecutivo = 1;
  successMessage = '';
  errorMessage = '';
  catalogoCarreras: any[] = [];
  especialidadesDisponibles: string[] = [];
  catalogoCiudades: any[] = [];
  selectedFile: File | null = null;

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.obtenerCatalogoCarreras();
    this.obtenerCatalogoCiudades();
    if (this.formData.Telefonos.length === 0) {
      this.formData.Telefonos.push({id: this.telefonoIdCounter++, numero: '' });
    }
    if (this.formData.CorreosElectronicos.length === 0) {
      this.formData.CorreosElectronicos.push({ id: this.correoIdCounter++, correo: '' });
    }
    if (this.formData.Tutor.Telefonos.length === 0) {
      this.formData.Tutor.Telefonos.push({ id: this.telefonoTutorIdCounter++, numeroT: '' });
    }
    if (this.formData.Tutor.CorreosElectronicos.length === 0) {
      this.formData.Tutor.CorreosElectronicos.push({ id: this.correoTIdCounter++, correoT: '' });
    }
  }

  obtenerCatalogoCiudades() {
    this.estudianteService.obtenerCatalogoCiudades().subscribe(
      (data) => {
        this.catalogoCiudades = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
        this.errorMessage = 'Error al cargar catálogo de ciudades.';
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
        this.errorMessage = 'Error al cargar catálogo de carreras.';
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

  submitForm(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';
  
    if (!form.valid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.errorMessage = 'Por favor completa todos los campos obligatorios.';
      return;
    }
  
  
    const foto = this.formData.Foto ? this.formData.Foto : new File([], '');
  
    // 🔥 Este es el paso clave:
    const payload = {
      ...this.formData,
      Telefonos: this.formData.Telefonos.map(t => t.numero),
      CorreosElectronicos: this.formData.CorreosElectronicos.map(c => c.correo),
      Tutor: {
        ...this.formData.Tutor,
        Telefonos: this.formData.Tutor.Telefonos.map(t => t.numeroT),
        CorreosElectronicos: this.formData.Tutor.CorreosElectronicos.map(c => c.correoT),
      }
    };
  
    this.estudianteService.registrarEstudiante(payload, foto).subscribe(
      (response) => {
        console.log('Estudiante registrado exitosamente:', response);
        this.successMessage = '¡Estudiante registrado exitosamente!';
        form.resetForm();
      },
      (error) => {
        console.error('Error al registrar estudiante:', error);
        this.errorMessage = 'Hubo un error al registrar al estudiante. Inténtalo de nuevo.';
      }
    );
  }
  

  telefonoIdCounter = 2; // empezamos en 2 porque el primero ya es id 1

  agregarTelefono() {
    this.formData.Telefonos.push({ id: this.telefonoIdCounter++, numero: '' });
  }

  eliminarTelefono(index: number) {
    this.formData.Telefonos.splice(index, 1);
  }

  trackByTelefonoId(index: number, tel: any): number {
    return tel.id;
  }

correoIdCounter = 2;

agregarCorreo() {
  this.formData.CorreosElectronicos.push({ id: this.correoIdCounter++, correo: '' });
}

eliminarCorreo(index: number) {
  this.formData.CorreosElectronicos.splice(index, 1);
}

trackByCorreoId(index: number, correo: any): number {
  return correo.id;
}

correoTIdCounter = 2;

agregarCorreoTutor() {
  this.formData.Tutor.CorreosElectronicos.push({ id: this.correoIdCounter++, correoT: '' });
}

eliminarCorreoTutor(index: number) {
  this.formData.Tutor.CorreosElectronicos.splice(index, 1);
}

trackByCorreoTutorId(index: number, correoT: any): number {
  return correoT.id;
}

telefonoTutorIdCounter = 2; // empezamos en 2 porque el primero ya es id 1

  agregarTelefonoTutor() {
    this.formData.Tutor.Telefonos.push({ id: this.telefonoIdCounter++, numeroT: '' });
  }

  eliminarTelefonoTutor(index: number) {
    this.formData.Tutor.Telefonos.splice(index, 1);
  }

  trackByTelefonoTutorId(index: number, telT: any): number {
    return telT.id;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  subirArchivoExcel() {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona un archivo Excel.';
      return;
    }
  
    this.estudianteService.subirEstudiantesExcel(this.selectedFile).subscribe({
      next: (res) => {
        this.successMessage = 'Estudiantes cargados correctamente desde el Excel.';
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Error al subir archivo:', err);
        this.errorMessage = 'Ocurrió un error al procesar el archivo.';
      }
    });
  }
  
  descargarPlantilla() {
    this.estudianteService.descargarPlantillaExcel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Plantilla_Estudiantes.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar plantilla', error);
      this.errorMessage = 'No se pudo descargar la plantilla.';
    });
  }
}
