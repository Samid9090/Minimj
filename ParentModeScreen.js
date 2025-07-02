import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';

export default function ParentModeScreen({ navigation }) {
  const [pairingCode, setPairingCode] = useState('');
  const [isWaitingForConnection, setIsWaitingForConnection] = useState(false);

  // Generate a random 6-digit code
  const generatePairingCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPairingCode(code);
    return code;
  };

  // Initialize with a pairing code
  useEffect(() => {
    generatePairingCode();
  }, []);

  const handleCopyCode = async () => {
    try {
      await Clipboard.setString(pairingCode);
      Alert.alert('Copied!', 'Pairing code copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy code to clipboard');
    }
  };

  const handleStartWaiting = () => {
    setIsWaitingForConnection(true);
    // Here we would start the WebSocket/WebRTC server
    // For now, we'll simulate a connection after 3 seconds
    setTimeout(() => {
      navigation.navigate('Connection', { 
        mode: 'parent', 
        pairingCode: pairingCode 
      });
    }, 3000);
  };

  const handleRegenerateCode = () => {
    const newCode = generatePairingCode();
    setIsWaitingForConnection(false);
    Alert.alert('New Code Generated', `New pairing code: ${newCode}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Parent Mode</Text>
        <Text style={styles.subtitle}>
          Share this code with your child to establish a secure connection
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Pairing Code</Text>
          <View style={styles.codeDisplay}>
            <Text style={styles.codeText}>{pairingCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Text style={styles.copyButtonText}>📋 Copy Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          {isWaitingForConnection ? (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingText}>🔄 Waiting for child to connect...</Text>
              <Text style={styles.waitingSubtext}>
                Make sure your child enters the code: {pairingCode}
              </Text>
            </View>
          ) : (
            <View style={styles.readyContainer}>
              <Text style={styles.readyText}>📱 Ready to Connect</Text>
              <Text style={styles.readySubtext}>
                Press "Start Waiting" when your child is ready to connect
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {!isWaitingForConnection ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleStartWaiting}
              >
                <Text style={styles.primaryButtonText}>Start Waiting for Connection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRegenerateCode}
              >
                <Text style={styles.secondaryButtonText}>Generate New Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsWaitingForConnection(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel Waiting</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>1. Share the 6-digit code with your child</Text>
          <Text style={styles.infoText}>2. Child enters the code in Kids Mode</Text>
          <Text style={styles.infoText}>3. Direct peer-to-peer connection established</Text>
          <Text style={styles.infoText}>4. Monitor with permission-based access</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  codeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  codeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
  },
  codeDisplay: {
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  codeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 8,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  copyButtonText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 30,
  },
  waitingContainer: {
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  waitingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
  },
  waitingSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  readyContainer: {
    alignItems: 'center',
    backgroundColor: '#d1ecf1',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0c5460',
    marginBottom: 5,
  },
  readySubtext: {
    fontSize: 14,
    color: '#0c5460',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  secondaryButtonText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
});

