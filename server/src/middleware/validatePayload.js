function validatePayload(req, res, next) {
  const { columns, rows } = req.body;

  if (!Array.isArray(columns) || columns.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty "columns" array.' });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty "rows" array.' });
  }

  next();
}

module.exports = { validatePayload };
