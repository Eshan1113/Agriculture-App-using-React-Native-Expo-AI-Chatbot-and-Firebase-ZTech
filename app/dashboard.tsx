import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DashboardProps {
  navigateToWelcome: () => void;
  navigateToLogin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateToWelcome, navigateToLogin }) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const featureFadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const features: { text: string; color: string; icon: 'water-outline' | 'timer-outline' | 'notifications-outline' }[] = [
    { text: 'Soil Moisture Tracking', color: '#16a34a', icon: 'water-outline' },
    { text: 'Automated Irrigation', color: '#2563eb', icon: 'timer-outline' },
    { text: 'Crop Health Alerts', color: '#dc2626', icon: 'notifications-outline' },
  ];

  useEffect(() => {
    const animateText = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(featureFadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(featureFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setTimeout(() => {
        setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
      }, 300);
    };

    const interval = setInterval(animateText, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBackNavigation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(navigateToWelcome);
  };

  const handleNextNavigation = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(navigateToLogin);
  };

  const currentFeature = features[featureIndex];

  return (
    <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
      <StatusBar style="dark" backgroundColor="#f8fafc" translucent />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleMain}>Z-</Text>
              <Text style={styles.titleIoT}>Tech</Text>
            </View>

            <Text style={styles.subtitle}>Smart Farming Solution</Text>
            
            <View style={styles.featureContainer}>
              <Animated.View 
                style={[
                  styles.featureBox,
                  { 
                    opacity: featureFadeAnim,
                    transform: [{ translateY: translateYAnim }],
                    backgroundColor: `${currentFeature.color}20`, 
                    borderColor: currentFeature.color
                  }
                ]}
              >
                <Ionicons name={currentFeature.icon} size={28} color={currentFeature.color} style={styles.featureIcon} />
                <Animated.Text 
                  style={[
                    styles.featureText, 
                    { color: currentFeature.color }
                  ]}
                >
                  {currentFeature.text}
                </Animated.Text>
              </Animated.View>
            </View>

            <Text style={styles.descriptionText}>
              Revolutionizing agriculture through IoT technology, Z-Tech empowers farmers 
              with real-time insights and automated solutions for optimal crop management.
            </Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="person-circle-outline" size={24} color="#1a2e05" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Developed By</Text>
                  <Text style={styles.infoContent}>Eshan Dananjaya</Text>
                  <Text style={styles.infoSubText}>Agri-Tech Specialist | IoT Expert</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={24} color="#1a2e05" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Designed For</Text>
                  <Text style={styles.infoContent}>Modern Farmers</Text>
                  <Text style={styles.infoSubText}>Small to medium-scale agricultural operations</Text>
                </View>
              </View>

            
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleBackNavigation}
          >
            <Ionicons name="arrow-back" size={24} color="#1a2e05" />
          </TouchableOpacity>

          <View style={styles.pagination}>
            {[1, 2, 3].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.dot, 
                  index === 0 ? styles.dotActive : {}
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]} 
            onPress={handleNextNavigation}
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerContent: {
    alignItems: 'center',
    paddingTop: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleMain: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a2e05',
  },
  titleIoT: {
    fontSize: 36,
    fontWeight: '700',
    color: '#16a34a',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 24,
    fontWeight: '500',
  },
  featureContainer: {
    height: 80,
    marginVertical: 20,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  infoContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e05',
    marginBottom: 2,
  },
  infoContent: {
    fontSize: 14,
    color: '#365314',
    fontWeight: '500',
  },
  infoSubText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 3,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#16a34a',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#16a34a',
    width: 20,
  },
});

export default Dashboard;