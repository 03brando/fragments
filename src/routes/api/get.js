const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports.getFrag = async (req, res) => {
  const user = req.user;
  const expand = req.query.expand || 0;

  const fragments = expand == 1 ? await Fragment.byUser(user, true) : await Fragment.byUser(user);

  res.status(200).json(createSuccessResponse({ fragments }));
};

module.exports.getById = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  logger.debug({ user, id }, 'User Info and ID');

  try {
    const fragment = await Fragment.byId(user, id);
    const data = (await fragment.getData()).toString();
    logger.debug(data, 'Data by ID');

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

module.exports.getInfo = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  logger.debug({ user, id }, 'User Info and ID');

  try {
    const fragment = await Fragment.byId(user, id);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    next(err);
  }
};
