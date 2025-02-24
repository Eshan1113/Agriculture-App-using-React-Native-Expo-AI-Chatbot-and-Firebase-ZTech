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

interface LoginProps {
  navigateToDashboard: () => void;
  navigateToRegister: () => void; // Added navigateToRegister prop
}

const Login: React.FC<LoginProps> = ({ navigateToDashboard, navigateToRegister }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNavigation = (navigateFunction: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigateFunction();
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

        {/* Login Title with Underline */}
        <View style={styles.titleContainer}>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.underline}>
            <View style={styles.underlineLine} />
            <View style={styles.underlineDot} />
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
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder=""
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

          {/* Help Links */}
          <View style={styles.linkContainer}>
            <Text style={styles.helpText}>Need Help? </Text>
            <Pressable>
              <Text style={styles.linkText}>Forgot Password</Text>
            </Pressable>
          </View>

          <View style={styles.createAccountContainer}>
            <Text style={styles.normalText}>Don't have an account? </Text>
            <Pressable onPress={() => handleNavigation(navigateToRegister)}>
              <Text style={[styles.linkText, styles.createAccountText]}>Create account</Text>
            </Pressable>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => handleNavigation(navigateToDashboard)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => handleNavigation(navigateToDashboard)}
            >
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
    left: -100, // Moved to the left side
    width: 400,
    height: 300,
    backgroundColor: '#4CD964',
    transform: [{ rotate: '-45deg' }], // Rotated forward
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 150,
    alignItems: 'flex-end',
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
    alignItems: 'center',
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
    width: 50,
    height: 2,
    backgroundColor: '#4CD964',
    marginTop: 4,
  },
  underlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CD964',
    marginLeft: 4,
    marginTop: 4,
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
    marginTop: 10,
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

export default Login;