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
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { database } from './firebaseConfig';
import { ref, set, get } from 'firebase/database';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const normalizeFontSize = (size: number) => {
  const scale = width / 320;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface RegisterProps {
  navigateToLogin: () => void;
  navigateToDashboard: () => void;
  navigateToHome: () => void;
}

const Register: React.FC<RegisterProps> = ({ navigateToLogin, navigateToDashboard, navigateToHome }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'terms' | 'privacy' | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations when component mounts
    Animated.sequence([
      // First animate the logo
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Then animate the form sliding up
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
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
    ]).start();
  }, []);

  const showModal = (contentType: 'terms' | 'privacy') => {
    setModalContent(contentType);
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setModalContent(null);
    });
  };

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

  // Check if username or email already exists
  const checkExistingUser = async (username: string, email: string) => {
    const usernameRef = ref(database, `users/${username}`);
    const emailRef = ref(database, 'users');
    const snapshot = await get(usernameRef);
    const emailSnapshot = await get(emailRef);

    if (snapshot.exists()) {
      return 'Username already exists.';
    }

    // Check if email already exists
    if (emailSnapshot.exists()) {
      const users = emailSnapshot.val();
      for (const key in users) {
        if (users[key].email === email) {
          return 'Email already exists.';
        }
      }
    }

    return null;
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Check if username or email already exists
      const existingUserError = await checkExistingUser(username, email);
      if (existingUserError) {
        Alert.alert('Error', existingUserError);
        setIsLoading(false);
        return;
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Save user data to Firebase
      const userData = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      await set(ref(database, `users/${username}`), userData);

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
        // Clear all form fields
        setUsername('');
        setEmail('');
        setPassword('');

        Alert.alert(
          'Success',
          'Registration successful!',
          [{
            text: 'OK',
            onPress: () => navigateToLogin(),
          }]
        );
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to register: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderModalContent = () => {
    if (modalContent === 'terms') {
      return (
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Terms of Service</Text>
          <Text style={styles.modalText}>
            Last Updated: {new Date().toLocaleDateString()}
          </Text>

          <Text style={styles.modalSubtitle}>1. Acceptance of Terms</Text>
          <Text style={styles.modalText}>
            By accessing or using the Z-Tech Smart Farming Solution ("Service"), you agree to be bound by these Terms of Service.
          </Text>

          <Text style={styles.modalSubtitle}>2. Description of Service</Text>
          <Text style={styles.modalText}>
            Z-Tech provides a smart farming solution that monitors soil moisture, temperature, and humidity levels to help optimize plant growth.
          </Text>

          <Text style={styles.modalSubtitle}>3. User Responsibilities</Text>
          <Text style={styles.modalText}>
            - You must provide accurate registration information{"\n"}
            - You are responsible for maintaining the confidentiality of your account{"\n"}
            - You agree to use the Service only for lawful purposes
          </Text>

          <Text style={styles.modalSubtitle}>4. Intellectual Property</Text>
          <Text style={styles.modalText}>
            All content and technology included on the Service are the property of Z-Tech and protected by intellectual property laws.
          </Text>

          <Text style={styles.modalSubtitle}>5. Limitation of Liability</Text>
          <Text style={styles.modalText}>
            Z-Tech shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </Text>

          <Text style={styles.modalSubtitle}>6. Privacy Policy</Text>
          <Text style={styles.modalText}>
            Please review our privacy policy for more information on how we collect, use, and protect your personal data.
          </Text>
        </ScrollView>
      );
    } else if (modalContent === 'privacy') {
      return (
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <Text style={styles.modalText}>
            Last Updated: {new Date().toLocaleDateString()}
          </Text>

          <Text style={styles.modalSubtitle}>1. Information We Collect</Text>
          <Text style={styles.modalText}>
            We collect personal information you provide when registering, including username, email address, and password (hashed for security).
          </Text>

          <Text style={styles.modalSubtitle}>2. How We Use Your Information</Text>
          <Text style={styles.modalText}>
            - To provide and maintain our Service{"\n"}
            - To notify you about changes to our Service{"\n"}
            - To allow you to participate in interactive features{"\n"}
            - To provide customer support
          </Text>

          <Text style={styles.modalSubtitle}>3. Data Security</Text>
          <Text style={styles.modalText}>
            We implement appropriate technical and organizational measures to protect your personal information. Passwords are hashed and never stored in plain text.
          </Text>

          <Text style={styles.modalSubtitle}>4. Data Retention</Text>
          <Text style={styles.modalText}>
            We retain your personal information only for as long as necessary to provide you with our services and as described in this Privacy Policy.
          </Text>

          <Text style={styles.modalSubtitle}>5. Your Rights</Text>
          <Text style={styles.modalText}>
            You have the right to access, correct, or delete your personal data. You may also request a copy of your data or withdraw consent at any time.
          </Text>
        </ScrollView>
      );
    }
    return null;
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#4CD964', '#2E8B57', '#1E5631']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Back Button - Enhanced Design */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigation(navigateToLogin)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Logo */}
          <Animated.View style={[styles.header, { opacity: logoFadeAnim }]}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf-outline" size={26} top={10} color="#fff" />
              <Text style={styles.logo}>
                <Text style={styles.logoPrefix}>Z-</Text>
                <Text style={styles.logoSuffix}>Tech</Text>
              </Text>
            </View>
            <Text style={styles.tagline}>Smart Farming Solution</Text>
          </Animated.View>

          {/* Main Content */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

              {/* Register Title with Underline */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginText}>Create Account</Text>
                <View style={styles.underline}>
                  <View style={styles.underlineLine} />
                  <View style={styles.underlineDot} />
                </View>
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
                    size={16}
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
                  focusedField === 'email' && styles.inputWrapperFocused
                ]}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={focusedField === 'email' ? '#4CD964' : '#757575'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email Address"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={[
                  styles.inputWrapper,
                  focusedField === 'password' && styles.inputWrapperFocused
                ]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
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
                      size={16}
                      color="#757575"
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.termsText}>
                  By signing up, you agree to our {' '}
                  <Pressable onPress={() => showModal('terms')}>
                    <Text style={styles.termsLink}>Terms</Text>
                  </Pressable> {' '}
                  &{' '}
                  <Pressable onPress={() => showModal('privacy')}>
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Pressable>
                </Text>
              </Animated.View>

              {/* Register Button */}
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
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Register</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.createAccountContainer}>
                  <Text style={styles.normalText}>Already have an account? </Text>
                  <Pressable onPress={() => handleNavigation(navigateToLogin)}>
                    <Text style={styles.createAccountText}>Login</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>

          {/* Progress Indicator - bottom dots */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Terms and Privacy Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalAnim }]}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modalOverlayTouchable} />
          </TouchableWithoutFeedback>
          <Animated.View style={[
            styles.modalContainer,
            {
              transform: [{
                translateY: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }]
            }
          ]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={hideModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#4CD964" />
              </TouchableOpacity>
            </View>
            {renderModalContent()}
          </Animated.View>
        </Animated.View>
      </Modal>
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
    height: height * 0.35,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.07 : height * 0.05,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: normalizeFontSize(24),
    fontWeight: '700',
    marginLeft: 6,
    top: 20,
  },
  logoPrefix: {
    color: '#fff',
  },
  logoSuffix: {
    color: '#fff',
  },
  tagline: {
    color: '#fff',
    fontSize: normalizeFontSize(12),
    opacity: 0.8,
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: width * 0.07,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginTop: height * 0.15,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -height * 0.06,
    marginBottom: height * 0.01,
  },
  avatarBorder: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
    backgroundColor: '#fff',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.08,
    backgroundColor: '#E8E8E8',
  },
  titleContainer: {
    marginBottom: height * 0.01,
    alignItems: 'center',
  },
  loginText: {
    fontSize: normalizeFontSize(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  underline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlineLine: {
    width: width * 0.1,
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
    marginTop: height * 0.008,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.012,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 1,
    borderWidth: 1,
    borderColor: '#F5F5F7',
  },
  inputWrapperFocused: {
    borderColor: '#4CD964',
    backgroundColor: '#F9FFF9',
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: normalizeFontSize(12),
    color: '#333',
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 4,
  },
  termsText: {
    fontSize: Math.min(normalizeFontSize(12), width * 0.037),
    color: '#757575',
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 16 : 18, 
    fontWeight: '400',
    marginBottom: height * 0.012,
    paddingHorizontal: width * 0.02, 
  },
  
  
  termsLink: {
    color: '#4CD964',
    fontWeight: '500',
    top: 2,
    fontSize: Math.min(normalizeFontSize(20), width * 0.032), 
    lineHeight: Platform.OS === 'ios' ? 12  : 14,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.008,
  },
  loginButton: {
    backgroundColor: '#4CD964',
    width: '100%',
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.015,
    flexDirection: 'row',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: normalizeFontSize(14),
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
    fontSize: normalizeFontSize(12),
  },
  createAccountText: {
    color: '#4CD964',
    fontSize: normalizeFontSize(12),
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.05 : height * 0.035,
    left: width * 0.05,
    zIndex: 10,
  },
  backButtonGradient: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    top: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? height * 0.04 : height * 0.025,
    left: 0,
    right: 0,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  activeDot: {
    backgroundColor: '#4CD964',
    width: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: normalizeFontSize(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: normalizeFontSize(14),
    fontWeight: '600',
    color: '#4CD964',
    marginTop: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: normalizeFontSize(12),
    color: '#555',
    lineHeight: 18,
    marginBottom: 10,
  },
});

export default Register;