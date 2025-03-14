import React, { useState } from 'react';
import WelcomeScreen from './index';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import Home from './home';
import ProfileCustomization from './ProfileCustomization';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<
    'welcome' | 'dashboard' | 'login' | 'register' | 'home' | 'profileCustomization'
  >('welcome');

  // Unified navigation handler
  const navigate = (screen: typeof currentScreen) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen navigateToDashboard={() => navigate('dashboard')} />
      )}
      
      {currentScreen === 'dashboard' && (
        <Dashboard 
          navigateToWelcome={() => navigate('welcome')}
          navigateToLogin={() => navigate('login')}
        />
      )}
      
      {currentScreen === 'login' && (
        <Login
          navigateToDashboard={() => navigate('dashboard')}
          navigateToRegister={() => navigate('register')}
          navigateToHome={() => navigate('home')}
        />
      )}
      
      {currentScreen === 'register' && (
        <Register 
          navigateToLogin={() => navigate('login')}
          navigateToDashboard={() => navigate('dashboard')}
        />
      )}
      
      {currentScreen === 'home' && (
        <Home 
          navigateToProfileCustomization={() => navigate('profileCustomization')}
        />
      )}
      
      {currentScreen === 'profileCustomization' && (
        <ProfileCustomization 
          navigateToHome={() => navigate('home')}
        />
      )}
    </>
  );
};

export default App;