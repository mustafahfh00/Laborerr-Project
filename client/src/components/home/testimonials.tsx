import { Rating } from "@/components/ui/rating";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <Rating rating={testimonial.rating} showText={true} />
              </div>
              <p className="mb-6 text-neutral-700">"{testimonial.comment}"</p>
              <div className="flex items-center">
                <img 
                  src={`${testimonial.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80`} 
                  alt={testimonial.name} 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
