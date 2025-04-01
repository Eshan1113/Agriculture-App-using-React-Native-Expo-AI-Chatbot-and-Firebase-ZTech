import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DashboardProps {
  navigateToWelcome: () => void;
  navigateToLogin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateToWelcome, navigateToLogin }) => {
  const [serviceText, setServiceText] = useState('Customer Support');
  const [textColor, setTextColor] = useState('#8B44FF');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const texts = [
      { text: 'Customer Support', color: '#8B44FF' },
      { text: 'AI Chat Bot', color: '#44A4FF' },
      { text: '24/7 Monitoring', color: '#4CD964' },
    ];

    let index = 0;

    const animateText = () => {
      Animated.timing(translateYAnim, {
        toValue: -40,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setServiceText(texts[index].text);
        setTextColor(texts[index].color);
        translateYAnim.setValue(20);
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
        index = (index + 1) % texts.length;
      });
    };

    const interval = setInterval(animateText, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBackNavigation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigateToWelcome();
    });
  };

  const handleNextNavigation = async () => {
    // Mark onboarding as completed before navigating
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigateToLogin();
    });
  };

  return (
    <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleZ}>Z</Text>
              <Text style={styles.titleRest}>-Tech</Text>
            </View>

            <Text style={styles.subtitle}>Monitor Your Plant Environment</Text>
            
            <View style={styles.serviceContainer}>
              <Animated.Text 
                style={[
                  styles.serviceText, 
                  { 
                    color: textColor, 
                    transform: [{ translateY: translateYAnim }] 
                  }
                ]}
              >
                {serviceText}
              </Animated.Text>
            </View>

            <Text style={styles.descriptionText}>
              Our smart monitoring system helps you maintain optimal conditions for your plants 
              with real-time data and automated alerts.
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.leftButton}>
            <TouchableOpacity 
              style={styles.circleButton} 
              onPress={handleBackNavigation}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          <View style={styles.rightButton}>
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleNextNavigation}
            >
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    alignItems: 'center',
    paddingTop: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleZ: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CD964',
  },
  titleRest: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  serviceContainer: {
    marginBottom: 20,
    height: 40,
    justifyContent: 'center',
  },
  serviceText: {
    fontSize: 18,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  leftButton: {
    width: 40,
  },
  rightButton: {
    width: 40,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#4CD964',
  },
  nextButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;