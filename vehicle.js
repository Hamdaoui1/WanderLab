class Vehicle {
  constructor(x, y, size = 16, color = 255) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.size = size;
    this.color = color;
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.wanderTheta = PI / 2;
    this.path = [];
  }

  setParameters(distance, radius, theta, maxSpeed, maxForce) {
    this.wanderDistance = distance;
    this.wanderRadius = radius;
    this.thetaVariation = theta;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(this.wanderDistance);
    wanderPoint.add(this.pos);

    let theta = this.wanderTheta + this.vel.heading();
    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);
    wanderPoint.add(x, y);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    this.wanderTheta += random(-this.thetaVariation, this.thetaVariation);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.path.push(this.pos.copy());
    if (this.path.length > 50) this.path.shift();
  }

  show(debugMode) {
    if (debugMode) {
      noFill();
      stroke(255);
      let wanderPoint = this.vel.copy().setMag(this.wanderDistance).add(this.pos);
      circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);
    }

    noStroke();
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.size, -this.size / 2, -this.size, this.size / 2, this.size, 0);
    pop();

    noFill();
    stroke(255, 50);
    beginShape();
    for (let p of this.path) {
      vertex(p.x, p.y);
    }
    endShape();
  }

  edges() {
    if (this.pos.x > width + this.size) this.pos.x = -this.size;
    if (this.pos.x < -this.size) this.pos.x = width + this.size;
    if (this.pos.y > height + this.size) this.pos.y = -this.size;
    if (this.pos.y < -this.size) this.pos.y = height + this.size;
  }
}
