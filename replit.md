# Pet Identity and Moments - Web3 NFT App

## Overview
This is a Next.js 16 application that allows users to mint pet NFTs and upload moments. It's a decentralized pet identity platform built with React, Next.js, and Web3 technologies.

**Project Type:** Frontend Web Application
**Framework:** Next.js 16 (React 19)
**Build System:** Next.js
**Language:** TypeScript
**Styling:** Tailwind CSS v4

## Key Features
- Wallet connection functionality
- Pet NFT minting
- Moment upload system
- Pet profiles
- Multi-language support (language switcher)
- Theme provider support

## Project Structure
- `/app` - Next.js app directory with pages and layouts
- `/components` - React components including UI components
  - `/ui` - Reusable UI components (button, card, input)
  - Wallet connect, minting forms, profile views
- `/lib` - Utility functions, Web3 utilities, translations, contract ABIs
- `/public` - Static assets (images, icons)
- `/styles` - Global CSS styles

## Development
- **Dev Server:** Runs on port 5000 (configured for Replit environment)
- **Host:** Bound to 0.0.0.0 to work with Replit's proxy
- **Command:** `npm run dev`

## Configuration Notes
- Next.js configured with `allowedOrigins: ['*']` for Replit proxy compatibility
- TypeScript build errors are ignored in config
- Images are unoptimized for faster development
- Uses localStorage for storing minted pets and moments data

## Dependencies
- Core: Next.js 16, React 19, TypeScript
- UI: Radix UI components, Tailwind CSS, Lucide React icons
- Forms: React Hook Form, Zod validation
- Utilities: date-fns, clsx, class-variance-authority
- Web3: Custom Web3 utilities and contract ABIs

## Important Notes
- This app uses localStorage for data persistence (no backend database)
- Web3 wallet integration for blockchain interactions
- Multi-language support implemented via translation system

## Recent Changes (Nov 26, 2025)
- Imported from GitHub/v0.app deployment
- Configured for Replit environment
- Set up dev server on port 5000 with proper host binding
- Added proper .gitignore for Next.js projects
- Configured allowedDevOrigins for Replit proxy compatibility
- Added product introduction on landing page (bilingual EN/ZH)
- Updated color scheme from violet to warm amber/orange tones
- Enhanced UI with feature cards and hero section
