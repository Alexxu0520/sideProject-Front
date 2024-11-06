import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TextModeration from './components/TextModeration';
import Register from './components/Register';
import PasswordChange from './components/PasswordChange';
import Login from "./components/Login";
import Friends from './components/Friends';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/text/moderation" element={<TextModeration />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/password/change" element={<PasswordChange />} />
                <Route path="/friends" element={<Friends />} />
            </Routes>
        </Router>
    );
}

export default App;
