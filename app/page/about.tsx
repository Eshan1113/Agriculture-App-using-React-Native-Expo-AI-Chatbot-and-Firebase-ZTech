import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, BackHandler } from 'react-native';
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
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="#4ADE80" />
            </Svg>
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>About Z-Tech</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Svg width="80" height="80" viewBox="0 0 24 24" fill="#4ADE80">
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" />
          </Svg>
          <Text style={styles.heroTitle}>Smart Plant Care Solutions</Text>
          <Text style={styles.heroSubtitle}>
            Revolutionizing plant care through IoT technology.
          </Text>
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            At Z-Tech, we are dedicated to making plant care effortless and efficient. 
            Our IoT-based system provides real-time monitoring and smart automation 
            to ensure your plants thrive with minimal effort.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Z-Tech?</Text>
          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#4ADE80">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" />
            </Svg>
            <Text style={styles.featureText}>Real-time plant monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#4ADE80">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" />
            </Svg>
            <Text style={styles.featureText}>Smart automation for watering</Text>
          </View>
          <View style={styles.featureItem}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#4ADE80">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" />
            </Svg>
            <Text style={styles.featureText}>Easy-to-use mobile app</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: Platform.OS === 'android' ? 25 : 16, // Adjust for Android status bar
  },
  backButton: {
    padding: 8,
  },
  backButtonCircle: {
    width: 40,
    top: 5,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    top: 5,
    right: 10,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  featuresSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
});

export default About;