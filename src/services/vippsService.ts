const BASE_URL = window.location.origin;

export const vippsService = {
  getVippsLoginUrl: () => {
    // Remove any trailing slashes and ensure clean URL formatting
    const cleanBaseUrl = BASE_URL.replace(/\/+$/, '');
    return `${cleanBaseUrl}/auth/login/vipps`;
  }
};