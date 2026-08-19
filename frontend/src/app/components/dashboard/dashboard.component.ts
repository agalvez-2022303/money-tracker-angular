import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user = signal<any>(null);
  timeRemaining = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user.set(this.authService.user());
    this.updateTimeRemaining();
    setInterval(() => this.updateTimeRemaining(), 1000);
  }

  private updateTimeRemaining(): void {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      const remaining = Math.max(0, payload.exp - now);
      
      const minutes = Math.floor(remaining / 60);
      const seconds = Math.floor(remaining % 60);
      this.timeRemaining.set(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    } catch {
      this.timeRemaining.set('0:00');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
