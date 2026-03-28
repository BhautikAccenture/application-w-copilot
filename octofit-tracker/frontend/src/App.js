import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  console.log('App component initialized');
  console.log('Environment variables:', {
    REACT_APP_CODESPACE_NAME: process.env.REACT_APP_CODESPACE_NAME
  });

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 navbar-custom">
          <Container>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <div className="navbar-logo-container">
                <span className="navbar-logo-emoji">🐙</span>
              </div>
              <span>OctoFit Tracker</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/users">👥 Users</Nav.Link>
                <Nav.Link as={Link} to="/teams">👫 Teams</Nav.Link>
                <Nav.Link as={Link} to="/activities">🏃 Activities</Nav.Link>
                <Nav.Link as={Link} to="/leaderboard">🏆 Leaderboard</Nav.Link>
                <Nav.Link as={Link} to="/workouts">💪 Workouts</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <Container className="mt-5">
      <div className="home-section">
        <h1>Welcome to OctoFit Tracker</h1>
        <p className="lead">Track your fitness activities and compete with your team!</p>
        <p className="text-muted">
          Use the navigation menu above to view Users, Teams, Activities, Leaderboard, and Workouts.
        </p>
      </div>
    </Container>
  );
}

export default App;

