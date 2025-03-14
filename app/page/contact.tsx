import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Contact = ({ navigateToHome }: { navigateToHome: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contact Support</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>24/7 Support Options</Text>
        
        <TouchableOpacity 
          style={styles.contactOption}
          onPress={() => Linking.openURL('mailto:support@ztech.com')}
        >
          <Text style={styles.optionText}>📧 Email: support@ztech.com</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactOption}
          onPress={() => Linking.openURL('tel:+1234567890')}
        >
          <Text style={styles.optionText}>📞 Call: +1 (234) 567-890</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Our team typically responds within 1 business hour
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base styles same as About screen
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#3B82F6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  contactOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  note: {
    marginTop: 24,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});

export default Contact;