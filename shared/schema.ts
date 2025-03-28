import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  email: text("email"),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
});

export const deviceSettings = pgTable("device_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  batteryLevel: integer("battery_level").notNull().default(100),
  locationSharing: boolean("location_sharing").notNull().default(true),
  smsAlerts: boolean("sms_alerts").notNull().default(true),
  emergencyServices: boolean("emergency_services").notNull().default(true),
  soundAlarm: boolean("sound_alarm").notNull().default(true),
  lastLocation: jsonb("last_location"),
});

export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  timestamp: text("timestamp").notNull(),
  location: jsonb("location"),
  isActive: boolean("is_active").notNull().default(true),
});

// Insert schema definitions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  phone: true,
  email: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).pick({
  userId: true,
  name: true,
  phone: true,
  email: true,
});

export const insertDeviceSettingsSchema = createInsertSchema(deviceSettings).pick({
  userId: true,
  isActive: true,
  batteryLevel: true,
  locationSharing: true,
  smsAlerts: true,
  emergencyServices: true,
  soundAlarm: true,
  lastLocation: true,
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).pick({
  userId: true,
  timestamp: true,
  location: true,
  isActive: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertDeviceSettings = z.infer<typeof insertDeviceSettingsSchema>;
export type DeviceSettings = typeof deviceSettings.$inferSelect;

export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;

// Location type
export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};
