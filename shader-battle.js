/* global CodeMirror */
let myReq;
const errorOutput = document.getElementById("shader-compilation-errors");
const myTextArea = document.getElementById("code");
const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
  mode: "x-shader/x-fragment",
  lineNumbers: false,
  indentUnit: 4,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
  },
});

const compileButton = document.getElementById("compile-shader");
compileButton.onclick = (event) => {
  const shader = myCodeMirror.getValue();
  cancelAnimationFrame(myReq);
  loadFragmentShader(shader);
};

// Filled in every render
const answerField = document.querySelector("[name='answer']");


const DEFAULT_VS = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const canvas = document.getElementById("shader");
const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

gl.clearColor(0, 0, 0, 0);

const vertices = new Float32Array([-1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vertexShader = makeShader(gl.VERTEX_SHADER, DEFAULT_VS);
const DEFAULT_FS = myCodeMirror.getValue();
loadFragmentShader(DEFAULT_FS);

function loadFragmentShader(shader) {
  const shaderCode =
    `
precision highp float;

uniform int u_frame;
uniform vec2 u_resolution;

const float PI = 3.14159265359;

vec2 getCoords()
{
    return gl_FragCoord.xy / u_resolution.xy;
}

vec2 getCenteredCoords()
{
    return (gl_FragCoord.xy - .5*u_resolution.xy) / u_resolution.y;
}
` + shader;
  const fragmentShader = makeShader(gl.FRAGMENT_SHADER, shaderCode);
  const program = makeProgram(vertexShader, fragmentShader);
  gl.useProgram(program);

  program.position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(program.position);
  gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const state = {
    uFrame: {
      location: gl.getUniformLocation(program, "u_frame"),
      value: 0,
    },
    uResolution: {
      location: gl.getUniformLocation(program, "u_resolution"),
      value: [canvas.width, canvas.height],
    }
  };

  myReq = render(state);
}

function render(state) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1i(state.uFrame.location, state.uFrame.value);
  gl.uniform2fv(state.uResolution.location, state.uResolution.value);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

  state.uFrame.value++;
  if (answerField) {
    answerField.value = canvas.toDataURL();
  }
  myReq = window.requestAnimationFrame(() => render(state));
}

function makeShader(type, string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, string);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const compilationLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    // TODO: Error?
    errorOutput.innerText = compilationLog;
    errorOutput.hidden = false;
    console.warn(compilationLog, "\nin shader:\n", string);
  } else {
    errorOutput.innerText = "";
    errorOutput.hidden = true;
  }

  return shader;
}

function makeProgram(...shaders) {
  const program = gl.createProgram();
  shaders.forEach((shader) => {
    gl.attachShader(program, shader);
  });
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkLog = gl.getProgramInfoLog(this.program);
    // TODO: Error!
    errorOutput.innerText = linkLog;
    errorOutput.hidden = false;
    console.warn(linkLog);
  } else {
    errorOutput.innerText = "";
    errorOutput.hidden = true;
  }

  return program;
}
