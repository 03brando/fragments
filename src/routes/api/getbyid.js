const path = require('path');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  logger.debug(`owner id and id: ${req.user}, ${req.params.id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id.split('.')[0]);

    if (!fragment) {
      logger.debug('no fragment with this id (in get-by-id.js)');
      return res.status(404).json(createErrorResponse(404, 'No fragment with this id'));
    }

    const data = await fragment.getData();

    const extension = path.extname(req.params.id);
    logger.debug('extension: ' + extension);
    if (extension) {
      const { convertedResult, convertedType } = await fragment.convertType(data, extension);

      if (!convertedResult) {
        return res.status(415).json(createErrorResponse(415, 'cannot convert!'));
      }

      res.set('Content-Type', convertedType);
      res.status(200).send(convertedResult);
    } else {
      res.set('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (e) {
    logger.warn(e.message, 'Cannot get fragment');
    res.status(500).json(createErrorResponse(500, e.message));
  }
};
