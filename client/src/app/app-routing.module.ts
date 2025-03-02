import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiciosEscolaresComponent } from './components/servicios-escolares/servicios-escolares.component';
import { ServiciosEscolaresRegistroEstudianteComponent } from './components/servicios-escolares-registro-estudiante/servicios-escolares-registro-estudiante.component';
import { DocenteExtracurricularComponent } from './components/docente-extracurricular/docente-extracurricular.component';
import { ObservacionDocenteComponent } from './components/observacion-docente/observacion-docente.component';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  { path: '', component: ServiciosEscolaresComponent},
  { path: 'inicio', component: InicioComponent},
  { path: 'se-reg-est', component: ServiciosEscolaresRegistroEstudianteComponent},
  { path: 'de-reg-act-ext', component: DocenteExtracurricularComponent},
  { path: 'ob-de', component: ObservacionDocenteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
