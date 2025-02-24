import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Expo-compatible icons
import { StatusBar } from 'expo-status-bar';

interface DashboardProps {
  navigateToWelcome: () => void;
  navigateToLogin: () => void; // Add navigateToLogin prop
}

const Dashboard: React.FC<DashboardProps> = ({ navigateToWelcome, navigateToLogin }) => {
  const [serviceText, setServiceText] = useState('Customer Support');
  const [textColor, setTextColor] = useState('#8B44FF'); // Initial color
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for erase animation
  const translateYAnim = useRef(new Animated.Value(0)).current; // Initial vertical position

  useEffect(() => {
    const texts = [
      { text: 'Customer Support', color: '#8B44FF' }, // Purple
      { text: 'AI Chat Bot', color: '#44A4FF' }, // Blue
      { text: '24/7', color: '#4CD964' }, // Green
    ];

    let index = 0;

    const animateText = () => {
      Animated.timing(translateYAnim, {
        toValue: -40, // Move text up
        duration: 100, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => {
        // Update text and color after animation
        setServiceText(texts[index].text);
        setTextColor(texts[index].color);
        translateYAnim.setValue(20); // Reset position below
        Animated.timing(translateYAnim, {
          toValue: 0, // Move text back to original position
          duration: 100, // Animation duration
          useNativeDriver: true, // Use native driver for better performance
        }).start();
        index = (index + 1) % texts.length;
      });
    };

    const interval = setInterval(animateText, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBackNavigation = () => {
    // Start the erase-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade out to 0 opacity
      duration: 500, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      navigateToWelcome(); // Navigate after animation completes
    });
  };

  const handleNextNavigation = () => {
    // Start the erase-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade out to 0 opacity
      duration: 500, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      navigateToLogin(); // Navigate to Login screen
    });
  };

  return (
    <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
      {/* Set the status bar style to light-content (white text) */}
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
              <Animated.Text style={[styles.serviceText, { color: textColor, transform: [{ translateY: translateYAnim }] }]}>
                {serviceText}
              </Animated.Text>
            </View>

            <Text style={styles.loremText}>
              Lorem ipsum dolor sit amet consectetur. Vulputate nisl nisl blandit pell accumsana ornare. Volutpat quam odio ut dui turpis viverra curabitur. Libero pellentesque enim felis venenatis massa aliquam egestas sollicitudin libero. Curabitur urna nullam volutpat nunc lectus lacus natoque elit. Lorem ipsum dolor sit amet consecpellentesque enim felis venenatis massa aliquam egestas sollicitudin libero. Curabitur urna nullam volutpat nunc lectus lacus natoque elit.
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.leftButton}>
            <TouchableOpacity style={styles.circleButton} onPress={handleBackNavigation}>
              {/* Use Ionicons from @expo/vector-icons */}
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.rightButton}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextNavigation}>
              {/* Use Ionicons from @expo/vector-icons */}
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
  },
  serviceText: {
    fontSize: 16,
  },
  loremText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
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