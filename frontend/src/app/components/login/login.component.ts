import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  estaCargando = signal(false);
  mensajeError = signal('');
  ondas: { id: number; x: number; y: number }[] = [];

  estrellas = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    l: Math.random() * 100,
    t: Math.random() * 100,
    s: Math.random() * 1.5 + 0.5,
    d: (Math.random() * 4 + 3) + 's',
    dl: (Math.random() * 6) + 's'
  }));

  constructor(
    private servicioAuth: AuthService,
    private router: Router
  ) {}

  @HostListener('document:mousemove', ['$event'])
  alMoverMouse(e: MouseEvent) {
    const punto = document.querySelector('.cursor-dot') as HTMLElement;
    const anillo = document.querySelector('.cursor-ring') as HTMLElement;
    if (punto) { punto.style.left = e.clientX + 'px'; punto.style.top = e.clientY + 'px'; }
    if (anillo) { anillo.style.left = e.clientX + 'px'; anillo.style.top = e.clientY + 'px'; }
  }

  @HostListener('document:click', ['$event'])
  alHacerClick(e: MouseEvent) {
    const id = Date.now();
    this.ondas = [...this.ondas, { id, x: e.clientX, y: e.clientY }];
    setTimeout(() => { this.ondas = this.ondas.filter(o => o.id !== id); }, 500);
  }

  enviar(): void {
    if (!this.correo || !this.contrasena) {
      this.mensajeError.set('Por favor ingresa email y contraseña');
      return;
    }
    this.estaCargando.set(true);
    this.mensajeError.set('');
    this.servicioAuth.login(this.correo, this.contrasena).subscribe({
      next: () => { this.router.navigate(['/dashboard']); },
      error: (error) => {
        this.estaCargando.set(false);
        this.mensajeError.set(error.error?.error || 'Credenciales inválidas');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
