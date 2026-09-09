"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
uniform vec2 u_pan;
uniform float u_zoom;
void main() {
  gl_Position = vec4(a_position * u_zoom + u_pan, 0.0, 1.0);
  gl_PointSize = 22.0;
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec4 u_color;
void main() { gl_FragColor = u_color; }
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

export function TopologyWebGlCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transform = useRef({ zoom: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const previousPinch = useRef(0);
  const frame = useRef<number | null>(null);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: false });
    if (!canvas || !gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    const buffer = gl.createBuffer();
    const points = new Float32Array([-0.78, 0, -0.26, 0, 0.26, 0, 0.78, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0.01, 0.02, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(
        gl.getUniformLocation(program, "u_pan"),
        transform.current.x,
        transform.current.y,
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_zoom"),
        transform.current.zoom,
      );
      const color = gl.getUniformLocation(program, "u_color");
      gl.uniform4f(color, 1, 0.3, 0.1, 0.7);
      gl.drawArrays(gl.LINE_STRIP, 0, 4);
      gl.uniform4f(color, 1, 0.3, 0.1, 1);
      gl.drawArrays(gl.POINTS, 0, 4);
    };
    drawRef.current = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        draw();
      });
    };
    draw();
    const observer = new ResizeObserver(drawRef.current);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const active = [...pointers.current.values()];
    if (active.length === 2) {
      const distance = Math.hypot(
        active[0]!.x - active[1]!.x,
        active[0]!.y - active[1]!.y,
      );
      if (previousPinch.current)
        transform.current.zoom = Math.max(
          0.65,
          Math.min(
            2.4,
            (transform.current.zoom * distance) / previousPinch.current,
          ),
        );
      previousPinch.current = distance;
    } else {
      transform.current.x = Math.max(
        -0.7,
        Math.min(0.7, transform.current.x + event.movementX / 300),
      );
      transform.current.y = Math.max(
        -0.7,
        Math.min(0.7, transform.current.y - event.movementY / 150),
      );
    }
    drawRef.current();
  };

  const release = (event: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(event.pointerId);
    previousPinch.current = 0;
  };

  return (
    <div className="relative border-b-2 border-border bg-black">
      <canvas
        aria-label="Interactive WebGL topology overview. Drag to pan, wheel or pinch to zoom."
        className="h-32 w-full touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onWheel={(event) => {
          transform.current.zoom = Math.max(
            0.65,
            Math.min(
              2.4,
              transform.current.zoom * (event.deltaY > 0 ? 0.9 : 1.1),
            ),
          );
          drawRef.current();
        }}
        ref={canvasRef}
        role="img"
      />
      <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] font-black uppercase text-sky-300">
        WebGL topology · drag / wheel / pinch
      </span>
    </div>
  );
}
