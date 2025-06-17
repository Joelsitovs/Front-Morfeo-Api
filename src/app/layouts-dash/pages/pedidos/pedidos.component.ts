import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../../core/services/orders.service';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  imports: [NgClass, DatePipe],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  private ordersService = inject(OrdersService);
  orders: any[] = [];

  ngOnInit() {
    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map((order) => ({
          ...order,
          parsedItems: this.parseItems(order.items),
        }));
      },
      error: (err) => console.error('Error al cargar pedidos', err),
    });
  }

  private parseItems(itemsJson: string): any[] {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  }
}

