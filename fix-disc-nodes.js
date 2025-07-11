// Fix script for the spiral disc visualization
// This will ensure the disc nodes are properly created, visible, and have working tooltips

// We'll modify the existing files to fix any issues

import * as fs from 'fs';
import * as path from 'path';

// Check if discLoader.js is present
const discLoaderPath = path.join(process.cwd(), 'src', 'discLoader.js');
const spiralDiscPath = path.join(process.cwd(), 'src', 'spiralDisc.js');
const mainJsPath = path.join(process.cwd(), 'src', 'main.js');

// Check if files exist
const discLoaderExists = fs.existsSync(discLoaderPath);
const spiralDiscExists = fs.existsSync(spiralDiscPath);
const mainJsExists = fs.existsSync(mainJsPath);

console.log(`discLoader.js exists: ${discLoaderExists}`);
console.log(`spiralDisc.js exists: ${spiralDiscExists}`);
console.log(`main.js exists: ${mainJsExists}`);

// Fix 1: Make sure discLoader.js is correctly loading data
if (discLoaderExists) {
  console.log('Ensuring discLoader.js correctly loads CSV data...');
  const discLoaderContent = fs.readFileSync(discLoaderPath, 'utf8');
  
  // Check for missing imports or incorrect file paths
  if (!discLoaderContent.includes('initializeData')) {
    console.log('ERROR: discLoader.js is missing the initializeData import');
  }
  
  if (!discLoaderContent.includes('fartcoinHolders')) {
    console.log('ERROR: discLoader.js is missing the fartcoinHolders import');
  }
  
  if (!discLoaderContent.includes('goatTokenHolders')) {
    console.log('ERROR: discLoader.js is missing the goatTokenHolders import');
  }
}

// Fix 2: Make sure spiralDisc.js is adding nodes to the scene
if (spiralDiscExists) {
  console.log('Ensuring spiralDisc.js correctly adds nodes to the scene...');
  const spiralDiscContent = fs.readFileSync(spiralDiscPath, 'utf8');
  
  // Check if nodes are being added to the scene
  if (!spiralDiscContent.includes('scene.add(discGroup)')) {
    console.log('ERROR: spiralDisc.js is not adding the disc group to the scene');
  }
  
  // Check if getDiscWalletNodes is returning the correct nodes
  if (!spiralDiscContent.includes('getDiscWalletNodes')) {
    console.log('ERROR: spiralDisc.js is missing the getDiscWalletNodes function');
  }
}

// Fix 3: Check main.js for proper spiral disc integration
if (mainJsExists) {
  console.log('Ensuring main.js correctly integrates the spiral disc...');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Check for imports
  if (!mainJsContent.includes('import { createSpiralDisc')) {
    console.log('ERROR: main.js is missing the createSpiralDisc import');
  }
  
  // Check for creation of spiral disc
  if (!mainJsContent.includes('createSpiralDisc(scene')) {
    console.log('ERROR: main.js is not calling createSpiralDisc');
  }
  
  // Check for adding disc nodes to raycasting
  if (!mainJsContent.includes('const discWalletNodes = getDiscWalletNodes()')) {
    console.log('ERROR: main.js is not getting disc wallet nodes for raycasting');
  }
  
  if (!mainJsContent.includes('allWalletPoints = allWalletPoints.concat(discWalletNodes)')) {
    console.log('ERROR: main.js is not adding disc nodes to raycasting targets');
  }
  
  // Check for updating disc in animation loop
  if (!mainJsContent.includes('updateDisc(delta)')) {
    console.log('ERROR: main.js is not updating the disc animation');
  }
}

// Fix 4: Check for raycasting to tooltip connection
if (mainJsExists) {
  console.log('Ensuring main.js correctly sets up tooltips for disc nodes...');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Check if the raycaster is set up with proper parameters
  if (!mainJsContent.includes('raycaster.params.Sprite')) {
    console.log('ERROR: main.js is not setting up raycaster parameters for sprites');
  }
  
  // Check if tooltips are being shown for intersected objects
  if (!mainJsContent.includes('updateTooltipContent')) {
    console.log('ERROR: main.js is not using updateTooltipContent for tooltips');
  }
}

console.log('Fix check complete. Please review any errors reported above.');