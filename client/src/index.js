import React from 'react'; // Required to write JSX
import ReactDOM from 'react-dom/client'; // For rendering React in the DOM
import App from './App'; // Import the App component

// Get the root element in public/index.html and attach React app to it
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(<App />);
