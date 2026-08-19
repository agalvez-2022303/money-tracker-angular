import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface Usuario {
  id: string;
  email: string;
  name: string;
}

interface RespuestaLogin {
  token: string;
  user: Usuario;
}

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_API = 'http://localhost:3000/api/auth';
  private readonly CLAVE_TOKEN = 'auth_token';

  private usuarioActual = signal<Usuario | null>(null);
  private temporizadorSesion: any = null;

  usuario = computed(() => this.usuarioActual());
  estaAutenticado = computed(() => !!this.usuarioActual());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.verificarSesionExistente();
  }

  login(email: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${this.URL_API}/login`, { email, password })
      .pipe(
        tap(respuesta => {
          localStorage.setItem(this.CLAVE_TOKEN, respuesta.token);
          this.usuarioActual.set(respuesta.user);
          this.iniciarTemporizador();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.CLAVE_TOKEN);
    this.usuarioActual.set(null);
    this.detenerTemporizador();
    this.router.navigate(['/login']);
  }

  sesionExpirada(): void {
    localStorage.removeItem(this.CLAVE_TOKEN);
    this.usuarioActual.set(null);
    this.detenerTemporizador();
    this.router.navigate(['/session-expired']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.CLAVE_TOKEN);
  }

  private verificarSesionExistente(): void {
    const token = localStorage.getItem(this.CLAVE_TOKEN);
    if (token) {
      try {
        const decodificado = jwtDecode<TokenPayload>(token);
        const ahora = Date.now() / 1000;

        if (decodificado.exp > ahora) {
          this.usuarioActual.set({
            id: decodificado.id,
            email: decodificado.email,
            name: decodificado.name
          });
          this.iniciarTemporizador();
        } else {
          this.sesionExpirada();
        }
      } catch {
        this.logout();
      }
    }
  }

  private iniciarTemporizador(): void {
    this.detenerTemporizador();
    const token = localStorage.getItem(this.CLAVE_TOKEN);
    if (!token) return;

    try {
      const decodificado = jwtDecode<TokenPayload>(token);
      const ahora = Date.now() / 1000;
      const restante = Math.max(0, (decodificado.exp - ahora) * 1000);

      if (restante <= 0) {
        this.sesionExpirada();
        return;
      }

      this.temporizadorSesion = setTimeout(() => {
        this.sesionExpirada();
      }, restante);
    } catch {
      this.sesionExpirada();
    }
  }

  private detenerTemporizador(): void {
    if (this.temporizadorSesion) {
      clearTimeout(this.temporizadorSesion);
      this.temporizadorSesion = null;
    }
  }
}
