import { Component, Output, EventEmitter } from '@angular/core';
import { ThreeVisualizer } from '../../components/three-visualizer/three-visualizer';

@Component({
  selector: 'app-landing-view',
  standalone: true,
  imports: [ThreeVisualizer],
  templateUrl: './landing-view.html',
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(229, 231, 235, 0.5);
      box-shadow: 0px 4px 20px rgba(31, 41, 55, 0.04);
    }
  `]
})
export class LandingView {
  @Output() navigateToLogin = new EventEmitter<void>();
  @Output() showAlert = new EventEmitter<string>();

  onLogin() {
    this.navigateToLogin.emit();
  }

  onRegister() {
    this.showAlert.emit('El registro de usuarios está actualmente en desarrollo. ¡Muy pronto podrás crear tu cuenta de Money Tracker!');
  }
}
