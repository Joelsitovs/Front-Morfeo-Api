import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarShopComponent } from './navbar-shop.component';

describe('NavbarShopComponent', () => {
  let component: NavbarShopComponent;
  let fixture: ComponentFixture<NavbarShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarShopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
