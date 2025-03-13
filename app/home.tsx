import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Modal, StatusBar, Platform, Animated } from 'react-native';
import { Svg, Circle, Path, Rect } from 'react-native-svg';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';  // Add onValue

const Home = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSidebar, setShowSidebar] = useState(false);
  const [sensorData, setSensorData] = useState({
    humidity: 0,
    temperature: 0,
    soil_moisture: 0,
    relay_status: "OFF",
  });

  // Animation value for sidebar
  const sidebarAnim = useRef(new Animated.Value(-250)).current; // Initial position off-screen

  // Fetch real-time data from Firebase
  useEffect(() => {
    // Create a reference to your database path
    const dbRef = ref(database, 'sensor_data');
  
    // Set up the real-time listener
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          humidity: data.humidity,
          temperature: data.temperature,
          soil_moisture: data.soil_moisture,
          relay_status: data.relay_status,
        });
      }
    });
  
    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    if (showSidebar) {
      // Close sidebar with animation
      Animated.timing(sidebarAnim, {
        toValue: -250, // Move sidebar off-screen
        duration: 300, // Animation duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => setShowSidebar(false)); // Update state after animation completes
    } else {
      // Open sidebar with animation
      setShowSidebar(true);
      Animated.timing(sidebarAnim, {
        toValue: 0, // Move sidebar on-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Dark Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Sidebar with Animation */}
      {showSidebar && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: sidebarAnim }], // Animate the sidebar's horizontal position
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
            <TouchableOpacity style={styles.sidebarMenuItem}>
              <Text style={styles.sidebarMenuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarMenuItem}>
              <Text style={styles.sidebarMenuText}>About Z-Tech</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarMenuItem}>
              <Text style={styles.sidebarMenuText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.sidebarFooterItem}>
              <Text style={styles.sidebarFooterText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarFooterItem}>
              <Text style={styles.sidebarFooterText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.logoContainer}>
              <Text style={styles.logoText}>Z</Text>
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
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
              <Text style={styles.deviceInfoLabel}>Condition</Text>
              <View style={styles.conditionIndicator}>
                <View style={[styles.statusDot, { backgroundColor: sensorData.relay_status === "ON" ? '#4ADE80' : '#EF4444' }]} />
                <Text style={styles.deviceInfoValue}>
                  {sensorData.relay_status === "ON" ? 'Active' : 'Inactive'}
                </Text>
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
                  <Text style={styles.legendText}>Alarm</Text>
                </View>
              </View>
            </View>

            {/* Gauges */}
            <View style={styles.gaugesContainer}>
              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={`M 50 5 A 45 45 0 ${sensorData.soil_moisture > 50 ? 1 : 0} 1 50 95`}
                    stroke="#4ADE80"
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>{sensorData.soil_moisture}%</Text>
                <Text style={styles.gaugeDescription}>Soil moisture</Text>
              </View>
              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={`M 50 5 A 45 45 0 ${sensorData.temperature > 25 ? 1 : 0} 1 50 95`}
                    stroke="#3B82F6"
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>{sensorData.temperature}°C</Text>
                <Text style={styles.gaugeDescription}>Temperature</Text>
              </View>
              <View style={styles.gaugeItem}>
                <Svg height="80" width="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <Path
                    d={`M 50 5 A 45 45 0 ${sensorData.humidity > 50 ? 1 : 0} 1 50 95`}
                    stroke="#FACC15"
                    strokeWidth="10"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.gaugeLabel}>{sensorData.humidity}%</Text>
                <Text style={styles.gaugeDescription}>Humidity</Text>
              </View>
            </View>
          </View>

          {/* Plant Condition Chart */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWithDateContainer}>
                <Text style={styles.cardTitle}>Average plant condition</Text>
                <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
              </View>
              <TouchableOpacity style={styles.calendarIconContainer} onPress={() => setShowCalendar(true)}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M16 2V6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M8 2V6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M3 10H21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.barChartContainer}>
              <BarChart />
            </View>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
              <Text style={[styles.navText, styles.activeNavText]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Templates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Chatbot Icon */}
      <TouchableOpacity style={styles.chatbotIcon} onPress={() => console.log('Chatbot clicked')}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" fill="#4ADE80" />
          <Circle cx="12" cy="10" r="3" fill="white" />
          <Rect x="8" y="15" width="8" height="3" rx="1.5" fill="white" />
        </Svg>
      </TouchableOpacity>

      {/* Calendar Modal */}
      {showCalendar && (
        <Modal transparent={true} visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <SimplifiedCalendar
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                selectedDate={selectedDate}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
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
  chatbotIcon: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { width: '90%', backgroundColor: 'white', borderRadius: 16, padding: 16, maxHeight: '80%' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  calendarTitle: { fontSize: 18, fontWeight: 'bold' },
  closeButton: { fontSize: 20, color: '#6B7280' },
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
  sidebar: {
    width: 250,
    backgroundColor: '#F3F4F6',
    height: Dimensions.get('window').height, 
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sidebarLogoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4ADE80', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  sidebarLogoText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  sidebarTitle: { fontSize: 20, fontWeight: 'bold' },
  sidebarMenu: { marginTop: 20 },
  sidebarMenuItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sidebarMenuText: { fontSize: 16 },
  sidebarFooter: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 20 },
  sidebarFooterItem: { paddingVertical: 10 },
  sidebarFooterText: { fontSize: 16 },
});

export default Home;