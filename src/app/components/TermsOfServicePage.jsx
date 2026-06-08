import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export function TermsOfServicePage({ onBack }) {
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
            Terms of <span className="italic text-gray-500">Service</span>
          </h1>

          <div className="space-y-12 font-sans text-gray-700 font-light leading-relaxed" style={{ fontSize: '1.05rem' }}>
            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>1. Acceptance of Terms</h2>
              <p>By accessing and using the Unicorn Jewels website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
            </section>

            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>2. Intellectual Property Rights</h2>
              <p>The Site and its original content, features, and functionality are owned by Unicorn Jewels and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site.</p>
            </section>

            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>3. Product Information and Pricing</h2>
              <p className="mb-4">We strive to display our products and their colors as accurately as possible. However, the displayed colors of the products will depend upon your monitor and we cannot guarantee that your monitor will accurately portray the actual colors of the products.</p>
              <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
            </section>

            <section id="shipping-returns">
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>4. Shipping and Returns</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Shipping Policy</h3>
                  <p className="mb-4">All items purchased from Unicorn Jewels are made pursuant to a shipment contract. This means that the risk of loss and title for such items pass to you upon our delivery to the carrier.</p>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>Shipping Methods:</strong></p>
                    <p>We offer multiple shipping options to suit your needs. All orders are carefully packaged and insured to ensure safe delivery. Tracking information will be provided via email upon shipment.</p>
                    
                    <p><strong>Domestic Shipping:</strong></p>
                    <p>Standard Delivery (5-7 business days) — Free on orders over $500</p>
                    <p>Express Delivery (2-3 business days) — Available for an additional fee</p>
                    <p>Next Day Delivery — Available for select items in major metropolitan areas</p>
                    
                    <p><strong>International Shipping:</strong></p>
                    <p>We ship to select countries worldwide. International orders may be subject to customs duties and taxes. All international orders include tracking and insurance.</p>
                    
                    <p><strong>Processing Time:</strong></p>
                    <p>Most orders are processed and shipped within 2-3 business days. Custom and made-to-order pieces may require additional time.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Returns and Exchanges</h3>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>Return Window:</strong></p>
                    <p>Customers have 30 days from the date of delivery to initiate a return. Items must be in original condition with all packaging materials.</p>
                    
                    <p><strong>Condition Requirements:</strong></p>
                    <p>Items must be unworn, unwashed, and in original packaging. Jewelry must not show any signs of wear or damage. Items that have been resized, engraved, or customized cannot be returned unless they are defective.</p>
                    
                    <p><strong>Return Process:</strong></p>
                    <p>1. Contact our customer service team at support@unicornjewels.com to initiate a return</p>
                    <p>2. Obtain a return shipping label (prepaid shipping)</p>
                    <p>3. Pack items securely and ship back to us</p>
                    <p>4. Once received and inspected, refunds will be processed within 5-7 business days</p>
                    
                    <p><strong>Exchanges:</strong></p>
                    <p>If you wish to exchange an item for a different size, color, or style, we're happy to help. Exchanges follow the same 30-day policy. Return shipping is prepaid, and exchange items are shipped at no additional cost.</p>
                    
                    <p><strong>Refunds:</strong></p>
                    <p>Full refunds include the original purchase price. Shipping costs are non-refundable unless the item was damaged or defective upon arrival. Refunds are issued to the original payment method.</p>
                    
                    <p><strong>Damaged or Defective Items:</strong></p>
                    <p>If you receive a damaged or defective item, please contact us immediately with photos. We will arrange for a replacement or full refund at no cost to you, including return shipping.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Special Orders and Custom Pieces</h3>
                  
                  <div className="space-y-3 text-sm">
                    <p>Custom and made-to-order pieces are non-returnable once production has begun. We recommend scheduling a consultation with our team before placing a custom order to ensure you're completely satisfied with the design.</p>
                    
                    <p>Sale items and clearance merchandise are final sale and non-returnable.</p>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>5. Limitation of Liability</h2>
              <p>In no event shall Unicorn Jewels, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>

            <section id="size-guide">
              <h2 className="text-2xl text-black mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>6. Size Guide</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Ring Sizing</h3>
                  <p className="mb-4">Finding the perfect ring size is essential for comfort and security. Here's how to measure your ring size accurately:</p>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>Method 1: Use an Existing Ring</strong></p>
                    <p>Take a ring that fits you perfectly and measure the inner diameter in millimeters. Compare this measurement to our ring size chart below.</p>
                    
                    <p><strong>Method 2: String Measurement</strong></p>
                    <p>Wrap a piece of string around your finger at the base (not too tight, not too loose). Mark where the string overlaps, then measure in millimeters and convert using our sizing chart.</p>
                    
                    <p><strong>Method 3: Professional Sizing</strong></p>
                    <p>Visit any jewelry store or book an appointment with our team at Unicorn Jewels for a professional sizing session.</p>
                  </div>
                  
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-3">US Size</th>
                          <th className="text-left py-2 px-3">Inner Diameter (mm)</th>
                          <th className="text-left py-2 px-3">Circumference (mm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">4</td>
                          <td className="py-2 px-3">14.9</td>
                          <td className="py-2 px-3">47</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">5</td>
                          <td className="py-2 px-3">15.7</td>
                          <td className="py-2 px-3">49.3</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">6</td>
                          <td className="py-2 px-3">16.5</td>
                          <td className="py-2 px-3">51.8</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">7</td>
                          <td className="py-2 px-3">17.4</td>
                          <td className="py-2 px-3">54.6</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">8</td>
                          <td className="py-2 px-3">18.2</td>
                          <td className="py-2 px-3">57.2</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">9</td>
                          <td className="py-2 px-3">19.0</td>
                          <td className="py-2 px-3">59.7</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">10</td>
                          <td className="py-2 px-3">19.8</td>
                          <td className="py-2 px-3">62.2</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3">11</td>
                          <td className="py-2 px-3">20.7</td>
                          <td className="py-2 px-3">65.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Necklace Sizing</h3>
                  <p className="mb-4">Necklace length determines how the pendant sits on your neck. Here are our standard lengths:</p>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>Choker:</strong> 14-16 inches — Sits snugly at the base of the neck</p>
                    <p><strong>Princess:</strong> 17-19 inches — The most popular length, sits just below the collarbone</p>
                    <p><strong>Matinée:</strong> 20-24 inches — Falls to mid-chest, elegant and versatile</p>
                    <p><strong>Opera:</strong> 25-30 inches — Makes a statement, can be worn long or doubled</p>
                    <p><strong>Rope:</strong> 30+ inches — Can be worn long, knotted, or wrapped</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Bracelet Sizing</h3>
                  <p className="mb-4">The perfect bracelet should fit comfortably with one finger's width of space between your wrist and the bracelet.</p>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>XSmall:</strong> 6.0 - 6.5 inches — For delicate wrists</p>
                    <p><strong>Small:</strong> 6.5 - 7.0 inches</p>
                    <p><strong>Medium:</strong> 7.0 - 7.5 inches — Most common size</p>
                    <p><strong>Large:</strong> 7.5 - 8.0 inches</p>
                    <p><strong>XLarge:</strong> 8.0 - 8.5 inches</p>
                  </div>
                </div>
              </div>
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
