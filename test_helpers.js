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


function setupFadeQuad() {
  fadeProgram = create_program(debugVSource, debugFaderFSource);
  // You can reuse your debug quad VAO if it’s set up for a full-screen quad.
  // Otherwise, create one (like in setupTestQuad()).
}

function applyFade() {
  // Use the fade program
  gl.useProgram(fadeProgram);
  
  // Bind the offscreen texture as the source
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);
  gl.uniform1i(gl.getUniformLocation(fadeProgram, "uTexture"), 0);
  
  // Set the decay factor uniform (0.95 means each pixel retains 95% of its value each frame)
  gl.uniform1f(gl.getUniformLocation(fadeProgram, "uDecay"), 0.95);
  
  // Bind the framebuffer and attach the offscreen texture as the render target.
  // This will write the decayed result back into screenTexture.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  
  // Set viewport to the size of the offscreen texture.
  gl.viewport(0, 0, renderSize, renderSize);
  
  // Draw the full-screen quad.
  // Assuming you’re using the same quad VAO as your debug/test quad:
  gl.bindVertexArray(debugVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
  // Unbind framebuffer to switch back to the main canvas.
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

function testFade() {
  // Make sure the framebuffer is set up with the offscreen texture.
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  
  // Use the fade shader program.
  gl.useProgram(fadeProgram);
  gl.uniform1f(gl.getUniformLocation(fadeProgram, "uDecay"), 0.005);
  
  // Bind the offscreen texture as input.
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, screenTexture);
  gl.uniform1i(gl.getUniformLocation(fadeProgram, "uTexture"), 0);
  
  // Set the viewport to the size of the offscreen texture.
  gl.viewport(0, 0, renderSize, renderSize);
  
  // Draw the full-screen quad (using your debug VAO).
  gl.bindVertexArray(debugVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  // Log the middle pixel value.
  logMiddlePixel();
}

function logMiddlePixel() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, screenTexture, 0);
  
  let pixel = new Float32Array(4);
  let midX = Math.floor(renderSize / 2);
  let midY = Math.floor(renderSize / 2);
  gl.readPixels(midX, midY, 1, 1, gl.RGBA, gl.FLOAT, pixel);
  console.log("Middle pixel RGBA:", pixel);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}



function testShaderHelper() {
  gl.uniform1f(gl.getUniformLocation(testShader,"iGlobalTime"), millis()*.001);
  gl.uniform2f(gl.getUniformLocation(testShader,"iResolution"), renderSize, renderSize);
  
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
}
