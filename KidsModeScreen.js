import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function KidsModeScreen({ navigation }) {
  const [pairingCode, setPairingCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const inputRef = useRef(null);

  const handleCodeChange = (text) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPairingCode(numericText);
  };

  const handleConnect = () => {
    if (pairingCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit pairing code');
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      // In a real app, this would validate the code with the parent device
      // For demo purposes, we'll accept any 6-digit code
      navigation.navigate('Connection', { 
        mode: 'child', 
        pairingCode: pairingCode 
      });
    }, 2000);
  };

  const handleClearCode = () => {
    setPairingCode('');
    inputRef.current?.focus();
  };

  const formatCodeDisplay = (code) => {
    // Add spaces between digits for better readability
    return code.split('').join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Kids Mode</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit pairing code provided by your parent
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pairing Code</Text>
            <View style={styles.codeInputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.codeInput}
                value={formatCodeDisplay(pairingCode)}
                onChangeText={handleCodeChange}
                placeholder="0 0 0 0 0 0"
                placeholderTextColor="#bdc3c7"
                keyboardType="numeric"
                maxLength={11} // 6 digits + 5 spaces
                autoFocus={true}
                editable={!isConnecting}
                textAlign="center"
              />
            </View>
            
            {pairingCode.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearCode}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statusContainer}>
            {isConnecting ? (
              <View style={styles.connectingContainer}>
                <Text style={styles.connectingText}>🔄 Connecting to parent...</Text>
                <Text style={styles.connectingSubtext}>
                  Establishing secure connection with code: {pairingCode}
                </Text>
              </View>
            ) : (
              <View style={styles.readyContainer}>
                <Text style={styles.readyText}>📱 Ready to Connect</Text>
                <Text style={styles.readySubtext}>
                  Enter the code and press "Connect" to start
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.connectButton,
                (pairingCode.length !== 6 || isConnecting) && styles.disabledButton
              ]}
              onPress={handleConnect}
              disabled={pairingCode.length !== 6 || isConnecting}
            >
              <Text style={[
                styles.connectButtonText,
                (pairingCode.length !== 6 || isConnecting) && styles.disabledButtonText
              ]}>
                {isConnecting ? 'Connecting...' : 'Connect to Parent'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What happens next:</Text>
            <Text style={styles.infoText}>• Your parent will be able to monitor this device</Text>
            <Text style={styles.infoText}>• You'll be asked to grant permissions</Text>
            <Text style={styles.infoText}>• All data is sent directly to your parent</Text>
            <Text style={styles.infoText}>• No information is stored on external servers</Text>
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡 Ask your parent for the 6-digit code if you don't have it
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
  },
  codeInputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#50C878',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  codeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingVertical: 20,
    paddingHorizontal: 40,
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 30,
  },
  connectingContainer: {
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  connectingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
  },
  connectingSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  readyContainer: {
    alignItems: 'center',
    backgroundColor: '#d4edda',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#50C878',
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 5,
  },
  readySubtext: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  connectButton: {
    backgroundColor: '#50C878',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  disabledButtonText: {
    color: '#7f8c8d',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
  helpContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  helpText: {
    fontSize: 14,
    color: '#2980b9',
    textAlign: 'center',
    lineHeight: 20,
  },
});

