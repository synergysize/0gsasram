// Fixed Central Node Interaction
import * as THREE from 'three';

class CentralNodeInteraction {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.centralNode = null;
    this.isWithinRange = false;
    this.isFacingNode = false;
    this.hasTriggered = false;
    this.countdownEndTime = null;
    
    this.createUIElements();
    this.checkPreviousActivation();
    
    window.addEventListener('keydown', this.handleKeyPress.bind(this));
  }
  
  findCentralNode(allWalletNodes) {
    console.log('Searching for central node among', allWalletNodes.length, 'wallet nodes');
    
    // Look for ANY white wallet (shared wallet with both tokens)
    this.centralNode = allWalletNodes.find(node => {
      if (!node.userData || !node.userData.walletData) return false;
      
      const walletData = node.userData.walletData;
      
      // Check if wallet has both tokens (any amount > 0)
      const hasFart = (walletData.fartcoinBalance > 0) || (walletData.fartAmount > 0);
      const hasGoat = (walletData.goatBalance > 0) || (walletData.goatAmount > 0);
      
      return hasFart && hasGoat;
    });
    
    // If no dual-holder found, just use the first shared wallet node
    if (!this.centralNode) {
      const sharedGroup = this.scene.getObjectByName('sharedWallets');
      if (sharedGroup && sharedGroup.children.length > 0) {
        this.centralNode = sharedGroup.children[0];
        console.log('Using first shared wallet as central node');
      }
    }
    
    if (this.centralNode) {
      console.log('Central node found:', this.centralNode);
      console.log('Central node position:', this.centralNode.position);
    } else {
      console.warn('Could not find central node');
    }
  }
  
  createUIElements() {
    // Create activation prompt
    this.promptElement = document.getElementById('activation-prompt');
    if (!this.promptElement) {
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
    
    // Create countdown element
    this.countdownElement = document.getElementById('countdown-overlay');
    if (!this.countdownElement) {
      this.countdownElement = document.createElement('div');
      this.countdownElement.id = 'countdown-overlay';
      this.countdownElement.style.position = 'absolute';
      this.countdownElement.style.top = '15%';
      this.countdownElement.style.left = '50%';
      this.countdownElement.style.transform = 'translateX(-50%)';
      this.countdownElement.style.color = 'red';
      this.countdownElement.style.fontFamily = 'monospace';
      this.countdownElement.style.fontSize = '36px';
      this.countdownElement.style.fontWeight = 'bold';
      this.countdownElement.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
      this.countdownElement.style.zIndex = '1000';
      this.countdownElement.style.display = 'none';
      document.body.appendChild(this.countdownElement);
    }
    
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
  }
  
  checkPreviousActivation() {
    try {
      if (localStorage.getItem('centralNodeActivated') === 'true') {
        this.hasTriggered = true;
        console.log('Central node was previously activated');
        
        const storedEndTime = localStorage.getItem('countdownEndTime');
        if (storedEndTime) {
          this.countdownEndTime = parseInt(storedEndTime);
        } else {
          // Set to a future date for testing - 24 hours from now
          this.countdownEndTime = Date.now() + (24 * 60 * 60 * 1000);
          localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
        }
        
        setTimeout(() => this.showCountdown(), 100);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }
  
  handleKeyPress(event) {
    if (event.key.toLowerCase() === 'f' && this.isWithinRange && this.isFacingNode && !this.hasTriggered) {
      this.triggerActivation();
    }
  }
  
  triggerActivation() {
    console.log('COUNTDOWN ACTIVATED!');
    
    this.hasTriggered = true;
    
    try {
      localStorage.setItem('centralNodeActivated', 'true');
    } catch (e) {
      console.error('Failed to save activation state:', e);
    }
    
    // Hide prompt
    this.promptElement.style.display = 'none';
    
    // Red flash
    this.flashElement.style.opacity = '0.7';
    setTimeout(() => {
      this.flashElement.style.opacity = '0';
    }, 250);
    
    // Set countdown to 24 hours from now for testing
    this.countdownEndTime = Date.now() + (24 * 60 * 60 * 1000);
    
    try {
      localStorage.setItem('countdownEndTime', this.countdownEndTime.toString());
    } catch (e) {
      console.error('Failed to save countdown end time:', e);
    }
    
    this.showCountdown();
  }
  
  showCountdown() {
    console.log('Showing countdown timer');
    this.countdownElement.style.display = 'block';
    this.updateCountdown();
    
    if (!this.countdownInterval) {
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    }
  }
  
  updateCountdown() {
    if (!this.countdownEndTime) return;
    
    const now = Date.now();
    const timeRemaining = Math.max(0, this.countdownEndTime - now);
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    const formattedTime = 
      days.toString().padStart(2, '0') + ':' +
      hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
    
    this.countdownElement.textContent = formattedTime;
    
    // Debug log
    console.log('Countdown updated:', formattedTime, 'Time remaining:', timeRemaining);
  }
  
  update() {
    if (this.hasTriggered) {
      this.updateCountdown();
      return;
    }
    
    if (!this.centralNode) {
      return;
    }
    
    // Calculate distance to central node
    const playerPosition = this.camera.position.clone();
    const nodePosition = this.centralNode.position.clone();
    const distance = playerPosition.distanceTo(nodePosition);
    
    // Check if within range (increased to 50 units for easier testing)
    this.isWithinRange = distance <= 50;
    
    // Check if facing the node (more lenient)
    const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const toNodeDirection = nodePosition.sub(playerPosition).normalize();
    const dotProduct = cameraDirection.dot(toNodeDirection);
    this.isFacingNode = dotProduct > 0.5; // More lenient than 0.7
    
    // Show/hide prompt
    if (this.isWithinRange && this.isFacingNode && !this.hasTriggered) {
      this.promptElement.style.display = 'block';
      console.log('Showing activation prompt - distance:', distance.toFixed(1));
    } else {
      this.promptElement.style.display = 'none';
    }
    
    // Debug log occasionally
    if (Math.random() < 0.01) {
      console.log('Central node update:', {
        distance: distance.toFixed(1),
        isWithinRange: this.isWithinRange,
        isFacing: this.isFacingNode,
        hasTriggered: this.hasTriggered
      });
    }
  }
}

export default CentralNodeInteraction;