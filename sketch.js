let vehicles = [];
let debugMode = false;

function setup() {
  createCanvas(800, 600);
  createVehicles();

  // Event listener for toggling debug mode
  document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
      debugMode = !debugMode;
    }
  });
}

function draw() {
  background(0);

  // Update vehicle parameters from sliders
  const distance = parseFloat(document.getElementById('distanceSlider').value);
  const radius = parseFloat(document.getElementById('radiusSlider').value);
  const theta = parseFloat(document.getElementById('thetaSlider').value);
  const maxSpeed = parseFloat(document.getElementById('maxSpeedSlider').value);
  const maxForce = parseFloat(document.getElementById('maxForceSlider').value);

  vehicles.forEach(vehicle => {
    vehicle.setParameters(distance, radius, theta, maxSpeed, maxForce);
    vehicle.wander();
    vehicle.update();
    vehicle.show(debugMode);
    vehicle.edges();
  });
}

// Function to create vehicles with random starting positions, sizes, and colors
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
