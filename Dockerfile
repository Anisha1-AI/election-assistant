FROM nginx:alpine
COPY . /usr/share/nginx/html

# Cloud Run provides the PORT environment variable
ENV PORT 8080

# Replace the default port 80 with the Cloud Run port in nginx config
CMD sed -i -e 's/listen  *80;/listen '"$PORT"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
