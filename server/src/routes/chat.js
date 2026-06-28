const { Router } = require('express');
const { validatePayload } = require('../middleware/validatePayload');
const { generateChatAnswer } = require('../lib/gemini');

const router = Router();

router.post('/', validatePayload, async (req, res) => {
  const { question, columns, rows } = req.body;

  if (typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Request body must include a non-empty "question" string.' });
  }

  try {
    const answer = await generateChatAnswer(question.trim(), columns, rows.slice(0, 100));
    res.json({ answer });
  } catch (err) {
    console.error('[chat] Gemini error:', err.message);
    res.status(502).json({ error: err.message ?? 'Failed to generate answer.' });
  }
});

module.exports = router;
