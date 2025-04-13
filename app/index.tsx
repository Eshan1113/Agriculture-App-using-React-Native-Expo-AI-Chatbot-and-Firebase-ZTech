import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Alert, Dimensions, Modal, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WelcomeScreenProps {
  navigateToDashboard: () => void;
}

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigateToDashboard }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'terms' | 'privacy' | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  
  const images = [
    require('../assets/bg.png'),
    require('../assets/bg2.jpg'), 
    require('../assets/bg3.jpg'),
    require('../assets/bg4.jpg'),
  ];

  const currentImageOpacity = useRef(new Animated.Value(1)).current;
  const nextImageOpacity = useRef(new Animated.Value(0)).current;
  const currentImageScale = useRef(new Animated.Value(1)).current;
  const nextImageScale = useRef(new Animated.Value(1.05)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const changeImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setNextImageIndex(nextIndex);
    nextImageScale.setValue(1.05);
    
    Animated.parallel([
      Animated.timing(currentImageOpacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(nextImageOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(currentImageScale, {
        toValue: 0.95,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(nextImageScale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentImageIndex(nextIndex);
      currentImageOpacity.setValue(1);
      nextImageOpacity.setValue(1);
      currentImageScale.setValue(1);
      Animated.timing(currentImageScale, {
        toValue: 1.05,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    });
  };

  const showModal = (contentType: 'terms' | 'privacy') => {
    setModalContent(contentType);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
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
              <Text style={styles.agreeText}>
                I agree to the {' '}
                <Pressable onPress={() => showModal('terms')}>
                  <Text style={styles.linkText}>Terms</Text>
                </Pressable> {' '}
                & {' '}
                <Pressable onPress={() => showModal('privacy')}>
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Pressable>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={hideModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
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
  logoZ: { color: '#4CD964' },
  logoHyphen: { color: '#fff' },
  logoTech: { color: '#fff' },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 24,
    width: '80%',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  agreeButton: {
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    marginRight: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  agreeText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#4CD964',
    fontWeight: 'bold',
    top: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  modalCloseButton: {
    padding: 10,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#4CD964',
  },
  modalContent: {
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#4CD964',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default WelcomeScreen;