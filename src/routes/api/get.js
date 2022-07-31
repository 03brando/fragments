const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports.getFrag = async (req, res) => {
  const user = req.user;
  const expand = req.query.expand || 0;

  const fragments = await Fragment.byUser(user, expand == 1);

  logger.debug({ fragments, expand }, 'Expanded fragments');

  res.status(200).json(createSuccessResponse({ fragments }));
};

module.exports.getById = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  logger.debug({ user, id }, 'User info and ID');

  try {
    const metadata = await Fragment.byId(user, id);
    const fragment = new Fragment(metadata);
    const data = await fragment.getData();
    res.type(fragment.type);
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
