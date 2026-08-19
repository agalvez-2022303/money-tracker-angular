import { Component, OnInit, signal, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuario = signal<any>(null);
  tiempoRestante = signal('');
  porcentajeTemporizador = 100;
  private idIntervalo: any;
  private duracionSesion = 120;
  ondas: { id: number; x: number; y: number }[] = [];

  estrellas = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    l: Math.random() * 100,
    t: Math.random() * 100,
    s: Math.random() * 1.5 + 0.5,
    d: (Math.random() * 4 + 3) + 's',
    dl: (Math.random() * 6) + 's'
  }));

  constructor(private servicioAuth: AuthService) {}

  ngOnInit(): void {
    this.usuario.set(this.servicioAuth.usuario());
    this.actualizarTiempo();
    this.idIntervalo = setInterval(() => this.actualizarTiempo(), 1000);
  }

  ngOnDestroy(): void {
    if (this.idIntervalo) clearInterval(this.idIntervalo);
  }

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

  private actualizarTiempo(): void {
    const token = this.servicioAuth.getToken();
    if (!token) {
      this.servicioAuth.sesionExpirada();
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Date.now() / 1000;
      const restante = Math.max(0, payload.exp - ahora);

      if (restante <= 0) {
        this.servicioAuth.sesionExpirada();
        return;
      }

      const minutos = Math.floor(restante / 60);
      const segundos = Math.floor(restante % 60);
      this.tiempoRestante.set(`${minutos}:${segundos.toString().padStart(2, '0')}`);
      this.porcentajeTemporizador = (restante / this.duracionSesion) * 100;
    } catch {
      this.servicioAuth.sesionExpirada();
    }
  }

  cerrarSesion(): void {
    this.servicioAuth.logout();
  }
}
