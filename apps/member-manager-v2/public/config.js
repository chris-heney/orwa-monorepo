// Runtime configuration for CI Synapse
// This file is loaded before the application starts and provides configuration
// that can be overridden at runtime without rebuilding the application

(function () {
    // Default configuration - these can be overridden by environment variables
    // or by replacing this file in production deployments
    window.APP_CONFIG = {
        VITE_API_URL: window.location.origin + '/api/v1',
        VITE_AUTHENTIK_CLIENT_ID: '',
        VITE_AUTHENTIK_AUTH_URL: '',
        VITE_AUTHENTIK_TOKEN_URL: '',
        VITE_REDIRECT_URI: window.location.origin,
        VITE_AUTHENTIK_LOGOUT_URL: '',
        VITE_AUTHENTIK_CLIENT_SECRET: '',
        VITE_GOOGLE_MAPS_API_KEY: '',
    };

    // In development, these values will be overridden by Vite's import.meta.env
    // In production, this file can be generated with actual values by docker-entrypoint.sh
    console.log('Runtime configuration loaded');
})();
