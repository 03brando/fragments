# This is the Dockerfile for fragments microservice

# Use node alpine version because it saves space
FROM node:16.14-alpine3.14@sha256:98a87dfa76dde784bb4fe087518c839697ce1f0e4f55e6ad0b49f0bfd5fbe52c

LABEL maintainer="Alastair Odhiambo <alastairodhiambo@outlook.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

COPY --chown=node:node . /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/


# Install node dependencies defined in package-lock.json
RUN npm ci -only=production \
# Install tini
&& apk add --no-cache tini=~0.19.0

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Make the entrypoint tini
ENTRYPOINT ["/sbin/tini", "--"]

# Change the user before we run the app
USER node

# Start the container by running our server
CMD ["node","src/server.js"]

# We run our service on port 8080
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=3m CMD curl --fail http://localhost:${PORT}/ || exit 1
