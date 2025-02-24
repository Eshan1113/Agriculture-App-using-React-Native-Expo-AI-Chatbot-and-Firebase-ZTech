import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface WelcomeScreenProps {
  navigateToDashboard: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigateToDashboard }) => {
  const [isChecked, setIsChecked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for erase animation

  const handleGetStarted = () => {
    if (isChecked) {
      // Start the erase-out animation
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out to 0 opacity
        duration: 500, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => {
        navigateToDashboard(); // Navigate after animation completes
      });
    } else {
      Alert.alert('Agreement Required', 'Please agree to continue by checking the box.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Image
        source={require('../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.contentContainer}>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.agreeButton}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, { backgroundColor: isChecked ? '#4CD964' : '#fff' }]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.agreeText}>I agree & Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoZ: {
    color: '#4CD964',
  },
  logoHyphen: {
    color: '#333',
  },
  logoTech: {
    color: '#333',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
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
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  agreeText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WelcomeScreen;