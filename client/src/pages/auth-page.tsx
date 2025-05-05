import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Register form schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" })
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false
    }
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await apiRequest("POST", "/api/login", {
        username: data.username,
        password: data.password
      });

      toast({
        title: "Login successful",
        description: "Welcome back to Laborerr!"
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword, terms, ...userData } = data;
      
      await apiRequest("POST", "/api/register", {
        ...userData,
        isFreelancer: false
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!"
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Auth Forms */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Login to Laborerr</CardTitle>
                      <CardDescription>
                        Enter your credentials to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-username">Username</Label>
                          <Input 
                            id="login-username"
                            placeholder="Enter your username" 
                            {...loginForm.register("username")}
                          />
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password">Password</Label>
                            <a href="#" className="text-sm text-primary hover:underline">
                              Forgot password?
                            </a>
                          </div>
                          <Input 
                            id="login-password"
                            type="password" 
                            placeholder="Enter your password" 
                            {...loginForm.register("password")}
                          />
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="login-remember" 
                            {...loginForm.register("rememberMe")}
                          />
                          <Label htmlFor="login-remember">Remember me</Label>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-white"
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-neutral-600">
                        Don't have an account?{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => setActiveTab("register")}
                        >
                          Sign up
                        </Button>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Create an Account</CardTitle>
                      <CardDescription>
                        Fill in your details to register with Laborerr
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="register-firstname">First Name</Label>
                            <Input 
                              id="register-firstname"
                              placeholder="First Name" 
                              {...registerForm.register("firstName")}
                            />
                            {registerForm.formState.errors.firstName && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.firstName.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="register-lastname">Last Name</Label>
                            <Input 
                              id="register-lastname"
                              placeholder="Last Name" 
                              {...registerForm.register("lastName")}
                            />
                            {registerForm.formState.errors.lastName && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.lastName.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="register-username">Username</Label>
                          <Input 
                            id="register-username"
                            placeholder="Choose a username" 
                            {...registerForm.register("username")}
                          />
                          {registerForm.formState.errors.username && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <Input 
                            id="register-email"
                            type="email" 
                            placeholder="Enter your email" 
                            {...registerForm.register("email")}
                          />
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="register-phone">Phone Number</Label>
                          <Input 
                            id="register-phone"
                            type="tel" 
                            placeholder="Enter your phone number" 
                            {...registerForm.register("phone")}
                          />
                          {registerForm.formState.errors.phone && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.phone.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <Input 
                            id="register-password"
                            type="password" 
                            placeholder="Create a password" 
                            {...registerForm.register("password")}
                          />
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="register-confirm-password">Confirm Password</Label>
                          <Input 
                            id="register-confirm-password"
                            type="password" 
                            placeholder="Confirm your password" 
                            {...registerForm.register("confirmPassword")}
                          />
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="register-terms" 
                            {...registerForm.register("terms")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="register-terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              I agree to the{" "}
                              <a href="#" className="text-primary hover:underline">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-primary hover:underline">
                                Privacy Policy
                              </a>
                            </label>
                            {registerForm.formState.errors.terms && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.terms.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-white"
                          disabled={registerForm.formState.isSubmitting}
                        >
                          {registerForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-neutral-600">
                        Already have an account?{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </Button>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Hero Section */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Join Laborerr Today</h2>
                <p className="mb-6">
                  Connect with skilled professionals or offer your services to thousands of customers across Iraq.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-2 rounded-full">
                      <i className="fas fa-check text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Find Skilled Professionals</h3>
                      <p className="text-white/80">Browse through various categories and find the perfect freelancer for your needs.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-2 rounded-full">
                      <i className="fas fa-check text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Secure Booking Process</h3>
                      <p className="text-white/80">Book services with confidence through our secure and transparent booking system.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-2 rounded-full">
                      <i className="fas fa-check text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Earn as a Freelancer</h3>
                      <p className="text-white/80">Create your profile and offer your services to a growing customer base across the country.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
