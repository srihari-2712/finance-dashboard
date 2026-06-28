const { createHash } = require('crypto');

const store = new Map();
const TTL_MS = 30 * 60 * 1000; // 30 minutes

function fingerprint(columns, rows) {
  const payload = JSON.stringify({ columns, sample: rows.slice(0, 5) });
  return createHash('sha256').update(payload).digest('hex');
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) { store.delete(key); return null; }
  return entry.value;
}

function set(key, value) {
  store.set(key, { value, ts: Date.now() });
}

module.exports = { fingerprint, get, set };
