import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TextAnnotation from './components/TextAnnotation';
import TextModeration from './components/TextModeration';
import UserHistory from './components/UserHistory';
import Register from './components/Register';
import PasswordChange from './components/PasswordChange';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/text/annotation" element={<TextAnnotation />} />
                <Route path="/text/moderation" element={<TextModeration />} />
                <Route path="/users/history" element={<UserHistory />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password/change" element={<PasswordChange />} />
            </Routes>
        </Router>
    );
}

export default App;
