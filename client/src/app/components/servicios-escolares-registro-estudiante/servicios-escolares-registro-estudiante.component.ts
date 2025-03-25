import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../services/estudiante.service';
import { NotificacionService } from '../../services/notificacion.service';

interface EstudianteForm {
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  Sexo: string;
  Telefonos: { id: number; numero: string }[];
  CorreosElectronicos: { id: number; correo: string }[];
  Foto: File | null;
  RFC: string;
  Domicilio: {
    Calle: string;
    NumeroInterior: number;
    NumeroExterior: number | null;
    Colonia: string;
    CodigoPostal: string;
    Ciudad: string;
  };
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
    };
    Telefonos: { id: number; numeroT: string }[];
    CorreosElectronicos: { id: number; correoT: string }[];
  };
  NombreCarrera: string;
  Especialidad: string;
  [key: string]: any;
}

@Component({
  selector: 'app-servicios-escolares-registro-estudiante',
  standalone: true,
  templateUrl: './servicios-escolares-registro-estudiante.component.html',
  styleUrls: ['./servicios-escolares-registro-estudiante.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ServiciosEscolaresRegistroEstudianteComponent implements OnInit {
  formData: EstudianteForm = {
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
      Ciudad: '',
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
        Ciudad: '',
      },
      Telefonos: [{ id: 1, numeroT: '' }],
      CorreosElectronicos: [{ id: 1, correoT: '' }],
    },
    NombreCarrera: '',
    Especialidad: '',
  };
  consecutivo = 1;
  catalogoCarreras: any[] = [];
  especialidadesDisponibles: string[] = [];
  catalogoCiudades: any[] = [];
  catalogoEspecialidadesBachillerato: any[] = [];
  selectedFile: File | null = null;
  errorMensaje: { [key: string]: string } = {};
  notificacionMensaje: string | null = null;
  isError: boolean = false;

  constructor(
    private estudianteService: EstudianteService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit() {
    this.obtenerCatalogoCarreras();
    this.obtenerCatalogoCiudades();
    this.obtenerCatalogoEspecialidadesBachillerato();
    const currentYear = new Date().getFullYear();
    this.formData.Anio = currentYear;
    const currentMonth = new Date().getMonth() + 1; 
    this.formData.Semestre = currentMonth <= 6 ? 1 : 2;
    if (this.formData.Telefonos.length === 0) {
      this.formData.Telefonos.push({
        id: this.telefonoIdCounter++,
        numero: '',
      });
    }
    if (this.formData.CorreosElectronicos.length === 0) {
      this.formData.CorreosElectronicos.push({
        id: this.correoIdCounter++,
        correo: '',
      });
    }
    if (this.formData.Tutor.Telefonos.length === 0) {
      this.formData.Tutor.Telefonos.push({
        id: this.telefonoTutorIdCounter++,
        numeroT: '',
      });
    }
    if (this.formData.Tutor.CorreosElectronicos.length === 0) {
      this.formData.Tutor.CorreosElectronicos.push({
        id: this.correoTIdCounter++,
        correoT: '',
      });
    }
    this.notificacionService.notificacionMensaje$.subscribe((message) => {
      this.notificacionMensaje = message;
    });
  }

  obtenerCatalogoCiudades() {
    this.estudianteService.obtenerCatalogoCiudades().subscribe(
      (data) => {
        this.catalogoCiudades = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
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
      }
    );
  }

  obtenerCatalogoEspecialidadesBachillerato() {
    this.estudianteService.obtenerCatalogoEspecialidadesBachillerato().subscribe(
      (data) => {
        this.catalogoEspecialidadesBachillerato = data;
      },
      (error) => {
        console.error('Error al cargar catálogo:', error);
      }
    );
  }

  onCarreraChange() {
    const carreraSeleccionada = this.catalogoCarreras.find(
      (carrera) => carrera.NombreCarrera === this.formData.NombreCarrera
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
    if (
      this.formData.Anio != null &&
      this.formData.ApellidoPaterno &&
      this.formData.Semestre != null
    ) {
      const year = String(this.formData.Anio).slice(-2);
      const semestre = this.formData.Semestre;
      const inicialPaterno = this.formData.ApellidoPaterno.charAt(0).toUpperCase();

      // Obtener el contador de matrícula desde el servicio
      const contadorResponse = this.estudianteService.obtenerContadorMatricula();

      // Asegúrate de que el contadorResponse tenga la estructura esperada
    if (contadorResponse && contadorResponse!= null) {
      const consecutivoStr = (contadorResponse).toString().padStart(4, '0'); // Incrementar y formatear a 4 dígitos

       // Construir la matrícula
       let matricula = `${year}${semestre}${inicialPaterno}${consecutivoStr+1}`;
       console.log("Matrícula generada:", matricula); // Para depuración
       return matricula; // Retornar la matrícula generada
    }else {
        console.error("Error: La respuesta del contador no es válida.");
        throw new Error("No se pudo obtener el contador de matrícula.");
      }
    } else {
      console.error("Error: Datos de entrada no válidos.");
      throw new Error("Los datos de entrada no son válidos.");
    }
}

  onInputChange() {
    this.generarRFC();
  }

  submitForm(form: NgForm) {
    if (this.validarFormulario()) {
      const foto = this.formData.Foto ? this.formData.Foto : new File([], '');

      // Este es el paso clave:
      const payload = {
        ...this.formData,
        Telefonos: this.formData.Telefonos.map((t) => t.numero),
        CorreosElectronicos: this.formData.CorreosElectronicos.map(
          (c) => c.correo
        ),
        Tutor: {
          ...this.formData.Tutor,
          Telefonos: this.formData.Tutor.Telefonos.map((t) => t.numeroT),
          CorreosElectronicos: this.formData.Tutor.CorreosElectronicos.map(
            (c) => c.correoT
          ),
        },
      };
      this.estudianteService.registrarEstudiante(payload, foto).subscribe(
        async (response) => {
          console.log('Estudiante registrado exitosamente:', response);
          const semestreActual = this.formData.Semestre;
          const anioActual = this.formData.Anio;
          form.resetForm();
          this.formData.Semestre = semestreActual;
          this.formData.Anio = anioActual;
          this.isError = false;
          this.notificacionService.showNotification(
            'Estudiante registrado exitosamente');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        (error) => {
          console.error('Error al registrar estudiante:', error);
          this.isError = true;
          this.notificacionService.showNotification(
            'Error al registrar estudiante'
          );
        }
      );
    }
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
    this.formData.CorreosElectronicos.push({
      id: this.correoIdCounter++,
      correo: '',
    });
  }

  eliminarCorreo(index: number) {
    this.formData.CorreosElectronicos.splice(index, 1);
  }

  trackByCorreoId(index: number, correo: any): number {
    return correo.id;
  }

  correoTIdCounter = 2;

  agregarCorreoTutor() {
    this.formData.Tutor.CorreosElectronicos.push({
      id: this.correoIdCounter++,
      correoT: '',
    });
  }

  eliminarCorreoTutor(index: number) {
    this.formData.Tutor.CorreosElectronicos.splice(index, 1);
  }

  trackByCorreoTutorId(index: number, correoT: any): number {
    return correoT.id;
  }

  telefonoTutorIdCounter = 2; // empezamos en 2 porque el primero ya es id 1

  agregarTelefonoTutor() {
    this.formData.Tutor.Telefonos.push({
      id: this.telefonoIdCounter++,
      numeroT: '',
    });
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
    if (this.validarArchivo()) {
      this.estudianteService
        .subirEstudiantesExcel(this.selectedFile!)
        .subscribe({
          next: (res) => {
            this.selectedFile = null;
            this.isError = false;
            this.notificacionService.showNotification(
              'Archivo cargado correctamente'
            );
            this.limpiarCampoArchivo();
          },
          error: (err) => {
            console.error('Error al subir archivo:', err);
            this.isError = true;
            this.notificacionService.showNotification(
              'Error al cargar archivo'
            );
          },
        });
    }
  }

  limpiarCampoArchivo(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  descargarPlantilla() {
    this.estudianteService.descargarPlantillaExcel().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Plantilla_Estudiantes.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar plantilla', error);
      }
    );
  }

  validarFormulario(): boolean {
    this.errorMensaje = {};

    
    if (!this.formData.Nombre) {
      this.errorMensaje['Nombre'] = 'Por favor, ingrese el nombre.';
    }
    if (!this.formData.ApellidoMaterno) {
      this.errorMensaje['ApellidoPaterno'] =
        'Por favor, ingrese el apellido paterno.';
    }
    if (!this.formData.ApellidoMaterno) {
      this.errorMensaje['ApellidoMaterno'] =
        'Por favor, ingrese el apellido materno.';
    }
    if (!this.formData.FechaNacimiento) {
      this.errorMensaje['FechaNacimiento'] =
        'Por favor, ingrese la fecha de nacimiento.';
    } else if (
      new Date().getFullYear() -
        new Date(this.formData.FechaNacimiento).getFullYear() <
      18
    ) {
      this.errorMensaje['FechaNacimiento'] = 'Debe ser mayor de 18 años.';
    }
    if (!this.formData.Sexo) {
      this.errorMensaje['Sexo'] = 'Por favor, seleccione un sexo.';
    }
    if (
      !this.formData.Telefonos ||
      this.formData.Telefonos.length === 0 ||
      !this.formData.Telefonos[0].numero ||
      this.formData.Telefonos[0].numero.length !== 10
    ) {
      this.errorMensaje['Telefono'] =
        'Por favor, ingrese un teléfono válido con 10 dígitos.';
    }
    if (
      !this.formData.CorreosElectronicos ||
      this.formData.CorreosElectronicos.length === 0 ||
      !this.formData.CorreosElectronicos[0].correo ||
      !this.formData.CorreosElectronicos[0].correo.includes('@')
    ) {
      this.errorMensaje['Correo'] =
        'Por favor, ingrese un correo electrónico válido.';
    }
    if (!this.formData.RFC) {
      this.errorMensaje['RFC'] = 'Es obligatorio el RFC.';
    }
    if (!this.formData.Foto) {
      this.errorMensaje['Foto'] = 'Por favor, seleccione una fotografía.';
    }
    if (!this.formData.Domicilio.Calle) {
      this.errorMensaje['Calle'] = 'Por favor, ingrese la calle.';
    }
    if (!this.formData.Domicilio.NumeroExterior) {
      this.errorMensaje['NumeroExterior'] =
        'Por favor, ingrese el número exterior.';
    }
    if (!this.formData.Domicilio.Colonia) {
      this.errorMensaje['Colonia'] = 'Por favor, ingrese la colonia.';
    }
    if (!this.formData.Domicilio.CodigoPostal) {
      this.errorMensaje['CodigoPostal'] =
        'Por favor, ingrese el código postal.';
    }
    if (!this.formData.Domicilio.Ciudad) {
      this.errorMensaje['Ciudad'] = 'Por favor, ingrese la ciudad.';
    }
    if (!this.formData.CertificadoBachillerato) {
      this.errorMensaje['CertificadoBachillerato'] =
        'Por favor, seleccione si se cuenta con el certificado.';
    }
    if (!this.formData.EspecialidadBachillerato) {
      this.errorMensaje['EspecialidadBachillerato'] =
        'Por favor, seleccione la especialidad del bachillerato.';
    }
    if (!this.formData.PromedioBachillerato) {
      this.errorMensaje['PromedioBachillerato'] =
        'Por favor, ingrese el promedio.';
    }
    if (!this.formData.Anio) {
      this.errorMensaje['Anio'] = 'El año es obligatorio.';
    }
    if (!this.formData.Semestre) {
      this.errorMensaje['Semestre'] = 'El semestre es obligatorio.';
    }
    if (!this.formData.Tutor.Nombre) {
      this.errorMensaje['NombreTutor'] = 'Por favor, ingrese el nombre.';
    }
    if (!this.formData.Tutor.ApellidoPaterno) {
      this.errorMensaje['ApellidoPaternoTutor'] =
        'Por favor, ingrese el apellido paterno.';
    }
    if (!this.formData.Tutor.ApellidoMaterno) {
      this.errorMensaje['ApellidoMaternoTutor'] =
        'Por favor, ingrese el apellido materno.';
    }
    if (!this.formData.Tutor.Domicilio.Calle) {
      this.errorMensaje['CalleTutor'] = 'Por favor, ingrese la calle.';
    }
    if (!this.formData.Tutor.Domicilio.NumeroExterior) {
      this.errorMensaje['NumeroExteriorTutor'] =
        'Por favor, ingrese el número exterior.';
    }
    if (!this.formData.Tutor.Domicilio.Colonia) {
      this.errorMensaje['ColoniaTutor'] = 'Por favor, ingrese la colonia.';
    }
    if (!this.formData.Tutor.Domicilio.CodigoPostal) {
      this.errorMensaje['CodigoPostalTutor'] =
        'Por favor, ingrese el código postal.';
    }
    if (!this.formData.Tutor.Domicilio.Ciudad) {
      this.errorMensaje['CiudadTutor'] = 'Por favor, seleccione la ciudad.';
    }
    if (
      !this.formData.Tutor.Telefonos ||
      this.formData.Tutor.Telefonos.length === 0 ||
      !this.formData.Tutor.Telefonos[0].numeroT ||
      this.formData.Telefonos[0].numero.length !== 10
    ) {
      this.errorMensaje['TelefonoTutor'] =
        'Por favor, ingrese al menos un teléfono.';
    }
    if (
      !this.formData.Tutor.CorreosElectronicos ||
      this.formData.Tutor.CorreosElectronicos.length === 0 ||
      !this.formData.Tutor.CorreosElectronicos[0].correoT ||
      !this.formData.CorreosElectronicos[0].correo.includes('@')
    ) {
      this.errorMensaje['CorreoT'] =
        'Por favor, ingrese al menos un correo electrónico.';
    }
    if (!this.formData.NombreCarrera) {
      this.errorMensaje['NombreCarrera'] = 'Por favor, seleccione la carrera.';
    }
    if (!this.formData.Especialidad) {
      this.errorMensaje['Especialidad'] =
        'Por favor, seleccione la especialidad.';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }

  validarArchivo(): boolean {
    this.errorMensaje = {};

    if (!this.selectedFile) {
      this.errorMensaje['fileInput'] = 'Por favor, cargue el archivo.';
    }

    return Object.keys(this.errorMensaje).length === 0;
  }
}
