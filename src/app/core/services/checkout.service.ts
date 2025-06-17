import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';

export interface Product {
  name: string;
  image: string;
  price: number;
  quantity: number;
}


@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private http = inject(HttpClient);
  private serverUrl = environment.serverUlr;

  private stripeKey = environment.stipeKey;

  constructor() {}

  onProceedToPay(products: Product[]): void {
    this.http.post<{ sessionId: string }>(`${this.serverUrl}/checkout`, { items: products }).subscribe({
      next: async (response) => {
        const stripe = await loadStripe(this.stripeKey);
        if (stripe) {
          stripe.redirectToCheckout({
            sessionId: response.sessionId,
          });
        } else {
          console.error('Stripe no se cargó correctamente');
        }
      },
      error: (err) => {
        console.error('Error al iniciar el pago:', err);
      },
    });
  }

}
