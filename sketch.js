// Global variables
// const A = {
//   simSize: 512,
//   renderSize: 1080,
//   mouse: { x: 450, y: 450 },
//   particleDensity: 2.7,
//   numParticles: -1,
//   drawOpacity: 0.2,
//   fillOpacity: 1,
//   drawPointsize: 1,
//   displayParticles: true,
//   canvasZoom: 1,
//   convergenceRate: 0.15,
//   name: "params",
//   update: true,
//   pastParams: o[s],
//   params: o[s],
//   lerpTime: 0,
//   smartLerp: true
// };

let agents = [];
// Default preset values
let currentPreset = {
  sensorDistanceBase: 1,
  sensorDistanceExponent: 1,
  sensorDistanceMultiplier: 0,
  sensorAngleBase: 1,
  sensorAngleExponent: 1,
  sensorAngleMultiplier: 0,
  turnAngleBase: 1,
  turnAngleExponent: 1,
  turnAngleMultiplier: 10,
  speedBase: 1,
  speedExponent: 1,
  speedpMultiplier: 0,
  verticalOffset: 0,
  horizontalOffset: 0,
  depositOpacity: 0.5,
  trailDecayFactor: 0.95,
  blurIterationCount: 1,
  renderOpacity: 0.5,
  clearOpacity: 0.1,
  particleDotSize: 2,
};




let gui;
let trailLayer; // Off-screen graphics buffer for trails

let particleDensity = 2.7
let simSize = 512;             // Size of the simulation texture
let numParticles = 1000; // Total number of particles
let drawPointsize = 1; // Size of the points to be drawn
let floatsPerParticle = 4;     // Example: 2 for position, 1 for age, 1 for angle
let particleData;              // Will hold our initial particle data

let textures = [];          // Array to hold textures
let buffers = [];          // Array to hold buffers
let buffer_read = 0;      // Index of the buffer to read from
let buffer_write = 1;     // Index of the buffer to write to
let vaos = [];          // Array to hold VAOs
let vao, vao_desc; // VAO descriptor
let gl; // WebGL context

let updateParticles, renderParticles, updateBlur, clearScreen, drawScreen; // Program for updating particles
let testShader;

let debugProgram;
let debugVAO;
let fadeProgram;
let depositProgram;

let t = 0;

let renderSize = 1080; // Size of the render texture
let screenTexture, framebuffer;

let presetArray;

function setup() {
  createCanvas(renderSize/2, renderSize/2, WEBGL2);

  // numParticles = int(simSize * simSize * particleDensity);
  numParticles = 1000
  
  gui = createGUI(currentPreset);
  presetArray = updatePresetArray();

  setup_webgl();
  screenTexture = loadOutputTexture()
  create_textures();
  framebuffer = gl.createFramebuffer();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0, 0, 0, 0.1);

  let data = new Float32Array(Array(simSize * simSize * 2).fill(0))
  setTexture(data);

  let updateParticlesTransforms = ["v_P", "v_A", "v_T"];
  updateParticles = create_program(updateVSource, updateFSource, updateParticlesTransforms);

  renderParticles = create_program(renderVSource, renderFSource);

  depositProgram = create_program(depositVSource, depositFSource, null);


  setup_vaos()
  initialize_buffers();

  setupDebugQuad()



  setupTestParticlesFromExistingBuffer();
  setupBlurQuad();
  createBlurTexture()
  setupClearQuad();
}

function create_particles(){
  let arr = [];
  for (let j = 0; j < numParticles; ++j) {
      arr.push(2 * Math.random() - 1); // x position
      arr.push(2 * Math.random() - 1); // y position
      arr.push(j / numParticles); // age factor
      arr.push(2 * Math.random() * 3.14159); // angle
  }
  return  new Float32Array(arr);
}

 

function draw() {
  t++;
  background(0);

  updateParticlesHelper();
  depositParticlesHelper()
  drawTestParticles(numParticles);
  // applyBlur(renderSize, presetArray[15]) 
  applyClearFade()

  drawTestOffscreenTexture()

  // drawDebugParticle()


  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Framebuffer incomplete");
  }

}






function updateParticlesHelper() {
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(updateParticles);
  gl.activeTexture(gl.TEXTURE0);

  gl.uniform1i(gl.getUniformLocation(updateParticles, "frame"), t);
  gl.uniform1i(gl.getUniformLocation(updateParticles, "pen"), 0 );


  let vLoc = gl.getUniformLocation(updateParticles, "v");
  gl.uniform1fv(vLoc, presetArray);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);

  gl.uniform1i(gl.getUniformLocation(updateParticles, "u_trail"), 1);
  gl.uniform2f(gl.getUniformLocation(updateParticles, "i_dim"), simSize, simSize);

  // Preparing for Transform Feedback
  gl.bindVertexArray(vaos[buffer_read]);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[buffer_write]);

  // Running the Vertex Shader with Transform Feedback
  gl.enable(gl.RASTERIZER_DISCARD); // disables frag shader, just run vertex to calc positions

  //capture points
  gl.beginTransformFeedback(gl.POINTS); 
  gl.drawArrays(gl.POINTS, 0, numParticles);
  gl.endTransformFeedback();

  gl.disable(gl.RASTERIZER_DISCARD);

  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindVertexArray(vaos[buffer_read + 2]);

  // Swap read and write buffers.
  var temp = buffer_read;
  buffer_read = buffer_write;
  buffer_write = temp;

}

function depositParticlesHelper() {
  gl.useProgram(renderParticles);

  gl.uniform1fv(gl.getUniformLocation(renderParticles, "v"), presetArray);
  gl.uniform1i(gl.getUniformLocation(renderParticles, "deposit"), 1);
  gl.uniform1f(gl.getUniformLocation(renderParticles, "pointsize"), 1);
  gl.uniform1f(gl.getUniformLocation(renderParticles, "dotSize"), presetArray[19]);

  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[0], 0);

  gl.bindVertexArray(vaos[buffer_read + 2]);
  gl.viewport(0, 0, simSize, simSize);
  gl.drawArrays(gl.POINTS, 0, numParticles);
}

function blurHelper() {
  gl.disable(gl.BLEND);
  gl.bindVertexArray(vao);
  

  let t = Math.round(presetArray[16]);

  for (let j = 0; j < t; j++) {
      gl.useProgram(updateBlur);
      gl.uniform1fv(gl.getUniformLocation(updateBlur, "v"), presetArray);
      gl.bindTexture(gl.TEXTURE_2D, textures[1]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[1], 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.uniform1i(gl.getUniformLocation(updateBlur, "uUpdateTex"), 1);
      gl.uniform2f(gl.getUniformLocation(updateBlur, "uTextureSize"), simSize, simSize);
      gl.viewport(0, 0, simSize, simSize);

      gl.clearColor(1, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // Swap textures
      // I think this could be elsewhere and stops the feedback
      textures = [textures[1], textures[0]];
  }
  gl.enable(gl.BLEND);
}

   // Draw particles to an offscreen texture.
function drawParticlesToCanvas() {
    gl.bindVertexArray(vaos[buffer_read + 2]);
    gl.useProgram(renderParticles);
    gl.uniform1fv(gl.getUniformLocation(renderParticles, "v"), presetArray);
    gl.uniform1i(gl.getUniformLocation(renderParticles, "deposit"), 0);
    gl.uniform1f(gl.getUniformLocation(renderParticles, "pointsize"), drawPointsize);
    gl.uniform1f(gl.getUniformLocation(renderParticles, "dotSize"), presetArray[19]);
    gl.bindTexture(gl.TEXTURE_2D, screenTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
    gl.enable(gl.BLEND);
    gl.viewport(0, 0, renderSize, renderSize);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

// Fade the offscreen screen texture.
function fadeScreen() {
    gl.useProgram(clearScreen);
    gl.enable(gl.BLEND);
    gl.uniform1fv(gl.getUniformLocation(clearScreen, "v"), presetArray);
    gl.bindTexture(gl.TEXTURE_2D, screenTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
    gl.viewport(0, 0, renderSize, renderSize);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Draw the offscreen texture to the main canvas.
function drawCanvasToScreen() {
    gl.useProgram(drawScreen);
    gl.uniform1i(gl.getUniformLocation(drawScreen, "invert"), 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, screenTexture);
    gl.uniform1i(gl.getUniformLocation(drawScreen, "uDrawTex"), 0);
    gl.viewport(0, 0, renderSize, renderSize);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // this previous checked the canvas ratio - presumably this makes it landscape/portrait
    // gl.viewport(parseInt(renderSize), 0, renderSize, renderSize);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

 // Utility methods for getting uniform and attribute locations.
function getUniform(program, name) { // function gu
  return gl.getUniformLocation(program, name);
}
function getAttribute(program, name) { // function ga
  return this.gl.getAttribLocation(program, name); 
}
  



