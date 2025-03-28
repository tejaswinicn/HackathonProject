import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmergencyContactSchema, 
  insertDeviceSettingsSchema, 
  insertEmergencyAlertSchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  
  // Get current user (demo user for simplicity)
  app.get('/api/user', async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername('demo');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Emergency Contacts API
  app.get('/api/contacts', async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername('demo');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const contacts = await storage.getContactsByUserId(user.id);
    res.json(contacts);
  });
  
  app.post('/api/contacts', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const contactData = insertEmergencyContactSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const newContact = await storage.createContact(contactData);
      res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  app.put('/api/contacts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const existingContact = await storage.getContact(id);
      
      if (!existingContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      if (existingContact.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this contact' });
      }
      
      const contactData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
      };
      
      const updatedContact = await storage.updateContact(id, contactData);
      res.json(updatedContact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  app.delete('/api/contacts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const existingContact = await storage.getContact(id);
      
      if (!existingContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      if (existingContact.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this contact' });
      }
      
      await storage.deleteContact(id);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Device Settings API
  app.get('/api/device-settings', async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername('demo');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const settings = await storage.getDeviceSettings(user.id);
    
    if (!settings) {
      return res.status(404).json({ message: 'Device settings not found' });
    }
    
    res.json(settings);
  });
  
  app.put('/api/device-settings', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const existingSettings = await storage.getDeviceSettings(user.id);
      
      if (!existingSettings) {
        return res.status(404).json({ message: 'Device settings not found' });
      }
      
      const settingsData = {
        isActive: req.body.isActive !== undefined ? req.body.isActive : existingSettings.isActive,
        locationSharing: req.body.locationSharing !== undefined ? req.body.locationSharing : existingSettings.locationSharing,
        smsAlerts: req.body.smsAlerts !== undefined ? req.body.smsAlerts : existingSettings.smsAlerts,
        emergencyServices: req.body.emergencyServices !== undefined ? req.body.emergencyServices : existingSettings.emergencyServices,
        soundAlarm: req.body.soundAlarm !== undefined ? req.body.soundAlarm : existingSettings.soundAlarm,
      };
      
      const updatedSettings = await storage.updateDeviceSettings(user.id, settingsData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  app.put('/api/device-settings/battery', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const batteryLevel = parseInt(req.body.batteryLevel);
      
      if (isNaN(batteryLevel) || batteryLevel < 0 || batteryLevel > 100) {
        return res.status(400).json({ message: 'Invalid battery level' });
      }
      
      const updatedSettings = await storage.updateBatteryLevel(user.id, batteryLevel);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: 'Device settings not found' });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  app.put('/api/device-settings/location', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { latitude, longitude, address } = req.body;
      
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Invalid location data' });
      }
      
      const location = {
        latitude,
        longitude,
        address: address || `${latitude}, ${longitude}`
      };
      
      const updatedSettings = await storage.updateLastLocation(user.id, location);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: 'Device settings not found' });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Emergency Alerts API
  app.get('/api/alerts', async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername('demo');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const alerts = await storage.getAlertsByUserId(user.id);
    res.json(alerts);
  });
  
  app.post('/api/alerts', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const deviceSettings = await storage.getDeviceSettings(user.id);
      
      if (!deviceSettings) {
        return res.status(404).json({ message: 'Device settings not found' });
      }
      
      if (!deviceSettings.isActive) {
        return res.status(400).json({ message: 'Device is not active' });
      }
      
      const location = deviceSettings.lastLocation || {
        latitude: 0,
        longitude: 0,
        address: 'Unknown location'
      };
      
      const alertData = {
        userId: user.id,
        timestamp: new Date().toISOString(),
        location,
        isActive: true,
      };
      
      const newAlert = await storage.createAlert(alertData);
      
      // In a real app, send notifications to emergency contacts
      // and emergency services if enabled
      
      res.status(201).json(newAlert);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  app.put('/api/alerts/:id/deactivate', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserByUsername('demo');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const existingAlert = await storage.getAlert(id);
      
      if (!existingAlert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      if (existingAlert.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this alert' });
      }
      
      const updatedAlert = await storage.deactivateAlert(id);
      res.json(updatedAlert);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
