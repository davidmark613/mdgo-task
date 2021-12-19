import React from 'react';
import ReactDOM from 'react-dom';
import CardProvider from './store/CardProvider';
import './index.css';
import App from './App';

ReactDOM.render(
  <CardProvider>
    <App />
  </CardProvider>,
  document.getElementById('root')
);

