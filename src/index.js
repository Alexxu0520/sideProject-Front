import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Optional if you're using Bootstrap

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')  // Make sure this matches the div in index.html
);
