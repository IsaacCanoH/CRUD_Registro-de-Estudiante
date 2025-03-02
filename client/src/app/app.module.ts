import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { ServiciosEscolaresComponent } from './components/servicios-escolares/servicios-escolares.component';
import { ObservacionDocenteComponent } from './components/observacion-docente/observacion-docente.component';
import { DocenteExtracurricularComponent } from './components/docente-extracurricular/docente-extracurricular.component';
import { ServiciosEscolaresRegistroEstudianteComponent } from './components/servicios-escolares-registro-estudiante/servicios-escolares-registro-estudiante.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiciosEscolaresComponent,
    ObservacionDocenteComponent,
    DocenteExtracurricularComponent,
    ServiciosEscolaresRegistroEstudianteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
