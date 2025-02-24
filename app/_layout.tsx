import React, { useState } from 'react';
import WelcomeScreen from './index';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register'; 
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'dashboard' | 'login' | 'register'>('welcome');

  const navigateToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen navigateToDashboard={navigateToDashboard} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard navigateToWelcome={navigateToWelcome} navigateToLogin={navigateToLogin} />
      )}
      {currentScreen === 'login' && (
        <Login navigateToDashboard={navigateToDashboard} navigateToRegister={navigateToRegister} />
      )}
      {currentScreen === 'register' && (
        <Register navigateToLogin={navigateToLogin} navigateToDashboard={navigateToDashboard} />
      )}
    </>
  );
};

export default App;