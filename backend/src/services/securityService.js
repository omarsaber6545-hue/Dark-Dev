const crypto = require('crypto');
const config = require('../config');

// In-memory sliding window rate limiter per session & IP
const rateLimits = new Map();

/**
 * Hash an IP address for privacy while maintaining abuse prevention capability
 */
function hashIp(ip) {
  if (!ip) return 'unknown';
  return crypto.createHash('sha256').update(ip + 'dark_salt_2026').digest('hex').substring(0, 16);
}

/**
 * Sanitize text inputs to prevent XSS attacks and injection
 */
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  
  // Trim and remove null bytes / control characters
  let clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  
  // Replace HTML special chars with safe entities
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
    
  return clean;
}

/**
 * Check if a session or IP exceeds the rate limit
 * Returns { allowed: boolean, remaining: number, resetInMs: number }
 */
function checkRateLimit(key) {
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const max = config.rateLimit.maxMessages;

  if (!rateLimits.has(key)) {
    rateLimits.set(key, []);
  }

  const timestamps = rateLimits.get(key);
  
  // Filter out timestamps outside the sliding window
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= max) {
    const oldest = validTimestamps[0];
    const resetInMs = windowMs - (now - oldest);
    return { allowed: false, remaining: 0, resetInMs };
  }

  validTimestamps.push(now);
  rateLimits.set(key, validTimestamps);
  
  return { 
    allowed: true, 
    remaining: max - validTimestamps.length, 
    resetInMs: windowMs 
  };
}

// Clean up stale rate limit entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  for (const [key, timestamps] of rateLimits.entries()) {
    const active = timestamps.filter(ts => now - ts < windowMs);
    if (active.length === 0) {
      rateLimits.delete(key);
    } else {
      rateLimits.set(key, active);
    }
  }
}, 300000);

module.exports = {
  hashIp,
  sanitizeInput,
  checkRateLimit
};
