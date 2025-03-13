import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PlantData {
  common_name?: string;
  scientific_name?: string;
  watering?: string;
  sunlight?: string[];
  care_level?: string;
  error?: string;
}

const PlantCareBot = () => {
  const [query, setQuery] = useState('');
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(false);

  const PERENUAL_API_KEY = 'sk-5w1O67d33a895860c9145'; // Use your actual key here

  const searchPlants = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setPlantData(data.data[0]);
      } else {
        setPlantData({ error: "No plant found with that name" });
      }
    } catch (error) {
      console.error('API Error:', error);
      setPlantData({ error: "Failed to fetch plant data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a plant (e.g., 'rose' or 'succulent')"
        value={query}
        onChangeText={setQuery}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={searchPlants}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Searching...' : 'Get Plant Info'}
        </Text>
      </TouchableOpacity>

      {plantData && (
        <View style={styles.resultContainer}>
          {plantData.error ? (
            <Text style={styles.errorText}>{plantData.error}</Text>
          ) : (
            <>
              <Text style={styles.plantName}>{plantData.common_name}</Text>
              <Text>Scientific Name: {plantData.scientific_name}</Text>
              <Text>Watering: {plantData.watering}</Text>
              <Text>Sunlight: {plantData.sunlight?.join(', ')}</Text>
              <Text>Care Level: {plantData.care_level}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
});

export default PlantCareBot;