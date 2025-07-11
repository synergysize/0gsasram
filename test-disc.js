// Test the spiral disc functionality
console.log('Testing spiral disc functionality...');

// Import THREE.js from node_modules
import * as THREE from 'three';

// Create a basic scene
const scene = new THREE.Scene();

// Import disc loader and spiral disc modules
import { getDiscData } from './src/discLoader.js';
import { createSpiralDisc, getDiscWalletNodes } from './src/spiralDisc.js';

// Create a point texture
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const context = canvas.getContext('2d');
const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
context.fillStyle = gradient;
context.fillRect(0, 0, 64, 64);
const pointTexture = new THREE.CanvasTexture(canvas);

// Get disc data
const discData = getDiscData();
console.log(`Loaded ${discData.length} wallet nodes for spiral disc`);

// Create spiral disc
const spiralDisc = createSpiralDisc(scene, pointTexture);
console.log(`Created spiral disc with ${spiralDisc.children.length} nodes`);

// Get disc wallet nodes for raycasting
const discWalletNodes = getDiscWalletNodes();
console.log(`Retrieved ${discWalletNodes.length} disc wallet nodes for raycasting`);

// Check scene children
console.log(`Scene has ${scene.children.length} children`);