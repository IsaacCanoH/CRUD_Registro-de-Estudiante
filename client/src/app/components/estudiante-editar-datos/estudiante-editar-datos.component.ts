import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';

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
      Calle: '',
      NumeroExterior: '',
      NumeroInterior: '',
    },
    CorreosElectronicos: [{ id: 1, correo: '' }],
    Telefonos: [{ id: 1, numero: '' }],
    Foto: null, 
    Tutor: {
      Domicilio: {
        CodigoPostal: '',
        Ciudad: '',
        Colonia: '',
        Calle: '',
        NumeroExterior: '',
        NumeroInterior: '',
      },
      CorreosElectronicos: [{ id: 1, correoT: '' }],
      Telefonos: [{ id: 1, numeroT: '' }]
    }
  };  
  foto: File | undefined;
  errorMensaje: { [key: string]: string } = {};
  ciudades: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit() {
    this.matricula = this.route.snapshot.paramMap.get('matricula') || '';
    this.obtenerEstudiante();
    this.cargarCiudades();
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

  cargarCiudades(): void {
    this.estudianteService.obtenerCatalogoCiudades().subscribe(
      (res) => {
        this.ciudades = res;
      },
      (error) => {
        console.log('Erroral obtener docentes', error);
      }
    )
  }

  telefonoIdCounter = 2; // empezamos en 2 porque el primero ya es id 1

  agregarTelefono() {
    this.estudiante.Telefonos.push({ id: this.telefonoIdCounter++, numero: '' });
  }

  eliminarTelefono(index: number) {
    this.estudiante.Telefonos.splice(index, 1);
  }

  trackByTelefonoId(index: number, tel: any): number {
    return tel.id;
  }

  correoIdCounter = 2;

  agregarCorreo() {
    this.estudiante.CorreosElectronicos.push({
      id: this.correoIdCounter++,
      correo: '',
    });
  }

  eliminarCorreo(index: number) {
    this.estudiante.CorreosElectronicos.splice(index, 1);
  }

  trackByCorreoId(index: number, correo: any): number {
    return correo.id;
  }

  correoTIdCounter = 2;

  agregarCorreoTutor() {
    this.estudiante.Tutor.CorreosElectronicos.push({
      id: this.correoIdCounter++,
      correoT: '',
    });
  }

  eliminarCorreoTutor(index: number) {
    this.estudiante.Tutor.CorreosElectronicos.splice(index, 1);
  }

  trackByCorreoTutorId(index: number, correoT: any): number {
    return correoT.id;
  }

  telefonoTutorIdCounter = 2; // empezamos en 2 porque el primero ya es id 1
  
  agregarTelefonoTutor() {
    this.estudiante.Tutor.Telefonos.push({
      id: this.telefonoIdCounter++,
      numeroT: '',
    });
  }

  eliminarTelefonoTutor(index: number) {
    this.estudiante.Tutor.Telefonos.splice(index, 1);
  }

  trackByTelefonoTutorId(index: number, telT: any): number {
    return telT.id;
  }
}
