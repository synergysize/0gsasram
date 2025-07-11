# 3D Blockchain Wallet Visualizer

This project visualizes blockchain wallet relationships between Fartcoin (💨) and Goat (🐐) token holders in an interactive 3D space.

## Features

- Beautiful 3D visualization of wallet relationships
- Interactive hover effects showing wallet details
- Twinkling starfield with constellation effects
- Wallet color coding:
  - **White**: Wallets holding both Fartcoin and Goat tokens (dual holders)
  - **Green**: Wallets holding only Fartcoin
  - **Blue**: Wallets holding only Goat tokens
- Visual effects:
  - Glowing dual-holder wallets
  - Size scaling based on token amounts
  - Dynamic tooltips with wallet data
- Flat spiral disc visualization:
  - 2000 wallet nodes (1000 from each token)
  - Golden angle-based spiral layout
  - Color-coded by token type (Blue/Green/White)
  - Hover tooltips for all nodes
  - Subtle rotation and floating animations

## Development

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technical Notes

- Built with Three.js for 3D rendering
- Uses Parcel for bundling
- Implements raycasting for hover interactions
- Features both HTML and 3D tooltips for accessibility