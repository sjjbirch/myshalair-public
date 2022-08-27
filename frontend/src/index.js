import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StateProvider } from './Components/utils/componentIndex';
import App from './Components/App/App';

const root = createRoot(document.getElementById('root'));
root.render(

  <>
    {/* makes state available to the whole application */}
    <StateProvider>
      {/* allows for conditional rendering based on path */}
      <Router>
        <App />
      </Router>
    </StateProvider>
  </>);
