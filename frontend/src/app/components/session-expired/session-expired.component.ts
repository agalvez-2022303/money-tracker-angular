import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
