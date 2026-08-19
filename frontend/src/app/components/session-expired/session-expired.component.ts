import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion-expirada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent {
  ondas: { id: number; x: number; y: number }[] = [];

  estrellas = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    l: Math.random() * 100,
    t: Math.random() * 100,
    s: Math.random() * 1.5 + 0.5,
    d: (Math.random() * 4 + 3) + 's',
    dl: (Math.random() * 6) + 's'
  }));

  constructor(private router: Router) {}

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

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}
