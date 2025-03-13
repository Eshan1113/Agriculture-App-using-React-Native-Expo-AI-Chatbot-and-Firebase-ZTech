import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PlantData {
  answer?: string;
  confidence?: number;
  care_tips?: string[];
  error?: string;
}

const PlantCareBot = () => {
  const [query, setQuery] = useState('');
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(false);

  const DEEPSEEK_API_KEY = 'sk-0cf4905a22074509baba2a7f3e19e441'; // Your DeepSeek key
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Verify actual endpoint

  const searchPlants = async () => {
    try {
      setLoading(true);
      setPlantData(null);
      
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{
            role: "user",
            content: `Act as a plant care expert. Answer concisely: ${query}`
          }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        setPlantData({
          answer: data.choices[0].message.content,
          confidence: data.choices[0].confidence,
          care_tips: extractCareTips(data.choices[0].message.content)
        });
      } else {
        setPlantData({ error: "No relevant plant care information found" });
      }
    } catch (error) {
      console.error('API Error:', error);
      setPlantData({ error: "Failed to fetch plant care advice" });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format responses
  const extractCareTips = (text: string) => {
    return text.split('\n').filter(line => line.trim().length > 0);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask about plant care (e.g., 'How often to water orchids?')"
        value={query}
        onChangeText={setQuery}
        multiline
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={searchPlants}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Asking DeepSeek...' : 'Get Plant Advice'}
        </Text>
      </TouchableOpacity>

      {plantData && (
        <View style={styles.resultContainer}>
          {plantData.error ? (
            <Text style={styles.errorText}>{plantData.error}</Text>
          ) : (
            <>
              <Text style={styles.plantName}>DeepSeek's Advice:</Text>
              {plantData.care_tips?.map((tip, index) => (
                <Text key={index} style={styles.tipText}>
                  • {tip}
                </Text>
              ))}
              {plantData.confidence && (
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(plantData.confidence * 100)}%
                </Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

// Add these new styles
const styles = StyleSheet.create({
    container: {
        padding: 20,
      },
  tipText: {
    marginVertical: 4,
    lineHeight: 20,
  },
  confidenceText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#6B7280',
  },
  input: {
    height: 40,
    borderColor: '#4ADE80',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4ADE80',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#EF4444',
  },
  // Keep existing styles and add any new ones
});

export default PlantCareBot;