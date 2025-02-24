import React, { useState } from 'react';
import WelcomeScreen from './index';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import Home from './home'; // Import the Home component


const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'dashboard' | 'login' | 'register' | 'home'>('welcome');

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

  const navigateToHome = () => {
    setCurrentScreen('home');
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
        <Login
          navigateToDashboard={navigateToDashboard}
          navigateToRegister={navigateToRegister}
          navigateToHome={navigateToHome} // Pass navigateToHome
        />
      )}
      {currentScreen === 'register' && (
        <Register navigateToLogin={navigateToLogin} navigateToDashboard={navigateToDashboard} />
      )}
      {currentScreen === 'home' && (
        <Home />
      )}
    </>
  );
};

export default App;