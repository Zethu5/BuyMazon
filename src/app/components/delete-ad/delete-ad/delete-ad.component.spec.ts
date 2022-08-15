import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdComponent } from './delete-ad.component';

describe('DeleteAdComponent', () => {
  let component: DeleteAdComponent;
  let fixture: ComponentFixture<DeleteAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
