import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shader-background',
  standalone: true,
  template: `<canvas #canvas class="block w-full h-full"></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ShaderBackground implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private mouse = { x: 0, y: 0 };
  private uniforms: {
    time: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    mouse: WebGLUniformLocation | null;
  } = { time: null, resolution: null, mouse: null };

  private mouseMoveListener = (event: MouseEvent) => {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      this.mouse.x = nx * canvas.width;
      this.mouse.y = ny * canvas.height;
    }
  };

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.mouse.x = canvas.width / 2;
    this.mouse.y = canvas.height / 2;

    window.addEventListener('mousemove', this.mouseMoveListener);

    this.resizeObserver = new ResizeObserver(() => this.syncSize());
    this.resizeObserver.observe(canvas);
    this.syncSize();

    this.initWebGL();
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.mouseMoveListener);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }

  private syncSize() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || 1280;
    const h = canvas.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  private initWebGL() {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;
    this.gl = gl;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
          vec2 uv = v_texCoord;
          float time = u_time * 0.3;
          
          // Ethereal background colors
          vec3 color1 = vec3(0.98, 0.98, 1.0); // Near white
          vec3 color2 = vec3(0.93, 0.95, 0.98); // Soft blue-tinted gray
          vec3 accent = vec3(0.13, 0.77, 0.37); // Growth Green
          
          float noise = sin(uv.x * 3.0 + time) * cos(uv.y * 2.0 - time * 0.8);
          noise += sin(uv.y * 5.0 + time * 1.2) * 0.5;
          
          vec3 finalColor = mix(color1, color2, clamp(noise * 0.5 + 0.5, 0.0, 1.0));
          
          // Subtle green glow at the edges
          float glow = smoothstep(0.8, 1.2, length(uv - 0.5) * 2.0);
          finalColor = mix(finalColor, accent, glow * 0.05);
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vsShader = compileShader(gl.VERTEX_SHADER, vs);
    const fsShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vsShader || !fsShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vsShader);
    gl.attachShader(prog, fsShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(prog));
      return;
    }
    this.program = prog;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    this.uniforms.time = gl.getUniformLocation(prog, 'u_time');
    this.uniforms.resolution = gl.getUniformLocation(prog, 'u_resolution');
    this.uniforms.mouse = gl.getUniformLocation(prog, 'u_mouse');

    const render = (t: number) => {
      if (!this.gl) return;
      this.syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      if (this.uniforms.time) gl.uniform1f(this.uniforms.time, t * 0.001);
      if (this.uniforms.resolution) gl.uniform2f(this.uniforms.resolution, canvas.width, canvas.height);
      if (this.uniforms.mouse) gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.animationFrameId = requestAnimationFrame(render);
    };

    render(0);
  }
}
