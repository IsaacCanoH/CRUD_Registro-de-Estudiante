import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEscolaresComponent } from './servicios-escolares.component';

describe('ServiciosEscolaresComponent', () => {
  let component: ServiciosEscolaresComponent;
  let fixture: ComponentFixture<ServiciosEscolaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiciosEscolaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosEscolaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
