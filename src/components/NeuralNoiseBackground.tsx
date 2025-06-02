
"use client";

import { useEffect, useRef, useCallback } from 'react';

const vertShaderSource = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragShaderSource = `
precision mediump float;

varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;
uniform float u_scroll_progress;

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;

    for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2);
    }
    return res.x + res.y;
}

void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;

    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .5 * pow(1. - p, 2.);

    float t = .001 * u_time;
    vec3 color = vec3(0.);

    float noise = neuro_shape(uv, t, p);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .5));

    // Blue/indigo color palette
    color = vec3(0.1, 0.2, 0.8); // Base blue color
    color += vec3(0.0, 0.1, 0.4) * sin(3.0 * u_scroll_progress + 1.5); // Indigo variation

    color = color * noise;

    gl_FragColor = vec4(color, noise);
}
`;

const NeuralNoiseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const pointerRef = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const animationFrameIdRef = useRef<number | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);


  const resizeCanvas = useCallback(() => {
    const canvasEl = canvasRef.current;
    const gl = glRef.current;
    if (!canvasEl || !gl) return;

    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    canvasEl.width = window.innerWidth * devicePixelRatio;
    canvasEl.height = window.innerHeight * devicePixelRatio;
    
    if (uniformsRef.current.u_ratio) {
        gl.uniform1f(uniformsRef.current.u_ratio, canvasEl.width / canvasEl.height);
    }
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
  }, []);


  const initShader = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return null;

    const gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL is not supported by your browser.");
      return null;
    }
    glRef.current = gl;

    const createShader = (sourceCode: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(vertShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(fragShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const createShaderProgram = (): WebGLProgram | null => {
      const program = gl.createProgram();
      if (!program) return null;
      programRef.current = program;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    };

    const shaderProgram = createShaderProgram();
    if (!shaderProgram) return null;

    const activeUniforms: Record<string, WebGLUniformLocation | null> = {};
    const uniformCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(shaderProgram, i);
      if (uniformInfo) {
        activeUniforms[uniformInfo.name] = gl.getUniformLocation(shaderProgram, uniformInfo.name);
      }
    }
    uniformsRef.current = activeUniforms;

    const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);

    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    return gl;
  }, []);


  const renderAnimation = useCallback(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    const pointer = pointerRef.current;

    if (!gl || !uniforms) {
      animationFrameIdRef.current = requestAnimationFrame(renderAnimation);
      return;
    }

    const currentTime = performance.now();

    pointer.x += (pointer.tX - pointer.x) * .2;
    pointer.y += (pointer.tY - pointer.y) * .2;

    if (uniforms.u_time) gl.uniform1f(uniforms.u_time, currentTime);
    if (uniforms.u_pointer_position) gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
    if (uniforms.u_scroll_progress) gl.uniform1f(uniforms.u_scroll_progress, window.pageYOffset / (2 * Math.max(1, window.innerHeight)));


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrameIdRef.current = requestAnimationFrame(renderAnimation);
  }, []);


  const setupEvents = useCallback(() => {
    const updateMousePosition = (eX: number, eY: number) => {
      pointerRef.current.tX = eX;
      pointerRef.current.tY = eY;
    };

    const handlePointerMove = (e: PointerEvent) => updateMousePosition(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    const handleClick = (e: MouseEvent) => updateMousePosition(e.clientX, e.clientY);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);


  useEffect(() => {
    const gl = initShader();
    if (!gl) return;

    resizeCanvas(); // Initial resize
    const removeEventListeners = setupEvents();
    
    animationFrameIdRef.current = requestAnimationFrame(renderAnimation);

    return () => {
      removeEventListeners();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Basic WebGL cleanup
      if (glRef.current) {
        if (programRef.current) {
            // Detach shaders, delete program - more thorough cleanup can be added
            // glRef.current.deleteProgram(programRef.current);
        }
        // glRef.current.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [initShader, resizeCanvas, setupEvents, renderAnimation]);

  return <canvas id="neuro" ref={canvasRef} />;
};

export default NeuralNoiseBackground;

