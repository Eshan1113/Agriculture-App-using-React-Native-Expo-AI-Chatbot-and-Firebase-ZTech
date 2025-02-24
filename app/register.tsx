import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Expo-compatible icons

interface RegisterProps {
  navigateToLogin: () => void; // Navigate to the login screen
  navigateToDashboard: () => void; // Navigate to the dashboard after registration
}

const Register: React.FC<RegisterProps> = ({ navigateToLogin, navigateToDashboard }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for erase animation

  const handleBackNavigation = () => {
    // Start the erase-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade out to 0 opacity
      duration: 500, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      navigateToDashboard(); // Navigate after animation completes
    });
  };

  const handleLoginNavigation = () => {
    // Start the erase-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade out to 0 opacity
      duration: 500, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      navigateToLogin(); // Navigate to the login screen
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Green Triangle Background */}
      <View style={styles.triangleBackground} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.logoPrefix}>Z-</Text>
            <Text style={styles.logoSuffix}>Tech</Text>
          </Text>
        </View>

        {/* Register Title with Underline */}
        <View style={styles.titleContainer}>
          <Text style={styles.loginText}>Register</Text>
          <View style={styles.underline}>
            <View style={styles.underlineDot} /> {/* Moved dot to the left */}
            <View style={styles.underlineLine} />
          </View>
        </View>
        
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/1.jpg')}
            style={styles.avatar}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder=""
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder=""
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder=""
            />
          </View>

          {/* Login Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.helpText}>Already have an account? </Text>
            <Pressable onPress={handleLoginNavigation}>
              <Text style={styles.linkText}>Login</Text>
            </Pressable>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleBackNavigation} // Use the animation function here
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackNavigation}>
              {/* Use Ionicons from @expo/vector-icons */}
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  triangleBackground: {
    position: 'absolute',
    top: -100,
    right: -100, // Moved to the right side
    width: 400,
    height: 300,
    backgroundColor: '#4CD964',
    transform: [{ rotate: '45deg' }], // Rotated backward
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center', // Center content vertically
  },
  header: {
    marginBottom: 200, // Adjusted to bring "Z-Tech" further down
    alignItems: 'flex-start', // Align logo to the left
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
  },
  logoPrefix: {
    color: '#4CD964',
  },
  logoSuffix: {
    color: '#000',
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center', // Center the title
  },
  loginText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  underline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlineLine: {
    width: 50, // Adjust the width of the underline
    height: 2, // Adjust the thickness of the underline
    backgroundColor: '#4CD964', // Green color for the underline
    marginTop: 4, // Space between text and underline
  },
  underlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CD964',
    marginRight: 4, // Moved dot to the left side of the underline
    marginTop: 4, // Align with the underline
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
  },
  formContainer: {
    width: '100%',
    marginTop: 10, // Adjusted to move the form fields down
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
  },
  helpText: {
    color: '#757575',
    fontSize: 14,
  },
  linkText: {
    color: '#4CD964',
    fontSize: 14,
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  normalText: {
    color: '#757575',
    fontSize: 14,
  },
  createAccountText: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#4CD964',
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8E8E8',
  },
  activeDot: {
    backgroundColor: '#4CD964',
  },
});

export default Register;