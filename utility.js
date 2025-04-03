// util.js
// Assumes that `rawPresets`, `presetKeys`, and the conversion code to create `presets` 
// are loaded before this file is included.

function createGUI(currentPreset) {
  const gui = new dat.GUI();

  // Compute attribute ranges (min, max, step) from all presets
  let attrRanges = {};
  presetKeys.forEach(key => {
    let values = Object.values(presets).map(p => p[key]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    // Use a simple fraction of the range as the step; if the range is zero, default to 0.01.
    let step = (max - min) / 100;
    if (step === 0) step = 0.01;
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
    });
  presetFolder.open();

  // Create a folder for all attribute controllers.
  let attrFolder = gui.addFolder("Attributes");
  presetKeys.forEach(key => {
    let range = attrRanges[key];
    controllers[key] = attrFolder.add(currentPreset, key, range.min, range.max)
      .step(range.step)
      .name(key)
      .listen();
  });
  attrFolder.open();

  return gui;
}
