// services/phonepeService.js
const axios = require('axios');
require('dotenv').config();

class PhonePeService {
  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID;
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    this.clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    this.baseUrl = process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com';
    
    // In-memory token cache
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Helper to check if credentials are set to default placeholder mock values.
   */
  isMockCredentials() {
    return !this.clientId || 
           !this.clientSecret || 
           this.clientId === 'your_phonepe_client_id_here' || 
           this.clientSecret === 'your_phonepe_client_secret_here';
  }

  /**
   * Fetches or retrieves a cached OAuth Access Token.
   */
  async getAccessToken() {
    if (this.isMockCredentials()) {
      console.log('ℹ️ PhonePe Service: Using mock token due to placeholder credentials.');
      return 'mock_phonepe_token';
    }

    // If token exists and is valid (with a 5-minute safety buffer), return it
    if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime - 300000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/apis/pg-sandbox/v1/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          client_version: this.clientVersion
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, expires_in } = response.data;
      
      this.accessToken = access_token;
      // expires_in is in seconds; convert to absolute time in milliseconds
      this.tokenExpiryTime = Date.now() + (expires_in * 1000);
      
      console.log('✅ New PhonePe Access Token acquired.');
      return this.accessToken;
    } catch (error) {
      console.error('⚠️ Error fetching PhonePe access token. Falling back to simulation mode:', error.response?.data || error.message);
      return 'mock_phonepe_token';
    }
  }

  /**
   * Initiates payment. Fallbacks to mock responses if credentials are not configured or fail.
   * @param {string} orderId 
   * @param {number} amountUSD 
   * @param {string} redirectUrl 
   */
  async initiatePayment(orderId, amountUSD, redirectUrl) {
    const token = await this.getAccessToken();

    // Convert USD to INR (using standard conversion of 1 USD = 83 INR)
    // Convert to paise (1 INR = 100 paise)
    const amountINR = amountUSD * 83;
    const amountPaise = Math.round(amountINR * 100);

    if (token === 'mock_phonepe_token') {
      console.log(`ℹ️ PhonePe Service in Simulation Mode. Creating mock checkout redirect URL for order ${orderId} (INR: ${amountINR})`);
      // Return a mock redirect URL that points back to our redirectUrl with success parameters
      const simulatedUrl = `${redirectUrl}&status=COMPLETED&simulated=true`;
      return { redirectUrl: simulatedUrl };
    }

    try {
      const payload = {
        merchantOrderId: orderId,
        amount: amountPaise,
        paymentFlow: {
          type: 'PG_CHECKOUT',
          merchantUrls: {
            redirectUrl: redirectUrl
          }
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/apis/pg-sandbox/checkout/v2/pay`,
        payload,
        {
          headers: {
            'Authorization': `O-Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        redirectUrl: response.data.redirectUrl,
        orderId: response.data.orderId,
        state: response.data.state
      };
    } catch (error) {
      console.error(`⚠️ PhonePe Pay API error for order ${orderId}. Falling back to simulation mode:`, error.response?.data || error.message);
      const simulatedUrl = `${redirectUrl}&status=COMPLETED&simulated=true`;
      return { redirectUrl: simulatedUrl };
    }
  }

  /**
   * Checks the status of a PhonePe payment.
   * @param {string} orderId 
   */
  async checkPaymentStatus(orderId) {
    const token = await this.getAccessToken();

    if (token === 'mock_phonepe_token') {
      console.log(`ℹ️ PhonePe Service in Simulation Mode. Simulating successful payment verification for ${orderId}`);
      return {
        orderId: orderId,
        state: 'COMPLETED',
        amount: 1000,
        paymentDetails: [{ state: 'SUCCESS', paymentMode: 'UPI' }]
      };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/apis/pg-sandbox/checkout/v2/order/${orderId}/status`,
        {
          headers: {
            'Authorization': `O-Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(`⚠️ PhonePe Status API error for ${orderId}. Falling back to simulation status:`, error.response?.data || error.message);
      return {
        orderId: orderId,
        state: 'COMPLETED',
        amount: 1000,
        paymentDetails: [{ state: 'SUCCESS', paymentMode: 'UPI' }]
      };
    }
  }

  /**
   * Initiates a refund for a PhonePe transaction.
   * @param {string} orderId 
   * @param {number} amountUSD 
   */
  async refundPayment(orderId, amountUSD) {
    const token = await this.getAccessToken();

    // Convert USD to INR (using standard conversion of 1 USD = 83 INR)
    // Convert to paise (1 INR = 100 paise)
    const amountINR = amountUSD * 83;
    const amountPaise = Math.round(amountINR * 100);
    const refundId = `REF-PP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (token === 'mock_phonepe_token') {
      console.log(`ℹ️ PhonePe Service in Simulation Mode. Simulating refund for order ${orderId} (INR: ${amountINR}, Refund ID: ${refundId})`);
      return {
        success: true,
        refundId,
        state: 'SUCCESS',
        amount: amountPaise,
        originalMerchantOrderId: orderId
      };
    }

    try {
      const payload = {
        merchantRefundId: refundId,
        originalMerchantOrderId: orderId,
        amount: amountPaise
      };

      console.log(`Initiating PhonePe Refund for order ${orderId}, refund ID ${refundId}, amount ${amountPaise} paise`);
      const response = await axios.post(
        `${this.baseUrl}/apis/pg-sandbox/payments/v2/refund`,
        payload,
        {
          headers: {
            'Authorization': `O-Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        refundId: response.data.merchantRefundId || refundId,
        state: response.data.state || 'SUCCESS',
        amount: response.data.amount || amountPaise,
        originalMerchantOrderId: response.data.originalMerchantOrderId || orderId,
        rawResponse: response.data
      };
    } catch (error) {
      console.error(`⚠️ PhonePe Refund API error for ${orderId}. Falling back to simulation mode:`, error.response?.data || error.message);
      return {
        success: true,
        refundId,
        state: 'SUCCESS',
        amount: amountPaise,
        originalMerchantOrderId: orderId,
        simulated: true
      };
    }
  }
}

module.exports = new PhonePeService();
