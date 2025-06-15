import { Component } from '@angular/core';
import { LucideAngularModule, Mail,Phone,MapPin} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  currentYear = new Date().getFullYear();
}
