const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug({ body: req.body }, 'PUT /fragments/:id');

  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Type!'));
  }

  const id = req.params.id.split('.')[0];

  try {
    const existingFragment = await Fragment.byId(req.user, id);

    if (!existingFragment) {
      return res.status(404).json(createErrorResponse(404, 'No fragmment found'));
    }

    if (existingFragment.type !== req.get('Content-Type')) {
      return res.status(400).json(createErrorResponse(400, 'Wrong content type!'));
    }

    const newFragment = new Fragment({
      ownerId: req.user,
      id: id,
      created: existingFragment.created,
      type: req.get('Content-Type'),
    });
    await newFragment.save();
    await newFragment.setData(req.body);

    logger.debug({ newFragment }, 'Fragment updated');

    res.set('Content-Type', newFragment.type);
    res.set('Location', `${process.env.API_URL}/v1/fragments/${newFragment.id}`);
    res.status(201).json(
      createSuccessResponse({
        fragment: newFragment,
      })
    );
  } catch (err) {
    res.status(500).json(createErrorResponse(500, err));
  }
};
