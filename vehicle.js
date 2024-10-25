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

  setParameters(distance, radius, theta, maxSpeed, maxForce, perceptionRadius, cohesionForce, alignForce) {
    this.wanderDistance = distance;
    this.wanderRadius = radius;
    this.thetaVariation = theta;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.perceptionRadius = perceptionRadius;
    this.cohesionForce = cohesionForce;
    this.alignForce = alignForce;
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

  avoidCollisions(vehicles) {
    let steering = createVector();
    let total = 0;

    vehicles.forEach(other => {
      let distance = p5.Vector.dist(this.pos, other.pos);
      if (other != this && distance < this.perceptionRadius) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(distance);
        steering.add(diff);
        total++;
      }
    });

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
      this.applyForce(steering);
    }
  }

  cohesion(vehicles) {
    let steering = createVector();
    let total = 0;

    vehicles.forEach(other => {
      let distance = p5.Vector.dist(this.pos, other.pos);
      if (other != this && distance < this.perceptionRadius) {
        steering.add(other.pos);
        total++;
      }
    });

    if (total > 0) {
      steering.div(total);
      steering.sub(this.pos);
      steering.setMag(this.cohesionForce);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  align(vehicles) {
    let steering = createVector();
    let total = 0;

    vehicles.forEach(other => {
      let distance = p5.Vector.dist(this.pos, other.pos);
      if (other != this && distance < this.perceptionRadius) {
        steering.add(other.vel);
        total++;
      }
    });

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.alignForce);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  applyBehaviors(vehicles) {
    let cohesionForce = this.cohesion(vehicles);
    let alignForce = this.align(vehicles);

    this.applyForce(cohesionForce);
    this.applyForce(alignForce);
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
