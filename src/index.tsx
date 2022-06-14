import React from 'react';
import ReactDOM from 'react-dom/client';
import Note from './page/Note';
import { Provider } from 'react-redux';
import { store } from './store/store'; 
import './reset.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Note />
    </Provider>
  </React.StrictMode>
);
