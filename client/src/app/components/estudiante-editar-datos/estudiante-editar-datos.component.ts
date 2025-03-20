import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';
import { retry } from 'rxjs';

@Component({
  selector: 'app-estudiante-editar-datos',
  standalone: false,
  templateUrl: './estudiante-editar-datos.component.html',
  styleUrl: './estudiante-editar-datos.component.css',
})
export class EstudianteEditarDatosComponent implements OnInit {
  matricula: string = '';
  estudiante = {
    Domicilio: {
      CodigoPostal: '',
      Ciudad: '',
      Colonia: '',
      NumeroExterior: '',
      NumeroInterior: '',
    },
    CorreosElectronicos: [''], // Se usa un array porque el correo está en la posición [0]
    Telefonos: [''], // Se usa un array porque el teléfono está en la posición [0]
    Foto: null, // Para almacenar la imagen seleccionada
    Tutor: {
      Domicilio: {
        CodigoPostal: '',
        Ciudad: '',
        Colonia: '',
        NumeroExterior: '',
        NumeroInterior: '',
      },
      CorreosElectronicos: [''], // Se usa un array similar al del estudiante
      Telefonos: [''], // Se usa un array similar al del estudiante
    }
  };  
  foto: File | undefined;
  errorMensaje: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit() {
    this.matricula = this.route.snapshot.paramMap.get('matricula') || '';
    this.obtenerEstudiante();
  }

  obtenerEstudiante() {
    this.estudianteService.obtenerPerfilPorMatricula(this.matricula).subscribe(
      (data) => {
        this.estudiante = data.estudiante;
      },
      (error) => {
        console.error('Error al obtener el perfil del estudiante:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.foto = event.target.files[0]; 
  }

  actualizarEstudiante() {
    if(this.validarFormulario()) {
    this.estudianteService
      .actualizarEstudiante(this.matricula, this.estudiante, this.foto)
      .subscribe(
        (response) => {
          console.log('Estudiante actualizado:', response);
          this.notificacionService.showNotification('Datos actualizados correctamente'); 
          this.router.navigate(['/ed']);
        },
        (error) => {
          console.error('Error al actualizar el estudiante:', error);
        }
      );
    }
  }

  cancelarEdicion(){
    this.router.navigate(['/ed']);
  }

  validarFormulario(): boolean {
    this.errorMensaje = {};

    if(!this.estudiante.Domicilio.CodigoPostal) {
      this.errorMensaje['codigoPostal'] = 'Por favor, ingrese el código postal.';
    }
    if(!this.estudiante.Domicilio.Ciudad) {
      this.errorMensaje['ciudad'] = 'Por favor, ingrese la ciudad.';
    }
    if(!this.estudiante.Domicilio.Colonia) {
      this.errorMensaje['colonia'] = 'Por favor, ingrese la colonia.'
    }
    if(!this.estudiante.Domicilio.NumeroExterior) {
      this.errorMensaje['numeroExterior'] = 'Por favor, ingrese el número exterior.'
    }
    if(!this.estudiante.CorreosElectronicos[0]) {
      this.errorMensaje['correoElectronico'] = 'Por favor, ingrese un correo electrónico.'
    }
    if(!this.estudiante.Telefonos[0]) {
      this.errorMensaje['telefono'] = 'Por favor, ingrese un teléfono.'
    }
    if(!this.estudiante.Tutor.Domicilio.CodigoPostal) {
      this.errorMensaje['codigoPostalTutor'] = 'Por favor, ingrese el código postal.'
    }
    if (!this.estudiante.Tutor.Domicilio.Ciudad) {
      this.errorMensaje['ciudadTutor'] = 'Por favor, ingrese la ciudad.'
    }
    if (!this.estudiante.Tutor.Domicilio.Colonia) {
      this.errorMensaje['coloniaTutor'] = 'Por favor, ingrese la colonia.'
    }
    if (!this.estudiante.Tutor.Domicilio.NumeroExterior) {
      this.errorMensaje['numeroExteriorTutor'] = 'Por favor, ingrese el número exterior.'
    }
    if (!this.estudiante.Tutor.CorreosElectronicos[0]) {
      this.errorMensaje['correoElectronicoTutor'] = 'Por favor, ingrese un correo electrónico.'
    }
    if (!this.estudiante.Tutor.Telefonos[0]) {
      this.errorMensaje['telefonoTutor'] = 'Por favor, ingrese un teléfono.'
    }
 
    return Object.keys(this.errorMensaje).length === 0;
  }
}
