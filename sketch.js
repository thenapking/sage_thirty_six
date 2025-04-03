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
  sensorDistanceBase: 5,
  sensorDistanceExponent: 1,
  sensorDistanceMultiplier: 1,
  sensorAngleBase: 45,
  sensorAngleExponent: 1,
  sensorAngleMultiplier: 1,
  turnAngleBase: 15,
  turnAngleExponent: 1,
  turnAngleMultiplier: 1,
  speedBase: 2,
  speedExponent: 1,
  speedpMultiplier: 1,
  verticalOffset: 0,
  horizontalOffset: 0,
  depositOpacity: 255,
  trailDecayFactor: 0.95,
  blurIterationCount: 1,
  renderOpacity: 255,
  clearOpacity: 10,
  particleDotSize: 3
};



let gui;
let trailLayer; // Off-screen graphics buffer for trails

let particleDensity = 2.7
let simSize = 512;             // Size of the simulation texture
let numParticles = simSize * simSize * particleDensity; // Total number of particles
let floatsPerParticle = 4;     // Example: 2 for position, 1 for age, 1 for angle
let particleData;              // Will hold our initial particle data

let textures = [];          // Array to hold textures
let buffers = [];          // Array to hold buffers
let buffer_read = 0;      // Index of the buffer to read from
let buffer_write = 1;     // Index of the buffer to write to
let vaos = [];          // Array to hold VAOs
let vao, vao_desc; // VAO descriptor
let gl; // WebGL context

let updateParticles, renderParticles; // Program for updating particles

let t = 0;

function setup() {
  createCanvas(800, 800, WEBGL2);
  
  gui = createGUI(currentPreset);

  setup_webgl();

  
  for (let j = 0; j < 2; j++) {
    textures[j] = loadTexture(null);
    buffers[j] = gl.createBuffer();
  }

  let updateParticlesTransforms = ["v_P", "v_A", "v_T"];
  updateParticles = create_program(updateParticlesTransforms);

  setup_vaos()
  initialize_buffers();

  

}


function loadTexture(data) {
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, simSize, simSize, 0, gl.RG, gl.FLOAT, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
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



function setup_webgl(){
  c = document.getElementById("slimewebgl");
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  gl = c.getContext("webgl2");		
}


// this replicates the function u in Sage Jenson's code
// this will be used for more shaders than just updateParticles
function create_program(transformFeedbackVaryings) {
  let program = gl.createProgram();

  vertexShader = create_shader(gl.VERTEX_SHADER, vsSource)
  fragmentShader =  create_shader(gl.FRAGMENT_SHADER, fsSource)

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (transformFeedbackVaryings != null) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS);
  }

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  
  gl.useProgram(program);

  return program;
}

function create_shader(type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
  } else {
      alert("Didn't compile shader. Info: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }
}



function draw() {
  t++;
  background(0);

  updateParticlesHelper();
  // drawDebugParticle()

}

function drawDebugParticle() {
  if(t%50 !== 0) return; // Only draw every 50 frames
  // Bind the updated (read) buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[buffer_read]);
  let debugData = new Float32Array(4); // Assuming each particle consists of 4 floats.
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, debugData);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Log the first particle’s data (x, y, age, angle) to the console.
  // console.log("Debug Particle Data:", debugData.slice(0, 4));

  // Map the coordinates from clip space (-1 to 1) to canvas space.
  let x = map(debugData[0], -1, 1, 0, width);
  let y = map(debugData[1], -1, 1, 0, height);

  console.log(x, y)
  
}

function updateParticlesHelper() {
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(updateParticles);
  gl.activeTexture(gl.TEXTURE0);

  gl.uniform1i(gl.getUniformLocation(updateParticles, "frame"), t);
  gl.uniform1i(gl.getUniformLocation(updateParticles, "pen"), 0 );


  let presetArray = updatePresetArray();

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

 // Utility methods for getting uniform and attribute locations.
function getUniform(program, name) { // function gu
  return gl.getUniformLocation(program, name);
}
function getAttribute(program, name) { // function ga
  return this.gl.getAttribLocation(program, name); 
}
  



