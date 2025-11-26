import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmPPage } from './adm-p.page';

describe('AdmPPage', () => {
  let component: AdmPPage;
  let fixture: ComponentFixture<AdmPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
