import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const About = ({ navigateToHome }: { navigateToHome: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About Z-Tech</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Smart Plant Care Solutions</Text>
        <Text style={styles.description}>
          Z-Tech is dedicated to revolutionizing plant care through IoT technology. 
          Our system provides real-time monitoring and smart automation for 
          healthier plants and simpler maintenance.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Use similar styles as ProfileCustomization
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#4B5563',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});

export default About;