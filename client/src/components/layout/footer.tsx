import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Laborerr</h3>
            <p className="text-neutral-400 mb-4">Find the perfect freelancer for your next project. Skilled professionals available across Iraq.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/1" className="text-neutral-400 hover:text-white">Home Repair</Link></li>
              <li><Link href="/category/2" className="text-neutral-400 hover:text-white">Design</Link></li>
              <li><Link href="/category/3" className="text-neutral-400 hover:text-white">Programming</Link></li>
              <li><Link href="/category/5" className="text-neutral-400 hover:text-white">Electrical</Link></li>
              <li><Link href="/category/6" className="text-neutral-400 hover:text-white">Plumbing</Link></li>
              <li><Link href="/category/7" className="text-neutral-400 hover:text-white">Cleaning</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-neutral-400 hover:text-white">How it Works</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white">Careers</Link></li>
              <li><Link href="/press" className="text-neutral-400 hover:text-white">Press</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-neutral-400 hover:text-white">Help Center</Link></li>
              <li><Link href="/safety" className="text-neutral-400 hover:text-white">Safety</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-neutral-400 hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/accessibility" className="text-neutral-400 hover:text-white">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-6 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Laborerr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
