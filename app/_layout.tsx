// _layout.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './index';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import Home from './home';
import ProfileCustomization from './page/ProfileCustomization';
import About from './page/about';
import Contact from './page/contact';
import FAQ from './page/faq';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<
    'welcome' | 'dashboard' | 'login' | 'register' | 'home' | 
    'profileCustomization' | 'about' | 'contact' | 'faq'
  >('welcome');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const [username, isLoggedIn, hasCompletedOnboarding] = await Promise.all([
          AsyncStorage.getItem('username'),
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('hasCompletedOnboarding')
        ]);

        // First time launch - show onboarding
        if (!hasCompletedOnboarding) {
          setCurrentScreen('welcome');
          setIsCheckingAuth(false);
          return;
        }

        // Returning user check
        if (username && isLoggedIn === 'true') {
          setCurrentScreen('home');
        } else {
          setCurrentScreen('login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setCurrentScreen('welcome');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const navigate = (screen: typeof currentScreen) => {
    setCurrentScreen(screen);
  };

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CD964" />
      </View>
    );
  }

  const screens = {
    welcome: <WelcomeScreen navigateToDashboard={() => navigate('dashboard')} />,
    dashboard: (
      <Dashboard 
        navigateToWelcome={() => navigate('welcome')}
        navigateToLogin={() => navigate('login')}
      />
    ),
    login: (
      <Login
        navigateToDashboard={() => navigate('dashboard')}
        navigateToRegister={() => navigate('register')}
        navigateToHome={() => navigate('home')}
      />
    ),
    register: (
      <Register 
        navigateToLogin={() => navigate('login')}
        navigateToDashboard={() => navigate('dashboard')}
      />
    ),
    home: (
      <Home 
        navigateToProfileCustomization={() => navigate('profileCustomization')}
        navigateToAbout={() => navigate('about')}
        navigateToContact={() => navigate('contact')}
        navigateToFAQ={() => navigate('faq')}
        navigateToLogin={async () => {
          await AsyncStorage.multiRemove(['username', 'isLoggedIn']);
          navigate('login');
        }}
      />
    ),
    profileCustomization: <ProfileCustomization navigateToHome={() => navigate('home')} />,
    about: <About navigateToHome={() => navigate('home')} />,
    contact: <Contact navigateToHome={() => navigate('home')} />,
    faq: <FAQ navigateToHome={() => navigate('home')} />
  };

  return screens[currentScreen] || screens.welcome;
};

export default App;