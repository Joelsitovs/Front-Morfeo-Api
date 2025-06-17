import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sucess',
  imports: [],
  templateUrl: './sucess.component.html',
  styleUrl: './sucess.component.css'
})
export class SucessComponent {
  sessionId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'] ?? null;
    });
  }
}
