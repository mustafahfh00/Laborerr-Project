import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertFreelancerSchema, 
  insertReviewSchema, 
  insertBookingSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  });
  
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Category routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Freelancer routes
  app.get("/api/freelancers", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let freelancers;
      if (categoryId && !isNaN(categoryId)) {
        freelancers = await storage.getFreelancersByCategory(categoryId);
      } else {
        freelancers = await storage.getFreelancers();
      }
      
      res.json(freelancers);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.get("/api/freelancers/:id", async (req: Request, res: Response) => {
    try {
      const freelancerId = parseInt(req.params.id);
      if (isNaN(freelancerId)) {
        return res.status(400).json({ message: "Invalid freelancer ID" });
      }
      
      const freelancer = await storage.getFreelancerById(freelancerId);
      if (!freelancer) {
        return res.status(404).json({ message: "Freelancer not found" });
      }
      
      res.json(freelancer);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.post("/api/freelancers", async (req: Request, res: Response) => {
    try {
      const freelancerData = insertFreelancerSchema.parse(req.body);
      
      // Validate that user exists
      const user = await storage.getUser(freelancerData.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      // Validate that category exists
      const category = await storage.getCategoryById(freelancerData.categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      
      // Update user to be a freelancer if they aren't already
      if (!user.isFreelancer) {
        await storage.updateUser(user.id, { isFreelancer: true });
      }
      
      const freelancer = await storage.createFreelancer(freelancerData);
      res.status(201).json(freelancer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  });
  
  // Review routes
  app.get("/api/freelancers/:id/reviews", async (req: Request, res: Response) => {
    try {
      const freelancerId = parseInt(req.params.id);
      if (isNaN(freelancerId)) {
        return res.status(400).json({ message: "Invalid freelancer ID" });
      }
      
      const reviews = await storage.getReviews(freelancerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Validate that freelancer exists
      const freelancer = await storage.getFreelancerById(reviewData.freelancerId);
      if (!freelancer) {
        return res.status(400).json({ message: "Freelancer not found" });
      }
      
      // Validate that user exists
      const user = await storage.getUser(reviewData.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  });
  
  // Booking routes
  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const freelancerId = req.query.freelancerId ? parseInt(req.query.freelancerId as string) : undefined;
      
      if (!userId && !freelancerId) {
        return res.status(400).json({ message: "Either userId or freelancerId is required" });
      }
      
      let bookings;
      if (userId) {
        bookings = await storage.getBookings(userId);
      } else if (freelancerId) {
        bookings = await storage.getFreelancerBookings(freelancerId!);
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Validate that freelancer exists
      const freelancer = await storage.getFreelancerById(bookingData.freelancerId);
      if (!freelancer) {
        return res.status(400).json({ message: "Freelancer not found" });
      }
      
      // Validate that user exists
      const user = await storage.getUser(bookingData.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  });
  
  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const { status } = req.body;
      if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
