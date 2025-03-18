  import { Component, OnInit } from '@angular/core';
  import { EstudianteService } from '../../services/estudiante.service';

  @Component({
    selector: 'app-servicios-escolares-registro-estudiante',
    standalone: false,
    templateUrl: './servicios-escolares-registro-estudiante.component.html',
    styleUrls: ['./servicios-escolares-registro-estudiante.component.css'],
  })
  export class ServiciosEscolaresRegistroEstudianteComponent implements OnInit {
    formData = {
      matricula: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      sexo: '',
      telefonos: [],
      correosElectronicos: [], 
      rfc: '',
      foto: null,
      calle: '',
      numeroExterior: null,
      numeroInterior: null,
      colonia: '',
      codigoPostal: '',
      ciudad: '',
      promedio: null,
      certificado: null,
      semestre: null, 
      anio: null, 
      nombreTutor: '',
      apellidoPaternoTutor: '',
      apellidoMaternoTutor: '',
      calleTutor: '',
      numeroExteriorTutor: null,
      coloniaTutor: '',
      ciudadTutor: '',
      nombreCarrera: '',
      especialidad: '',
    };

    constructor(private estudianteService: EstudianteService) {}

    ngOnInit() {
      // Inicialización si es necesario
    }

    submitForm() {
      const foto = this.formData.foto ? this.formData.foto : new File([], ''); 

      this.estudianteService.registrarEstudiante(this.formData, foto).subscribe(
        (response) => {
          console.log('Estudiante registrado exitosamente:', response);
          // Aquí puedes agregar lógica adicional, como redirigir o mostrar un mensaje
        },
        (error) => {
          console.error('Error al registrar estudiante:', error);
          // Manejo de errores
        }
      );
    }

    onFileChange(event: any, type: 'foto' | 'certificado') {
      const file = event.target.files[0];

      if (file) {
        this.formData[type] = file;
      }
    }
  }
