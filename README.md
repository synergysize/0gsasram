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
- Central Node Interaction:
  - "Press F to Activate" prompt when near the central white node
  - Full-screen red flash when activated
  - Persistent countdown timer to July 12, 2025 at 17:00 UTC
  - Countdown state preserved across page refreshes

## Development

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technical Notes

- Built with Three.js for 3D rendering
- Static site with ES modules (no bundler required)
- Implements raycasting for hover interactions
- Features both HTML and 3D tooltips for accessibility
- Uses localStorage for persistent state management

## Deployment

This project is configured for deployment to Vercel as a static site. The main entry point is `public/index.html`.