// DataStreamingService.js - Handles real-time data streaming between devices
import PermissionsService from './PermissionsService';

class DataStreamingService {
  constructor() {
    this.isStreaming = false;
    this.streamingInterval = null;
    this.onDataStream = null;
    this.streamingFrequency = 5000; // 5 seconds
  }

  // Start streaming data from child device
  startStreaming(onDataStream) {
    if (this.isStreaming) {
      console.warn('Data streaming already active');
      return;
    }

    this.onDataStream = onDataStream;
    this.isStreaming = true;

    console.log('Starting data streaming...');

    // Set up permission change listener
    PermissionsService.setPermissionChangeCallback((type, granted) => {
      this.sendPermissionUpdate(type, granted);
    });

    // Set up location update listener
    PermissionsService.setLocationUpdateCallback((location) => {
      this.sendLocationUpdate(location);
    });

    // Start periodic data streaming
    this.streamingInterval = setInterval(() => {
      this.collectAndStreamData();
    }, this.streamingFrequency);

    // Send initial data
    this.collectAndStreamData();
  }

  // Stop streaming data
  stopStreaming() {
    if (!this.isStreaming) {
      return;
    }

    console.log('Stopping data streaming...');

    this.isStreaming = false;
    
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }

    // Cleanup permissions service
    PermissionsService.cleanup();
    
    this.onDataStream = null;
  }

  // Collect and stream comprehensive device data
  async collectAndStreamData() {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    try {
      const data = {
        type: 'comprehensive_update',
        timestamp: new Date().toISOString(),
        deviceInfo: PermissionsService.getDeviceInfo(),
        appUsage: PermissionsService.getAppUsage(),
        permissions: PermissionsService.getPermissionsStatus(),
      };

      // Add location if permission granted
      if (PermissionsService.getPermissionsStatus().location) {
        try {
          data.location = await PermissionsService.getCurrentLocation();
        } catch (error) {
          console.warn('Failed to get current location:', error);
        }
      }

      // Add recent photos if permission granted
      if (PermissionsService.getPermissionsStatus().gallery) {
        try {
          data.recentPhotos = await PermissionsService.getRecentPhotos(5);
        } catch (error) {
          console.warn('Failed to get recent photos:', error);
        }
      }

      this.onDataStream(data);
    } catch (error) {
      console.error('Error collecting device data:', error);
    }
  }

  // Send permission update
  sendPermissionUpdate(type, granted) {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    const data = {
      type: 'permission_update',
      timestamp: new Date().toISOString(),
      permission: {
        type,
        granted,
      },
    };

    this.onDataStream(data);
  }

  // Send location update
  sendLocationUpdate(location) {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    const data = {
      type: 'location_update',
      timestamp: new Date().toISOString(),
      location,
    };

    this.onDataStream(data);
  }

  // Send app activity update
  sendAppActivity(appName, action) {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    const data = {
      type: 'app_activity',
      timestamp: new Date().toISOString(),
      app: {
        name: appName,
        action, // 'opened', 'closed', 'backgrounded'
      },
    };

    this.onDataStream(data);
  }

  // Send notification received
  sendNotificationReceived(notification) {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    const data = {
      type: 'notification_received',
      timestamp: new Date().toISOString(),
      notification: {
        title: notification.title,
        body: notification.body,
        app: notification.app,
      },
    };

    this.onDataStream(data);
  }

  // Send screen capture (simulated)
  async sendScreenCapture() {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    // In a real implementation, this would capture the screen
    const data = {
      type: 'screen_capture',
      timestamp: new Date().toISOString(),
      screenshot: {
        uri: 'simulated_screenshot_uri',
        width: 1080,
        height: 1920,
      },
    };

    this.onDataStream(data);
  }

  // Send camera capture
  async sendCameraCapture() {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    try {
      const photo = await PermissionsService.capturePhoto();
      
      const data = {
        type: 'camera_capture',
        timestamp: new Date().toISOString(),
        photo,
      };

      this.onDataStream(data);
    } catch (error) {
      console.error('Failed to capture photo:', error);
    }
  }

  // Send emergency alert
  sendEmergencyAlert(alertType, message) {
    if (!this.isStreaming || !this.onDataStream) {
      return;
    }

    const data = {
      type: 'emergency_alert',
      timestamp: new Date().toISOString(),
      alert: {
        type: alertType, // 'panic', 'location_alert', 'app_alert'
        message,
        priority: 'high',
      },
    };

    this.onDataStream(data);
  }

  // Set streaming frequency
  setStreamingFrequency(frequency) {
    this.streamingFrequency = frequency;
    
    if (this.isStreaming) {
      // Restart streaming with new frequency
      this.stopStreaming();
      this.startStreaming(this.onDataStream);
    }
  }

  // Get streaming status
  getStreamingStatus() {
    return {
      isStreaming: this.isStreaming,
      frequency: this.streamingFrequency,
    };
  }
}

// Export singleton instance
export default new DataStreamingService();

