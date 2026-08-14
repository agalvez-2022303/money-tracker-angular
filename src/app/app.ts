import { Component, signal } from '@angular/core';
import { ShaderBackground } from './components/shader-background/shader-background';
import { LandingView } from './views/landing-view/landing-view';
import { LoginView } from './views/login-view/login-view';
import { AlertModal } from './components/alert-modal/alert-modal';

@Component({
  selector: 'app-root',
  imports: [ShaderBackground, LandingView, LoginView, AlertModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentView = signal<'welcome' | 'login'>('welcome');
  alertMessage = signal<string>('');

  onNavigate(view: 'welcome' | 'login') {
    this.currentView.set(view);
  }

  showAlert(msg: string) {
    this.alertMessage.set(msg);
  }

  closeAlert() {
    this.alertMessage.set('');
  }
}
