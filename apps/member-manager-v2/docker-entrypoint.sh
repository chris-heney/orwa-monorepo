#!/bin/sh

# Generate runtime config with better error handling
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
    VITE_API_URL: '${VITE_API_URL:-}',
    VITE_AUTHENTIK_CLIENT_ID: '${VITE_AUTHENTIK_CLIENT_ID:-}',
    VITE_AUTHENTIK_AUTH_URL: '${VITE_AUTHENTIK_AUTH_URL:-}',
    VITE_AUTHENTIK_TOKEN_URL: '${VITE_AUTHENTIK_TOKEN_URL:-}',
    VITE_AUTHENTIK_LOGOUT_URL: '${VITE_AUTHENTIK_LOGOUT_URL:-}',
    VITE_AUTHENTIK_CLIENT_SECRET: '${VITE_AUTHENTIK_CLIENT_SECRET:-}',
    VITE_REDIRECT_URI: '${VITE_REDIRECT_URI:-}',
    VITE_GOOGLE_MAPS_API_KEY: '${VITE_GOOGLE_MAPS_API_KEY:-}',
};
EOF

# Start nginx
exec nginx -g 'daemon off;' 