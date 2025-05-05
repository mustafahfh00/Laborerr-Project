import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/modals/booking-modal";
import { useModal } from "@/hooks/use-modal";
import { formatPrice } from "@/lib/utils";
import { User, MessageSquare, Calendar, Clock, MapPin, BriefcaseBusiness, Star } from "lucide-react";
import { freelancers as staticFreelancers } from "@/data/freelancers";

export default function FreelancerPage() {
  const [, params] = useRoute("/freelancer/:id");
  const freelancerId = params ? parseInt(params.id) : 0;
  const { isOpen, open, close } = useModal();

  // Fetch freelancer data
  const { data: freelancerData, isLoading: isLoadingFreelancer } = useQuery({
    queryKey: [`/api/freelancers/${freelancerId}`],
    enabled: !!freelancerId,
  });

  // Fetch reviews for this freelancer
  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: [`/api/freelancers/${freelancerId}/reviews`],
    enabled: !!freelancerId,
  });

  // Use API data if available, otherwise use static data
  const freelancer = freelancerData || staticFreelancers.find(f => f.id === freelancerId);
  const reviews = reviewsData || [];

  // Return loading state or 404 if freelancer not found
  if (isLoadingFreelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-12 w-48 bg-neutral-200 rounded-md mx-auto mb-4"></div>
            <div className="h-6 w-64 bg-neutral-200 rounded-md mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Freelancer Not Found</h1>
            <p className="text-neutral-600 mb-6">The freelancer you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-primary text-white" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Freelancer Info */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <img
                    src={`${freelancer.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80`}
                    alt={freelancer.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                  />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{freelancer.name}</h1>
                    <p className="text-lg text-neutral-600 mb-2">{freelancer.title}</p>
                    <div className="flex items-center mb-3">
                      <Rating rating={freelancer.rating} showText={true} reviewCount={freelancer.reviewCount} />
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{freelancer.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h2 className="text-xl font-semibold mb-4">About Me</h2>
                  <p className="text-neutral-700 mb-6">
                    {freelancer.description || `Experienced ${freelancer.title} with a track record of delivering high-quality services to clients across Iraq. I specialize in providing professional and reliable solutions tailored to meet each client's specific needs.`}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Clock size={20} className="text-primary mr-2" />
                      <div>
                        <div className="text-sm text-neutral-500">Hourly Rate</div>
                        <div className="font-semibold">{formatPrice(freelancer.hourlyRate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={20} className="text-primary mr-2" />
                      <div>
                        <div className="text-sm text-neutral-500">Availability</div>
                        <div className="font-semibold">{freelancer.isAvailable ? "Available" : "Unavailable"}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BriefcaseBusiness size={20} className="text-primary mr-2" />
                      <div>
                        <div className="text-sm text-neutral-500">Experience</div>
                        <div className="font-semibold">3+ years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="reviews" className="mb-8">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="reviews">Reviews ({freelancer.reviewCount})</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6">
                  {isLoadingReviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 w-24 bg-neutral-200 rounded mb-2"></div>
                              <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                            </div>
                          </div>
                          <div className="h-4 w-28 bg-neutral-200 rounded mb-2"></div>
                          <div className="h-16 bg-neutral-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center mb-2">
                            <User size={40} className="text-neutral-400 bg-neutral-100 p-2 rounded-full mr-3" />
                            <div>
                              <h4 className="font-medium">Client Name</h4>
                              <p className="text-sm text-neutral-500">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="mb-2">
                            <Rating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-neutral-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star size={48} className="mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                      <p className="text-neutral-600">This freelancer hasn't received any reviews yet.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="portfolio" className="bg-white rounded-lg shadow-sm p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-neutral-100 rounded-md flex items-center justify-center">
                        <p className="text-neutral-400">Portfolio item {i}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking & Contact */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Book This Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-primary mb-1">{formatPrice(freelancer.hourlyRate)}<span className="text-sm font-normal text-neutral-600">/hour</span></div>
                    <p className="text-sm text-neutral-600">Service fee included</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span className={freelancer.isAvailable ? "text-green-600" : "text-neutral-500"}>
                        {freelancer.isAvailable ? "Ready to work" : "Currently unavailable"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>Usually within a day</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Languages</span>
                      <span>Arabic, English</span>
                    </div>

                    <Button 
                      className="w-full bg-primary text-white" 
                      onClick={open}
                      disabled={!freelancer.isAvailable}
                    >
                      {freelancer.isAvailable ? "Book Now" : "Currently Unavailable"}
                    </Button>

                    <Button variant="outline" className="w-full">
                      <MessageSquare size={16} className="mr-2" />
                      Contact Freelancer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-700 space-y-3">
                  <p>• Always communicate through Laborerr</p>
                  <p>• Pay only through our secure payment system</p>
                  <p>• Meet in public places for initial consultations</p>
                  <p>• Report suspicious behavior to our support team</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <BookingModal 
        isOpen={isOpen} 
        onClose={close} 
        freelancer={{
          id: freelancer.id,
          name: freelancer.name,
          title: freelancer.title,
          hourlyRate: freelancer.hourlyRate,
          rating: freelancer.rating,
          image: freelancer.image
        }}
      />
    </div>
  );
}
