import React, { useState, useRef, useEffect } from 'react';
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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { database } from './firebaseConfig';
import { ref, get } from 'firebase/database';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

const normalizeFontSize = (size: number) => {
  const scale = Math.min(width / 375, height / 812);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface LoginProps {
  navigateToDashboard: () => void;
  navigateToRegister: () => void;
  navigateToHome: () => void;
}

const Login: React.FC<LoginProps> = ({ navigateToDashboard, navigateToRegister, navigateToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [animationsCompleted, setAnimationsCompleted] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // Platform specific timing for animations
  const animationTiming = Platform.OS === 'android' ? 600 : 800;

  useEffect(() => {
    // Add a delay before starting animations to ensure layout stability
    const initialTimeout = setTimeout(() => {
      // Sequence animations when component mounts
      Animated.sequence([
        // First animate the logo
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: animationTiming,
          useNativeDriver: true,
        }),
        // Then animate the form sliding up
        Animated.parallel([
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: animationTiming,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animationTiming,
            useNativeDriver: true,
          }),
        ]),
        // Then fade in the avatar
        Animated.timing(avatarAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Finally fade in the form fields
        Animated.stagger(200, [
          Animated.timing(formAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Mark animations as completed
        setAnimationsCompleted(true);
      });
    }, Platform.OS === 'android' ? 300 : 100);

    return () => clearTimeout(initialTimeout);
  }, []);

  // Add keyboard listeners to handle keyboard appearance
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Freeze animations when keyboard is visible
        if (!animationsCompleted) {
          translateYAnim.stopAnimation();
          scaleAnim.stopAnimation();
          setAnimationsCompleted(true);
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {

      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [animationsCompleted]);

  const handleNavigation = (navigateFunction: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigateFunction();
    });
  };

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

      await AsyncStorage.multiSet([
        ['username', username],
        ['isLoggedIn', 'true']
      ]);

      // Animate button before success message
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Alert.alert(
          'Success',
          'Login successful!',
          [{
            text: 'OK',
            onPress: () => handleNavigation(navigateToHome),
          }]
        );
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to login: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };
  const GoogleLogo = () => (
    <View style={styles.googleLogoContainer}>
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <Path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <Path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <Path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </Svg>
    </View>
  );
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Prevent keyboard from causing layout shifts
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#4CD964', '#2E8B57', '#1E5631']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Top decoration waves */}
          <View style={styles.waveContainer}>
            <Image
              source={require('../assets/1.jpg')}
              style={styles.waveImage}
              resizeMode="cover"
            />
          </View>

          {/* Logo */}
          <Animated.View style={[styles.header, { opacity: logoFadeAnim }]}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf-outline" size={28} color="#fff" />
              <Text style={styles.logo}>
                <Text style={styles.logoPrefix}>Z-</Text>
                <Text style={styles.logoSuffix}>Tech</Text>
              </Text>
            </View>
            <Text style={styles.tagline}>Smart Farming Solution</Text>
          </Animated.View>

          {/* Main Content */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={styles.keyboardAvoid}
          >
            <Animated.View
              style={[
                styles.formWrapper,
                {
                  transform: [
                    { translateY: translateYAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              {/* Avatar */}
              <Animated.View
                style={[
                  styles.avatarContainer,
                  { opacity: avatarAnim }
                ]}
              >
                <View style={styles.avatarBorder}>
                  <Image source={require('../assets/1.jpg')} style={styles.avatar} />
                </View>
              </Animated.View>

              {/* Login Title with Underline */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginText}>Welcome Back</Text>
                <View style={styles.underline}>
                  <View style={styles.underlineLine} />
                  <View style={styles.underlineDot} />
                </View>
                <Text style={styles.loginSubtext}>Sign in to continue</Text>
              </View>

              {/* Form Fields */}
              <Animated.View
                style={[
                  styles.formContainer,
                  { opacity: formAnim }
                ]}
              >
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'username' && styles.inputWrapperFocused
                ]}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={focusedField === 'username' ? '#4CD964' : '#757575'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="#A0A0A0"
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={[
                  styles.inputWrapper,
                  focusedField === 'password' && styles.inputWrapperFocused
                ]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={focusedField === 'password' ? '#4CD964' : '#757575'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    placeholderTextColor="#A0A0A0"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#757575"
                    />
                  </TouchableOpacity>
                </View>

                {/* Help Links */}
                <Pressable style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </Pressable>
              </Animated.View>

              {/* Login Button */}
              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    opacity: buttonAnim,
                    transform: [{ scale: buttonAnim }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Login</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => {/* Add Google login logic here */ }}
                  activeOpacity={0.7}
                >
                  <GoogleLogo />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                <View style={styles.createAccountContainer}>
                  <Text style={styles.normalText}>Don't have an account? </Text>
                  <Pressable onPress={() => handleNavigation(navigateToRegister)}>
                    <Text style={styles.createAccountText}>Create account</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>

          {/* Back Button Improved */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigation(navigateToDashboard)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  waveContainer: {
    position: 'absolute',
    top: height * 0.33,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
    zIndex: 1,
  },
  waveImage: {
    width: width,
    height: 100,
    tintColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: height * 0.08,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logo: {
    fontSize: normalizeFontSize(24),
    fontWeight: '700',
    marginLeft: 6,
  },
  logoPrefix: {
    color: '#fff',
  },
  logoSuffix: {
    color: '#fff',
  },
  tagline: {
    color: '#fff',
    fontSize: normalizeFontSize(13),
    opacity: 0.8,
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: width * 0.06,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginTop: height * 0.15,
    position: 'relative',
    zIndex: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -height * 0.07,
    marginBottom: height * 0.01,
  },
  avatarBorder: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: '#fff',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.09,
    backgroundColor: '#E8E8E8',
  },
  titleContainer: {
    marginBottom: height * 0.015,
    alignItems: 'center',
  },
  loginText: {
    fontSize: normalizeFontSize(20),
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  loginSubtext: {
    fontSize: normalizeFontSize(13),
    color: '#757575',
    marginTop: 4,
  },
  underline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlineLine: {
    width: width * 0.12,
    height: 2,
    backgroundColor: '#4CD964',
    borderRadius: 1,
  },
  underlineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CD964',
    marginLeft: 3,
  },
  formContainer: {
    width: '100%',
    marginTop: height * 0.01,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 3,
    borderWidth: 1,
    borderColor: '#F5F5F7',
  },
  inputWrapperFocused: {
    borderColor: '#4CD964',
    backgroundColor: '#F9FFF9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: normalizeFontSize(13),
    color: '#333',
    paddingVertical: 6,
  },
  eyeIcon: {
    padding: 6,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: height * 0.01,
  },
  forgotPasswordText: {
    color: '#4CD964',
    fontSize: normalizeFontSize(12),
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  loginButton: {
    backgroundColor: '#4CD964',
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
    flexDirection: 'row',
    shadowColor: '#4CD964',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: normalizeFontSize(15),
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 6,
  },
  createAccountContainer: {
    flexDirection: 'row',
  },
  normalText: {
    color: '#757575',
    fontSize: normalizeFontSize(13),
  },
  createAccountText: {
    color: '#4CD964',
    fontSize: normalizeFontSize(13),
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 16,
  },

  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 10,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dadce0',
    height: 40,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: height * 0.02,
  },
  googleLogoContainer: {
    marginRight: 10,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: normalizeFontSize(12),
    fontWeight: '500',
    letterSpacing: 0.25,
  }
});

export default Login;