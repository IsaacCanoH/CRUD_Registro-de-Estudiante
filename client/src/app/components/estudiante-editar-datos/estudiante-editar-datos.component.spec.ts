import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEditarDatosComponent } from './estudiante-editar-datos.component';

describe('EstudianteEditarDatosComponent', () => {
  let component: EstudianteEditarDatosComponent;
  let fixture: ComponentFixture<EstudianteEditarDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteEditarDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteEditarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
