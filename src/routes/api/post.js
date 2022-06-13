// src/routes/api/post

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
require('dotenv').config();

module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body) === true) {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });

    await fragment.save();

    res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
  } else {
    res.status(415).json(createErrorResponse(415, 'not supported type'));
  }
};
