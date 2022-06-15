/**
 * Get fragment  with ID
 */

const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);
  const data = await fragment.getData();
  res.status(200).json(data.toString());
};
