const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports = async (req, res, next) => {
  const data = req.body;
  const user = req.user;
  const type = req.headers['content-type'];

  logger.debug({ user, type }, 'POST /fragments');

  try {
    if (!Fragment.isSupportedType(type)) {
      throw new Error('Invalid type');
    }

    const size = Buffer.byteLength(data);
    const fragment = new Fragment({ ownerId: user, type: type, size: size });
    await fragment.save();
    await fragment.setData(data);
    const id = fragment.id;
    logger.debug(id, 'Post /fragments');

    const location = `${process.env.API_URL}/v1/fragments/${id}`;

    res.location(location);
    logger.debug({ location }, 'Location');
    res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    next(err);
  }
};
