#version 300 es
precision highp float;
out vec4 FragColor;
uniform float[19] v;
uniform int deposit;
void main() {
  float opacity;
  if (deposit == 1) {
    opacity = v[14];
  } else {
    opacity = v[17];
  }
  if (dot(gl_PointCoord - 0.5, gl_PointCoord - 0.5) > 0.25)
    discard;
  else
    FragColor = vec4(1.0, 1.0, 1.0, opacity);
}
