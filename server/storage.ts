import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  freelancers, Freelancer, InsertFreelancer,
  reviews, Review, InsertReview,
  bookings, Booking, InsertBooking
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Freelancer methods
  getFreelancers(): Promise<Freelancer[]>;
  getFreelancerById(id: number): Promise<Freelancer | undefined>;
  getFreelancersByCategory(categoryId: number): Promise<Freelancer[]>;
  createFreelancer(freelancer: InsertFreelancer): Promise<Freelancer>;
  updateFreelancer(id: number, freelancer: Partial<Freelancer>): Promise<Freelancer | undefined>;
  
  // Review methods
  getReviews(freelancerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Booking methods
  getBookings(userId: number): Promise<Booking[]>;
  getFreelancerBookings(freelancerId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private freelancers: Map<number, Freelancer>;
  private reviews: Map<number, Review>;
  private bookings: Map<number, Booking>;
  private userId: number;
  private categoryId: number;
  private freelancerId: number;
  private reviewId: number;
  private bookingId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.freelancers = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    this.userId = 1;
    this.categoryId = 1;
    this.freelancerId = 1;
    this.reviewId = 1;
    this.bookingId = 1;
    
    // Seed initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed categories
    const categoryData: InsertCategory[] = [
      { name: "Home Repair", icon: "fa-hammer", servicesCount: 125 },
      { name: "Design", icon: "fa-paint-roller", servicesCount: 94 },
      { name: "Programming", icon: "fa-code", servicesCount: 78 },
      { name: "Delivery", icon: "fa-truck", servicesCount: 65 },
      { name: "Electrical", icon: "fa-lightbulb", servicesCount: 112 },
      { name: "Plumbing", icon: "fa-wrench", servicesCount: 89 },
      { name: "Cleaning", icon: "fa-broom", servicesCount: 56 },
      { name: "Gardening", icon: "fa-seedling", servicesCount: 45 },
      { name: "Automotive", icon: "fa-car", servicesCount: 42 }
    ];
    
    categoryData.forEach(cat => this.createCategory(cat));
    
    // Seed users
    const userData: InsertUser[] = [
      { username: "ahmed_hassan", password: "password123", firstName: "Ahmed", lastName: "Hassan", email: "ahmed@example.com", phone: "+9647501234567", isFreelancer: true },
      { username: "zainab_ali", password: "password123", firstName: "Zainab", lastName: "Ali", email: "zainab@example.com", phone: "+9647501234568", isFreelancer: true },
      { username: "mohammed_karim", password: "password123", firstName: "Mohammed", lastName: "Karim", email: "mohammed@example.com", phone: "+9647501234569", isFreelancer: true },
      { username: "sara_mahmoud", password: "password123", firstName: "Sara", lastName: "Mahmoud", email: "sara@example.com", phone: "+9647501234570", isFreelancer: true },
      { username: "omar_fawzi", password: "password123", firstName: "Omar", lastName: "Fawzi", email: "omar@example.com", phone: "+9647501234571", isFreelancer: true },
      { username: "noor_hameed", password: "password123", firstName: "Noor", lastName: "Hameed", email: "noor@example.com", phone: "+9647501234572", isFreelancer: true },
      { username: "customer1", password: "password123", firstName: "Ali", lastName: "Kareem", email: "customer1@example.com", phone: "+9647501234573", isFreelancer: false },
      { username: "customer2", password: "password123", firstName: "Mariam", lastName: "Ahmed", email: "customer2@example.com", phone: "+9647501234574", isFreelancer: false },
      { username: "customer3", password: "password123", firstName: "Hassan", lastName: "Sabah", email: "customer3@example.com", phone: "+9647501234575", isFreelancer: false }
    ];
    
    userData.forEach(user => this.createUser(user));
    
    // Seed freelancers
    const freelancerData: InsertFreelancer[] = [
      { userId: 1, title: "Home Repair Specialist", description: "Experienced home repair specialist offering quality services.", hourlyRate: 25, categoryId: 1, location: "Baghdad, Iraq", isAvailable: true, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9" },
      { userId: 2, title: "Graphic Designer", description: "Creative graphic designer with a passion for visual storytelling.", hourlyRate: 30, categoryId: 2, location: "Erbil, Iraq", isAvailable: true, image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c" },
      { userId: 3, title: "Web Developer", description: "Full-stack web developer specializing in modern web technologies.", hourlyRate: 35, categoryId: 3, location: "Baghdad, Iraq", isAvailable: true, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
      { userId: 4, title: "Interior Designer", description: "Interior designer creating beautiful and functional spaces.", hourlyRate: 40, categoryId: 2, location: "Basra, Iraq", isAvailable: false, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
      { userId: 5, title: "Electrician", description: "Licensed electrician for all your electrical needs.", hourlyRate: 20, categoryId: 5, location: "Mosul, Iraq", isAvailable: true, image: "https://images.unsplash.com/photo-1615813967515-e1838c1c5116" },
      { userId: 6, title: "Plumber", description: "Professional plumber with over 5 years of experience.", hourlyRate: 22, categoryId: 6, location: "Baghdad, Iraq", isAvailable: true, image: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50" }
    ];
    
    freelancerData.forEach(freelancer => this.createFreelancer(freelancer));
    
    // Seed reviews
    const reviewData: InsertReview[] = [
      { freelancerId: 1, userId: 7, rating: 5, comment: "Great job fixing my kitchen sink!" },
      { freelancerId: 1, userId: 8, rating: 4, comment: "Very professional and punctual." },
      { freelancerId: 1, userId: 9, rating: 5, comment: "Excellent service, highly recommend!" },
      { freelancerId: 2, userId: 7, rating: 4, comment: "Amazing design work for my business logo." },
      { freelancerId: 2, userId: 8, rating: 4, comment: "Creative and responsive to feedback." },
      { freelancerId: 3, userId: 9, rating: 5, comment: "Built an awesome website for my business." },
      { freelancerId: 3, userId: 7, rating: 5, comment: "Great communication and exceeded expectations." },
      { freelancerId: 4, userId: 8, rating: 5, comment: "Transformed my living room completely!" },
      { freelancerId: 4, userId: 9, rating: 4, comment: "Innovative design ideas and great execution." },
      { freelancerId: 5, userId: 7, rating: 3, comment: "Did the job but was a bit late." },
      { freelancerId: 6, userId: 8, rating: 4, comment: "Fixed my plumbing issue quickly." },
      { freelancerId: 6, userId: 9, rating: 4, comment: "Very knowledgeable and fair pricing." }
    ];
    
    reviewData.forEach(review => this.createReview(review));
    
    // Update freelancer ratings based on reviews
    this.updateFreelancerRatings();
  }

  private updateFreelancerRatings() {
    // Group reviews by freelancer ID
    const reviewsByFreelancer = new Map<number, Review[]>();
    this.reviews.forEach(review => {
      const reviews = reviewsByFreelancer.get(review.freelancerId) || [];
      reviews.push(review);
      reviewsByFreelancer.set(review.freelancerId, reviews);
    });
    
    // Update each freelancer's average rating and review count
    reviewsByFreelancer.forEach((reviews, freelancerId) => {
      const freelancer = this.freelancers.get(freelancerId);
      if (freelancer) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        
        this.freelancers.set(freelancerId, {
          ...freelancer,
          averageRating,
          reviewCount: reviews.length
        });
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Freelancer methods
  async getFreelancers(): Promise<Freelancer[]> {
    return Array.from(this.freelancers.values());
  }

  async getFreelancerById(id: number): Promise<Freelancer | undefined> {
    return this.freelancers.get(id);
  }

  async getFreelancersByCategory(categoryId: number): Promise<Freelancer[]> {
    return Array.from(this.freelancers.values()).filter(
      freelancer => freelancer.categoryId === categoryId
    );
  }

  async createFreelancer(freelancer: InsertFreelancer): Promise<Freelancer> {
    const id = this.freelancerId++;
    const newFreelancer: Freelancer = { 
      ...freelancer, 
      id, 
      averageRating: 0, 
      reviewCount: 0 
    };
    this.freelancers.set(id, newFreelancer);
    return newFreelancer;
  }

  async updateFreelancer(id: number, freelancerData: Partial<Freelancer>): Promise<Freelancer | undefined> {
    const freelancer = this.freelancers.get(id);
    if (!freelancer) return undefined;
    
    const updatedFreelancer = { ...freelancer, ...freelancerData };
    this.freelancers.set(id, updatedFreelancer);
    return updatedFreelancer;
  }

  // Review methods
  async getReviews(freelancerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.freelancerId === freelancerId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    
    // Update freelancer rating
    const freelancer = this.freelancers.get(review.freelancerId);
    if (freelancer) {
      const freelancerReviews = await this.getReviews(review.freelancerId);
      freelancerReviews.push(newReview);
      
      const totalRating = freelancerReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / freelancerReviews.length;
      
      await this.updateFreelancer(review.freelancerId, {
        averageRating,
        reviewCount: freelancerReviews.length
      });
    }
    
    return newReview;
  }

  // Booking methods
  async getBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async getFreelancerBookings(freelancerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.freelancerId === freelancerId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking: Booking = { ...booking, id, createdAt: new Date() };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
