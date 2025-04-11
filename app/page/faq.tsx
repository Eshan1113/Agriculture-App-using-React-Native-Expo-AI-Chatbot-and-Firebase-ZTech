import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const FAQ = ({ navigateToHome }: { navigateToHome: () => void }) => {
  const faqItems = [
    {
      question: "How does the automated irrigation system work?",
      answer: "Our system continuously monitors soil moisture levels. When the moisture drops below your set threshold, it automatically activates the water pump to irrigate your plants.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
    {
      question: "What should I do if my IoT device goes offline?",
      answer: "The system will notify you if the device disconnects. You can check your WiFi connection or access the device directly via its Access Point mode by connecting to its network and entering your WiFi credentials again.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
    {
      question: "How often is sensor data updated?",
      answer: "Sensor data is collected continuously, with average values calculated and stored in Firebase every 60 seconds. The mobile app displays these real-time updates.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
    {
      question: "Can I use the system without internet connection?",
      answer: "Yes, the IoT device can operate in Access Point mode when offline. You can connect directly to the device via WiFi to monitor and control it locally.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
    {
      question: "How do I change the language of the app?",
      answer: "You can switch between English and Sinhala in your profile settings after logging in to the application.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
    {
      question: "What power options are available for the IoT device?",
      answer: "The device can be powered by a rechargeable battery pack, 12V DC power supply, or through solar charging for sustainable operation.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z",
    },
  ];

  // Handle the back button press
  useEffect(() => {
    const backAction = () => {
      navigateToHome();
      return true; 
    };

    
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
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqCard}>
            <View style={styles.iconContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
                <Path d={item.icon} />
              </Svg>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          </View>
        ))}
        
        {/* Additional Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Still need help?</Text>
          <Text style={styles.helpText}>Contact our support team through the Contact Us page for further assistance.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
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
    marginLeft: -40, // To center the title properly
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e05',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  helpSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default FAQ;