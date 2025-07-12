// Central Node Interaction
// Detects proximity to the large glowing white central node
// Shows a prompt when within 10 units and facing it
// Triggers red flash and countdown timer when 'F' is pressed

class CentralNodeInteraction {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.centralNode = null; // Will store reference to the central white node
    this.isWithinRange = false;
    this.isFacingNode = false;
    this.hasTriggered = false;
    this.countdownEndTime = null;
    
    // Create UI elements
    this.createUIElements();
    
    // Check if the activation was already done (from localStorage)
    this.checkPreviousActivation();
    
    // Add keydown event listener for F key
    window.addEventListener('keydown', this.handleKeyPress.bind(this));
  }
  
  // Find the central node (the large glowing white node that holds both tokens)
  findCentralNode(allWalletNodes) {
    // Look for a node that has both tokens (white color)
    this.centralNode = allWalletNodes.find(node => {
      return node.userData && 
             node.userData.walletData && 
             node.userData.walletData.fartcoinBalance > 0 && 
             node.userData.walletData.goatBalance > 0;
    });
    
    if (this.centralNode) {
      console.log('Central node found:', this.centralNode);
    } else {
      console.warn('Could not find central node with both tokens');
    }
  }
  
  // Create UI elements needed for interaction
  createUIElements() {
    // Create prompt element
    this.promptElement = document.createElement('div');
    this.promptElement.textContent = 'Press F to Activate';
    this.promptElement.style.position = 'absolute';
    this.promptElement.style.top = '20%';
    this.promptElement.style.left = '50%';
    this.promptElement.style.transform = 'translateX(-50%)';
    this.promptElement.style.color = 'white';
    this.promptElement.style.fontWeight = 'bold';
    this.promptElement.style.fontSize = '24px';
    this.promptElement.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
    this.promptElement.style.zIndex = '1000';
    this.promptElement.style.display = 'none';
    document.body.appendChild(this.promptElement);
    
    // Create red flash element
    this.flashElement = document.createElement('div');
    this.flashElement.style.position = 'absolute';
    this.flashElement.style.top = '0';
    this.flashElement.style.left = '0';
    this.flashElement.style.width = '100%';
    this.flashElement.style.height = '100%';
    this.flashElement.style.backgroundColor = 'red';
    this.flashElement.style.opacity = '0';
    this.flashElement.style.pointerEvents = 'none';
    this.flashElement.style.zIndex = '999';
    this.flashElement.style.transition = 'opacity 0.25s ease';
    document.body.appendChild(this.flashElement);
    
    // Create countdown element
    this.countdownElement = document.createElement('div');
    this.countdownElement.style.position = 'absolute';
    this.countdownElement.style.top = '15%';  // Positioned on the horizon
    this.countdownElement.style.left = '50%';
    this.countdownElement.style.transform = 'translateX(-50%)';
    this.countdownElement.style.color = 'red';
    this.countdownElement.style.fontFamily = '"Digital-7", monospace';
    this.countdownElement.style.fontSize = '36px';
    this.countdownElement.style.fontWeight = 'bold';
    this.countdownElement.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
    this.countdownElement.style.zIndex = '1000';
    this.countdownElement.style.display = 'none';
    document.body.appendChild(this.countdownElement);
  }
  
  // Check if the activation was already done in a previous session
  checkPreviousActivation() {
    if (localStorage.getItem('centralNodeActivated') === 'true') {
      this.hasTriggered = true;
      
      // Get countdown end time or set a new one if not found
      const storedEndTime = localStorage.getItem('countdownEndTime');
      if (storedEndTime) {
        this.countdownEndTime = parseInt(storedEndTime);
      } else {
        // Set to 72 hours from now if not found
        this.countdownEndTime = Date.now() + (72 * 60 * 60 * 1000);
        localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
      }
      
      // Show countdown immediately
      this.showCountdown();
    }
  }
  
  // Handle key press events
  handleKeyPress(event) {
    // Only proceed if 'F' key is pressed, player is within range and facing the node, and hasn't triggered yet
    if (event.key.toLowerCase() === 'f' && this.isWithinRange && this.isFacingNode && !this.hasTriggered) {
      this.triggerActivation();
    }
  }
  
  // Trigger the activation sequence
  triggerActivation() {
    // Set the trigger flag and save to localStorage
    this.hasTriggered = true;
    localStorage.setItem('centralNodeActivated', 'true');
    
    // Hide the prompt
    this.promptElement.style.display = 'none';
    
    // Show red flash
    this.flashElement.style.opacity = '0.7';
    setTimeout(() => {
      this.flashElement.style.opacity = '0';
    }, 250);
    
    // Set countdown end time (72 hours from now)
    this.countdownEndTime = Date.now() + (72 * 60 * 60 * 1000);
    localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
    
    // Show countdown
    this.showCountdown();
  }
  
  // Show the countdown timer
  showCountdown() {
    this.countdownElement.style.display = 'block';
    this.updateCountdown();
    
    // Update countdown every second
    if (!this.countdownInterval) {
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    }
  }
  
  // Update the countdown display
  updateCountdown() {
    const now = Date.now();
    const timeRemaining = Math.max(0, this.countdownEndTime - now);
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Format as DD:HH:MM:SS
    const formattedTime = 
      days.toString().padStart(2, '0') + ':' +
      hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
    
    this.countdownElement.textContent = formattedTime;
  }
  
  // Update function to be called every frame
  update() {
    if (!this.centralNode) return;
    
    // Calculate distance to central node
    const playerPosition = this.camera.position.clone();
    const nodePosition = this.centralNode.position.clone();
    const distance = playerPosition.distanceTo(nodePosition);
    
    // Check if within 10 units
    this.isWithinRange = distance <= 10;
    
    // Check if facing the node
    const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const toNodeDirection = nodePosition.sub(playerPosition).normalize();
    const dotProduct = cameraDirection.dot(toNodeDirection);
    // A dot product > 0.7 means the angle is less than ~45 degrees
    this.isFacingNode = dotProduct > 0.7;
    
    // Update UI based on conditions
    if (this.isWithinRange && this.isFacingNode && !this.hasTriggered) {
      this.promptElement.style.display = 'block';
    } else {
      this.promptElement.style.display = 'none';
    }
  }
}

export default CentralNodeInteraction;