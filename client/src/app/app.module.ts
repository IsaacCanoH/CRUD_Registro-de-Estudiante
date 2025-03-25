import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { ServiciosEscolaresComponent } from './components/servicios-escolares/servicios-escolares.component';
import { ObservacionDocenteComponent } from './components/observacion-docente/observacion-docente.component';
import { DocenteExtracurricularComponent } from './components/docente-extracurricular/docente-extracurricular.component';
import { ServiciosEscolaresRegistroEstudianteComponent } from './components/servicios-escolares-registro-estudiante/servicios-escolares-registro-estudiante.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { EstudianteEditarDatosComponent } from './components/estudiante-editar-datos/estudiante-editar-datos.component';
import { ServiciosEscolaresEditarEstudianteComponent } from './components/servicios-escolares-editar-estudiante/servicios-escolares-editar-estudiante.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiciosEscolaresComponent,
    ObservacionDocenteComponent,
    DocenteExtracurricularComponent,
    EstudianteComponent,
    EstudianteEditarDatosComponent,
    ServiciosEscolaresEditarEstudianteComponent,
  ],
  imports: [
    BrowserModule,
    ServiciosEscolaresRegistroEstudianteComponent,
    AppRoutingModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
