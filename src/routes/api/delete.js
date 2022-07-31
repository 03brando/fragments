const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  try {
    await Fragment.delete(user, id);

    logger.debug(id, 'deleted fragment');

    res.status(200).json(createSuccessResponse());
  } catch (err) {
    next(err);
  }
};
