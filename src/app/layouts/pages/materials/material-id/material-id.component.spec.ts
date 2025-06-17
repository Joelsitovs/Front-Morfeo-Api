import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIdComponent } from './material-id.component';

describe('MaterialIdComponent', () => {
  let component: MaterialIdComponent;
  let fixture: ComponentFixture<MaterialIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
