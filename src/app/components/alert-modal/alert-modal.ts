import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md animate-[fade-in_0.2s_ease-out]">
      <!-- Modal Panel -->
      <div class="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl bg-white/80 border border-white/40 flex flex-col items-center text-center animate-[scale-up_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
        <!-- Icon -->
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 animate-[bounce_1.5s_infinite]">
          <span class="material-symbols-outlined text-[36px]" style="font-variation-settings: 'FILL' 1;">construction</span>
        </div>
        
        <!-- Slogan/Subheader -->
        <h2 class="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-gray-900">¡Próximamente disponible!</h2>
        
        <!-- Message -->
        <p class="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed text-gray-600">
          {{ message || 'Esta característica se encuentra actualmente en construcción. Nuestro equipo está trabajando duro para darte el mejor control de tus finanzas.' }}
        </p>
        
        <!-- Button -->
        <button 
          (click)="onClose()"
          class="w-full bg-gray-900 text-white rounded-lg py-3 font-label-caps text-label-caps tracking-wider font-semibold shadow-md hover:bg-gray-800 transition-all active:scale-[0.98] cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scale-up {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class AlertModal {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
