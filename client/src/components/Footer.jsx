import { Link } from 'react-router-dom';

const Footer = () => {
  return (
   <footer className="bg-gray-900 text-white py-12">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div>
                 <h3 className="text-xl font-bold mb-4">Rich English</h3>
                 <p className="text-gray-400">
                   Where Kindness Leads, English Follows, Growth Lasts.
                 </p>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Quick Links</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li><Link to="/" className="hover:text-white">Home</Link></li>
                   <li><Link to="/about" className="hover:text-white">About</Link></li>
                   <li><Link to="/apply" className="hover:text-white">Apply to Teach</Link></li>
                   <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Support</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li><a href="#" className="hover:text-white">Help Center</a></li>
                   <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                   <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Contact Info</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li>Email: info@richenglish.com</li>
                   <li>Phone: +1 (555) 123-4567</li>
                   <li>Available 24/7</li>
                 </ul>
               </div>
             </div>
             <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
               <p>&copy; 2024 Rich English. All rights reserved.</p>
             </div>
           </div>
         </footer>
  )
}

export default Footer