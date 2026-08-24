const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) 
    : ['http://localhost:8080', 'http://127.0.0.1:8080'],
  dbPath: process.env.DB_PATH 
    ? path.resolve(__dirname, '../../', process.env.DB_PATH) 
    : path.join(__dirname, '../database/livechat.sqlite'),
  discord: {
    token: process.env.DISCORD_BOT_TOKEN || '',
    channelId: process.env.DISCORD_CHANNEL_ID || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 10000,
    maxMessages: parseInt(process.env.RATE_LIMIT_MAX_MESSAGES, 10) || 5
  }
};

module.exports = config;
