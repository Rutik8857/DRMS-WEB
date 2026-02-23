"use client";

import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Heart className="mr-2" /> HealthAI
          </h3>
          <p className="text-gray-400 text-sm">
            A college project dedicated to improving public health awareness through Artificial Intelligence.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Home</li>
            <li>Consultation</li>
            <li>Doctors</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="text-gray-400 text-sm">Computer Science Dept.</p>
          <p className="text-gray-400 text-sm">University of Technology</p>
          <p className="text-gray-400 text-sm mt-2">admin@healthai.edu</p>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
        © 2023 HealthAI Project. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;