function setup_vaos(){
  let update_attrib_locations = {
    i_P: {
        location: gl.getAttribLocation(updateParticles, "i_P"),
        num_components: 2,
        type: gl.FLOAT
    },
    i_A: {
        location: gl.getAttribLocation(updateParticles, "i_A"),
        num_components: 1,
        type: gl.FLOAT
    },
    i_T: {
        location: gl.getAttribLocation(updateParticles, "i_T"),
        num_components: 1,
        type: gl.FLOAT
    }
  };

  let render_attrib_locations = {
      i_P: {
          location: gl.getAttribLocation(renderParticles, "i_P"),
          num_components: 2,
          type: gl.FLOAT
      }
  };

  vaos = [
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray()
  ];


  vao_desc = [{vao: vaos[0],
    buffers: [{
        buffer_object: buffers[0],
        stride: 16,
        attribs: update_attrib_locations
      }]
  }, {
      vao: vaos[1],
      buffers: [{
          buffer_object: buffers[1],
          stride: 16,
          attribs: update_attrib_locations
      }]
  }, {
      vao: vaos[2],
      buffers: [{
          buffer_object: buffers[0],
          stride: 16,
          attribs: render_attrib_locations
      }]
  }, {
      vao: vaos[3],
      buffers: [{
          buffer_object: buffers[1],
          stride: 16,
          attribs: render_attrib_locations
      }]
  }];
}


function initialize_buffers(){
  let initial_data = create_particles();

  // Initialize buffers with the particle data.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
  // Bind attributes for each VAO.
  for (let j = 0; j < vao_desc.length; j++) {
    bind_attributes(gl, vao_desc[j].buffers, vao_desc[j].vao, 4);
  }
}


function bind_attributes(gl, bufferDesc, vao, compSize) {
  gl.bindVertexArray(vao);
  for (let k in bufferDesc) {
    if (bufferDesc.hasOwnProperty(k)) {
      let desc = bufferDesc[k].attribs;
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferDesc[k].buffer_object);
      let offset = 0;
      for (var attr in desc) {
        if (desc.hasOwnProperty(attr)) {
          let attrib = desc[attr];
          gl.enableVertexAttribArray(attrib.location);
          gl.vertexAttribPointer(attrib.location, attrib.num_components, attrib.type, false, bufferDesc[k].stride, offset);
          offset += attrib.num_components * compSize;
        }
      }
    }
  }
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}



// Creates a framebuffer texture for drawing the screen.
// originally createScreenFbo
function loadOutputTexture(initialData) {
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA32F,
      renderSize, renderSize, 0,
      gl.RGBA, gl.FLOAT, initialData
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}


function createBlurTexture() {
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, renderSize, renderSize, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex
}





function setup_webgl(){
  c = document.getElementById("slimewebgl");
  c.width = renderSize;
  c.height = renderSize;

  gl = c.getContext("webgl2");		

  gl.getExtension("EXT_color_buffer_float");
  gl.getExtension("OES_texture_float_linear");
  gl.getExtension("EXT_float_blend");
}


// this replicates the function u in Sage Jenson's code
function create_program(vsSource, fsSource, transformFeedbackVaryings) {
  let program = gl.createProgram();

  let vertexShader = create_shader(gl.VERTEX_SHADER, vsSource)
  let fragmentShader =  create_shader(gl.FRAGMENT_SHADER, fsSource)

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (transformFeedbackVaryings) {
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
