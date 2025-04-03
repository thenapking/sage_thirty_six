class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Initialize with a random direction (in radians)
    this.angle = random(TWO_PI);
  }

  update() {
    // Calculate sensor distance and sensor angle using preset values.
    // (For now we simply use the base values multiplied by their multipliers.)
    let sensorDistance = currentPreset.sensorDistanceBase * currentPreset.sensorDistanceMultiplier;
    let sensorAngle = radians(currentPreset.sensorAngleBase) * currentPreset.sensorAngleMultiplier;

    // Sample sensor values in three directions: left, forward, and right.
    let sensorLeft = this.sense(this.angle - sensorAngle, sensorDistance);
    let sensorForward = this.sense(this.angle, sensorDistance);
    let sensorRight = this.sense(this.angle + sensorAngle, sensorDistance);

    // Steer based on sensor readings.
    if (sensorForward > sensorLeft && sensorForward > sensorRight) {
      // Continue straight.
    } else if (sensorLeft > sensorRight) {
      // Turn left.
      this.angle -= radians(currentPreset.turnAngleBase) * currentPreset.turnAngleMultiplier;
    } else if (sensorRight > sensorLeft) {
      // Turn right.
      this.angle += radians(currentPreset.turnAngleBase) * currentPreset.turnAngleMultiplier;
    } else {
      // If sensor readings are similar, turn a bit randomly.
      this.angle += random(-radians(currentPreset.turnAngleBase), radians(currentPreset.turnAngleBase));
    }

    // Calculate speed from the preset (ignoring the exponent for now).
    let speed = currentPreset.speedBase * currentPreset.speedpMultiplier;
    
    // Update position based on direction and speed.
    let velocity = p5.Vector.fromAngle(this.angle).mult(speed);
    this.pos.add(velocity);
    
    // Wrap around the edges.
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;

    // Deposit a trail on the trail layer.
    deposit(this.pos.x + currentPreset.horizontalOffset, this.pos.y + currentPreset.verticalOffset);
  }

  // Sense function samples the trailLayer at a point in a given direction.
  sense(angle, distance) {
    let sensorX = this.pos.x + cos(angle) * distance;
    let sensorY = this.pos.y + sin(angle) * distance;
    
    sensorX = constrain(sensorX, 0, width - 1);
    sensorY = constrain(sensorY, 0, height - 1);
    
    // Get the pixel at the sensor location from the trailLayer.
    let c = trailLayer.get(sensorX, sensorY);
    // Return a simple brightness value (here, using the red channel).
    return red(c);
  }

  display() {
    // Optionally, draw the agent as a triangle pointing in its direction.
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(255);
    noStroke();
    triangle(
      -currentPreset.particleDotSize, -currentPreset.particleDotSize / 2,
      -currentPreset.particleDotSize, currentPreset.particleDotSize / 2,
      currentPreset.particleDotSize, 0
    );
    pop();
  }
}
