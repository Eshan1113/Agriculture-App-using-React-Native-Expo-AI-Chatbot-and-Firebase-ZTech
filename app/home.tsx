import React, { useState, useRef, useEffect } from 'react';
import { BlurView } from '@react-native-community/blur'; 
// import { BlurView } from 'expo-blur'; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
  Platform,
  Animated,

} from 'react-native';
import Slider from '@react-native-community/slider';

import { Svg, Circle, Path, Rect } from 'react-native-svg';
import { database } from './firebaseConfig';
import { ref, onValue, set } from 'firebase/database'; // Add set for writing to Firebase
import PlantCareBot from './PlantCareBot'; // Import your chatbot component
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = ({ navigateToProfileCustomization, navigateToLogin, navigateToFAQ, navigateToAbout, navigateToContact }: { 
  navigateToProfileCustomization: () => void,
  navigateToLogin: () => void,
  navigateToAbout: () => void;
  navigateToContact: () => void;
  navigateToFAQ: () => void,
  
 

}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isDeviceOnline, setIsDeviceOnline] = useState(true);
  const [notificationsViewed, setNotificationsViewed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const [chatbotKey, setChatbotKey] = useState(0); // For resetting chatbot state
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
  }>>([]);
  const [sensorData, setSensorData] = useState({
    humidity: 0,
    temperature: 0,
    soil_moisture: 0,
    relay_status: 'OFF',
  });
  const [soilMoistureThreshold, setSoilMoistureThreshold] = useState(50); // Default threshold

  // Animation value for sidebar
  const sidebarAnim = useRef(new Animated.Value(-250)).current;

  // Fetch real-time data from Firebase
  useEffect(() => {
    const dbRef = ref(database, 'sensor_data');
    const unsubscribeSensorData = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          humidity: data.humidity,
          temperature: data.temperature,
          soil_moisture: data.soil_moisture,
          relay_status: data.relay_status,
        });
        // Update last update time whenever new data arrives
        setLastUpdateTime(new Date());
        setIsDeviceOnline(true);
      }
    });
    useEffect(() => {
      const checkSession = async () => {
        try {
          const username = await AsyncStorage.getItem('username');
          const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
          
          if (!username || isLoggedIn !== 'true') {
            navigateToLogin();
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      };
  
      // Check immediately on mount
      checkSession();
      
      // Then check every 5 minutes
      const interval = setInterval(checkSession, 300000);
      return () => clearInterval(interval);
    }, []);
    // Fetch threshold from Firebase
    const thresholdRef = ref(database, 'sensor_data/moisture_threshold');
    const unsubscribeThreshold = onValue(thresholdRef, (snapshot) => {
      if (snapshot.exists()) {
        setSoilMoistureThreshold(snapshot.val());
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeSensorData();
      unsubscribeThreshold();
    };
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const diffMinutes = (now.getTime() - lastUpdateTime.getTime()) / 1000 / 60;

      if (diffMinutes > 1 && isDeviceOnline) {
        setIsDeviceOnline(false);
        setNotifications(prev => [
          {
            id: Date.now().toString(),
            message: 'Device offline - No recent updates',
            timestamp: new Date(),
            isRead: false
          },
          ...prev
        ]);
      } else if (diffMinutes <= 1 && !isDeviceOnline) {
        setIsDeviceOnline(true);
        setNotifications(prev => [
          {
            id: Date.now().toString(),
            message: 'Device back online',
            timestamp: new Date(),
            isRead: false
          },
          ...prev
        ]);
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [lastUpdateTime, isDeviceOnline]);


  // Update threshold in Firebase when slider changes
  const handleThresholdChange = (value: number) => {
    setSoilMoistureThreshold(value); // Update local state
    const thresholdRef = ref(database, 'sensor_data/moisture_threshold');
    set(thresholdRef, value); // Update Firebase
  };

  const toggleSidebar = () => {
    if (showSidebar) {
      Animated.timing(sidebarAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowSidebar(false));
    } else {
      setShowSidebar(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  const handleOutsideClick = () => {
    if (showSidebar) {
      toggleSidebar();
    }
  };
  const [sensorReadings, setSensorReadings] = useState<Array<{
    temperature: number;
    soil_moisture: number;
    humidity: number;
  }>>([]);
  const [averages, setAverages] = useState<{
    temperature: number;
    soil_moisture: number;
    humidity: number;
  }>({ temperature: 0, soil_moisture: 0, humidity: 0 });

  // Add this useEffect for calculating averages
  useEffect(() => {
    if (!isDeviceOnline) return; // Stop calculating if device is offline

    const newReading = {
      temperature: sensorData.temperature,
      soil_moisture: sensorData.soil_moisture,
      humidity: sensorData.humidity
    };

    setSensorReadings(prev => {
      const updatedReadings = [...prev, newReading];

      if (updatedReadings.length === 10) {
        const avgTemp = updatedReadings.reduce((sum, reading) => sum + reading.temperature, 0) / 10;
        const avgMoisture = updatedReadings.reduce((sum, reading) => sum + reading.soil_moisture, 0) / 10;
        const avgHumidity = updatedReadings.reduce((sum, reading) => sum + reading.humidity, 0) / 10;

        setAverages({
          temperature: avgTemp,
          soil_moisture: avgMoisture,
          humidity: avgHumidity
        });

        return [];
      }
      return updatedReadings;
    });
  }, [sensorData, isDeviceOnline]); // This will trigger every time sensorData updates

  // Add this state for the timer
  const [timer, setTimer] = useState(10);

  // Add this useEffect for the countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notificationsViewed) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setNotificationsViewed(false);
    }
  }, [notificationsViewed]);

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

    {/* Semi-Transparent Overlay */}
    {showSidebar && (
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1} // Prevent flickering
        onPress={handleOutsideClick}
      />
    )}

  {/* Sidebar */}
{showSidebar && (
  <Animated.View
    style={[
      styles.sidebar,
      {
        transform: [{ translateX: sidebarAnim }],
      },
    ]}
  >
    <View style={styles.sidebarHeader}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarLogoContainer}>
        <Text style={styles.sidebarLogoText}>Z</Text>
      </TouchableOpacity>
      <Text style={styles.sidebarTitle}>Z-Tech</Text>
    </View>

    <View style={styles.sidebarMenu}>
      <TouchableOpacity 
        style={styles.sidebarMenuItem}
        onPress={navigateToProfileCustomization}
      >
        <Text style={styles.sidebarMenuText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.sidebarMenuItem}
        onPress={navigateToAbout}
      >
        <Text style={styles.sidebarMenuText}>About Z-Tech</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.sidebarMenuItem}
        onPress={navigateToContact}
      >
        <Text style={styles.sidebarMenuText}>Contact Support</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.sidebarFooter}>
      <TouchableOpacity 
        style={styles.sidebarFooterItem}
        onPress={navigateToFAQ}
      >
        <Text style={styles.sidebarFooterText}>FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.sidebarFooterItem}
        onPress={navigateToLogin}
      >
        <Text style={styles.sidebarFooterText}>Log out</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
)}

      {/* Notification Panel */}
      {showNotifications && (
        <View style={styles.notificationPanel}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationPanelTitle}>Notifications</Text>
            <View style={styles.notificationActions}>
              <TouchableOpacity
                onPress={() => {
                  setNotifications([]);
                  setNotificationsViewed(true);
                }}
                style={styles.clearButton}
              >
                <Svg width="20" height="20" viewBox="0 0 24 24">
                  <Path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    fill="#6B7280"
                  />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

          </View>
          <ScrollView style={styles.notificationList}>
            {notifications.length === 0 ? (
              <Text style={styles.noNotificationsText}>No notifications</Text>
            ) : (
              notifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.isRead && styles.unreadNotification
                  ]}
                >
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {notification.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              ))
            )}
            {/* Add Device Status Notification */}
            {!isDeviceOnline && (
              <View style={[styles.notificationItem, styles.unreadNotification]}>
                <Text style={styles.notificationMessage}>
                  ⚠️ Device offline - Last update: {lastUpdateTime.toLocaleTimeString()}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header with Notification Bell */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.logoContainer}>
              <Text style={styles.logoText}>Z</Text>
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <TouchableOpacity
              style={styles.notificationIconContainer}
              onPress={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  // Mark all notifications as read when opening
                  setNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true }))
                  );
                  setNotificationsViewed(true);
                }
              }}
            >
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                  fill={
                    notifications.some(n => !n.isRead) ? '#FACC15' : '#4B5563'
                  }
                />
              </Svg>
              {notifications.some(n => !n.isRead) && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notifications.filter(n => !n.isRead).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>



          {/* Device Info Card */}
          <View style={styles.card}>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Device name</Text>
              <Text style={styles.deviceInfoValue}>Plant Monitor X3</Text>
            </View>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Location</Text>
              <Text style={styles.deviceInfoValue}>Living Room</Text>
            </View>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Motor status</Text>
              <View style={styles.conditionIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: sensorData.relay_status === 'ON' ? '#4ADE80' : '#EF4444' },
                  ]}
                />
                <Text style={styles.deviceInfoValue}>
                  {sensorData.relay_status === 'ON' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>



          <View style={styles.averagesContainer}>
            <View style={styles.averagesHeader}>
              <Text style={styles.averagesTitle}>10-Second Averages</Text>
              <View style={styles.timerContainer}>
                <Svg height="20" width="20" viewBox="0 0 24 24">
                  <Path
                    d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    fill="#4B5563"
                  />
                  <Path
                    d="M13 7h-2v6h6v-2h-4z"
                    fill="#4B5563"
                  />
                </Svg>
                <Text style={styles.timerText}>{timer}s</Text>
              </View>
            </View>
            <View style={styles.averageRow}>
              <View style={styles.averageBox}>
                <Text style={styles.averageValue}>{averages.temperature.toFixed(1)}°C</Text>
                <Text style={styles.averageLabel}>Temperature</Text>
              </View>
              <View style={styles.averageBox}>
                <Text style={styles.averageValue}>{averages.soil_moisture.toFixed(1)}%</Text>
                <Text style={styles.averageLabel}>Soil Moisture</Text>
              </View>
              <View style={styles.averageBox}>
                <Text style={styles.averageValue}>{averages.humidity.toFixed(1)}%</Text>
                <Text style={styles.averageLabel}>Humidity</Text>
              </View>
            </View>
          </View>

          {/* Statistics Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Statistics</Text>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.legendText}>Low</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4ADE80' }]} />
                  <Text style={styles.legendText}>Healthy</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FACC15' }]} />
                  <Text style={styles.legendText}>Warning</Text>
                </View>
              </View>
            </View>



            {/* Gauges */}
            <View style={styles.gaugesContainer}>
              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={calculateArc(sensorData.soil_moisture, 100).path}
                    stroke={getSoilMoistureColor(sensorData.soil_moisture, soilMoistureThreshold)}
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>
                  {calculateArc(sensorData.soil_moisture, 100).percentage}%
                </Text>
                <Text style={styles.gaugeDescription}>Soil moisture</Text>
              </View>

              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={calculateArc(sensorData.temperature, 50).path}
                    stroke={getTemperatureColor(sensorData.temperature)}
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>{sensorData.temperature}°C</Text>
                <Text style={styles.gaugeDescription}>Temperature</Text>
              </View>

              {/* Humidity Gauge */}
              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={calculateArc(sensorData.humidity, 100).path}
                    stroke={getHumidityColor(sensorData.humidity)}
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>
                  {calculateArc(sensorData.humidity, 100).percentage}%
                </Text>
                <Text style={styles.gaugeDescription}>Humidity</Text>
              </View>
            </View>

            {/* Soil Moisture Threshold Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                Soil Moisture Threshold: {soilMoistureThreshold}%
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={soilMoistureThreshold}
                onValueChange={isDeviceOnline ? handleThresholdChange : undefined}
                disabled={!isDeviceOnline}
                minimumTrackTintColor={isDeviceOnline ? '#4ADE80' : '#D1D5DB'}
                maximumTrackTintColor={isDeviceOnline ? '#E5E7EB' : '#E5E7EB'}
                thumbTintColor={isDeviceOnline ? '#4ADE80' : '#D1D5DB'}
              />
            </View>

          </View>

        </View>

        
      </ScrollView >
      

      {/* Chatbot Modal */}
      <PlantCareBot />
    </SafeAreaView>
  );
};
const getSoilMoistureColor = (current: number, threshold: number) => {
  return current <= threshold + 5 ? '#4ADE80' : '#FACC15';
};
const getTemperatureColor = (temp: number) => {
  if (temp > 35) return '#FACC15'; // Alarm
  if (temp >= 20 && temp <= 35) return '#4ADE80'; // Healthy
  return '#3B82F6'; // Low
};

const getHumidityColor = (humidity: number) => {
  if (humidity > 70) return '#FACC15'; // Alarm
  if (humidity >= 60 && humidity <= 70) return '#4ADE80'; // Healthy
  return '#3B82F6'; // Low
};
const calculateArc = (value: number, max: number) => {
  const percentage = Math.min(value / max, 1);
  const angle = percentage * 360;
  const radians = (angle * Math.PI) / 180;
  const x = 50 + 45 * Math.sin(radians);
  const y = 50 - 45 * Math.cos(radians);
  return {
    path: `M 50 5 A 45 45 0 ${angle > 180 ? 1 : 0} 1 ${x} ${y}`,
    percentage: Math.round(percentage * 100)
  };
};
const SimplifiedCalendar = ({ onSelectDate, selectedDate }: { onSelectDate: (date: Date) => void; selectedDate: Date }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const getDayArray = () => {
    const days = Array(firstDayOfMonth).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isSelectedDay = (day: number) => day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() && currentMonth.getFullYear() === selectedDate.getFullYear();

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarNavigation}>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
          <Text style={styles.calendarNavButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.calendarMonth}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
          <Text style={styles.calendarNavButton}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekdaysContainer}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={styles.weekday}>{day}</Text>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {getDayArray().map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayButton, isSelectedDay(day) && styles.selectedDay]}
            onPress={() => day && onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            disabled={!day}
          >
            {day && <Text style={[styles.dayText, isSelectedDay(day) && styles.selectedDayText]}>{day}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const BarChart = () => {
  const data = [
    { day: 10, value: 20, color: '#3B82F6' },
    { day: 11, value: 35, color: '#4ADE80' },
    { day: 12, value: 45, color: '#4ADE80' },
    { day: 13, value: 30, color: '#4ADE80' },
    { day: 14, value: 25, color: '#4ADE80' },
    { day: 15, value: 40, color: '#4ADE80' },
    { day: 16, value: 15, color: '#3B82F6' },
    { day: 17, value: 85, color: '#FACC15' },
  ];

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={[styles.bar, { height: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }]} />
          <Text style={styles.barLabel}>{item.day}</Text>
        </View>
      ))}
    </View>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android status bar
  },
  averagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 4,
  },
  sliderContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
  },

  averagesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  averagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  averageBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '30%',
  },
  averageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  averageLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Add these styles to your StyleSheet
  notificationIconContainer: {
    position: 'relative',
    marginLeft: 'auto',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationPanel: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 300,
    maxHeight: 400,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    paddingHorizontal: 8,
  },
  notificationList: {
    maxHeight: 300,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadNotification: {
    backgroundColor: '#FEF3C7',
  },
  notificationMessage: {
    color: '#111827',
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  noNotificationsText: {
    color: '#6B7280',
    textAlign: 'center',
    padding: 16,
  },

  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    padding: 4,
  },
  chatbotBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatbotIcon: {
    position: 'absolute', // Position it absolutely
    bottom: 20, // Distance from the bottom
    right: 20, // Distance from the right
    width: 56, // Size of the icon container
    height: 56, // Size of the icon container
    borderRadius: 28, // Make it circular
    backgroundColor: '#4ADE80', // Green background color
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
    shadowColor: '#000', // Add shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
  },
  chatbotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatbotTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  chatbotModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 999, // Below the sidebar but above other content
  },
  sidebar: {
    width: 250,
    backgroundColor: 'rgba(243, 244, 246, 0.81)', // Semi-transparent background
    height: Dimensions.get('window').height,
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000, // Above the overlay
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidebarLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sidebarLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarMenu: {
    marginTop: 20,
  },
  sidebarMenuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidebarMenuText: {
    fontSize: 16,
  },
  sidebarFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  sidebarFooterItem: {
    paddingVertical: 10,
  },
  sidebarFooterText: {
    fontSize: 16,
  },
  scrollView: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4ADE80', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  dashboardTitle: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  deviceInfoRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deviceInfoLabel: { fontSize: 14, color: '#4B5563' },
  deviceInfoValue: { fontSize: 14, fontWeight: '500', color: '#111827' },
  conditionIndicator: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  titleWithDateContainer: { flexDirection: 'column' },
  selectedDateText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  calendarIconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  legendContainer: { flexDirection: 'row' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendText: { fontSize: 12, color: '#6B7280' },
  gaugesContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  gaugeItem: { alignItems: 'center', width: (Dimensions.get('window').width - 64) / 3, marginBottom: 8 },
  gaugeLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  gaugeDescription: { fontSize: 12, color: '#6B7280' },
  barChartContainer: { height: 160, marginTop: 8 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' },
  barContainer: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: 16, borderRadius: 4, marginBottom: 8 },
  barLabel: { fontSize: 12, color: '#6B7280' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 24, marginTop: 8, marginBottom: 16 },
  navItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeNavItem: { backgroundColor: 'white', borderRadius: 24 },
  navText: { fontSize: 14, color: '#6B7280' },
  activeNavText: { color: '#111827', fontWeight: 'bold' },
  // chatbotIcon: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { width: '90%', backgroundColor: 'white', borderRadius: 16, padding: 16, maxHeight: '80%' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  calendarTitle: { fontSize: 18, fontWeight: 'bold' },
  // closeButton: { fontSize: 20, color: '#6B7280' },
  calendar: { width: '100%' },
  calendarNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarNavButton: { fontSize: 18, fontWeight: 'bold', color: '#4ADE80', padding: 8 },
  calendarMonth: { fontSize: 16, fontWeight: 'bold' },
  weekdaysContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  weekday: { fontSize: 12, color: '#6B7280', textAlign: 'center', width: '14.28%' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dayButton: { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  dayText: { fontSize: 14 },
  selectedDay: { backgroundColor: '#4ADE80', borderRadius: 20 },
  selectedDayText: { color: 'white', fontWeight: 'bold' },
  
});

export default Home;