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
    console.log('Searching for central node among', allWalletNodes.length, 'wallet nodes');
    
    // Look for a node that has both tokens (white color)
    this.centralNode = allWalletNodes.find(node => {
      if (!node.userData || !node.userData.walletData) return false;
      
      // Debug logging to see what properties are available
      if (Math.random() < 0.1) { // Log only 10% of nodes to avoid console spam
        console.log('Node userData:', node.userData);
      }
      
      const walletData = node.userData.walletData;
      
      // Check both possible property naming conventions
      return (
        (walletData.fartcoinBalance > 0 && walletData.goatBalance > 0) || 
        (walletData.fartAmount > 0 && walletData.goatAmount > 0)
      );
    });
    
    if (this.centralNode) {
      console.log('Central node found:', this.centralNode);
    } else {
      console.warn('Could not find central node with both tokens');
    }
  }
  
  // Get or create UI elements needed for interaction
  createUIElements() {
    // Try to get existing elements first
    this.promptElement = document.getElementById('activation-prompt');
    this.countdownElement = document.getElementById('countdown-overlay');
    
    // Create elements only if they don't exist
    if (!this.promptElement) {
      console.log('Creating activation prompt element');
      this.promptElement = document.createElement('div');
      this.promptElement.id = 'activation-prompt';
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
    }
    
    // Create red flash element (always create this as it's not in the HTML)
    this.flashElement = document.createElement('div');
    this.flashElement.id = 'red-flash';
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
    
    if (!this.countdownElement) {
      console.log('Creating countdown element');
      this.countdownElement = document.createElement('div');
      this.countdownElement.id = 'countdown-overlay';
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
    
    console.log('UI Elements created/found:', { 
      promptElement: !!this.promptElement, 
      flashElement: !!this.flashElement, 
      countdownElement: !!this.countdownElement 
    });
  }
  
  // Check if the activation was already done in a previous session
  checkPreviousActivation() {
    try {
      // Wrap in try-catch to prevent localStorage errors from blocking rendering
      if (localStorage && localStorage.getItem('centralNodeActivated') === 'true') {
        this.hasTriggered = true;
        console.log('Central node was previously activated');
        
        // Get countdown end time or set a new one if not found
        const storedEndTime = localStorage.getItem('countdownEndTime');
        if (storedEndTime) {
          this.countdownEndTime = parseInt(storedEndTime);
          console.log('Loaded countdown end time:', new Date(this.countdownEndTime).toISOString());
        } else {
          // Set to July 12, 2025 at 17:00 UTC if not found
          const targetDate = new Date(Date.UTC(2025, 6, 12, 17, 0, 0)); // July is month 6 (0-indexed)
          this.countdownEndTime = targetDate.getTime();
          console.log('Set countdown end time to:', targetDate.toISOString());
          
          try {
            localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
          } catch (e) {
            console.error('Failed to save countdown end time to localStorage:', e);
          }
        }
        
        // Use requestAnimationFrame to delay showing the countdown
        // This ensures the DOM is ready and prevents blocking initial render
        requestAnimationFrame(() => {
          this.showCountdown();
        });
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
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
    console.log('Triggering central node activation!');
    
    // Set the trigger flag and save to localStorage
    this.hasTriggered = true;
    
    try {
      localStorage.setItem('centralNodeActivated', 'true');
    } catch (e) {
      console.error('Failed to save activation state to localStorage:', e);
    }
    
    // Hide the prompt
    if (this.promptElement) {
      this.promptElement.style.display = 'none';
    }
    
    // Show red flash
    if (this.flashElement) {
      this.flashElement.style.opacity = '0.7';
      setTimeout(() => {
        this.flashElement.style.opacity = '0';
      }, 250);
    }
    
    // Set countdown end time to July 12, 2025 at 17:00 UTC
    const targetDate = new Date(Date.UTC(2025, 6, 12, 17, 0, 0)); // July is month 6 (0-indexed)
    this.countdownEndTime = targetDate.getTime();
    console.log('Setting countdown to end at:', targetDate.toISOString());
    
    try {
      localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
    } catch (e) {
      console.error('Failed to save countdown end time to localStorage:', e);
    }
    
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
    // If already triggered, just update the countdown
    if (this.hasTriggered) {
      this.updateCountdown();
      return;
    }
    
    // If central node not found, don't do proximity checks
    if (!this.centralNode) {
      console.log('Central node not found, skipping proximity check');
      return;
    }
    
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
    
    // Log status occasionally for debugging
    if (Math.random() < 0.01) { // Log 1% of the time
      console.log('Proximity status:', { 
        distance, 
        isWithinRange: this.isWithinRange, 
        isFacing: this.isFacingNode,
        hasTriggered: this.hasTriggered
      });
    }
    
    // Update UI based on conditions
    if (this.isWithinRange && this.isFacingNode && !this.hasTriggered) {
      if (this.promptElement) {
        this.promptElement.style.display = 'block';
      }
    } else {
      if (this.promptElement) {
        this.promptElement.style.display = 'none';
      }
    }
    
    // Always update the countdown if it's active
    if (this.countdownEndTime) {
      this.updateCountdown();
    }
  }
}

export default CentralNodeInteraction;