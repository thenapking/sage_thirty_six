// 36 Points (2019-2022)
// by Sage Jenson (sagejenson.com / @mxsage);
// released on feralfile.com on 24 February 2022
// © 2022, Sage Jenson

// --- Global Parameters and Data Definitions ---

// Edition index (from 1 to 36)
const e = 7;

// Multiline string of parameters for each simulation “point”.
// Each line represents one preset (with a trailing comment giving its name).
const t = `
0.000, 4.000, 0.300, 0.100, 51.32, 20.00, 0.410, 4.000, 0.000, 0.100, 6.000, 0.100, 0.000, 0.000, 0.400, 0.705, 1.000, 0.300, 0.250, 8.0,   // pure_multiscale
0.000, 28.04, 14.53, 0.090, 1.000, 0.000, 0.010, 1.400, 1.120, 0.830, 0.000, 0.000, 0.570, 0.030, 0.070, 0.986, 1.000, 0.230, 0.166, 6.0,   // hex_hole_open
17.92, 0.000, 0.000, 0.520, 0.000, 0.000, 0.180, 0.000, 0.000, 0.100, 6.050, 0.170, 0.000, 0.000, 0.040, 0.973, 1.000, 0.530, 0.455, 16.,   // vertebrata
3.000, 0.000, 0.000, 0.350, 0.000, 0.000, 0.000, 0.570, 2.000, 0.010, 4.000, 0.020, 0.300, 0.000, 0.110, 0.945, 1.000, 0.180, 0.248, 16.,   // traffic_many_lanes
13.95, 7.460, 0.110, 4.040, 5.000, 0.520, 0.490, 0.580, 0.180, 7.590, 3.040, 0.160, 4.760, 0.000, 0.610, 0.975, 1.000, 0.348, 0.172, 5.0,   // tactile_extreme
3.000, 10.17, 0.400, 1.030, 2.300, 2.000, 1.420, 20.00, 0.750, 0.830, 1.560, 0.110, 1.070, 0.000, 0.200, 0.951, 10.00, 0.150, 0.248, 16.,   // star_network
0.000, 8.510, 0.190, 0.610, 0.000, 0.000, 3.350, 0.000, 0.000, 0.750, 12.62, 0.060, 0.000, 0.000, 0.270, 0.904, 1.000, 0.060, 0.042, 7.0,   // enmeshed_singularities
0.000, 0.820, 0.030, 0.1800, 0.00, 0.000, 0.260, 0.000, 0.000, 0.000, 20.00, 0.650, 0.200, 0.900, 0.140, 0.939, 1.000, 0.470, 0.430, 10.,   // waves_upturn
0.000, 8.440, 0.080, 4.820, 0.000, 0.000, 1.190, 0.000, 0.000, 0.000, 0.330, 0.010, 0.000, 0.000, 0.040, 0.980, 1.000, 0.320, 0.172, 7.0,   // turing
1.660, 19.26, 0.060, 1.260, 0.000, 0.000, 1.650, 0.000, 0.000, 0.060, 5.740, 0.080, 0.000, 3.040, 0.110, 0.988, 3.000, 0.134, 0.221, 19.,   // petri_worms
0.000, 17.54, 0.080, 0.640, 0.000, 0.000, 1.800, 0.000, 0.000, 0.100, 20.00, 0.060, 0.400, 0.000, 0.200, 0.939, 1.000, 0.200, 0.283, 14.,   // a_rooting
1.500, 1.940, 0.280, 1.730, 1.120, 0.710, 0.180, 2.220, 0.850, 0.500, 4.130, 0.110, 1.120, 0.000, 0.020, 0.850, 1.000, 0.140, 0.234, 11.,   // more_individuals
8.340, 3.860, 0.030, 1.210, 1.400, 0.300, 1.130, 5.500, 0.390, 17.85, 8.510, 0.960, 0.000, 7.140, 0.020, 0.781, 1.000, 0.200, 0.166, 16.,   // slow_metastructure
2.870, 3.040, 0.280, 0.090, 0.000, 0.000, 0.440, 0.850, 0.000, 0.000, 2.220, 0.140, 0.300, 0.850, 0.020, 0.891, 1.000, 0.140, 0.166, 21.,   // sloppy_bucky
0.140, 1.120, 0.190, 0.270, 1.400, 0.000, 1.130, 2.000, 0.390, 0.750, 2.220, 0.190, 0.000, 7.140, 0.210, 0.795, 1.000, 0.120, 0.166, 19.,   // massive_structure
0.001, 2.540, 0.080, 0.000, 0.000, 0.000, 3.350, 0.000, 0.000, 0.100, 12.62, 0.060, 0.000, 0.000, 0.270, 0.877, 1.000, 0.250, 0.344, 5.0,   // speed_modulation
0.000, 20.00, 0.080, 5.280, 0.000, 0.000, 5.200, 0.000, 0.000, 1.440, 1.560, 0.060, 1.810, 0.000, 0.050, 0.987, 1.000, 0.280, 0.172, 16.,   // emergent_hex_waves
0.000, 17.26, 0.280, 0.350, 1.120, 0.660, 1.470, 0.570, 1.020, 0.750, 19.18, 0.390, 0.000, 1.940, 0.130, 0.959, 1.000, 0.110, 0.135, 21.,   // formalisms
0.000, 89.60, 20.00, 1.300, 0.000, 0.000, 1.300, 1.400, 1.070, 0.750, 69.08, 2.220, 0.300, 0.000, 0.080, 0.959, 1.000, 0.160, 0.332, 10.,   // growing_on_a_sea_of_sand
4.240, 75.92, 0.000, 4.390, 0.000, 0.000, 1.300, 171.7, 20.00, 6.220, 7.520, 1.120, 0.000, 0.000, 0.060, 0.877, 5.000, 0.230, 0.166, 11.,   // grid_of_sorts
17.92, 89.60, 3.040, 2.670, 34.88, 10.70, 0.350, 294.8, 0.000, 0.001, 82.76, 20.00, 0.000, 0.000, 0.005, 0.999, 1.000, 0.330, 0.289, 6.0,   // negotiation_of_highways
0.000, 28.04, 20.00, 0.180, 26.74, 20.00, 0.010, 1.400, 1.120, 0.830, 0.000, 0.000, 2.540, 0.000, 0.120, 0.959, 1.000, 0.230, 0.166, 5.0,   // transmission_tower
2.000, 28.04, 0.000, 0.090, 1.000, 0.000, 0.800, 2.080, 0.000, 0.000, 2.000, 0.030, 0.820, 0.000, 0.050, 0.889, 1.000, 0.200, 0.394, 16.,   // sacred_network_nodules
0.000, 0.850, 0.010, 0.350, 1.400, 0.000, 1.810, 0.570, 1.450, 0.010, 4.000, 0.020, 0.300, 0.000, 0.110, 0.945, 1.000, 0.070, 0.049, 16.,   // positive_negative_space
1.660, 20.00, 33.19, 1.030, 39.03, 2.540, 2.650, 364.8, 8.200, 0.050, 2.150, 2.540, 0.000, 0.000, 0.001, 0.975, 1.000, 0.160, 0.115, 14.,   // circular_consolidation
0.000, 9.000, 2000., 1.030, 39.03, 2.540, 2.650, 174.3, 8.200, 6.360, 5.000, 20.00, 0.000, 0.000, 0.001, 0.975, 1.000, 0.080, 0.115, 14.,   // radiative_nexus
17.92, 89.60, 3.040, 2.670, 34.88, 10.70, 3.350, 294.8, 0.000, 0.001, 69.76, 116.4, 0.000, 0.000, 0.005, 0.999, 1.000, 0.330, 0.289, 10.,   // unfold_time_but_only_in_a_line
0.000, 20.00, 3.000, 0.260, 2.150, 4.760, 0.410, 6.600, 12.62, 0.300, 6.600, 0.037, 0.400, 0.040, 0.030, 0.926, 1.000, 0.450, 0.459, 10.,   // ink_on_white
0.000, 89.60, 20.00, 1.300, 0.000, 0.000, 0.180, 1.400, 1.070, 0.750, 69.08, 2.220, 0.300, 0.000, 0.080, 0.960, 1.000, 0.160, 0.332, 7.0,   // network_time
0.000, 0.800, 0.020, 0.100, 1.000, 0.000, 0.260, 0.100, 2.790, 0.830, 32.88, 37.74, 0.090, 0.330, 0.100, 0.939, 1.000, 0.430, 0.262, 3.0,   // inverse_network
27.50, 2.000, 2.540, 0.880, 26.74, 0.000, 0.090, 267.4, 1.400, 0.100, 5.000, 7.410, 1.400, 14.25, 0.140, 0.754, 1.000, 0.600, 0.627, 11.,   // vanishing_points
5.350, 6.000, 0.000, 0.100, 1.000, 0.000, 0.180, 1.000, 0.000, 0.000, 2.150, 0.330, 0.000, 0.000, 0.100, 0.840, 2.000, 0.230, 0.164, 16.,   // neuron_cluster
0.000, 6.000, 100.0, 0.157, 1.000, 1.070, 0.000, 1.000, 5.000, 0.830, 5.000, 20.00, 0.400, 0.000, 0.003, 0.914, 1.000, 0.250, 0.361, 6.0,   // scaling_nodule_emergence
0.005, 6.000, 205.3, 0.000, 1.000, 1.000, 0.180, 2.200, 20.00, 0.830, 3.000, 1.320, 0.400, 0.000, 0.001, 0.939, 1.000, 0.150, 0.361, 6.0,   // probe_emergence_from_line
0.000, 15.00, 8.600, 0.030, 1.000, 0.000, 0.340, 2.000, 1.070, 0.220, 15.00, 0.100, 2.300, 0.820, 1.000, 0.705, 1.000, 0.420, 0.373, 8.0,   // hyp_offset
0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 1.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.230, 0.166, 4.0,   // noise
0.000, 32.88, 402.0, 0.410, 3.000, 0.000, 0.100, 0.000, 0.000, 0.300, 6.000, 0.000, 0.000, 0.000, 0.090, 0.914, 1.000, 0.460, 0.290, 6.0,   // strike
5.350, 2.150, 0.000, 0.340, 20.59, 0.000, 0.490, 0.100, 2.790, 0.830, 125.1, 45.11, 0.090, 0.000, 0.190, 0.975, 1.000, 0.550, 0.213, 6.0,   // suture
0.000, 100.5, 20.00, 0.180, 14.44, 0.000, 1.260, 0.000, 0.000, 0.830, 75.91, 0.860, 0.300, 0.000, 0.390, 0.975, 2.000, 0.250, 0.250, 11.,   // surface_tension_sharp
0.000, 0.800, 0.020, 0.340, 20.59, 0.000, 0.260, 0.100, 2.790, 0.830, 125.1, 45.11, 0.580, 0.330, 0.190, 0.975, 1.000, 0.520, 0.238, 5.0,   // pincushion
0.000, 0.800, 0.020, 5.200, 1.000, 0.000, 0.260, 0.100, 2.790, 0.830, 32.88, 37.74, 0.090, 0.330, 0.100, 0.939, 1.000, 0.450, 0.189, 6.0,   // clear_spaghetti
17.92, 89.60, 3.040, 2.670, 34.88, 10.70, 5.770, 294.8, 0.000, 0.001, 82.76, 20.00, 0.000, 0.000, 0.005, 0.999, 1.000, 0.330, 0.289, 10.,   // negotiation_of_zoning
1.829, 23.65, 0.029, 0.674, 0.500, 0.000, 1.224, 1.039, 0.000, 0.029, 3.869, 0.054, 0.409, 1.519, 0.080, 0.938, 2.000, 0.065, 0.307, 18.,   // hexa1833
`;

// s is the current point index (0-indexed)
let s = e - 1;

// A flag used later to indicate interpolation mode.
let r = false;

// Split the multiline string into an array of lines and then each line into values.
const i = t.split("\n");
i.shift(); // remove the first empty element
for (let j = 0; j < i.length; ++j) {
    i[j] = i[j].split(",");
}

// Prepare arrays for various parameter sets
let a = [], o = [], l = [];
let n = 0;
for (let j = 0; j < i.length; ++j) {
    // For each preset, if there are more than 16 values, push the 17th as an integer into array a.
    if (i[j].length > 16) {
        a.push(parseInt(i[j][16]));
    }
    // If there are 19 or more values, create a Float32Array of the first 20 numbers.
    if (i[j].length >= 19) {
        o.push(new Float32Array(i[j].slice(0, 20)));
    }
    // Extract the trailing comment (or name) from the line.
    let str = i[j][20] + "";
    str = str.replace(/\s|\//g, "");
    l.push(str);
}

// --- Special adjustments for touch devices ---
if (["iPad", "iPhone", "iPod"].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
  // Adjust certain parameters for touch devices
  o[16][15] = 0.988;
  o[18][15] = 0.977;
  o[25][15] = 0.99;
  o[27][15] = 0.965;
  o[28][15] += 0.02;
  o[29][15] -= 0.002;
  o[32][15] += 0.04;
  o[33][15] += 0.045;
  o[35][15] += 0.1;
}

// --- Set up canvas layout based on aspect ratio ---
let h = window.innerWidth / window.innerHeight < 0.8;
if ("iPad" === navigator.platform) {
  h = false;
}

// Log initial information to the console.
console.log("36 Points (2019-2022)\nPoint " +
    e.toString().padStart(2, "0") + " (" + l[e - 1] + ")\nby Sage Jenson\n(sagejenson.com / @mxsage)");

// --- Shader Code String for a simple vertex shader ---
const g = `#version 300 es
in vec4 aVertexPosition;
in vec2 aTexCoord;
precision highp float;
out vec2 vTexCoord;
void main() {
    gl_Position = aVertexPosition;
    vTexCoord = aTexCoord;
}`;

// --- Utility Functions --- 

// Creates and links a shader program with optional transform feedback varyings.
function u(gl, shaderInfos, transformFeedbackVaryings) {
    var shader, program = gl.createProgram();
    for (let j = 0; j < shaderInfos.length; j++) {
        let info = shaderInfos[j];
        // Create, compile, and attach shader.
        shader = (function(gl, info) {
            let shader = gl.createShader(info.type);
            gl.shaderSource(shader, info.source);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            } else {
                alert("Didn't compile shader. Info: " + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
        })(gl, info);
        gl.attachShader(program, shader);
    }
    if (transformFeedbackVaryings != null) {
        gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS);
    }
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    } else {
        alert("Didn't link shader. Info: " + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
}

// Linear interpolation helper.
function c(a, b, t) {
    return (1 - t) * a + t * b;
}

// Multiplicative interpolation helper.
function m(a, b, t) {
    return Math.pow(a, 1 - t) * Math.pow(b, t);
}

// --- Global flag for "egg" drop behavior ---
let d = false;

// --- Main Simulation Class ---
class p {
    // Creates a framebuffer texture for drawing the screen.
    createScreenFbo(initialData) {
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA32F,
            this.params.renderSize, this.params.renderSize, 0,
            this.gl.RGBA, this.gl.FLOAT, initialData
        );
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        return tex;
    }

    // Constructor: sets up the simulation, compiles shaders, and initializes buffers.
    constructor(gl, params) {
        this.gl = gl;
        this.params = params;
        this.frame = 0;
        this.lerpParams = o[s]; // current simulation preset parameters

        // Prepare a Float32Array for mouse positions (used in shaders).
        const mouseArray = [];
        mouseArray.length = 8;
        mouseArray.fill(-1);
        this.mousePositions = new Float32Array(mouseArray);

        // Enable necessary WebGL extensions.
        this.gl.getExtension("EXT_color_buffer_float");
        this.gl.getExtension("OES_texture_float_linear");
        this.gl.getExtension("EXT_float_blend");

        // Create a texture to store the screen output.
        this.screenTexture = this.createScreenFbo(null);

        // Compile update and render shader programs.
        this.updateParticles = u(this.gl, [{
            source: `#version 300 es
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
    pos *= 2.;
    return pos;
}
float gn(in vec2 coordinate, in float seed){
    return fract(tan(distance(coordinate*(seed+0.118446744073709551614), vec2(0.118446744073709551614, 0.314159265358979323846264)))*0.141421356237309504880169);
}
vec2 cr(float t) {
    vec2 G1 = vec2(mps[0], mps[1]);
    vec2 G2 = vec2(mps[2], mps[3]);
    vec2 G3 = vec2(mps[4], mps[5]);
    vec2 G4 = vec2(mps[6], mps[7]);
    vec2 A = G1*-0.5+G2*1.5+G3*-1.5+G4*0.5;
    vec2 B = G1+G2*-2.5+G3*2.+G4*-.5;
    vec2 C = G1*-0.5+G3*0.5 ;
    vec2 D = G2;
    return t*(t*(t*A+B)+C)+D;
}
void main() {
    vec2 dir = vec2(cos(i_T), sin(i_T));
    float hd = i_dim.x/2.;
    vec2 sp = 0.5 * (i_P + vec2(1.0));
    float sv = texture(u_trail, bd(sp + v[13]/hd*dir + vec2(0., v[12]/hd))).x;
    sv = max(sv, 0.000000001);
    float sd = v[0]/hd + v[2]*pow(sv, v[1])*250./hd;
    float md = v[9]/hd + v[11]*pow(sv, v[10])*250./hd;
    float sa = v[3] + v[5]*pow(sv, v[4]);
    float ra = v[6] + v[8]*pow(sv, v[7]);
    float m = texture(u_trail, bd(sp + sd*vec2(cos(i_T), sin(i_T)))).x;
    float l = texture(u_trail, bd(sp + sd*vec2(cos(i_T+sa), sin(i_T+sa)))).x;
    float r = texture(u_trail, bd(sp + sd*vec2(cos(i_T-sa), sin(i_T-sa)))).x;
    float h = i_T;
    if (m > l && m > r) {
        // Do nothing: continue straight
    } else if (m < l && m < r) {
        if (gn(i_P*1332.4324, i_T) > 0.5)
            h += ra;
        else
            h -= ra;
    } else if (l < r) {
        h -= ra;
    } else if (l > r) {
        h += ra;
    }
    vec2 nd = vec2(cos(h), sin(h));
    vec2 op = i_P + nd * md;
    const float segmentPop = 0.0005;
    if (pen == 1 && i_A < segmentPop) {
        op = 2. * cr(i_A/segmentPop) - vec2(1.);
        op += nd * pow(gn(i_P*132.43, i_T), 1.8);
    }
    v_P = bd(op);
    v_A = fract(i_A + segmentPop);
    v_T = h;
}`,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
precision highp float;
in float v_A;
void main() { discard; }`,
            type: this.gl.FRAGMENT_SHADER
        }], ["v_P", "v_A", "v_T"]);

        this.renderParticles = u(this.gl, [{
            source: `#version 300 es
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
}`,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
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
}`,
            type: this.gl.FRAGMENT_SHADER
        }], null);

        // Define attribute locations for update and render programs.
        this.update_attrib_locations = {
            i_P: {
                location: this.gl.getAttribLocation(this.updateParticles, "i_P"),
                num_components: 2,
                type: this.gl.FLOAT
            },
            i_A: {
                location: this.gl.getAttribLocation(this.updateParticles, "i_A"),
                num_components: 1,
                type: this.gl.FLOAT
            },
            i_T: {
                location: this.gl.getAttribLocation(this.updateParticles, "i_T"),
                num_components: 1,
                type: this.gl.FLOAT
            }
        };

        this.render_attrib_locations = {
            i_P: {
                location: this.gl.getAttribLocation(this.renderParticles, "i_P"),
                num_components: 2,
                type: this.gl.FLOAT
            }
        };

        // Create vertex array objects and buffers.
        this.vaos = [
            this.gl.createVertexArray(),
            this.gl.createVertexArray(),
            this.gl.createVertexArray(),
            this.gl.createVertexArray()
        ];
        this.buffers = [
            this.gl.createBuffer(),
            this.gl.createBuffer()
        ];

        // Describe each VAO's buffer and attribute setup.
        this.vao_desc = [{
            vao: this.vaos[0],
            buffers: [{
                buffer_object: this.buffers[0],
                stride: 16,
                attribs: this.update_attrib_locations
            }]
        }, {
            vao: this.vaos[1],
            buffers: [{
                buffer_object: this.buffers[1],
                stride: 16,
                attribs: this.update_attrib_locations
            }]
        }, {
            vao: this.vaos[2],
            buffers: [{
                buffer_object: this.buffers[0],
                stride: 16,
                attribs: this.render_attrib_locations
            }]
        }, {
            vao: this.vaos[3],
            buffers: [{
                buffer_object: this.buffers[1],
                stride: 16,
                attribs: this.render_attrib_locations
            }]
        }];

        // Compute number of particles based on simulation size and density.
        this.params.numParticles = this.params.simSize * this.params.simSize * this.params.particleDensity;

        // Create initial particle data (randomized positions, age and angle).
        this.initial_data = new Float32Array((() => {
            let arr = [];
            for (let j = 0; j < this.params.numParticles; ++j) {
                arr.push(2 * Math.random() - 1); // x position
                arr.push(2 * Math.random() - 1); // y position
                arr.push(j / this.params.numParticles); // age factor
                arr.push(2 * Math.random() * 3.14159); // angle
            }
            return arr;
        })());

        // Initialize buffers with the particle data.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[0]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.initial_data, this.gl.STREAM_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[1]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.initial_data, this.gl.STREAM_DRAW);

        // Bind attributes for each VAO.
        for (let j = 0; j < this.vao_desc.length; j++) {
            (function(gl, bufferDesc, vao, compSize) {
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
            })(this.gl, this.vao_desc[j].buffers, this.vao_desc[j].vao, 4);
        }

        // Setup read/write buffer indices for particle updates.
        this.read = 0;
        this.write = 1;

        // Compile additional shader programs for blurring and screen drawing.
        this.drawBlur = u(this.gl, [{
            source: g,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
precision highp float;
in vec2 vTexCoord;
uniform vec2 uTextureSize;
out vec4 outColor;
uniform sampler2D uDrawTex;
void main() {
    vec2 uv = texture(uDrawTex, vTexCoord).rg;
    vec3 color = vec3(uv.r);
    outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`,
            type: this.gl.FRAGMENT_SHADER
        }], null);

        this.updateBlur = u(this.gl, [{
            source: g,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
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
}`,
            type: this.gl.FRAGMENT_SHADER
        }], null);

        // Set up a vertex array object for full-screen quad rendering.
        this.vao = this._initVertexArray();

        // Create two textures used for simulation updates.
        this.textures = new Array(2);
        for (let j = 0; j < this.textures.length; j++) {
            this.textures[j] = this._loadTexture(null);
        }

        // Create framebuffer object.
        this.framebuffer = this.gl.createFramebuffer();

        // Enable blending and clear initial buffers.
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0, 0, 0, 0.1);

        // Compile shader for drawing the screen.
        this.drawScreen = u(this.gl, [{
            source: g,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
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
}`,
            type: this.gl.FRAGMENT_SHADER
        }], null);

        // Compile shader for clearing (fading) the screen.
        this.clearScreen = u(this.gl, [{
            source: g,
            type: this.gl.VERTEX_SHADER
        }, {
            source: `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 outColor;
uniform float[19] v;
void main() {
    outColor = vec4(0., 0., 0., v[18]);
}`,
            type: this.gl.FRAGMENT_SHADER
        }], null);

        // Initialize simulation texture data.
        let texSize = this.params.simSize * this.params.simSize * 2;
        this.setTexture(new Float32Array(Array(texSize).fill(0)));
    }

    // Utility methods for getting uniform and attribute locations.
    gu(program, name) {
        return this.gl.getUniformLocation(program, name);
    }
    ga(program, name) {
        return this.gl.getAttribLocation(program, name);
    }

    // --- Simulation Update Methods ---

    // Update particle positions using transform feedback.
    updateParticlesHelper() {
        this.frame++;
        this.gl.enable(this.gl.BLEND);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.updateParticles);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1fv(this.gl.getUniformLocation(this.updateParticles, "v"), this.lerpParams);

        // Update mouse positions (the newest is at the beginning).
        this.mousePositions[0] = this.params.mouse.x;
        this.mousePositions[1] = 1 - this.params.mouse.y;
        for (let j = 7; j >= 2; j--) {
            this.mousePositions[j] = this.mousePositions[j - 2];
        }
        this.gl.uniform1fv(this.gl.getUniformLocation(this.updateParticles, "mps"), this.mousePositions);
        this.gl.uniform1i(this.gl.getUniformLocation(this.updateParticles, "frame"), this.frame);
        this.gl.uniform1i(this.gl.getUniformLocation(this.updateParticles, "pen"), (d || r) ? 1 : 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.uniform1i(this.gu(this.updateParticles, "u_trail"), 1);
        this.gl.uniform2f(this.gu(this.updateParticles, "i_dim"), this.params.simSize, this.params.simSize);

        this.gl.bindVertexArray(this.vaos[this.read]);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.buffers[this.write]);
        this.gl.enable(this.gl.RASTERIZER_DISCARD);
        this.gl.beginTransformFeedback(this.gl.POINTS);
        this.gl.drawArrays(this.gl.POINTS, 0, this.params.numParticles);
        this.gl.endTransformFeedback();
        this.gl.disable(this.gl.RASTERIZER_DISCARD);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        this.gl.bindVertexArray(this.vaos[this.read + 2]);

        // Swap read and write buffers.
        var temp = this.read;
        this.read = this.write;
        this.write = temp;
    }

    // Deposit particles onto the trail texture.
    depositParticlesHelper() {
        this.gl.useProgram(this.renderParticles);
        this.gl.uniform1fv(this.gl.getUniformLocation(this.renderParticles, "v"), this.lerpParams);
        this.gl.uniform1i(this.gu(this.renderParticles, "deposit"), 1);
        this.gl.uniform1f(this.gu(this.renderParticles, "pointsize"), 1);
        this.gl.uniform1f(this.gu(this.renderParticles, "dotSize"), this.lerpParams[19]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures[0], 0);
        this.gl.bindVertexArray(this.vaos[this.read + 2]);
        this.gl.viewport(0, 0, this.params.simSize, this.params.simSize);
        this.gl.drawArrays(this.gl.POINTS, 0, this.params.numParticles);
    }

    // Apply a blur to the trail texture.
    blurHelper() {
        this.gl.disable(this.gl.BLEND);
        this.gl.bindVertexArray(this.vao);
        let t = Math.round(this.lerpParams[16]);
        for (let j = 0; j < t; j++) {
            this.gl.useProgram(this.updateBlur);
            this.gl.uniform1fv(this.gl.getUniformLocation(this.updateBlur, "v"), this.lerpParams);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures[1], 0);
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
            this.gl.uniform1i(this.gu(this.updateBlur, "uUpdateTex"), 1);
            this.gl.uniform2f(this.gu(this.updateBlur, "mouse"), this.params.mouse.x, this.params.mouse.y);
            this.gl.uniform2f(this.gu(this.updateBlur, "prevMouse"), this.params.prevMouseX, this.params.prevMouseY);
            this.gl.uniform2f(this.gu(this.updateBlur, "uTextureSize"), this.params.simSize, this.params.simSize);
            this.gl.viewport(0, 0, this.params.simSize, this.params.simSize);
            this.gl.clearColor(1, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            // Swap textures
            this.textures = [this.textures[1], this.textures[0]];
        }
        this.gl.enable(this.gl.BLEND);
    }

    // Draw particles to an offscreen texture.
    drawParticlesToCanvas() {
        this.gl.bindVertexArray(this.vaos[this.read + 2]);
        this.gl.useProgram(this.renderParticles);
        this.gl.uniform1fv(this.gl.getUniformLocation(this.renderParticles, "v"), this.lerpParams);
        this.gl.uniform1i(this.gu(this.renderParticles, "deposit"), 0);
        this.gl.uniform1f(this.gu(this.renderParticles, "pointsize"), this.params.drawPointsize);
        this.gl.uniform1f(this.gu(this.renderParticles, "dotSize"), this.lerpParams[19]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTexture);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.screenTexture, 0);
        this.gl.enable(this.gl.BLEND);
        this.gl.viewport(0, 0, this.params.renderSize, this.params.renderSize);
        this.gl.drawArrays(this.gl.POINTS, 0, this.params.numParticles);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    // Fade the offscreen screen texture.
    fadeScreen() {
        this.gl.useProgram(this.clearScreen);
        this.gl.enable(this.gl.BLEND);
        this.gl.uniform1fv(this.gl.getUniformLocation(this.clearScreen, "v"), this.lerpParams);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTexture);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.screenTexture, 0);
        this.gl.viewport(0, 0, this.params.renderSize, this.params.renderSize);
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    // Draw the offscreen texture to the main canvas.
    drawCanvasToScreen() {
        this.gl.useProgram(this.drawScreen);
        this.gl.uniform1i(this.gl.getUniformLocation(this.drawScreen, "invert"), (27 == s || 36 == s) ? 1 : 0);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTexture);
        this.gl.uniform1i(this.gu(this.drawScreen, "uDrawTex"), 0);
        this.gl.viewport(0, 0, this.params.renderSize, this.params.renderSize);
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        if (h) {
            this.gl.viewport(0, parseInt(this.params.renderSize), this.params.renderSize, this.params.renderSize);
        } else {
            this.gl.viewport(parseInt(this.params.renderSize), 0, this.params.renderSize, this.params.renderSize);
        }
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    // Main draw function called every frame.
    draw() {
        // Lerp current parameters toward target parameters.
        this.params.lerpTime = Math.min(1, this.params.lerpTime + Math.max((1 - this.params.lerpTime) * this.params.convergenceRate, 0.001));
        this.lerpParams = (function(oldParams, newParams, t) {
            let result = [];
            for (let j = 0; j < oldParams.length; ++j) {
                if (typeof oldParams[j] === "number") {
                    let val = 0;
                    // For some specific indices use multiplicative interpolation.
                    if (j === 1 || j === 4 || j === 7 || j === 11) {
                        val = m(oldParams[j], newParams[j], t);
                    } else if (j === 19) {
                        val = m(oldParams[j], newParams[j], Math.pow(t, 10));
                    } else {
                        val = c(oldParams[j], newParams[j], t);
                    }
                    result.push(val);
                }
            }
            return result;
        })(this.params.pastParams, this.params.params, this.params.lerpTime);

        // Run the simulation steps.
        this.updateParticlesHelper();
        this.depositParticlesHelper();
        this.blurHelper();
        if (this.params.displayParticles) {
            this.fadeScreen();
            this.drawParticlesToCanvas();
            this.drawCanvasToScreen();
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        } else {
            this.gl.useProgram(this.drawBlur);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
            this.gl.uniform1i(this.gu(this.drawBlur, "uDrawTex"), 0);
            this.gl.uniform2f(this.gu(this.drawBlur, "uTextureSize"), this.params.simSize, this.params.simSize);
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    // Update the simulation texture.
    setTexture(data) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.R32F, this.params.simSize, this.params.simSize, 0, this.gl.RED, this.gl.FLOAT, data);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    // Initialize a vertex array for full-screen quad rendering.
    _initVertexArray() {
        let vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.ga(this.drawBlur, "aVertexPosition"));
        this.gl.vertexAttribPointer(this.ga(this.drawBlur, "aVertexPosition"), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ga(this.updateBlur, "aVertexPosition"));
        this.gl.vertexAttribPointer(this.ga(this.updateBlur, "aVertexPosition"), 2, this.gl.FLOAT, false, 0, 0);
        buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.ga(this.drawBlur, "aTexCoord"));
        this.gl.vertexAttribPointer(this.ga(this.drawBlur, "aTexCoord"), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ga(this.updateBlur, "aTexCoord"));
        this.gl.vertexAttribPointer(this.ga(this.updateBlur, "aTexCoord"), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindVertexArray(null);
        return vao;
    }

    // Create and initialize a texture for simulation state.
    _loadTexture(data) {
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RG32F, this.params.simSize, this.params.simSize, 0, this.gl.RG, this.gl.FLOAT, data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        return tex;
    }
}

// --- URL Hash and Navigation Handlers ---

let f = ""; // current point name
function v(val) {
    f = val;
    window.location.hash = val;
}
function _() {
    const nextPoint = s + 1;
    v(nextPoint.toString().padStart(2, "0") + "_" + l[s]);
}
window.onhashchange = function() {
    let hash = window.location.hash.slice();
    if (hash.slice(1, 12) !== "interpolant") {
        r = false;
        let digits = hash.match(/\d/g);
        digits = parseInt(digits.join("")) - 1;
        if (s != digits) {
            w(digits);
        }
    } else {
        r = true;
        let parts = hash.split("_").slice(1);
        if (parts.length === 3) {
            let amt = parseFloat(parts[2]);
            amt = Math.max(0, Math.min(1, amt));
            y(parseInt(parts[0]) - 1, parseInt(parts[1]) - 1, amt, false, true);
        }
    }
};
_();

// --- Canvas and Context Setup ---
const T = document.getElementById("canvas");
let x = false;
function E() {
    if (x) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
    }
    x = !x;
}
function R() {
    new Date;
    (function(name) {
        const a = document.createElement("a");
        new Date;
        a.download = name + ".png";
        a.href = T.toDataURL();
        a.click();
        a.remove();
    })("36_Points_" + f);
}

// Default simulation parameters.
const A = {
    simSize: 512,
    renderSize: 1080,
    mouse: { x: 450, y: 450 },
    particleDensity: 2.7,
    numParticles: -1,
    drawOpacity: 0.2,
    fillOpacity: 1,
    drawPointsize: 1,
    displayParticles: true,
    canvasZoom: 1,
    convergenceRate: 0.15,
    name: "params",
    update: true,
    pastParams: o[s],
    params: o[s],
    lerpTime: 0,
    smartLerp: true
};
if (h) {
    A.drawPointsize = 512 / 330;
    A.simSize = 330;
}
const b = document.getElementById("canvas").getContext("webgl2", {
    preserveDrawingBuffer: true
});
if (!b) alert("Requires WebGL2");

// Resize handler for canvas zoom.
function P() {
    if (A.mobile) {
        A.canvasZoom = window.innerWidth / A.renderSize;
    } else {
        A.canvasZoom = Math.max(window.innerHeight / A.renderSize, 0.5 * window.innerWidth / A.renderSize);
    }
    A.canvasZoom = Math.max(0.5, A.canvasZoom);
    if (window.devicePixelRatio < 1.25) {
        A.canvasZoom = Math.max(1, A.canvasZoom);
    }
    let e = parseInt(A.renderSize * A.canvasZoom);
    if (A.mobile) {
        T.style.width = e + "px";
        T.style.height = (2 * e) + "px";
        b.canvas.width = A.renderSize;
        b.canvas.height = 2 * A.renderSize;
        T.width = A.renderSize;
        T.height = 2 * A.renderSize;
    } else {
        T.style.width = (2 * e) + "px";
        T.style.height = e + "px";
        b.canvas.width = 2 * A.renderSize;
        b.canvas.height = A.renderSize;
        T.width = 2 * A.renderSize;
        T.height = A.renderSize;
    }
}
P();

// --- Key and Mouse Event Handling ---

let F = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109, 90, 88, 67, 86, 66, 78, 77];
function S() {
    var randIndex = Math.floor(Math.random() * F.length);
    if (randIndex != s) {
        s = randIndex;
        A.pastParams = A.params;
        A.lerpTime = 0;
        A.params = o[s];
        A.drawOpacity = A.params[17];
        A.fillOpacity = A.params[18];
        _();
    }
}
function w(e) {
    if (e < 0 || e >= o.length) {
        _();
    } else {
        s = e;
        A.pastParams = U.lerpParams;
        A.lerpTime = 0;
        A.params = o[s];
        A.drawOpacity = A.params[17];
        A.fillOpacity = A.params[18];
        d = false;
        _();
        console.log("Point " + (e + 1).toString().padStart(2, "0") + " (" + l[e] + ")");
    }
}
function y(e, t, i, s, r) {
    if (typeof e !== "number" || typeof t !== "number" || typeof i !== "number" ||
        e < 0 || e >= F.length || t < 0 || t >= F.length || i < 0 || i > 1) {
        console.log("Invalid interpolation parameters: " + e + " " + t + " " + i);
        _();
        return;
    }
    A.pastParams = U.lerpParams;
    A.params = (function(a, b, t) {
        let result = [];
        for (let j = 0; j < a.length; ++j) {
            if (typeof a[j] === "number") {
                result.push(c(a[j], b[j], t));
            }
        }
        return result;
    })(o[e], o[t], i);
    A.lerpTime = 0;
    if (r)
        console.log("Interpolation from Point " + (e + 1) + " to Point " + (t + 1) + " with amount " + i);
    if (s) v("interpolant_" + (e + 1) + "_" + (t + 1) + "_" + i);
}
function D(e) {
    var t = String.fromCharCode(e);
    if (t === "\\") {
        A.params = U.lerpParams;
        A.lerpTime = 1;
        console.log("Frozen!");
    } else if (t === "U") {
        A.update = !A.update;
    } else if (t === "S") {
        R();
        console.log("Save canvas");
    } else if (t === "R") {
        U = new p(b, A);
        console.log("Reset");
    } else if (t === "L") {
        console.log("Current parameters: " + this.lerpParams);
    } else if (t === " ") {
        E();
        console.log("Toggle fullscreen");
    } else if (t === "~") {
        y(Math.floor(Math.random() * F.length), Math.floor(Math.random() * F.length), parseFloat(Math.random().toFixed(3)), true, false);
    } else if (t === "+") {
        A.convergenceRate = Math.max(1e-15, 0.5 * A.convergenceRate);
        console.log("Convergence speed: " + A.convergenceRate);
    } else if (t === "-") {
        A.convergenceRate = Math.min(1, 2 * A.convergenceRate);
        console.log("Convergence speed: " + A.convergenceRate);
    } else {
        if (n > 1e3) {
            if (e === 109 && Math.random() > 0.95)
                e = 86;
            else if (e === 104 && Math.random() > 0.95)
                e = 67;
            else if (e === 110 && Math.random() > 0.99)
                e = 90;
            else if (e === 97 && 20 == s)
                e = 78;
        }
        w(F.indexOf(e));
    }
}
window.addEventListener("resize", P);
document.onkeypress = function(e) {
    B = 0;
    D(e.keyCode || e.which);
};

let U = new p(b, A);
let B = 0;
document.addEventListener("pointermove", () => {
    event.preventDefault();
    let rect = T.getBoundingClientRect();
    A.mouse.x = (event.clientX - rect.x) / A.canvasZoom * 2 / T.width;
    A.mouse.y = (event.clientY - rect.y) / A.canvasZoom / T.height;
    A.mouse.x = A.mouse.x - Math.floor(A.mouse.x);
    A.mouse.y = A.mouse.y - Math.floor(A.mouse.y);
});
document.ontouchstart = function() {
    S();
    d = true;
};
document.ontouchend = function() {
    d = false;
};
document.onmousestart = S;

function C() {
    B++;
    n++;
    if (B > 18000 && s != e - 1) {
        console.log("Slow mode (~5 minutes of inactivity)... returning to original edition.");
        A.convergenceRate = 1e-5;
        w(e - 1);
        B = 0;
    }
    if (A.update) U.draw();
    requestAnimationFrame(C);
}
requestAnimationFrame(C);
