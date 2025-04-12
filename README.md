# Z-Tech Smart Farming Solution

## Overview
Z-Tech Smart Farming Solution is an innovative mobile application integrated with an IoT device for smart farming. This solution helps optimize plant growth by monitoring soil moisture, temperature, and humidity levels. The app allows users to interact with the IoT device, control the irrigation system, and receive real-time sensor data.

### Built With:
- **React Native (Expo)**
- **Arduino IDE** (for programming the IoT device)
- **Firebase** (for real-time data synchronization)
- **ESP32 Module** (for Wi-Fi connectivity)

---

## Features

### Mobile Application Features:
- **User Registration & Authentication**:
  - Sign up via email/password or Google authentication.
  - Supports both English and Sinhala languages.

- **Dashboard & Sensor Data**:
  - View real-time sensor data: soil moisture, temperature, humidity.
  - View average readings every 60 seconds fetched from Firebase.

- **Automated Irrigation & Humidity Control**:
  - Control the water pump and exhaust fan based on user preferences for soil moisture and humidity.

- **Chatbot Support**:
  - Ask questions about plants, diseases, and farming techniques.

- **Profile Management**:
  - Update username, email, and password.

- **Notification System**:
  - Receive alerts if the IoT device goes offline due to power failure or network issues.

### IoT Device Features:
- **Power Options**:
  - Rechargeable battery, 12V DC power supply, or solar charging.

- **Display & Connectivity**:
  - Displays real-time sensor data.
  - Connects via Wi-Fi using the ESP32 module.

- **Offline Mode & AP Mode**:
  - Automatically switches to AP mode if the Wi-Fi connection is lost.
  - Display local IP for browser access to sensor data.

- **Reset Functionality**:
  - Allows users to reset the device and reconnect to the network.

- **Data Management**:
  - Stores sensor data (temperature, soil moisture, and humidity) in Firebase every 60 seconds.
  - Syncs user preferences from the mobile app to the IoT device.

---

## Technologies Used

### Frontend
- **React Native (Expo)**: Used for building the mobile app for cross-platform support (Android and iOS).
- **Firebase**: Real-time database for storing and syncing sensor data.
  
### Backend
- **Arduino IDE**: Programmed the IoT device using an ESP32 module for sensor data acquisition and Wi-Fi connectivity.

### IoT Device
- **ESP32**: A Wi-Fi-enabled microcontroller used to connect to the internet and communicate with the mobile app.
- **Sensors**: Soil moisture, temperature, and humidity sensors for real-time data.

---

## Installation Instructions

### Prerequisites:
- **Node.js** installed on your machine.
- **Expo CLI** installed globally (`npm install -g expo-cli`).
- **Arduino IDE** installed for IoT programming.
- **Firebase account** for setting up real-time data storage.

### Clone the Repository:
```bash
git clone https://github.com/your-username/z-tech-smart-farming.git
cd z-tech-smart-farming
```

### Install Dependencies:
```bash
npm install
```

### Firebase Configuration:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project.
3. Set up Firebase Realtime Database for storing sensor data.
4. Add Firebase credentials (API keys, etc.) to your project:
   - Replace the `google-services.json` for Android.
   - Replace `GoogleService-Info.plist` for iOS (if applicable).
   
### Run the App:
```bash
expo start
```
You can now open the app on an Android or iOS emulator, or scan the QR code using the Expo Go app on your phone.

---

## IoT Device Setup

1. **Connect the Sensors**: Connect the soil moisture, temperature, and humidity sensors to the ESP32 board.
2. **Upload the Arduino Sketch**:
   - Open Arduino IDE.
   - Upload the sketch code (found in `arduino/` folder in the repository) to the ESP32 board.
3. **Connect to Wi-Fi**:
   - Ensure the IoT device is connected to the Wi-Fi network.
   - If the network goes down, the device will switch to Access Point (AP) mode, and the user can reconnect using the app.
4. **Monitor Data**: The ESP32 will send sensor data to Firebase every 60 seconds.

---

## Folder Structure

```
/MY-APP
  ├── /.expo               # Expo-specific files
  ├── /app                 # App source code
      ├── /assets          # Images and icons
      ├── /components      # React components for the app
      ├── /constants       # App constants like strings, themes, etc.
      ├── /hooks           # Custom React hooks
  ├── /node_modules        # NPM packages
  ├── /scripts             # Custom scripts for your app
  ├── .gitignore           # Git ignore configuration
  ├── app.json             # Expo app configuration
  ├── eas.json             # Expo Application Services configuration
  ├── expo-env.d.ts        # TypeScript environment configuration for Expo
  ├── package.json         # NPM dependencies and scripts
  ├── package-lock.json    # NPM lock file
  ├── README.md            # Project README file
  ├── tsconfig.json        # TypeScript configuration
```

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## License


---

## Acknowledgements
- ESP32 Documentation: [ESP32 Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- Firebase: [Firebase Docs](https://firebase.google.com/docs)

---

## Terms and Privacy Policy

### Terms of Service:
- **Acceptance of Terms**: By accessing or using the Z-Tech Smart Farming Solution ("Service"), you agree to be bound by these Terms of Service.
- **Description of Service**: Z-Tech provides a smart farming solution that monitors soil moisture, temperature, and humidity levels to help optimize plant growth.
- **User Responsibilities**: You must provide accurate registration information. You are responsible for maintaining the confidentiality of your account.
- **Intellectual Property**: All content and technology included on the Service are the property of Z-Tech and protected by intellectual property laws.
- **Limitation of Liability**: Z-Tech shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.

### Privacy Policy:
- **Information We Collect**: We collect personal information you provide when registering, including username, email address, and password (hashed for security).
- **How We Use Your Information**: To provide and maintain our Service, notify you about changes, and provide customer support.
- **Data Security**: We implement technical measures to protect your personal information, including hashed passwords.
- **Data Retention**: We retain personal information only for as long as necessary.
- **Your Rights**: You have the right to access, correct, or delete your personal data. You may also request a copy of your data or withdraw consent at any time.

---
