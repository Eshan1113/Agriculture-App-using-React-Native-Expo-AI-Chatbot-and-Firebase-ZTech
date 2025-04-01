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
  Dimensions,
  Platform,
  PixelRatio,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { database } from './firebaseConfig'; // Import the database instance
import { ref, get } from 'firebase/database';
import * as Crypto from 'expo-crypto'; // For hashing the password
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const normalizeFontSize = (size: number) => {
  const scale = width / 320;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface LoginProps {
  navigateToDashboard: () => void;
  navigateToRegister: () => void;
  navigateToHome: () => void; // Add navigateToHome prop
}

const Login: React.FC<LoginProps> = ({ navigateToDashboard, navigateToRegister, navigateToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
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

  // Hash the password using SHA-256
  const hashPassword = async (password: string) => {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hashedPassword;
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const hashedPassword = await hashPassword(password);
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        Alert.alert('Error', 'Username does not exist.');
        setIsLoading(false);
        return;
      }

      const userData = snapshot.val();
      if (userData.password !== hashedPassword) {
        Alert.alert('Error', 'Incorrect password.');
        setIsLoading(false);
        return;
      }

      // Store both username and login state
      await AsyncStorage.multiSet([
        ['username', username],
        ['isLoggedIn', 'true']
      ]);

      Alert.alert(
        'Success',
        'Login successful!',
        [{
          text: 'OK',
          onPress: () => handleNavigation(navigateToHome),
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to login: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
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
            <Image source={require('../assets/1.jpg')} style={styles.avatar} />
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
              onPress={handleLogin}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" /> // Spinner
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  triangleBackground: {
    position: 'absolute',
    top: -height * 0.2,
    left: -width * 0.2,
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: '#4CD964',
    transform: [{ rotate: '-45deg' }],
  },
  content: {
    flex: 1,
    padding: width * 0.06,
    justifyContent: 'center',
  },
  header: {
    marginBottom: height * 0.05,
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: normalizeFontSize(20),
    fontWeight: '700',
  },
  logoPrefix: {
    color: '#4CD964',
  },
  logoSuffix: {
    color: '#000',
  },
  titleContainer: {
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  loginText: {
    fontSize: normalizeFontSize(18),
    fontWeight: '600',
    marginBottom: height * 0.01,
  },
  underline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlineLine: {
    width: width * 0.15,
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
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#E8E8E8',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: normalizeFontSize(14),
    color: '#000',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontSize: normalizeFontSize(14),
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  helpText: {
    color: '#757575',
    fontSize: normalizeFontSize(12),
  },
  linkText: {
    color: '#4CD964',
    fontSize: normalizeFontSize(12),
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  normalText: {
    color: '#757575',
    fontSize: normalizeFontSize(12),
  },
  createAccountText: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#4CD964',
    width: '100%',
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.05,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: normalizeFontSize(14),
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
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