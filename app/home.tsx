import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database, auth } from './firebaseConfig';

interface HomeProps {
  navigateToLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {
  const [sensorData, setSensorData] = useState<{ [key: string]: any }>({});
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controlLoading, setControlLoading] = useState(false);

  // Fetch real-time data from Firebase
  useEffect(() => {
    const dataRef = database().ref('/sensorData');
    const statusRef = database().ref('/deviceStatus');

    dataRef.on('value', snapshot => {
      setSensorData(snapshot.val() || {});
      setLoading(false);
    });

    statusRef.on('value', snapshot => {
      setDeviceStatus(snapshot.val());
    });

    return () => {
      dataRef.off();
      statusRef.off();
    };
  }, []);

  const handleDeviceControl = async () => {
    try {
      setControlLoading(true);
      await database().ref('/deviceStatus').set(!deviceStatus);
    } catch (error) {
      setError((error as any).message);
    } finally {
      setControlLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigateToLogin();
    } catch (error) {
      setError((error as any).message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CD964" />
        <Text style={styles.loadingText}>Loading Sensor Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={styles.logoPrefix}>Z-</Text>
          <Text style={styles.logoSuffix}>Tech</Text>
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Sensor Data Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensor Readings</Text>
          <View style={styles.dataGrid}>
            {Object.entries(sensorData).map(([key, value]) => (
              <View key={key} style={styles.dataCard}>
                <Text style={styles.dataLabel}>{key}</Text>
                <Text style={styles.dataValue}>{value}</Text>
                <Text style={styles.dataUnit}>{getUnit(key)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Device Control Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Control</Text>
          <TouchableOpacity 
            style={[styles.controlButton, deviceStatus && styles.activeButton]}
            onPress={handleDeviceControl}
            disabled={controlLoading}
          >
            {controlLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {deviceStatus ? 'Turn Off Device' : 'Turn On Device'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4CD964" />
          <Text style={styles.infoText}>
            Connected to device: {deviceStatus ? 'Online' : 'Offline'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to display units
const getUnit = (sensorType: string) => {
  switch (sensorType.toLowerCase()) {
    case 'temperature': return '°C';
    case 'humidity': return '%';
    case 'pressure': return 'hPa';
    default: return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    color: '#4CD964',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CD964',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  logoPrefix: {
    color: '#fff',
  },
  logoSuffix: {
    color: '#fff',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dataLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CD964',
  },
  dataUnit: {
    color: '#999',
    fontSize: 12,
  },
  controlButton: {
    backgroundColor: '#4CD964',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    marginLeft: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#ffeeee',
    marginHorizontal: 20,
    borderRadius: 8,
  },
});

export default Home;