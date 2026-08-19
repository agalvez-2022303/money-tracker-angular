import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  ondas: { id: number; x: number; y: number }[] = [];

  estrellas = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    l: Math.random() * 100,
    t: Math.random() * 100,
    s: Math.random() * 1.5 + 0.5,
    d: (Math.random() * 4 + 3) + 's',
    dl: (Math.random() * 6) + 's'
  }));

  funcionalidades = [
    { num: '01', titulo: 'Registro instantáneo', desc: 'Añade gastos e ingresos en segundos. Interfaz pensada para que no pierdas ni un segundo de tu día.' },
    { num: '02', titulo: 'Visualización orbital', desc: 'Gráficos y dashboards que muestran tu progreso como vistas desde el espacio. Cada quetzal tiene su lugar.' },
    { num: '03', titulo: 'Metas ambiciosas', desc: 'Define objetivos financieros y sigue tu trayectoria hacia ellos. Porque llegar a la luna empieza con un paso.' },
    { num: '04', titulo: 'Categorías inteligentes', desc: 'Tu dinero se organiza solo. Alimentación, transporte, entretenimiento — todo clasificado automáticamente.' },
    { num: '05', titulo: 'Seguridad de primer nivel', desc: 'Tus datos viajan con la misma protección que una nave espacial. Encriptación completa, sin compromisos.' },
    { num: '06', titulo: 'Sincronización total', desc: 'Accede desde cualquier dispositivo. Tu órbita financiera siempre está contigo, sin importar dónde estés.' }
  ];

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
}
