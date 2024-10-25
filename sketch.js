let vehicles = [];
let debugMode = false;

function setup() {
  createCanvas(800, 600);
  createVehicles();

  document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
      debugMode = !debugMode;
    }
  });
}

function draw() {
  background(0);
  updateVehicleParams();

  vehicles.forEach(vehicle => {
    vehicle.wander();
    vehicle.avoidCollisions(vehicles);
    vehicle.applyBehaviors(vehicles);
    vehicle.update();
    vehicle.show(debugMode);
    vehicle.edges();
  });
  
  displayStats();
}

function createVehicles() {
  vehicles = [];
  const count = parseInt(document.getElementById('vehicleCountSlider').value);
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    let vehicle = new Vehicle(x, y, random(10, 20), color(random(255), random(255), random(255)));
    vehicles.push(vehicle);
  }
}

function updateVehicleParams() {
  const distance = parseFloat(document.getElementById('distanceSlider').value);
  const radius = parseFloat(document.getElementById('radiusSlider').value);
  const theta = parseFloat(document.getElementById('thetaSlider').value);
  const maxSpeed = parseFloat(document.getElementById('maxSpeedSlider').value);
  const maxForce = parseFloat(document.getElementById('maxForceSlider').value);
  const perceptionRadius = parseFloat(document.getElementById('perceptionSlider').value);
  const cohesionForce = parseFloat(document.getElementById('cohesionSlider').value);
  const alignForce = parseFloat(document.getElementById('alignSlider').value);

  vehicles.forEach(vehicle => {
    vehicle.setParameters(distance, radius, theta, maxSpeed, maxForce, perceptionRadius, cohesionForce, alignForce);
  });
}

function mousePressed() {
  let vehicle = new Vehicle(mouseX, mouseY, random(10, 20), color(random(255), random(255), random(255)));
  vehicles.push(vehicle);
}

function displayStats() {
  fill(255);
  textSize(12);
  text(`Nombre de véhicules : ${vehicles.length}`, 10, height - 20);
}
