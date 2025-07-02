// ConnectionService.js - Handles peer-to-peer connections
import PermissionsService from './PermissionsService';
import DataStreamingService from './DataStreamingService';

class ConnectionService {
  constructor() {
    this.isConnected = false;
    this.mode = null; // 'parent' or 'child'
    this.pairingCode = null;
    this.websocket = null;
    this.peerConnection = null;
    this.onConnectionChange = null;
    this.onDataReceived = null;
    
    // Simulated WebSocket server URL (in real app, this would be a signaling server)
    this.signalingServerUrl = 'ws://localhost:8080';
  }

  // Initialize connection as parent (creates room with pairing code)
  initializeAsParent(pairingCode, onConnectionChange, onDataReceived) {
    this.mode = 'parent';
    this.pairingCode = pairingCode;
    this.onConnectionChange = onConnectionChange;
    this.onDataReceived = onDataReceived;
    
    console.log(`Parent mode initialized with code: ${pairingCode}`);
    
    // In a real implementation, this would:
    // 1. Create a WebSocket connection to signaling server
    // 2. Create a room with the pairing code
    // 3. Wait for child to join
    // 4. Establish WebRTC peer connection
    
    // For demo purposes, we'll simulate the connection
    this.simulateConnection();
  }

  // Initialize connection as child (joins room with pairing code)
  initializeAsChild(pairingCode, onConnectionChange, onDataReceived) {
    this.mode = 'child';
    this.pairingCode = pairingCode;
    this.onConnectionChange = onConnectionChange;
    this.onDataReceived = onDataReceived;
    
    console.log(`Child mode initialized with code: ${pairingCode}`);
    
    // In a real implementation, this would:
    // 1. Create a WebSocket connection to signaling server
    // 2. Join room with the pairing code
    // 3. Exchange WebRTC offer/answer with parent
    // 4. Establish WebRTC peer connection
    
    // For demo purposes, we'll simulate the connection
    this.simulateConnection();
  }

  // Simulate connection establishment (replace with real WebRTC logic)
  simulateConnection() {
    setTimeout(() => {
      this.isConnected = true;
      if (this.onConnectionChange) {
        this.onConnectionChange(true);
      }
      console.log('Connection established successfully');
      
      // Start data streaming if in child mode
      if (this.mode === 'child') {
        this.startDataStreaming();
      }
    }, 2000);
  }

  // Start data streaming from child to parent
  startDataStreaming() {
    if (this.mode !== 'child') {
      console.warn('Data streaming only available in child mode');
      return;
    }

    DataStreamingService.startStreaming((data) => {
      this.sendData(data);
    });
  }

  // Send data through the connection
  sendData(data) {
    if (!this.isConnected) {
      console.warn('Cannot send data: not connected');
      return;
    }

    console.log('Sending data:', data);
    
    // In a real implementation, this would send data through WebRTC data channel
    // For demo, we'll just log and trigger the callback on the other end
    if (this.onDataReceived) {
      setTimeout(() => {
        this.onDataReceived(data);
      }, 100);
    }
  }

  // Request permission from child device
  async requestPermission(permissionType) {
    if (this.mode !== 'parent') {
      console.warn('Only parent can request permissions');
      return Promise.reject('Only parent can request permissions');
    }

    console.log(`Requesting ${permissionType} permission from child`);
    
    // In a real implementation, this would send a permission request to the child
    // and wait for the child to approve/deny
    
    // For demo purposes, we'll simulate the request
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Simulate child device responding to permission request
        try {
          const granted = await PermissionsService.requestPermission(permissionType);
          console.log(`Permission ${permissionType}: ${granted ? 'granted' : 'denied'}`);
          
          // Send permission update through data stream
          if (granted) {
            this.sendData({
              type: 'permission_granted',
              timestamp: new Date().toISOString(),
              permission: permissionType,
            });
          }
          
          resolve(granted);
        } catch (error) {
          console.error(`Error requesting ${permissionType} permission:`, error);
          resolve(false);
        }
      }, 1500);
    });
  }

  // Send command to child device
  sendCommand(command, params = {}) {
    if (this.mode !== 'parent') {
      console.warn('Only parent can send commands');
      return;
    }

    const commandData = {
      type: 'command',
      timestamp: new Date().toISOString(),
      command,
      params,
    };

    this.sendData(commandData);
  }

  // Handle received commands (child side)
  handleCommand(commandData) {
    if (this.mode !== 'child') {
      return;
    }

    const { command, params } = commandData;
    
    switch (command) {
      case 'capture_screen':
        DataStreamingService.sendScreenCapture();
        break;
      case 'capture_photo':
        DataStreamingService.sendCameraCapture();
        break;
      case 'get_location':
        this.sendCurrentLocation();
        break;
      case 'get_app_usage':
        this.sendAppUsage();
        break;
      default:
        console.warn(`Unknown command: ${command}`);
    }
  }

  // Send current location
  async sendCurrentLocation() {
    try {
      const location = await PermissionsService.getCurrentLocation();
      this.sendData({
        type: 'location_response',
        timestamp: new Date().toISOString(),
        location,
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  }

  // Send app usage data
  sendAppUsage() {
    const appUsage = PermissionsService.getAppUsage();
    this.sendData({
      type: 'app_usage_response',
      timestamp: new Date().toISOString(),
      appUsage,
    });
  }

  // Disconnect from peer
  disconnect() {
    this.isConnected = false;
    
    // Stop data streaming
    if (this.mode === 'child') {
      DataStreamingService.stopStreaming();
    }
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.onConnectionChange) {
      this.onConnectionChange(false);
    }
    
    console.log('Disconnected from peer');
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      mode: this.mode,
      pairingCode: this.pairingCode,
    };
  }
}

// Export singleton instance
export default new ConnectionService();

