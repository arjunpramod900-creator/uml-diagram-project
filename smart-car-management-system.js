class Engine {
    #isRunning = false;

    start() {
        if (this.#isRunning) {
            console.log("Engine is already running");
            return;
        }

        this.#isRunning = true;
        console.log("Engine started");
    }

    stop() {
        this.#isRunning = false;
        console.log("Engine stopped");
    }

    get isRunning() {
        return this.#isRunning;
    }
}

class BrakeSystem {
    applyBrake(currentSpeed) {
        const newSpeed = Math.max(0, currentSpeed - 20);

        console.log("Brakes applied");

        return newSpeed;
    }
}

class Steering {
    turnLeft() {
        console.log("Car turned left");
    }

    turnRight() {
        console.log("Car turned right");
    }
}

class FuelSystem {
    #fuelLevel;
    #totalFuelConsumed = 0;
    #totalDistance = 0;

    constructor(fuelLevel) {
        this.#fuelLevel = fuelLevel;
    }

    get fuelLevel() {
        return this.#fuelLevel;
    }

    hasFuel() {
        return this.#fuelLevel > 0;
    }

    consumeFuel(amount) {
        if (amount <= 0 || amount > this.#fuelLevel) {
            return false;
        }

        this.#fuelLevel -= amount;
        this.#totalFuelConsumed += amount;

        return true;
    }

    addFuel(amount) {
        if (amount <= 0) {
            console.log("Invalid fuel amount");
            return;
        }

        this.#fuelLevel += amount;
    }

    recordDistance(distance) {
        if (distance > 0) {
            this.#totalDistance += distance;
        }
    }

    calculateEfficiency() {
        if (this.#totalFuelConsumed === 0) {
            return 0;
        }

        return this.#totalDistance / this.#totalFuelConsumed;
    }
}

class Transmission {
    constructor() {
        this.currentGear = 0;
    }

    shiftGear() {
        throw new Error("shiftGear() must be implemented by child classes");
    }
}

class AutomaticTransmission extends Transmission {
    shiftGear(speed) {
        let newGear;

        if (speed === 0) {
            newGear = 0;
        } else if (speed < 20) {
            newGear = 1;
        } else if (speed < 40) {
            newGear = 2;
        } else if (speed < 60) {
            newGear = 3;
        } else if (speed < 80) {
            newGear = 4;
        } else {
            newGear = 5;
        }

        if (newGear !== this.currentGear) {
            this.currentGear = newGear;
            console.log(`Automatic gear changed to ${newGear}`);
        }
    }
}

class ManualTransmission extends Transmission {
    shiftGear(newGear) {
        if (!Number.isInteger(newGear) || newGear < 0 || newGear > 5) {
            console.log("Invalid gear");
            return;
        }

        this.currentGear = newGear;
        console.log(`Manual gear changed to ${newGear}`);
    }
}

class Vehicle {
    #brand;
    #model;
    #speed = 0;

    constructor(brand, model) {
        this.#brand = brand;
        this.#model = model;
    }

    get brand() {
        return this.#brand;
    }

    get model() {
        return this.#model;
    }

    get speed() {
        return this.#speed;
    }

    setSpeed(speed) {
        this.#speed = Math.max(0, speed);
    }

    start() {
        throw new Error("start() must be implemented");
    }

    stop() {
        throw new Error("stop() must be implemented");
    }
}

class Car extends Vehicle {
    #engine;
    #brakes;
    #steering;
    #fuelSystem;
    #transmission;
    #cruiseControl = false;
    #cruiseSpeed = 0;

    constructor(brand, model, fuel, transmission) {
        super(brand, model);

        this.#engine = new Engine();
        this.#brakes = new BrakeSystem();
        this.#steering = new Steering();
        this.#fuelSystem = new FuelSystem(fuel);
        this.#transmission = transmission;
    }

    start() {
        if (!this.#fuelSystem.hasFuel()) {
            console.log("Cannot start: No fuel");
            return;
        }

        this.#engine.start();
    }

    stop() {
        this.#cruiseControl = false;
        this.setSpeed(0);
        this.#transmission.shiftGear(0);
        this.#engine.stop();
    }

    accelerate() {
        if (!this.#engine.isRunning) {
            console.log("Start the engine first");
            return;
        }

        if (!this.#fuelSystem.consumeFuel(0.05)) {
            console.log("Insufficient fuel");
            return;
        }

        this.setSpeed(this.speed + 10);
        this.#transmission.shiftGear(this.speed);

        console.log(`Current speed: ${this.speed} km/h`);
    }

    applyBrake() {
        const newSpeed = this.#brakes.applyBrake(this.speed);

        this.setSpeed(newSpeed);
        this.#transmission.shiftGear(this.speed);

        if (this.#cruiseControl && this.speed !== this.#cruiseSpeed) {
            this.#cruiseControl = false;
            console.log("Cruise control cancelled");
        }

        console.log(`Current speed: ${this.speed} km/h`);
    }

    turnLeft() {
        this.#steering.turnLeft();
    }

    turnRight() {
        this.#steering.turnRight();
    }

    drive(distance) {
        if (!this.#engine.isRunning || this.speed === 0) {
            console.log("Car must be running and moving");
            return;
        }

        if (distance <= 0) {
            console.log("Invalid distance");
            return;
        }

        const fuelNeeded = distance * 0.08;

        if (!this.#fuelSystem.consumeFuel(fuelNeeded)) {
            console.log("Insufficient fuel for this journey");
            return;
        }

        this.#fuelSystem.recordDistance(distance);

        console.log(`Travelled ${distance} km`);
    }

    enableCruiseControl() {
        if (!this.#engine.isRunning || this.speed < 30) {
            console.log("Cruise control requires a running car at 30 km/h or above");
            return;
        }

        this.#cruiseControl = true;
        this.#cruiseSpeed = this.speed;

        console.log(`Cruise control enabled at ${this.#cruiseSpeed} km/h`);
    }

    disableCruiseControl() {
        this.#cruiseControl = false;
        console.log("Cruise control disabled");
    }

    addFuel(amount) {
        this.#fuelSystem.addFuel(amount);
    }

    getFuelLevel() {
        return this.#fuelSystem.fuelLevel;
    }

    getFuelEfficiency() {
        return this.#fuelSystem.calculateEfficiency();
    }

    displayDetails() {
        console.log("\n----- CAR DETAILS -----");
        console.log(`Brand: ${this.brand}`);
        console.log(`Model: ${this.model}`);
        console.log(`Speed: ${this.speed} km/h`);
        console.log(`Fuel: ${this.getFuelLevel().toFixed(2)} L`);
        console.log(`Fuel efficiency: ${this.getFuelEfficiency().toFixed(2)} km/L`);
        console.log("-----------------------\n");
    }
}

class CarManagementSystem {
    constructor() {
        this.cars = [];
    }

    addCar(car) {
        if (!(car instanceof Car)) {
            console.log("Invalid car object");
            return;
        }

        this.cars.push(car);
        console.log("Car added successfully");
    }

    removeCar(model) {
        const index = this.cars.findIndex(car => car.model === model);

        if (index === -1) {
            console.log("Car not found");
            return;
        }

        this.cars.splice(index, 1);
        console.log("Car removed successfully");
    }

    listCars() {
        if (this.cars.length === 0) {
            console.log("No cars available");
            return;
        }

        this.cars.forEach((car, index) => {
            console.log(`${index + 1}. ${car.brand} ${car.model}`);
        });
    }
}

// Project execution

const automatic = new AutomaticTransmission();
const manual = new ManualTransmission();

const car1 = new Car("BMW", "320d", 50, automatic);
const car2 = new Car("Honda", "Civic", 40, manual);

const management = new CarManagementSystem();

management.addCar(car1);
management.addCar(car2);

management.listCars();

console.log("\n--- CAR OPERATIONS ---");

car1.start();

car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.accelerate();

car1.drive(20);
car1.enableCruiseControl();
car1.turnLeft();
car1.displayDetails();
car1.applyBrake();
car1.disableCruiseControl();
car1.stop();

console.log("\n--- MANUAL TRANSMISSION ---");

car2.start();
car2.accelerate();
manual.shiftGear(2);
car2.displayDetails();