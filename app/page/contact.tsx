import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, BackHandler, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const Contact = ({ navigateToHome }: { navigateToHome: () => void }) => {
  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigateToHome(); // Go back when the hardware back button is pressed
      return true; // Prevent default behavior
    });

    return () => backHandler.remove(); // Cleanup on unmount
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
        <Text style={styles.title}>Contact Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Email Contact Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('mailto:eshan@gmail.com')}
        >
          <View style={styles.iconWrapper}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"
                fill="#4ADE80"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardSubtitle}>eshan@gmail.com</Text>
          </View>
        </TouchableOpacity>

        {/* Phone Contact Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('tel:+94778519383')}
        >
          <View style={styles.iconWrapper}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                fill="#3B82F6"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Call Support</Text>
            <Text style={styles.cardSubtitle}>+94 (77) 8519383</Text>
          </View>
        </TouchableOpacity>

        {/* Live Chat Contact Card */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('https://ztech.com/chat')}
        >
          <View style={styles.iconWrapper}>
            <Svg height="24" width="24" viewBox="0 0 24 24">
              <Path
                d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z"
                fill="#FACC15"
              />
            </Svg>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>Live Chat</Text>
            <Text style={styles.cardSubtitle}>Available weekdays 8am-6pm</Text>
          </View>
        </TouchableOpacity>

        {/* Information Notice */}
        <View style={styles.noticeBox}>
  <View style={styles.noteHeader}>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="#4ADE80">
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </Svg>
    <Text style={styles.noteTitle}>Important Note</Text>
  </View>
  <Text style={styles.noticeText}>
    Our technical support team is available around the clock to assist
    with any issues related to your plant monitoring system.
  </Text>
</View>
      </View>
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
  noticeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4ADE80',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    top: 5,
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
    flex: 1,
    padding: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default Contact;