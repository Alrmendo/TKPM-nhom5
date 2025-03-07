import { Instagram, Facebook, Youtube } from 'lucide-react';
import logo from '../assets/LOGO.svg';

export default function Footer() {
  return (
    <footer className="bg-[#fbf8f1] mt-20 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-4">The Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Our cleaning process
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Professional consultation
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Personalized dress for you
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Return policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Customize your dress size
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-medium mb-4">The Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Personal information
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-medium mb-4">About us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Our story
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-medium mb-4">Supports</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Email us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#868686] hover:text-[#292d32]">
                  Help and contact
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-medium mb-4">Mobile app</h3>
            <a href="#" className="inline-block mb-6">
              <img src="/placeholder.svg?height=40&width=140" alt="Download on the App Store" width={140} height={40} className="h-10 w-auto" />
            </a>

            <h3 className="font-medium mb-2">Get 5% off</h3>
            <button className="bg-[#c3937c] text-white rounded-full px-4 py-2 text-sm mb-6">Subscribe Now</button>

            <h3 className="font-medium mb-2">Stay connected with</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-[#292d32]" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-[#292d32]" />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-[#292d32]" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 pt-8 border-t border-[#eaeaea]">
          <div className="mb-6">
            <img src={logo} alt="Enchanted Weddings" className="h-16 w-auto mx-auto" />
          </div>
        </div>

        <div className="text-center text-sm text-[#868686]">Copyright © 2024. All rights reserved.</div>
      </div>
    </footer>
  );
}
