import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WelcomeScreenProps {
  navigateToDashboard: () => void;
}

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigateToDashboard }) => {
  const [isChecked, setIsChecked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  
  // Images array
  const images = [
    require('../assets/bg.png'),
    require('../assets/bg2.jpg'), 
    require('../assets/bg3.jpg'),
    require('../assets/bg4.jpg'),
  ];

  // Animation values for cross-fade effect
  const currentImageOpacity = useRef(new Animated.Value(1)).current;
  const nextImageOpacity = useRef(new Animated.Value(0)).current;
  
  // For zoom effect
  const currentImageScale = useRef(new Animated.Value(1)).current;
  const nextImageScale = useRef(new Animated.Value(1.05)).current;

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  // Handle image transition with cross-fade and scale
  const changeImage = () => {
    // Calculate next image index
    const nextIndex = (currentImageIndex + 1) % images.length;
    setNextImageIndex(nextIndex);
    
    // Reset scale for next image
    nextImageScale.setValue(1.05);
    
    // Animate both images simultaneously
    Animated.parallel([
      // Fade out current image
      Animated.timing(currentImageOpacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Fade in next image
      Animated.timing(nextImageOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale down current image slightly
      Animated.timing(currentImageScale, {
        toValue: 0.95,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale next image to normal size
      Animated.timing(nextImageScale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Update current image index
      setCurrentImageIndex(nextIndex);
      
      // Reset animation values for next transition
      currentImageOpacity.setValue(1);
      nextImageOpacity.setValue(1);
      currentImageScale.setValue(1);
      
      // Start subtle zoom animation for current image
      Animated.timing(currentImageScale, {
        toValue: 1.05,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleGetStarted = () => {
    if (isChecked) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(async () => {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        navigateToDashboard();
      });
    } else {
      Alert.alert('Agreement Required', 'Please agree to continue by checking the box.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* Two overlapping background images for cross-fade effect */}
      <Animated.Image
        source={images[currentImageIndex]}
        style={[
          styles.backgroundImage, 
          { 
            opacity: currentImageOpacity,
            transform: [{ scale: currentImageScale }]
          }
        ]}
        resizeMode="cover"
      />
      
      <Animated.Image
        source={images[nextImageIndex]}
        style={[
          styles.backgroundImage, 
          { 
            opacity: nextImageOpacity,
            transform: [{ scale: nextImageScale }]
          }
        ]}
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoZ}>Z</Text>
            <Text style={styles.logoHyphen}>-</Text>
            <Text style={styles.logoTech}>Tech</Text>
          </Text>
          <Text style={styles.subtitle}>
            Smart Plant Monitoring{'\n'}System
          </Text>
        </View>
        
        {/* Image indicators */}
        {/* <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentImageIndex ? '#4CD964' : '#FFFFFF' }
              ]}
            />
          ))}
        </View> */}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.agreeButton}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, { backgroundColor: isChecked ? '#4CD964' : 'transparent', borderColor: '#fff', borderWidth: 1 }]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.agreeText}>I agree & Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoZ: {
    color: '#4CD964',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  logoHyphen: {
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  logoTech: {
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: 'auto',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agreeButton: {
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  agreeText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default WelcomeScreen;