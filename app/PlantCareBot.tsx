import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PlantData {
  common_name?: string;
  scientific_name?: string;
  watering?: string;
  sunlight?: string[];
  care_level?: string;
  error?: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  plantData?: PlantData;
}

const PlantCareBot = () => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your Plant Care Assistant. Ask me about any plant and I'll help you care for it!",
      isUser: false
    }
  ]);
  const scrollViewRef = useRef<ScrollView>(null);
  const PERENUAL_API_KEY = 'sk-5w1O67d33a895860c9145'; // Use your actual key here

  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  useEffect(() => {
    // Start the animations when component mounts
    startIconAnimations();
  }, []);

  const startIconAnimations = () => {
    // Create bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Create pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const searchPlants = async (plantQuery: string) => {
    try {
      setLoading(true);

      // Add user message
      const userMessageId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: userMessageId,
        text: plantQuery,
        isUser: true
      }]);

      // Show typing indicator
      setMessages(prev => [...prev, {
        id: 'typing',
        text: '',
        isUser: false
      }]);

      const response = await fetch(
        `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(plantQuery)}`
      );

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      if (data.data && data.data.length > 0) {
        const plantData = data.data[0];
        const botResponse = `I found information about ${plantData.common_name}!`;

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isUser: false,
          plantData: plantData
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "I couldn't find any plants matching that name. Could you try a different name or be more specific?",
          isUser: false
        }]);
      }
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to my plant database right now. Please try again later.",
        isUser: false
      }]);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    searchPlants(input);
    setInput('');
  };

  const renderPlantCard = (plantData: PlantData) => {
    return (
      <View style={styles.plantCard}>
        <Text style={styles.plantName}>{plantData.common_name || 'Unknown Plant'}</Text>
        
        <Text style={styles.plantDetail}>
          <Text style={styles.detailLabel}>Scientific Name: </Text>
          {plantData.scientific_name || 'Not specified'}
        </Text>
        
        <Text style={styles.plantDetail}>
          <Text style={styles.detailLabel}>Watering: </Text>
          {plantData.watering || 'Not specified'}
        </Text>
        
        <Text style={styles.plantDetail}>
          <Text style={styles.detailLabel}>Sunlight: </Text>
          {Array.isArray(plantData.sunlight) ? plantData.sunlight.join(', ') : 'Not specified'}
        </Text>
        
        <Text style={styles.plantDetail}>
          <Text style={styles.detailLabel}>Care Level: </Text>
          {plantData.care_level || 'Not specified'}
        </Text>
      </View>
    );
  };

  const renderMessage = (message: Message) => {
    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.botBubble,
          message.id === 'typing' ? styles.typingBubble : null
        ]}
      >
        {message.id === 'typing' ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={message.isUser ? styles.userText : styles.botText}>
              {message.text}
            </Text>
            {message.plantData && renderPlantCard(message.plantData)}
          </>
        )}
      </View>
    );
  };

  // Combine animations for the floating icon
  const iconAnimatedStyle = {
    transform: [
      { translateY: bounceAnim },
      { scale: pulseAnim }
    ]
  };

  return (
    <View>
      {/* Animated Chatbot Icon */}
      <Animated.View style={iconAnimatedStyle}>
        <TouchableOpacity
          style={styles.chatbotIcon}
          onPress={() => setVisible(true)}
        >
          <Svg height="24" width="24" viewBox="0 0 24 24">
            <Path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14h12v2H6v-2zm0-3h12v2H6v-2zm0-3h12v2H6V8z"
              fill="#FFFFFF"
            />
          </Svg>
        </TouchableOpacity>
      </Animated.View>

      {/* Chatbot Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.chatbotAvatarContainer}>
                <View style={styles.chatbotAvatar}>
                  <Svg height="20" width="20" viewBox="0 0 24 24">
                    <Path
                      d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zm0 0c0-4.97-4.03-9-9-9 0 4.97 4.03 9 9 9zm0-18c-4.97 0-9 4.03-9 9 4.97 0 9-4.03 9-9zm0 0c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"
                      fill="#FFFFFF"
                    />
                  </Svg>
                </View>
                <Text style={styles.modalTitle}>Plant Care Assistant</Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map(renderMessage)}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={100}
            >
              <View style={styles.inputContainer}>
                <TextInput

                  style={styles.input}
                  placeholder="Ask about a plant (e.g., 'rose' or 'monstera')"
                  placeholderTextColor="#9CA3AF"
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                  onPress={handleSend}
                  disabled={loading || input.trim() === ''}
                >
                  <Svg height="24" width="24" viewBox="0 0 24 24">
                    <Path
                      d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                      fill={(loading || input.trim() === '') ? '#6B7280' : '#FFFFFF'}
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chatbotIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4ADE80',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    maxHeight: '80%',
    flex: 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#4ADE80',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  chatbotAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatbotAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3BAE70',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typingBubble: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    color: '#000000',
  },
  botText: {
    color: '#000000',
  },
  plantCard: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4ADE80',
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  plantDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#4B5563',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  scientificNameText: {
    fontStyle: 'italic',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
  },
});

export default PlantCareBot;