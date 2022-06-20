import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManufacturerComponent } from './delete-manufacturer.component';

describe('DeleteManufacturerComponent', () => {
  let component: DeleteManufacturerComponent;
  let fixture: ComponentFixture<DeleteManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteManufacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
