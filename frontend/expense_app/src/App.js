import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import bg from '../src/Img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from '../src/Components/Navigation/Navigation';
import Dashboard from '../src/Components/Dashboard/Dashboard';
import Chatbot from '../src/Components/Chatbot/Chatbot';
import Income from '../src/Components/Income/Income';
import Expenses from '../src/Components/Expenses/Expenses';
import Login from '../src/Components/Login/login';
import Signup from '../src/Components/Signup/Signup';

function App() {
  const [active, setActive] = useState(1);
  const [isMenuDisabled, setIsMenuDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigatedToLastPath = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsMenuDisabled(false); // User is authenticated
    } else {
      setIsMenuDisabled(true); // User is not authenticated
    }
  }, []);

  useEffect(() => {
    if (!isMenuDisabled && !hasNavigatedToLastPath.current) {
      const lastPath = localStorage.getItem('lastPath');
      if (lastPath) {
        navigate(lastPath, { replace: true });
      }
      hasNavigatedToLastPath.current = true;
    }
  }, [isMenuDisabled, navigate]);

  useEffect(() => {
    if (!isMenuDisabled) {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location, isMenuDisabled]);

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('lastPath');
    setIsMenuDisabled(true);
    navigate('/login');
  };

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation 
          active={active} 
          setActive={setActive} 
          isMenuDisabled={isMenuDisabled} 
          onSignOut={handleSignOut} 
        />
        <main>
          <Routes>
            <Route path="/" element={isMenuDisabled ? <Navigate to="/login" /> : <Dashboard />} />
            <Route path="/income" element={isMenuDisabled ? <Navigate to="/login" /> : <Income />} />
            <Route path="/expenses" element={isMenuDisabled ? <Navigate to="/login" /> : <Expenses />} />
            <Route path="/chatbot" element={isMenuDisabled ? <Navigate to="/login" /> : <Chatbot />} />
            <Route path="/login" element={<Login setIsMenuDisabled={setIsMenuDisabled} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to={isMenuDisabled ? "/login" : "/"} />} />
          </Routes>
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
