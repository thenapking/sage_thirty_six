
const updateVSource = `#version 300 es
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Full license: https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// Contact the author for other licensing options (sagejenson.com / @mxsage)
precision highp float;

uniform sampler2D u_trail;
in vec2 i_P;
in float i_A;
in float i_T;
out vec2 v_P;
out float v_A;
out float v_T;

uniform vec2 i_dim;
uniform int pen;
uniform float[19] v;
uniform float[8] mps;
uniform int frame;

vec2 bd(vec2 pos) {
  pos *= 0.5;
  pos += vec2(0.5);
  pos -= floor(pos);
  pos -= vec2(0.5);
  pos *= 2.0;
  return pos;
}

float gn(in vec2 coordinate, in float seed) {
  return fract(tan(distance(coordinate * (seed + 0.118446744073709551614),
                           vec2(0.118446744073709551614, 0.314159265358979323846264)))
               * 0.141421356237309504880169);
}

vec2 cr(float t) {
  vec2 G1 = vec2(mps[0], mps[1]);
  vec2 G2 = vec2(mps[2], mps[3]);
  vec2 G3 = vec2(mps[4], mps[5]);
  vec2 G4 = vec2(mps[6], mps[7]);
  vec2 A = G1 * -0.5 + G2 * 1.5 + G3 * -1.5 + G4 * 0.5;
  vec2 B = G1 + G2 * -2.5 + G3 * 2.0 + G4 * -0.5;
  vec2 C = G1 * -0.5 + G3 * 0.5;
  vec2 D = G2;
  return t * (t * (t * A + B) + C) + D;
}

void main() {
  vec2 dir = vec2(cos(i_T), sin(i_T));
  float hd = i_dim.x / 2.0;
  vec2 sp = 0.5 * (i_P + vec2(1.0));
  float sv = texture(u_trail, bd(sp + v[13] / hd * dir + vec2(0.0, v[12] / hd))).x;
  sv = max(sv, 0.000000001);
  float sd = v[0] / hd + v[2] * pow(sv, v[1]) * 250.0 / hd;
  float md = v[9] / hd + v[11] * pow(sv, v[10]) * 250.0 / hd;
  float sa = v[3] + v[5] * pow(sv, v[4]);
  float ra = v[6] + v[8] * pow(sv, v[7]);
  float m = texture(u_trail, bd(sp + sd * vec2(cos(i_T), sin(i_T)))).x;
  float l = texture(u_trail, bd(sp + sd * vec2(cos(i_T + sa), sin(i_T + sa)))).x;
  float r = texture(u_trail, bd(sp + sd * vec2(cos(i_T - sa), sin(i_T - sa)))).x;
  float h = i_T;
  if (m > l && m > r) {
    // do nothing
  } else if (m < l && m < r) {
    if (gn(i_P * 1332.4324, i_T) > 0.5)
      h += ra;
    else
      h -= ra;
  } else if (l < r)
    h -= ra;
  else if (l > r)
    h += ra;
    
  vec2 nd = vec2(cos(h), sin(h));
  vec2 op = i_P + nd * md;
  const float segmentPop = 0.0005;
  if (pen == 1 && i_A < segmentPop) {
    op = 2.0 * cr(i_A / segmentPop) - vec2(1.0);
    op += nd * pow(gn(i_P * 132.43, i_T), 1.8);
  }
  v_P = bd(op);
  v_A = fract(i_A + segmentPop);
  v_T = h;
}
`

const updateFSource =  `#version 300 es
precision highp float;
in float v_A;
void main() {
  discard;
}`

const renderVSource = `#version 300 es
precision highp float;
in vec2 i_P;
uniform float pointsize;
uniform float dotSize;
void main() {
    gl_PointSize = pointsize;
    gl_Position = vec4(i_P, 0.0, 1.0);
    if (gl_VertexID == 0) {
        gl_PointSize = dotSize;
    }
}`

const renderFSource = `#version 300 es
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
        FragColor = vec4(1., 1., 1., opacity);
}`

// This is the trail diffusion shader.
const blurFSource = `#version 300 es
precision highp float;
uniform vec2 uTextureSize;
uniform vec2 mouse;
uniform vec2 prevMouse;
uniform sampler2D uUpdateTex;
in vec2 vTexCoord;
out vec2 outState;
uniform float[19] v;
void main() {
    vec2 onePixel = 1.0 / uTextureSize;
    vec2 average = vec2(0.);
    float dec_x = vTexCoord.x - onePixel.x;
    float inc_x = vTexCoord.x + onePixel.x;
    float dec_y = vTexCoord.y - onePixel.y;
    float inc_y = vTexCoord.y + onePixel.y;
    average += texture(uUpdateTex, vec2(dec_x, dec_y)).rg;
    average += texture(uUpdateTex, vec2(dec_x, vTexCoord.y)).rg;
    average += texture(uUpdateTex, vec2(dec_x, inc_y)).rg;
    average += texture(uUpdateTex, vec2(vTexCoord.x, dec_y)).rg;
    average += texture(uUpdateTex, vTexCoord).rg;
    average += texture(uUpdateTex, vec2(vTexCoord.x, inc_y)).rg;
    average += texture(uUpdateTex, vec2(inc_x, dec_y)).rg;
    average += texture(uUpdateTex, vec2(inc_x, vTexCoord.y)).rg;
    average += texture(uUpdateTex, vec2(inc_x, inc_y)).rg;
    average /= 9.;
    outState = average * v[15];
}`

const clearFSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 outColor;
uniform float[19] v;
void main() {
    outColor = vec4(0., 0., 0., v[18]);
}`

const drawFSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 outColor;
uniform sampler2D uDrawTex;
uniform int invert;
void main() {
    vec4 color = clamp(texture(uDrawTex, vTexCoord), 0., 1.);
    color.a = 1.0;
    if (invert == 1) {
        color.xyz = vec3(1.) - color.xyz;
    }
    outColor = color;
}`

const universalVSource = `#version 300 es
in vec4 aVertexPosition;
in vec2 aTexCoord;
precision highp float;
out vec2 vTexCoord;
void main() {
    gl_Position = aVertexPosition;
    vTexCoord = aTexCoord;
}`;

// draws some colours
const testVSource = `#version 300 es
        in vec4 position;void main() {gl_Position =  vec4(position.xy,0.,1.);}`

const testFSource =  `#version 300 es
        precision mediump float;

        uniform vec2 iResolution;
        uniform float iGlobalTime;
        out vec4 myOutputColor;
        void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    		vec2 uv = fragCoord.xy/iResolution.xy;
    		fragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);

				}
 
				void main() {
						mainImage(myOutputColor,gl_FragCoord.xy);
				}`

const debugVSource = `#version 300 es
precision mediump float;
in vec2 position;
in vec2 aTexCoord;
out vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const debugFSource = `#version 300 es
precision mediump float;
in vec2 vTexCoord;
uniform sampler2D uTexture;
out vec4 fragColor;
void main() {
  fragColor = texture(uTexture, vTexCoord);
}`

const debugFaderFSource = `#version 300 es
precision mediump float;
in vec2 vTexCoord;
uniform sampler2D uTexture;
uniform float uDecay; // e.g., 0.95
out vec4 fragColor;
void main() {
  vec4 texColor = texture(uTexture, vTexCoord);
  fragColor = texColor * uDecay;
}
`

const testParticleVSource = `#version 300 es
precision mediump float;
in vec2 aPos;  // Particle position (clip space)
uniform float dotSize;  // The size of the point
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
  gl_PointSize = dotSize;  // Adjust the size as needed.
}`

const testParticleFSource = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main() {
  // Use gl_PointCoord to create a circular point.
  vec2 center = vec2(0.5);
  float dist = distance(gl_PointCoord, center);
  if(dist > 0.5) {
    discard;
  }
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`

const testBlurFSource = `#version 300 es
precision mediump float;
in vec2 vTexCoord;
uniform sampler2D uTexture;  // Input texture (the offscreen trail texture)
uniform vec2 uTextureSize;   // Dimensions of the texture (in pixels)
uniform float uDecay;        // Decay factor (e.g. 0.95)
out vec4 fragColor;
void main() {
    vec2 onePixel = 1.0 / uTextureSize;
    vec4 sum = vec4(0.0);
    // Loop over a 3x3 neighborhood: offsets -1, 0, 1
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            sum += texture(uTexture, vTexCoord + onePixel * vec2(x, y));
        }
    }
    vec4 blurred = sum / 9.0;
    fragColor = blurred * uDecay;
}`

const testBlurVSource = `#version 300 es
precision mediump float;
in vec2 aPos;      // Full-screen quad vertex position (clip space)
in vec2 aTexCoord; // Texture coordinate
out vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`



