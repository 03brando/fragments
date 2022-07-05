# The docker file for fragments microservice
#Stage 0: install base dependencies
# Use node version 16 with apline
FROM node:16.15.1-alpine3.14@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b as dependencies

LABEL maintainer="Brandon Kandola <bkandola@myseneca.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false
# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

################################################################

#Stage 1 build app for production
FROM node:16.15.1-alpine3.14@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b as production

RUN apk --no-cache add curl=7.83.1-r2 && apk --no-cache add dumb-init=1.2.5-r1

WORKDIR /app

COPY --chown=node:node --from=dependencies /app /app/

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

USER node


# Start the container by running our server
CMD ["dumb-init", "node", "src/index.js"]

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1

