#!/bin/sh
set -e

# Substitui os placeholders pelas env vars reais do container
#!/bin/sh
envsubst '${VITE_API_URL}' < /usr/share/nginx/html/env-template.js > /usr/share/nginx/html/env.js

# Segue o comando padrão do nginx
exec "$@"