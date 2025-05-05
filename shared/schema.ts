import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  isFreelancer: boolean("is_freelancer").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  servicesCount: integer("services_count").default(0).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Freelancers schema
export const freelancers = pgTable("freelancers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hourlyRate: real("hourly_rate").notNull(),
  categoryId: integer("category_id").notNull(),
  location: text("location").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  averageRating: real("average_rating").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  image: text("image"),
});

export const insertFreelancerSchema = createInsertSchema(freelancers).omit({
  id: true,
  averageRating: true,
  reviewCount: true,
});
export type InsertFreelancer = z.infer<typeof insertFreelancerSchema>;
export type Freelancer = typeof freelancers.$inferSelect;

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  freelancerId: integer("freelancer_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Bookings schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  freelancerId: integer("freelancer_id").notNull(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  address: text("address").notNull(),
  details: text("details"),
  estimatedHours: integer("estimated_hours").notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
