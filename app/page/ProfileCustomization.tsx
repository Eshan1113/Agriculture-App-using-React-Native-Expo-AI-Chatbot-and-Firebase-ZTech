import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  BackHandler,
  ImageBackground,
  Dimensions
} from 'react-native';
import { database } from '../firebaseConfig';
import { ref, get, update, remove, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { digestStringAsync, CryptoDigestAlgorithm } from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
const ProfileCustomization = ({ navigateToHome }: { 
  navigateToHome: () => void 
}) => {
  const [userData, setUserData] = useState<{username?: string, email?: string}>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const backAction = () => {
      navigateToHome();
      return true; // Event එක handle කරන බව පෙන්වයි
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

   
    const fetchUserData = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          const userRef = ref(database, `users/${username}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setNewUsername(data.username || '');
            setNewEmail(data.email || '');
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    return () => backHandler.remove(); // Cleanup function
  }, []);

  const hashPassword = async (password: string) => {
    return await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!newUsername.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (newPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required';
        isValid = false;
      }
      if (newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const originalUsername = await AsyncStorage.getItem('username');
      
      if (!originalUsername) return;

      const userRef = ref(database, `users/${originalUsername}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      // Verify current password if changing password
      if (newPassword) {
        const currentHash = await hashPassword(currentPassword);
        if (currentHash !== userData.password) {
          Alert.alert('Error', 'Current password is incorrect');
          return;
        }
      }

      const updateData: any = {
        username: newUsername,
        email: newEmail
      };

      // If changing password
      if (newPassword) {
        updateData.password = await hashPassword(newPassword);
      }

      if (newUsername !== originalUsername) {
        const usernameRef = ref(database, `users/${newUsername}`);
        const snapshot = await get(usernameRef);
        
        if (snapshot.exists()) {
          Alert.alert('Error', 'Username already exists');
          return;
        }

        // Copy data to new username
        await set(ref(database, `users/${newUsername}`), {
          ...userData,
          ...updateData
        });

        // Remove old data
        await remove(userRef);
        await AsyncStorage.setItem('username', newUsername);
      } else {
        await update(userRef, updateData);
      }

      Alert.alert('Success', 'Profile updated successfully');
      setUserData(updateData);
      setEditing(false);
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewUsername(userData.username || '');
    setNewEmail(userData.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditing(false);
    setErrors({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4CD964" />
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* Top Gradient Header */}
      <LinearGradient
        colors={['#3CB371', '#4ADE80']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
            <View style={styles.backButtonCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="#3CB371" />
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Profile Settings</Text>
          
          {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={loading}
            >
              <Text style={styles.buttonText1}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={[styles.button, styles.editButton]}
          >
            <Text style={styles.buttonText1}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

        
        {/* Profile avatar placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="50" fill="#E0F2F1" />
              <Circle cx="50" cy="40" r="20" fill="#2E7D32" />
              <Path d="M20,85 C20,65 80,65 80,85" fill="#2E7D32" strokeWidth="1" />
            </Svg>
          </View>
          <Text style={styles.welcomeText}>
            Welcome {userData.username || 'Plant Parent'}!
          </Text>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputWrapper, editing && styles.inputWrapperActive]}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                editable={editing}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, editing && styles.inputWrapperActive]}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                editable={editing}
                keyboardType="email-address"
                placeholder="Enter email"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {editing && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change Password</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperActive]}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPassword.current}
                  placeholder="Required for password changes"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => ({...prev, current: !prev.current}))}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword.current ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperActive]}>
                <Ionicons name="key-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword.new}
                  placeholder="Leave blank to keep current"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => ({...prev, new: !prev.new}))}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword.new ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperActive]}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword.confirm}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => ({...prev, confirm: !prev.confirm}))}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword.confirm ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.helpText}>
              Password must be at least 6 characters
            </Text>
          </View>
        )}
        
        <Text style={styles.footerText}>
          {editing ? "Tap 'Save' to update your profile" : "Tap 'Edit' to make changes"}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF8',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonText1: {
    fontWeight: '600',
    fontSize: 16,
    color: '#3CB371',
  },
  cancelButton: {
    backgroundColor: '#3B82F6', // White color
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#F0FDF4',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputWrapperActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4ADE80',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },


  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
  },
  passwordField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProfileCustomization;