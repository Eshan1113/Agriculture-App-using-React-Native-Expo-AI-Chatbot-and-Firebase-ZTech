import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, BackHandler, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const Contact = ({ navigateToHome }: { navigateToHome: () => void }) => {
  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigateToHome();
      return true;
    });

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
        <Text style={styles.title}>Contact Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Email Contact Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('mailto:support@agriiot.com')}
        >
          <View style={[styles.iconWrapper, styles.emailIcon]}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"
                fill="#16a34a"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardSubtitle}>support@ztech.com</Text>
            <Text style={styles.responseTime}>Typically responds within 24 hours</Text>
          </View>
        </TouchableOpacity>

        {/* Phone Contact Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('tel:+94114567890')}
        >
          <View style={[styles.iconWrapper, styles.phoneIcon]}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                fill="#2563eb"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Call Support</Text>
            <Text style={styles.cardSubtitle}>+94 778519383</Text>
            <Text style={styles.responseTime}>Available 8:00 AM - 6:00 PM (GMT+5:30)</Text>
          </View>
        </TouchableOpacity>

        {/* Technical Support Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('https://agriiot.com/tech-support')}
        >
          <View style={[styles.iconWrapper, styles.techIcon]}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
                fill="#9333ea"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Technical Support</Text>
            <Text style={styles.cardSubtitle}>IoT Device & App Assistance</Text>
            <Text style={styles.responseTime}>24/7 for critical system issues</Text>
          </View>
        </TouchableOpacity>

        {/* Information Notice */}
        <View style={styles.noticeBox}>
          <View style={styles.noteHeader}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </Svg>
            <Text style={styles.noteTitle}>Agricultural Support</Text>
          </View>
          <Text style={styles.noticeText}>
          Our team includes agricultural experts who provide plant care advice, recommend optimal moisture settings, and offer troubleshooting support tailored to your specific crops.
          
          </Text>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencyBox}>
          <View style={styles.noteHeader}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#dc2626">
              <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm1-10h-2v6h2V7zm0 8h-2v2h2v-2z" />
            </Svg>
            <Text style={styles.emergencyTitle}>Emergency Contact</Text>
          </View>
          <Text style={styles.emergencyText}>
            For critical system failures affecting your crops, call our 24/7 emergency line: 
            <Text style={styles.emergencyNumber}> +94 77 8519383</Text>
          </Text>
        </View>
      </View>
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
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: Platform.OS === 'android' ? 50 : 16,
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
    flex: 1,
    padding: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrapper: {
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  emailIcon: {
    backgroundColor: '#dcfce7',
  },
  phoneIcon: {
    backgroundColor: '#dbeafe',
  },
  techIcon: {
    backgroundColor: '#f3e8ff',
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e05',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
  },
  noticeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emergencyBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e05',
    marginLeft: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    marginLeft: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emergencyText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emergencyNumber: {
    color: '#dc2626',
    fontWeight: '600',
  },
});

export default Contact;