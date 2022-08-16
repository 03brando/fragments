const express = require('express');
const logger = require('../logger');
// Version and author from package.json
const { version, author } = require('../../package.json');

// Our authorization middleware
const { authenticate } = require('../authorization');
const hash = require('../hash');
const { createSuccessResponse } = require('../response');

// Create a router that we can use to mount our API
const router = express.Router();
// Hashing
const hashEmail = async (req, res, next) => {
  req.user = hash(req.user);
  logger.debug(req.user, 'Hashed email');
  next();
};
/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), hashEmail, require('./api'));

/**
 * Define a simple health check route. If the server is running
 * We'll respond with a 200 OK. If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/03brando/fragments',
      version,
    })
  );
});

module.exports = router;
