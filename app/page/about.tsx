import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, BackHandler, Image } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const About = ({ navigateToHome }: { navigateToHome: () => void }) => {
  // Handle the back button press
  useEffect(() => {
    const backAction = () => {
      navigateToHome();
      return true; // This prevents the default back button behavior
    };

    // Add the event listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Clean up the event listener on unmount
    return () => backHandler.remove();
  }, [navigateToHome]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8fafc" translucent />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="#16a34a" />
            </Svg>
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>About ZTech</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Replace the SVG with your logo image */}
          <Image
            source={require('../../assets/images/11.png')} // Update path to your logo
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Smart Agricultural Monitoring System</Text>
          <Text style={styles.heroSubtitle}>
            Revolutionizing farming through IoT technology and automation
          </Text>
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            ZTech is dedicated to helping farmers and agricultural enthusiasts optimize their crop
            production through real-time monitoring and automated control systems. Our integrated
            mobile app and IoT device provide precise control over irrigation and environmental
            conditions, ensuring optimal plant growth with minimal manual intervention.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>

          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
              <Path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <View>
              <Text style={styles.featureTitle}>Real-time Monitoring</Text>
              <Text style={styles.featureText}>
                Track soil moisture, temperature, and humidity with updates every 60 seconds
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
              <Path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <View>
              <Text style={styles.featureTitle}>Automated Control</Text>
              <Text style={styles.featureText}>
                Smart irrigation and humidity control based on your custom settings
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
              <Path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <View>
              <Text style={styles.featureTitle}>Reliable Connectivity</Text>
              <Text style={styles.featureText}>
                WiFi-enabled with automatic fallback to Access Point mode when offline
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
              <Path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <View>
              <Text style={styles.featureTitle}>Multi-language Support</Text>
              <Text style={styles.featureText}>
                Available in both English and Sinhala for better accessibility
              </Text>
            </View>
          </View>
        </View>

        {/* Technology Section */}
        <View style={styles.techSection}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.techItem}>
            <Text style={styles.techTitle}>Mobile App</Text>
            <Text style={styles.techText}>React Native (Expo) with Firebase integration</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techTitle}>IoT Device</Text>
            <Text style={styles.techText}>ESP32 microcontroller programmed with Arduino IDE</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techTitle}>Cloud Services</Text>
            <Text style={styles.techText}>Firebase for real-time data storage and synchronization</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 50 : 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2e05',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2e05',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e05',
    marginLeft: 12,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
    lineHeight: 20,
  },
  techSection: {
    marginBottom: 16,
  },
  techItem: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  techText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default About;