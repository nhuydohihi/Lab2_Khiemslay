/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import Dashboard from './dashboard';

// src/main.tsx
// Part 5.1: Main Entry Point

// TODO: Create main app file that:
// - Imports your components
// - Mounts the app to DOM

const rootElement = document.getElementById('root');

if (rootElement) {
  mount(<Dashboard />, rootElement);
} else {
  console.error('Root element #root not found in index.html');
}