const VIPPS_CONFIG = {
  clientId: import.meta.env.VITE_VIPPS_CLIENT_ID || 'mock-client-id',
  redirectUri: `${window.location.origin}/vipps-callback`,
  scope: 'openid name email phoneNumber',
  responseType: 'code',
};

export const vippsService = {
  getVippsLoginUrl(): string {
    const params = new URLSearchParams({
      client_id: VIPPS_CONFIG.clientId,
      redirect_uri: VIPPS_CONFIG.redirectUri,
      response_type: VIPPS_CONFIG.responseType,
      scope: VIPPS_CONFIG.scope,
      state: crypto.randomUUID(), // For CSRF protection
    });

    // Use test environment for development
    const baseUrl = import.meta.env.DEV 
      ? 'https://apitest.vipps.no/access-management-1.0/access/oauth2/auth'
      : 'https://api.vipps.no/access-management-1.0/access/oauth2/auth';

    return `${baseUrl}?${params.toString()}`;
  },
};