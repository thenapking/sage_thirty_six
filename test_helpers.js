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
    gl.uniform1f(dotSizeLoc, presetArray[19]);
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

function applyBlur(renderSize, decayFactor) {
  gl.useProgram(blurProgram);
  
  // Bind source texture (screenTexture) to TEXTURE0.
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);
  gl.uniform1i(gl.getUniformLocation(blurProgram, "uTexture"), 0);
  
  // Set texture size and decay uniform.
  gl.uniform2f(gl.getUniformLocation(blurProgram, "uTextureSize"), renderSize, renderSize);
  gl.uniform1f(gl.getUniformLocation(blurProgram, "uDecay"), decayFactor);
  
  // Bind the framebuffer and attach blurTexture as the color attachment.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurTexture, 0);
  
  gl.viewport(0, 0, renderSize, renderSize);
  gl.bindVertexArray(blurVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  // Swap the textures: the blurred result becomes the new screenTexture.
  let tmp = screenTexture;
  screenTexture = blurTexture;
  blurTexture = tmp;
}


let clearProgram; // Shader program for clear/fade

function setupClearQuad() {
  clearProgram = create_program(debugVSource, clearFSource);
  // Optionally, you can reuse your existing debugVAO or set up a new one:
  // (Assuming debugVAO is set up as a full-screen quad with attributes aPos and aTexCoord.)
}

function applyClearFade() {
  gl.useProgram(clearProgram);
  
  // Set the uniform clearOpacity. We assume presetArray[18] holds the normalized value.
  let clearOpacityLoc = gl.getUniformLocation(clearProgram, "clearOpacity");
  if(clearOpacityLoc !== null){
    gl.uniform1f(clearOpacityLoc, 0.1);
  }
  
  // Bind the framebuffer and attach screenTexture as the render target.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  
  // Set the viewport to match your offscreen texture.
  gl.viewport(0, 0, renderSize, renderSize);
  
  // Enable blending if not already enabled.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Bind your full-screen quad VAO (reuse debugVAO, for example) and draw the quad.
  gl.bindVertexArray(debugVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
  
  // Unbind the framebuffer so that subsequent drawing goes to the default framebuffer.
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}




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


