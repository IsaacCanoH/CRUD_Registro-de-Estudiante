import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteExtracurricularComponent } from './docente-extracurricular.component';

describe('DocenteExtracurricularComponent', () => {
  let component: DocenteExtracurricularComponent;
  let fixture: ComponentFixture<DocenteExtracurricularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocenteExtracurricularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteExtracurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
