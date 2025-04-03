function debugOffscreen(){
  if(t%100 !== 0) return; // Only draw every 50 frames
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  let pixelData = new Float32Array(4);
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, pixelData);
  console.log("Screen texture sample pixel:", pixelData);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}

function drawTestOffscreenTexture() {
  gl.useProgram(debugProgram);
  
  // Make sure the viewport matches your canvas size
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  // Bind the offscreen texture (for example, screenTexture)
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);
  gl.uniform1i(gl.getUniformLocation(debugProgram, "uTexture"), 0);
  
  // Bind and draw the full-screen quad
  gl.bindVertexArray(debugVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
}

let testParticleProgram;
let testParticleVAO;

function setupTestParticlesFromExistingBuffer() {
  testParticleProgram = create_program(testParticleVSource, testParticleFSource);
  
  testParticleVAO = gl.createVertexArray();
  gl.bindVertexArray(testParticleVAO);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[buffer_read]);
  
  let posLoc = gl.getAttribLocation(testParticleProgram, "aPos");
  if (posLoc === -1) {
    console.error("Attribute 'aPos' not found in testParticleProgram");
  } else {
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(
      posLoc,
      2,                         // 2 components per vertex (x, y)
      gl.FLOAT,                  // Data type
      false,
      floatsPerParticle * 4,     // Stride in bytes (floatsPerParticle * 4 bytes per float)
      0                          // Offset in bytes (position starts at beginning)
    );
  }
  
  // Unbind (optional)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

function drawTestParticles(numParticles) {

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  gl.viewport(0, 0, renderSize, renderSize);

  gl.useProgram(testParticleProgram);


  let dotSizeLoc = gl.getUniformLocation(testParticleProgram, "dotSize");
  if(dotSizeLoc !== null) {
    gl.uniform1f(dotSizeLoc, 1);
  } else {
    console.error("dotSize uniform not found.");
  }


  gl.bindVertexArray(testParticleVAO);
  gl.drawArrays(gl.POINTS, 0, numParticles);
  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function setupDebugQuad() {
  debugProgram = create_program(debugVSource, debugFSource);
  
  debugVAO = gl.createVertexArray();
  gl.bindVertexArray(debugVAO);
  
  // Define vertices for a full-screen quad: two attributes per vertex:
  // positions (in clip space) and texture coordinates.
  let vertices = new Float32Array([
    //  position    // aTexCoord
    -1,  1,       0, 1,  // Top-left
    -1, -1,       0, 0,  // Bottom-left
     1,  1,       1, 1,  // Top-right
     1, -1,       1, 0   // Bottom-right
  ]);
  
  let debug_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, debug_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  // Set up attribute pointers.
  let posLoc = gl.getAttribLocation(debugProgram, "position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
  
  let texLoc = gl.getAttribLocation(debugProgram, "aTexCoord");
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  
  // Clean up
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

// Checked same - only thing is VAO
function depositParticlesHelper() {
  gl.useProgram(depositProgram);
  
  // Set the deposit flag to 1 (deposit mode).
  gl.uniform1fv(gl.getUniformLocation(renderParticles, "v"), presetArray);
  gl.uniform1i(gl.getUniformLocation(depositProgram, "deposit"), 1);
  gl.uniform1f(gl.getUniformLocation(depositProgram, "pointsize"), 1);
  gl.uniform1f(gl.getUniformLocation(depositProgram, "dotSize"), presetArray[19]);
  
  // Bind the offscreen texture framebuffer.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  gl.viewport(0, 0, simSize, simSize);
  
  // Bind the VAO that holds your particle data (assumed to be set up with attribute "i_P").
  gl.bindVertexArray(vaos[buffer_read + 2]); // or your designated VAO for deposit
  
  // Draw all particles as points.
  gl.drawArrays(gl.POINTS, 0, numParticles);
  
  // Clean up: unbind framebuffer and VAO.
  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}


let blurProgram;
let blurVAO;
let blurTexture;

function createBlurTexture() {
  blurTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blurTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, renderSize, renderSize, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function setupBlurQuad() {
  // Create the shader program for the blur effect.
  blurProgram = create_program(testBlurVSource, testBlurFSource);
  
  // Create and bind a VAO for a full-screen quad.
  blurVAO = gl.createVertexArray();
  gl.bindVertexArray(blurVAO);
  
  // Define a full-screen quad with positions and texture coordinates.
  // Positions in clip space and corresponding texture coordinates.
  let vertices = new Float32Array([
    // aPos       // aTexCoord
    -1,  1,      0, 1,  // Top-left
    -1, -1,      0, 0,  // Bottom-left
     1,  1,      1, 1,  // Top-right
     1, -1,      1, 0   // Bottom-right
  ]);
  
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  // Set up the attribute pointers.
  let posLoc = gl.getAttribLocation(blurProgram, "aPos");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
  
  let texCoordLoc = gl.getAttribLocation(blurProgram, "aTexCoord");
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  
  // Clean up bindings.
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

// DOES NOT IMPLEMENT NUMBER OF BLUR PASSES
// HOWEVER THIS IS 1 FOR MOST SETTINGS
function applyBlur(renderSize, decayFactor) {
  gl.disable(gl.BLEND);

  gl.bindVertexArray(blurVAO);
  gl.useProgram(blurProgram);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);

  // Bind the framebuffer and attach blurTexture as the color attachment.
  gl.bindTexture(gl.TEXTURE_2D, blurTexture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurTexture, 0);
  

  gl.uniform1i(gl.getUniformLocation(blurProgram, "uTexture"), 0);
  gl.uniform2f(gl.getUniformLocation(blurProgram, "uTextureSize"), renderSize, renderSize);
  gl.uniform1f(gl.getUniformLocation(blurProgram, "uDecay"), decayFactor);

  gl.viewport(0, 0, renderSize, renderSize);

  
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

 
  
  // Swap the textures: the blurred result becomes the new screenTexture.
  let tmp = screenTexture;
  screenTexture = blurTexture;
  blurTexture = tmp;

  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.enable(gl.BLEND);
}

let clearProgram; // Shader program for clear/fade

function setupClearQuad() {
  clearProgram = create_program(debugVSource, clearFSource);
}

// checked - same
function applyClearFade() {
  gl.useProgram(clearProgram);
  gl.enable(gl.BLEND);
  
  let clearOpacityLoc = gl.getUniformLocation(clearProgram, "clearOpacity");
  if(clearOpacityLoc !== null){
    gl.uniform1f(clearOpacityLoc, presetArray[18]);
  }
  
  // Bind the framebuffer and attach screenTexture as the render target.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  gl.viewport(0, 0, renderSize, renderSize);
  
  // Enable blending if not already enabled.
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  gl.bindVertexArray(debugVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

let drawScreenProgram;
let screenQuadVAO;

function setupDrawScreenQuad() {
  // Create the shader program using our vertex and fragment sources.
  drawScreenProgram = create_program(drawVSource, drawFSource);
  
  // Create a VAO for a full-screen quad.
  screenQuadVAO = gl.createVertexArray();
  gl.bindVertexArray(screenQuadVAO);
  
  // Define vertices for a full-screen quad.
  // Each vertex consists of 4 floats: 2 for position and 2 for texture coordinates.
  let vertices = new Float32Array([
    // aPos       // aTexCoord
    -1,  1,      0, 1,  // Top-left
    -1, -1,      0, 0,  // Bottom-left
     1,  1,      1, 1,  // Top-right
     1, -1,      1, 0   // Bottom-right
  ]);
  
  let quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  // Get and set the position attribute.
  let posLoc = gl.getAttribLocation(drawScreenProgram, "aPos");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(
    posLoc,
    2,                           // 2 components (x, y)
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT, // stride (4 floats per vertex)
    0                           // offset: position starts at 0
  );
  
  // Get and set the texture coordinate attribute.
  let texCoordLoc = gl.getAttribLocation(drawScreenProgram, "aTexCoord");
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(
    texCoordLoc,
    2,                           // 2 components (u, v)
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT, // stride
    2 * Float32Array.BYTES_PER_ELEMENT  // offset: after the first two floats
  );
  
  // Clean up bindings.
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

// Checked - same
function drawCanvasToScreen() {
  gl.useProgram(drawScreenProgram);
  
  // Set the "invert" uniform. (Here, 0 means no inversion.)
  gl.uniform1i(gl.getUniformLocation(drawScreenProgram, "invert"), 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);
  gl.uniform1i(gl.getUniformLocation(drawScreenProgram, "uDrawTex"), 0);
  
  gl.viewport(0, 0, renderSize, renderSize);
  
  gl.bindVertexArray(screenQuadVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
  
}


// USE P5JS to debug and draw circles
function drawDebugParticle() {
  // Bind the updated (read) buffer.
  let n = 1000
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[buffer_read]);
  let debugData = new Float32Array(floatsPerParticle * n); // Assuming each particle consists of 4 floats.
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, debugData);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Log the first particle’s data (x, y, age, angle) to the console.
  // console.log("Debug Particle Data:", debugData.slice(0, 4));

  // Map the coordinates from clip space (-1 to 1) to canvas space.
  for(let i = 0; i < n; i++){
    let x = map(debugData[floatsPerParticle * i], -1, 1, 0, width);
    let y = map(debugData[floatsPerParticle * i + 1], -1, 1, 0, height);

    fill(255, 0, 0);

    circle(x, y, 10); // Draw a circle at the particle's position
  }
  
}




