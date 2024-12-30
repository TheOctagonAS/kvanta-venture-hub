/**
 * Mock implementation of Vipps login service
 * For real implementation, see: https://developer.vippsmobilepay.com/docs/APIs/login-api/
 */

// Mock configuration - these would come from Supabase secrets in production
const MOCK_CONFIG = {
  clientId: 'mock-client-id',
  redirectUri: 'http://localhost:5173/vipps-callback',
  testMode: true,
  // Test endpoints
  authEndpoint: 'https://apitest.vipps.no/access-management-1.0/access/',
  apiEndpoint: 'https://apitest.vipps.no/vipps-userinfo-api/',
  // Production endpoints would be:
  // authEndpoint: 'https://api.vipps.no/access-management-1.0/access/',
  // apiEndpoint: 'https://api.vipps.no/vipps-userinfo-api/'
};

interface VippsUserProfile {
  sub: string;          // Unique Vipps ID
  email?: string;       // Optional as per user privacy settings
  phone_number?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}

export const vippsService = {
  /**
   * Generates the OAuth2 URL for Vipps login
   * @returns URL to redirect user to Vipps login
   */
  getVippsLoginUrl(): string {
    const params = new URLSearchParams({
      client_id: MOCK_CONFIG.clientId,
      redirect_uri: MOCK_CONFIG.redirectUri,
      response_type: 'code',
      scope: 'openid name email phone',
      state: crypto.randomUUID(), // For CSRF protection
    });

    return `${MOCK_CONFIG.authEndpoint}oauth2/auth?${params.toString()}`;
  },

  /**
   * Handles the OAuth callback from Vipps
   * @param code Authorization code from Vipps
   * @returns Mock user profile data
   */
  async handleVippsCallback(code: string): Promise<VippsUserProfile> {
    console.log('Received Vipps authorization code:', code);

    // Mock successful authentication
    // In production, this would:
    // 1. Exchange code for access token
    // 2. Use access token to fetch user profile
    // 3. Return actual user data
    
    return {
      sub: 'mock-vipps-id-' + Math.random().toString(36).substr(2, 9),
      email: 'mock.user@example.com',
      phone_number: '+4712345678',
      name: 'Mock Vipps User',
      given_name: 'Mock',
      family_name: 'User',
      email_verified: true,
      phone_number_verified: true
    };
  }
};