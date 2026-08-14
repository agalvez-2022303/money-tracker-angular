import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-view.html',
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .ambient-shadow {
      box-shadow: 0px 4px 20px rgba(31, 41, 55, 0.04);
    }

    .level-3-shadow {
      box-shadow: 0px 10px 30px rgba(31, 41, 55, 0.1);
    }
  `]
})
export class LoginView {
  @Output() navigateBack = new EventEmitter<void>();
  @Output() showAlert = new EventEmitter<string>();

  email: string = '';
  contra: string = '';

  onBack() {
    this.navigateBack.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.showAlert.emit('El inicio de sesión no está disponible todavía. Money Tracker se encuentra actualmente bajo desarrollo y pronto estará listo para ayudarte a simplificar tus finanzas.');
  }

  onForgot(event: Event) {
    event.preventDefault();
    this.showAlert.emit('La recuperación de contraseña está en construcción. Estará activa una vez que el sistema de autenticación esté completo.');
  }

  onSignUp(event: Event) {
    event.preventDefault();
    this.showAlert.emit('El registro de usuarios está actualmente en construcción. ¡Estamos trabajando en ello!');
  }
}
