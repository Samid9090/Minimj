// PermissionsService.js - Handles device permissions and data access
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';

class PermissionsService {
  constructor() {
    this.permissions = {
      camera: false,
      location: false,
      notifications: false,
      gallery: false,
      screenProjection: false,
    };
    
    this.locationSubscription = null;
    this.onLocationUpdate = null;
    this.onPermissionChange = null;
  }

  // Request camera permission
  async requestCameraPermission() {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      this.permissions.camera = granted;
      
      if (this.onPermissionChange) {
        this.onPermissionChange('camera', granted);
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  // Request location permission
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      this.permissions.location = granted;
      
      if (this.onPermissionChange) {
        this.onPermissionChange('location', granted);
      }
      
      if (granted) {
        this.startLocationTracking();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  // Request notifications permission
  async requestNotificationsPermission() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      this.permissions.notifications = granted;
      
      if (this.onPermissionChange) {
        this.onPermissionChange('notifications', granted);
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notifications permission:', error);
      return false;
    }
  }

  // Request gallery permission
  async requestGalleryPermission() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === 'granted';
      this.permissions.gallery = granted;
      
      if (this.onPermissionChange) {
        this.onPermissionChange('gallery', granted);
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
      return false;
    }
  }

  // Request screen projection permission (simulated)
  async requestScreenProjectionPermission() {
    try {
      // Screen projection would require platform-specific implementation
      // For demo purposes, we'll simulate user approval
      return new Promise((resolve) => {
        setTimeout(() => {
          const granted = Math.random() > 0.3; // 70% approval rate
          this.permissions.screenProjection = granted;
          
          if (this.onPermissionChange) {
            this.onPermissionChange('screenProjection', granted);
          }
          
          resolve(granted);
        }, 1000);
      });
    } catch (error) {
      console.error('Error requesting screen projection permission:', error);
      return false;
    }
  }

  // Start location tracking
  async startLocationTracking() {
    if (!this.permissions.location) {
      console.warn('Location permission not granted');
      return;
    }

    try {
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          if (this.onLocationUpdate) {
            this.onLocationUpdate({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              timestamp: location.timestamp,
            });
          }
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  // Stop location tracking
  stopLocationTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Get current location
  async getCurrentLocation() {
    if (!this.permissions.location) {
      throw new Error('Location permission not granted');
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Get recent photos from gallery
  async getRecentPhotos(limit = 10) {
    if (!this.permissions.gallery) {
      throw new Error('Gallery permission not granted');
    }

    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: limit,
        mediaType: 'photo',
        sortBy: 'creationTime',
      });
      
      return assets.map(asset => ({
        id: asset.id,
        filename: asset.filename,
        uri: asset.uri,
        creationTime: asset.creationTime,
        width: asset.width,
        height: asset.height,
      }));
    } catch (error) {
      console.error('Error getting recent photos:', error);
      throw error;
    }
  }

  // Capture photo with camera
  async capturePhoto() {
    if (!this.permissions.camera) {
      throw new Error('Camera permission not granted');
    }

    // This would require camera component integration
    // For demo purposes, we'll return a simulated photo
    return {
      uri: 'simulated_photo_uri',
      width: 1920,
      height: 1080,
      timestamp: Date.now(),
    };
  }

  // Get device information
  getDeviceInfo() {
    return {
      battery: Math.floor(Math.random() * 100), // Simulated battery level
      storage: {
        total: 64000, // 64GB in MB
        used: Math.floor(Math.random() * 32000), // Random used storage
      },
      memory: {
        total: 4096, // 4GB in MB
        used: Math.floor(Math.random() * 2048), // Random used memory
      },
      network: {
        type: 'wifi', // or 'cellular'
        strength: Math.floor(Math.random() * 5) + 1, // 1-5 bars
      },
    };
  }

  // Get app usage statistics (simulated)
  getAppUsage() {
    const apps = [
      'Messages', 'Safari', 'Instagram', 'TikTok', 'YouTube',
      'Spotify', 'Games', 'Camera', 'Photos', 'Settings'
    ];
    
    return apps.map(app => ({
      name: app,
      timeSpent: Math.floor(Math.random() * 120), // Minutes
      lastUsed: Date.now() - Math.floor(Math.random() * 86400000), // Last 24 hours
    })).sort((a, b) => b.timeSpent - a.timeSpent);
  }

  // Set permission change callback
  setPermissionChangeCallback(callback) {
    this.onPermissionChange = callback;
  }

  // Set location update callback
  setLocationUpdateCallback(callback) {
    this.onLocationUpdate = callback;
  }

  // Get all permissions status
  getPermissionsStatus() {
    return { ...this.permissions };
  }

  // Request specific permission by type
  async requestPermission(type) {
    switch (type) {
      case 'camera':
        return await this.requestCameraPermission();
      case 'location':
        return await this.requestLocationPermission();
      case 'notifications':
        return await this.requestNotificationsPermission();
      case 'gallery':
        return await this.requestGalleryPermission();
      case 'screenProjection':
        return await this.requestScreenProjectionPermission();
      default:
        throw new Error(`Unknown permission type: ${type}`);
    }
  }

  // Cleanup resources
  cleanup() {
    this.stopLocationTracking();
    this.onLocationUpdate = null;
    this.onPermissionChange = null;
  }
}

// Export singleton instance
export default new PermissionsService();

