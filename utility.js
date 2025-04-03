const presetKeys = [
  "sensorDistanceBase",
  "sensorDistanceExponent",
  "sensorDistanceMultiplier",
  "sensorAngleBase",
  "sensorAngleExponent",
  "sensorAngleMultiplier",
  "turnAngleBase",
  "turnAngleExponent",
  "turnAngleMultiplier",
  "speedBase",
  "speedExponent",
  "speedpMultiplier",
  "verticalOffset",
  "horizontalOffset",
  "depositOpacity",
  "trailDecayFactor",
  "blurIterationCount",
  "renderOpacity",
  "clearOpacity",
  "particleDotSize"
];

// const presetSettings= {
//   sensorDistanceBase: {min: 0, max: 100, step: 0.01},
//   sensorDistanceExponent: {min: 0, max: 50, step: 0.01},
//   sensorDistanceMultiplier: {min: 0, max: 10, step: 0.01},
//   sensorAngleBase: {min: 0, max: 10, step: 0.01},
//   sensorAngleExponent: {min: 0, max: 50, step: 0.01},
//   sensorAngleMultiplier: {min: 0, max: 20, step: 0.01},


// }

let presets = {};
rawPresets.forEach(row => {
  // Pop the preset name from the end of the row.
  let name = row.pop();
  let presetObj = {};
  presetKeys.forEach((key, index) => {
    presetObj[key] = row[index];
  });
  presets[name] = presetObj;
});


function updatePresetArray(){
  
  let arr = [
    currentPreset.sensorDistanceBase,        // v[0]
    currentPreset.sensorDistanceExponent,    // v[1]
    currentPreset.sensorDistanceMultiplier,  // v[2]
    currentPreset.sensorAngleBase,           // v[3]
    currentPreset.sensorAngleExponent,       // v[4]
    currentPreset.sensorAngleMultiplier,     // v[5]
    currentPreset.turnAngleBase,             // v[6]
    currentPreset.turnAngleExponent,         // v[7]
    currentPreset.turnAngleMultiplier,       // v[8]
    currentPreset.speedBase,                 // v[9]
    currentPreset.speedExponent,             // v[10]
    currentPreset.speedpMultiplier,          // v[11]
    currentPreset.verticalOffset,            // v[12] /
    currentPreset.horizontalOffset,          // v[13] /
    currentPreset.depositOpacity,            // v[14] /
    currentPreset.trailDecayFactor,          // v[15] /
    currentPreset.blurIterationCount,        // v[16] /
    currentPreset.renderOpacity,             // v[17] /
    currentPreset.clearOpacity,              // v[18] /
    currentPreset.particleDotSize            // v[19] /
  ]

  console.log(arr[14], arr[17], arr[18]);
  return arr;
}

function createGUI(currentPreset) {
  const gui = new dat.GUI();

  // Compute attribute ranges (min, max, step) from all presets
  let attrRanges = {};
  presetKeys.forEach(key => {
    let values = Object.values(presets).map(p => p[key]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    // Use a simple fraction of the range as the step; if the range is zero, default to 0.01.
    // let step = (max - min) / 100;
    let step = 0.01;
    attrRanges[key] = { min, max, step };
  });

  // Object to hold the controllers for each attribute so we can update them later.
  let controllers = {};

  // Create a folder for preset selection
  let presetFolder = gui.addFolder("Preset Selection");
  // Set default selection to the first preset name.
  let presetSelector = { preset: Object.keys(presets)[0] };
  presetFolder.add(presetSelector, "preset", Object.keys(presets))
    .name("Preset")
    .onChange(function(selectedName) {
      let newPreset = presets[selectedName];
      // Update the global preset values and the corresponding GUI controllers.
      Object.keys(newPreset).forEach(key => {
        currentPreset[key] = newPreset[key];
        if (controllers[key]) {
          controllers[key].setValue(newPreset[key]);
        }
      });
      presetArray = updatePresetArray();
    });
  presetFolder.open();

  // Create a folder for all attribute controllers.
  let attrFolder = gui.addFolder("Attributes");
  presetKeys.forEach(key => {
    let range = attrRanges[key];
    controllers[key] = attrFolder.add(currentPreset, key, range.min, range.max)
      .step(range.step)
      .name(key)
      .onChange(() => {
        presetArray = updatePresetArray();
      })
      .listen();
  });
  attrFolder.open();

  return gui;
}
