/**
 * jetpackManager.js - Manages jetpack fuel and boost functionality
 * 
 * Features:
 * - Depletes fuel when SHIFT is held
 * - Regenerates fuel over time (with delay after use)
 * - Updates UI fuel meter
 * - Controls movement boost
 */

class JetpackManager {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    
    // Jetpack parameters
    this.maxFuel = 100;
    this.currentFuel = this.maxFuel;
    this.fuelBurnRate = 10; // Units per second
    this.fuelRegenRate = 15; // Units per second
    this.regenDelay = 5000; // 5 second delay before regeneration starts
    this.boostMultiplier = 2.5; // How much faster when boosting
    
    // State tracking
    this.isBoosting = false;
    this.lastBoostTime = 0;
    this.normalSpeed = 0;
    
    // UI elements
    this.fuelMeter = document.getElementById('fuel-meter-inner');
    
    // Input tracking
    this.keys = {};
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('Jetpack manager initialized');
  }
  
  setupEventListeners() {
    // Key down event
    document.addEventListener('keydown', (event) => {
      this.keys[event.key] = true;
      
      // Start boosting on Shift key
      if (event.key === 'Shift' && this.currentFuel > 0) {
        this.startBoosting();
      }
    });
    
    // Key up event
    document.addEventListener('keyup', (event) => {
      this.keys[event.key] = false;
      
      // Stop boosting when Shift is released
      if (event.key === 'Shift') {
        this.stopBoosting();
      }
    });
  }
  
  startBoosting() {
    if (this.isBoosting || this.currentFuel <= 0) return;
    
    this.isBoosting = true;
    this.lastBoostTime = Date.now();
    
    // Store the normal speed if not already stored
    if (this.normalSpeed === 0 && this.controls.movementSpeed) {
      this.normalSpeed = this.controls.movementSpeed;
    }
    
    // Apply speed boost
    if (this.controls.movementSpeed) {
      this.controls.movementSpeed = this.normalSpeed * this.boostMultiplier;
    }
    
    console.log('Jetpack boost activated');
    
    // Add visual effects for boost
    this.createBoostEffect();
  }
  
  stopBoosting() {
    if (!this.isBoosting) return;
    
    this.isBoosting = false;
    this.lastBoostTime = Date.now();
    
    // Restore normal speed
    if (this.normalSpeed > 0 && this.controls.movementSpeed) {
      this.controls.movementSpeed = this.normalSpeed;
    }
    
    console.log('Jetpack boost deactivated');
    
    // Remove boost visual effects
    this.removeBoostEffect();
  }
  
  createBoostEffect() {
    // A simple visual indicator could be added here
    // For example, changing the background color or adding particles
    this.fuelMeter.style.boxShadow = '0 0 20px rgba(0, 200, 255, 1)';
  }
  
  removeBoostEffect() {
    // Remove the visual indicator
    this.fuelMeter.style.boxShadow = '0 0 10px rgba(0, 150, 255, 0.8)';
  }
  
  update(deltaTime) {
    // Handle boost fuel consumption
    if (this.isBoosting && this.currentFuel > 0) {
      // Consume fuel
      this.currentFuel -= this.fuelBurnRate * deltaTime;
      
      // Check if out of fuel
      if (this.currentFuel <= 0) {
        this.currentFuel = 0;
        this.stopBoosting();
      }
    } 
    // Handle fuel regeneration
    else if (!this.isBoosting && this.currentFuel < this.maxFuel) {
      // Only regenerate after delay
      const timeSinceBoost = Date.now() - this.lastBoostTime;
      if (timeSinceBoost > this.regenDelay) {
        this.currentFuel += this.fuelRegenRate * deltaTime;
        
        // Cap at max fuel
        if (this.currentFuel > this.maxFuel) {
          this.currentFuel = this.maxFuel;
        }
      }
    }
    
    // Update the fuel meter UI
    this.updateFuelMeter();
    
    // Continue boosting if shift is still held and we have fuel
    if (this.keys['Shift'] && !this.isBoosting && this.currentFuel > 0) {
      this.startBoosting();
    }
  }
  
  updateFuelMeter() {
    if (!this.fuelMeter) return;
    
    // Calculate percentage
    const fuelPercentage = (this.currentFuel / this.maxFuel) * 100;
    
    // Update the fuel meter width
    this.fuelMeter.style.width = `${fuelPercentage}%`;
    
    // Change color based on fuel level
    if (fuelPercentage < 20) {
      this.fuelMeter.style.background = 'linear-gradient(90deg, rgb(255, 50, 50), rgb(255, 100, 50))';
    } else if (fuelPercentage < 50) {
      this.fuelMeter.style.background = 'linear-gradient(90deg, rgb(255, 150, 50), rgb(255, 200, 50))';
    } else {
      this.fuelMeter.style.background = 'linear-gradient(90deg, rgb(0, 100, 255), rgb(50, 200, 255))';
    }
  }
  
  // Public methods for external access
  getFuelPercentage() {
    return (this.currentFuel / this.maxFuel) * 100;
  }
  
  isBoosting() {
    return this.isBoosting;
  }
}

export default JetpackManager;