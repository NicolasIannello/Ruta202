import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoAdminComponent } from './pedido-admin.component';

describe('PedidoAdminComponent', () => {
  let component: PedidoAdminComponent;
  let fixture: ComponentFixture<PedidoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
