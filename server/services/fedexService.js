// services/fedexService.js
const axios = require('axios');
require('dotenv').config();

class FedExService {
  constructor() {
    this.clientId = process.env.FEDEX_CLIENT_ID;
    this.clientSecret = process.env.FEDEX_CLIENT_SECRET;
    this.baseUrl = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com';
    
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
           this.clientId === 'mock_client_id' || 
           this.clientSecret === 'mock_client_secret';
  }

  /**
   * Fetches or retrieves a cached OAuth Access Token.
   */
  async getAccessToken() {
    // If we are using mock credentials, skip token retrieval and use simulation mode
    if (this.isMockCredentials()) {
      return 'mock_token';
    }

    // If token exists and is valid (with a 5-minute safety buffer), return it
    if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime - 300000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret
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
      
      console.log('✅ New FedEx Access Token acquired.');
      return this.accessToken;
    } catch (error) {
      console.error('⚠️ Error fetching FedEx access token. Falling back to simulation mode:', error.response?.data || error.message);
      return 'mock_token';
    }
  }

  /**
   * Fetches tracking details. Fallbacks to mock responses if credentials are not configured or fail.
   * @param {string} trackingNumber 
   */
  async getTrackingDetails(trackingNumber) {
    const token = await this.getAccessToken();

    if (token === 'mock_token') {
      console.log(`ℹ️ FedEx Service in Simulation Mode. Generating mock tracking data for ${trackingNumber}`);
      return this.getMockTrackingDetails(trackingNumber);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/track/v1/trackingnumbers`,
        {
          includeDetailedScans: true,
          trackingInfo: [
            {
              trackingNumberInfo: {
                trackingNumber: trackingNumber
              }
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-locale': 'en_US'
          }
        }
      );

      return this.parseTrackingResponse(response.data);
    } catch (error) {
      console.error(`⚠️ FedEx Tracking API error for ${trackingNumber}. Falling back to simulation mode:`, error.response?.data || error.message);
      return this.getMockTrackingDetails(trackingNumber);
    }
  }

  /**
   * Parses FedEx API response into local clean structure.
   */
  parseTrackingResponse(apiData) {
    const trackResult = apiData.output?.completeTrackResults?.[0]?.trackResults?.[0];
    
    if (!trackResult || trackResult.error || !trackResult.scanEvents) {
      throw new Error(trackResult?.error?.parameterList?.[0]?.value || 'Invalid tracking number or no tracking events found');
    }

    const latestStatus = trackResult.latestStatusDetail;
    const estimatedDelivery = trackResult.estimatedDeliveryTimeWindow?.window?.begins || trackResult.datesOrTimes?.find(d => d.type === 'ACTUAL_DELIVERY' || d.type === 'ESTIMATED_DELIVERY')?.dateOrTime;
    const shipmentDate = trackResult.datesOrTimes?.find(d => d.type === 'SHIPMENT')?.dateOrTime;
    
    const statusMap = {
      'OC': 'Label Created',
      'PU': 'Picked Up',
      'IT': 'In Transit',
      'OD': 'Out for Delivery',
      'DL': 'Delivered',
      'SE': 'Exception',
      'CA': 'Cancelled'
    };
    
    const mappedStatus = statusMap[latestStatus?.code] || 'In Transit';

    const events = trackResult.scanEvents.map(event => {
      let locationParts = [];
      if (event.eventAddress?.city) locationParts.push(event.eventAddress.city);
      if (event.eventAddress?.stateOrProvinceCode) locationParts.push(event.eventAddress.stateOrProvinceCode);
      if (event.eventAddress?.countryCode) locationParts.push(event.eventAddress.countryCode);

      return {
        timestamp: new Date(event.date),
        location: locationParts.join(', '),
        description: event.eventDescription,
        statusCode: event.eventType
      };
    });

    return {
      trackingNumber: trackResult.trackingNumber,
      status: mappedStatus,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      actualDelivery: mappedStatus === 'Delivered' ? new Date(latestStatus.date) : null,
      shipmentDate: shipmentDate ? new Date(shipmentDate) : null,
      events: events.sort((a, b) => b.timestamp - a.timestamp)
    };
  }

  /**
   * Generates mock tracking details to facilitate testing.
   */
  getMockTrackingDetails(trackingNumber) {
    const now = new Date();
    let status = 'In Transit';
    let steps = [];

    // Clean tracking number for routing
    const cleanedNumber = trackingNumber.replace(/\s+/g, '');

    if (cleanedNumber === '449012345551') {
      status = 'Delivered';
      steps = [
        { timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), location: 'Memphis, TN, US', description: 'Shipment information sent to FedEx', statusCode: 'OC' },
        { timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), location: 'Memphis, TN, US', description: 'Picked up by FedEx', statusCode: 'PU' },
        { timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), location: 'New York, NY, US', description: 'In transit - Departed FedEx location', statusCode: 'IT' },
        { timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), location: 'New York, NY, US', description: 'Out for delivery - On FedEx vehicle', statusCode: 'OD' },
        { timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), location: 'New York, NY, US', description: 'Delivered - Package left at front door', statusCode: 'DL' }
      ];
    } else if (cleanedNumber === '449012345552') {
      status = 'In Transit';
      steps = [
        { timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), location: 'Los Angeles, CA, US', description: 'Shipment information sent to FedEx', statusCode: 'OC' },
        { timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), location: 'Los Angeles, CA, US', description: 'Picked up by FedEx', statusCode: 'PU' },
        { timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), location: 'Oakland, CA, US', description: 'Arrived at FedEx sorting center', statusCode: 'IT' },
        { timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), location: 'Oakland, CA, US', description: 'In transit - Departed hub', statusCode: 'IT' }
      ];
    } else if (cleanedNumber === '449012345553') {
      status = 'Exception';
      steps = [
        { timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), location: 'Chicago, IL, US', description: 'Shipment information sent to FedEx', statusCode: 'OC' },
        { timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), location: 'Chicago, IL, US', description: 'Picked up by FedEx', statusCode: 'PU' },
        { timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), location: 'Chicago, IL, US', description: 'Delivery exception - Weather conditions delay', statusCode: 'SE' }
      ];
    } else {
      status = 'Label Created';
      steps = [
        { timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), location: 'Dallas, TX, US', description: 'Shipment information sent to FedEx', statusCode: 'OC' }
      ];
    }

    return {
      trackingNumber: trackingNumber,
      status: status,
      estimatedDelivery: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      actualDelivery: status === 'Delivered' ? new Date(now.getTime() - 2 * 60 * 60 * 1000) : null,
      shipmentDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      events: steps.sort((a, b) => b.timestamp - a.timestamp)
    };
  }
}

module.exports = new FedExService();
