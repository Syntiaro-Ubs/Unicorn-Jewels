import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicyPage({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-16"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-6 block font-sans">Legal</span>
          <h1 className="text-5xl lg:text-7xl mb-16 text-black leading-tight" style={{ fontWeight: 300 }}>
            Privacy <span className="italic text-gray-500">Policy</span>
          </h1>

          <div className="space-y-12 font-sans text-gray-700 font-light leading-relaxed" style={{ fontSize: '1.05rem' }}>
            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>1. Introduction</h2>
              <p>Welcome to Unicorn Jewels. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            </section>

            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>2. The Data We Collect About You</h2>
              <p className="mb-4">Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes bank account and payment card details.</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
            </section>

            <div className="pt-12 border-t border-gray-200 mt-16">
              <p className="text-sm text-gray-500">Last Updated: October 2025</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
