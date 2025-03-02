import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicios-escolares-registro-estudiante',
  standalone: false,
  templateUrl: './servicios-escolares-registro-estudiante.component.html',
  styleUrl: './servicios-escolares-registro-estudiante.component.css'
})
export class ServiciosEscolaresRegistroEstudianteComponent implements OnInit{
  currentStep: number = 1;
  totalSteps: number = 5;
  progress: number = 0;

  // Modelo de datos para el formulario
  formData = {
    // Datos Generales
    matricula: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    correo: '',
    rfc: '',
    foto: null,

    // Domicilio
    calle: '',
    numeroExterior: null,
    numeroInterior: null,
    colonia: '',
    codigoPostal: '',
    ciudad: '',

    // Datos Académicos
    promedio: null,
    certificado: null,

    // Datos del Tutor
    nombreTutor: '',
    apellidoPaternoTutor: '',
    apellidoMaternoTutor: '',
    calleTutor: '',
    numeroExteriorTutor: null,
    coloniaTutor: '',
    ciudadTutor: '',

    nombreCarrera: '',
    especialidad: ''
  };

  ngOnInit() {
    this.updateProgress();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateProgress();
    } else {
      this.submitForm();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }

  updateProgress() {
    this.progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  submitForm() {
    console.log('Formulario enviado:', this.formData);
    // Aquí puedes agregar la lógica para enviar los datos al servidor
  }

  onFileChange(event: any, type: 'foto' | 'certificado') {
    const file = event.target.files[0];
    if (file) {
      this.formData[type] = file;
    }
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  isStepActive(step: number): boolean {
    return step === this.currentStep;
  }
}
