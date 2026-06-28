const { Router } = require('express');
const { validatePayload } = require('../middleware/validatePayload');
const { analyzeDataset } = require('../lib/gemini');
const cache = require('../lib/cache');

const router = Router();

router.post('/', validatePayload, async (req, res) => {
  const { columns, rows } = req.body;
  const sample = rows.slice(0, 100);
  const key = cache.fingerprint(columns, sample);

  const cached = cache.get(key);
  if (cached) {
    console.log('[analyze] cache hit');
    return res.json({ ...cached, cached: true });
  }

  try {
    const result = await analyzeDataset(columns, sample);
    cache.set(key, result);
    res.json(result);
  } catch (err) {
    console.error('[analyze] error:', err.message);
    res.status(502).json({ error: err.message ?? 'Failed to analyze dataset.' });
  }
});

module.exports = router;
