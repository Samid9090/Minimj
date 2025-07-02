import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import ConnectionService from '../services/ConnectionService';

export default function ConnectionScreen({ route, navigation }) {
  const { mode, pairingCode } = route.params;
  const [isConnected, setIsConnected] = useState(false);
  const [receivedData, setReceivedData] = useState([]);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false,
    gallery: false,
    screenProjection: false,
  });

  useEffect(() => {
    // Initialize connection service
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
    };

    const handleDataReceived = (data) => {
      setReceivedData(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 items
    };

    if (mode === 'parent') {
      ConnectionService.initializeAsParent(pairingCode, handleConnectionChange, handleDataReceived);
    } else {
      ConnectionService.initializeAsChild(pairingCode, handleConnectionChange, handleDataReceived);
    }

    return () => {
      // Cleanup on unmount
      ConnectionService.disconnect();
    };
  }, [mode, pairingCode]);

  const handleRequestPermission = async (permissionType) => {
    if (mode !== 'parent') return;

    try {
      const granted = await ConnectionService.requestPermission(permissionType);
      setPermissions(prev => ({
        ...prev,
        [permissionType]: granted
      }));
      
      Alert.alert(
        'Permission Request',
        `${permissionType} permission ${granted ? 'granted' : 'denied'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            ConnectionService.disconnect();
            navigation.navigate('ModeSelection');
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderParentView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>📱 Monitoring Child Device</Text>
        <Text style={styles.statusSubtitle}>
          Connected with pairing code: {pairingCode}
        </Text>
      </View>

      <View style={styles.permissionsContainer}>
        <Text style={styles.sectionTitle}>Device Permissions</Text>
        {Object.entries(permissions).map(([permission, granted]) => (
          <View key={permission} style={styles.permissionRow}>
            <Text style={styles.permissionName}>
              {permission.charAt(0).toUpperCase() + permission.slice(1)}
            </Text>
            <View style={styles.permissionActions}>
              <Text style={[
                styles.permissionStatus,
                granted ? styles.permissionGranted : styles.permissionDenied
              ]}>
                {granted ? '✅ Granted' : '❌ Not Granted'}
              </Text>
              {!granted && (
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => handleRequestPermission(permission)}
                >
                  <Text style={styles.requestButtonText}>Request</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Live Data Stream</Text>
        {receivedData.length === 0 ? (
          <Text style={styles.noDataText}>Waiting for data from child device...</Text>
        ) : (
          receivedData.map((data, index) => (
            <View key={index} style={styles.dataItem}>
              <Text style={styles.dataTimestamp}>
                {formatTimestamp(data.timestamp)}
              </Text>
              <Text style={styles.dataContent}>
                Battery: {data.battery}% | Location: {data.location?.latitude?.toFixed(4)}, {data.location?.longitude?.toFixed(4)}
              </Text>
              <Text style={styles.dataApps}>
                Active Apps: {data.apps?.join(', ')}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderChildView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>🔗 Connected to Parent</Text>
        <Text style={styles.statusSubtitle}>
          Your parent can now monitor this device
        </Text>
      </View>

      <View style={styles.permissionsContainer}>
        <Text style={styles.sectionTitle}>Granted Permissions</Text>
        <Text style={styles.infoText}>
          Your parent may request access to various device features. You'll be asked to approve each request.
        </Text>
        
        <View style={styles.permissionsList}>
          <Text style={styles.permissionItem}>📷 Camera access</Text>
          <Text style={styles.permissionItem}>📍 Location tracking</Text>
          <Text style={styles.permissionItem}>🔔 Notifications monitoring</Text>
          <Text style={styles.permissionItem}>🖼️ Gallery access</Text>
          <Text style={styles.permissionItem}>📺 Screen projection</Text>
        </View>
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Data Being Shared</Text>
        <Text style={styles.infoText}>
          The following information is being sent to your parent:
        </Text>
        
        <View style={styles.dataList}>
          <Text style={styles.dataListItem}>• Device battery level</Text>
          <Text style={styles.dataListItem}>• Current location (if permitted)</Text>
          <Text style={styles.dataListItem}>• Active applications</Text>
          <Text style={styles.dataListItem}>• Device usage statistics</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.connectionIndicator}>
          <View style={[
            styles.connectionDot,
            isConnected ? styles.connectedDot : styles.disconnectedDot
          ]} />
          <Text style={styles.connectionText}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {mode === 'parent' ? renderParentView() : renderChildView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectedDot: {
    backgroundColor: '#28a745',
  },
  disconnectedDot: {
    backgroundColor: '#ffc107',
  },
  connectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  permissionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  permissionName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  permissionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  permissionGranted: {
    color: '#28a745',
  },
  permissionDenied: {
    color: '#dc3545',
  },
  requestButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDataText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dataItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  dataTimestamp: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  dataContent: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 2,
  },
  dataApps: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
  },
  permissionsList: {
    gap: 8,
  },
  permissionItem: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 22,
  },
  dataList: {
    gap: 6,
  },
  dataListItem: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
});

