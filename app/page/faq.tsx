import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FAQ = ({ navigateToHome }: { navigateToHome: () => void }) => {
  const faqItems = [
    {
      question: "How often should I water my plants?",
      answer: "Our system automatically monitors soil moisture and waters when needed."
    },
    {
      question: "What plants are compatible?",
      answer: "Z-Tech works with most common houseplants and outdoor vegetation."
    },
    {
      question: "How do I reset my device?",
      answer: "Hold the power button for 10 seconds until the LED flashes red."
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>FAQ</Text>
      </View>

      <View style={styles.content}>
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base styles same as About screen
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  faqItem: {
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default FAQ;