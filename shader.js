/* global CodeMirror */
let myReq;
const errorOutput = document.getElementById("shader-compilation-errors");
const myTextArea = document.getElementById("code");
const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
  mode: "x-shader/x-fragment",
  // theme: "pastel-on-dark",
  lineNumbers: false,
  indentUnit: 4,
  extraKeys: {
    "Ctrl-Space": "autocomplete"
  }
});

const compileButton = document.getElementById("compile-shader");
compileButton.onclick = event => {
  const shader = myCodeMirror.getValue();
  cancelAnimationFrame(myReq);
  loadFragmentShader(shader);
};

// FIRST AUDIO!
const fftSize = 2048;
const audioData = new Uint8Array(fftSize / 2);
audioData.fill(100);

//THEN SHADERS!
const DEFAULT_VS = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const canvas = document.getElementById("shader");
const gl = canvas.getContext("webgl");

gl.clearColor(0, 0, 0, 0);

const vertices = new Float32Array([-1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vertexShader = makeShader(gl.VERTEX_SHADER, DEFAULT_VS);
const DEFAULT_FS = myCodeMirror.getValue();
loadFragmentShader(DEFAULT_FS);

function loadFragmentShader(shader) {
  const shaderCode = `
precision highp float;

uniform int u_frame;
uniform vec2 u_resolution;
uniform sampler2D u_image;

float pulse(float speed)
{
    return (sin(float(u_frame) / float(speed)) / 2.0) + 0.5;
}

vec4 getPixel()
{
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    return texture2D(u_image, st);
}` + shader;
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
      value: 0
    },
    uResolution: {
      location: gl.getUniformLocation(program, "u_resolution"),
      value: [canvas.width, canvas.height]
    },
    uImage: {
      location: gl.getUniformLocation(program, "u_image"),
      value: loadTexture()
    }
  };

  myReq = render(state);
}

function render(state) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1i(state.uFrame.location, state.uFrame.value);
  gl.uniform2fv(state.uResolution.location, state.uResolution.value);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.uImage.value);
  gl.uniform1i(state.uImage.location, 0);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

  state.uFrame.value++;
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
  shaders.forEach(shader => {
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

function loadTexture() {
  const url =
    "./assets/stenographic-image-4.png";
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };
  image.src = url;

  return texture;
}
