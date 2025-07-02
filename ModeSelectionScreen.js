import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ModeSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Mode</Text>
        <Text style={styles.subtitle}>
          Select whether you are a parent or child to get started
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.modeButton, styles.parentButton]}
            onPress={() => navigation.navigate('ParentMode')}
          >
            <Text style={styles.buttonText}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.buttonTitle}>Parent Mode</Text>
            <Text style={styles.buttonDescription}>
              Generate a pairing code and monitor your child's device
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, styles.kidsButton]}
            onPress={() => navigation.navigate('KidsMode')}
          >
            <Text style={styles.buttonText}>👶</Text>
            <Text style={styles.buttonTitle}>Kids Mode</Text>
            <Text style={styles.buttonDescription}>
              Enter the pairing code provided by your parent
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            🔒 No data is stored or logged
          </Text>
          <Text style={styles.infoText}>
            🔗 Direct peer-to-peer connection
          </Text>
          <Text style={styles.infoText}>
            ✅ Permissions granted with user approval
          </Text>
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
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  modeButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
  },
  parentButton: {
    borderColor: '#4A90E2',
  },
  kidsButton: {
    borderColor: '#50C878',
  },
  buttonText: {
    fontSize: 48,
    marginBottom: 15,
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

