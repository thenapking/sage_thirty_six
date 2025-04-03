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

  // let render_attrib_locations = {
  //     i_P: {
  //         location: gl.getAttribLocation(renderParticles, "i_P"),
  //         num_components: 2,
  //         type: gl.FLOAT
  //     }
  // };

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
  // }, {
  //     vao: vaos[2],
  //     buffers: [{
  //         buffer_object: buffers[0],
  //         stride: 16,
  //         attribs: render_attrib_locations
  //     }]
  // }, {
  //     vao: vaos[3],
  //     buffers: [{
  //         buffer_object: this.buffers[1],
  //         stride: 16,
  //         attribs: this.render_attrib_locations
  //     }]
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

