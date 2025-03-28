import { 
  users, type User, type InsertUser,
  emergencyContacts, type EmergencyContact, type InsertEmergencyContact,
  deviceSettings, type DeviceSettings, type InsertDeviceSettings,
  emergencyAlerts, type EmergencyAlert, type InsertEmergencyAlert,
  type Location
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency contact methods
  getContactsByUserId(userId: number): Promise<EmergencyContact[]>;
  getContact(id: number): Promise<EmergencyContact | undefined>;
  createContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  
  // Device settings methods
  getDeviceSettings(userId: number): Promise<DeviceSettings | undefined>;
  createDeviceSettings(settings: InsertDeviceSettings): Promise<DeviceSettings>;
  updateDeviceSettings(userId: number, settings: Partial<InsertDeviceSettings>): Promise<DeviceSettings | undefined>;
  updateBatteryLevel(userId: number, batteryLevel: number): Promise<DeviceSettings | undefined>;
  updateLastLocation(userId: number, location: Location): Promise<DeviceSettings | undefined>;
  
  // Emergency alerts methods
  getAlertsByUserId(userId: number): Promise<EmergencyAlert[]>;
  getAlert(id: number): Promise<EmergencyAlert | undefined>;
  createAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  deactivateAlert(id: number): Promise<EmergencyAlert | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private deviceSettings: Map<number, DeviceSettings>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  
  private currentUserId: number;
  private currentContactId: number;
  private currentSettingsId: number;
  private currentAlertId: number;

  constructor() {
    this.users = new Map();
    this.emergencyContacts = new Map();
    this.deviceSettings = new Map();
    this.emergencyAlerts = new Map();
    
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentSettingsId = 1;
    this.currentAlertId = 1;
    
    // Create a default user for demo
    const defaultUser: InsertUser = {
      username: "demo",
      password: "password",
      fullName: "Demo User",
      phone: "+1234567890",
      email: "demo@example.com"
    };
    
    this.createUser(defaultUser).then(user => {
      // Create default device settings
      this.createDeviceSettings({
        userId: user.id,
        isActive: true,
        batteryLevel: 85,
        locationSharing: true,
        smsAlerts: true,
        emergencyServices: true,
        soundAlarm: true,
        lastLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: "New York, NY, USA"
        }
      });
      
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Emergency contact methods
  async getContactsByUserId(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      (contact) => contact.userId === userId
    );
  }
  
  async getContact(id: number): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }
  
  async createContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentContactId++;
    const contact: EmergencyContact = { ...insertContact, id };
    this.emergencyContacts.set(id, contact);
    return contact;
  }
  
  async updateContact(id: number, contactUpdate: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const existingContact = this.emergencyContacts.get(id);
    
    if (!existingContact) {
      return undefined;
    }
    
    const updatedContact: EmergencyContact = {
      ...existingContact,
      ...contactUpdate,
    };
    
    this.emergencyContacts.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }
  
  // Device settings methods
  async getDeviceSettings(userId: number): Promise<DeviceSettings | undefined> {
    return Array.from(this.deviceSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }
  
  async createDeviceSettings(insertSettings: InsertDeviceSettings): Promise<DeviceSettings> {
    const id = this.currentSettingsId++;
    const settings: DeviceSettings = { ...insertSettings, id };
    this.deviceSettings.set(id, settings);
    return settings;
  }
  
  async updateDeviceSettings(userId: number, settingsUpdate: Partial<InsertDeviceSettings>): Promise<DeviceSettings | undefined> {
    const existingSettings = Array.from(this.deviceSettings.values()).find(
      (settings) => settings.userId === userId
    );
    
    if (!existingSettings) {
      return undefined;
    }
    
    const updatedSettings: DeviceSettings = {
      ...existingSettings,
      ...settingsUpdate,
    };
    
    this.deviceSettings.set(existingSettings.id, updatedSettings);
    return updatedSettings;
  }
  
  async updateBatteryLevel(userId: number, batteryLevel: number): Promise<DeviceSettings | undefined> {
    return this.updateDeviceSettings(userId, { batteryLevel });
  }
  
  async updateLastLocation(userId: number, location: Location): Promise<DeviceSettings | undefined> {
    return this.updateDeviceSettings(userId, { lastLocation: location });
  }
  
  // Emergency alerts methods
  async getAlertsByUserId(userId: number): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values()).filter(
      (alert) => alert.userId === userId
    );
  }
  
  async getAlert(id: number): Promise<EmergencyAlert | undefined> {
    return this.emergencyAlerts.get(id);
  }
  
  async createAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.currentAlertId++;
    const alert: EmergencyAlert = { ...insertAlert, id };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
  
  async deactivateAlert(id: number): Promise<EmergencyAlert | undefined> {
    const existingAlert = this.emergencyAlerts.get(id);
    
    if (!existingAlert) {
      return undefined;
    }
    
    const updatedAlert: EmergencyAlert = {
      ...existingAlert,
      isActive: false,
    };
    
    this.emergencyAlerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();
