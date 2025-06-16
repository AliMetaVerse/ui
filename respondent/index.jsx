import React from 'react';
import ReactDOM from 'react-dom/client';
import { Survey } from './survey-component';
import { surveyConfig } from './survey-config';
import './survey-styles.css';

// Create root for React app
const root = ReactDOM.createRoot(document.getElementById('survey-root') || document.createElement('div'));

// Render the Survey component
root.render(
  <React.StrictMode>
    <Survey />
  </React.StrictMode>
);

// For older browsers or non-module environments
// This allows the survey to be used in a traditional HTML page with a script tag
if (typeof window !== 'undefined') {
  window.renderSurvey = (elementId, config = surveyConfig) => {
    const container = document.getElementById(elementId);
    if (container) {
      const root = ReactDOM.createRoot(container);
      root.render(<Survey config={config} />);
    }
  };
  
  // Set up a global survey configuration object that can be modified
  window.surveyConfig = surveyConfig;
}
