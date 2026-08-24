const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config');
const { initSocketHandlers } = require('./socket/socketHandler');
const { initDiscordBot } = require('./discord/client');

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

// Initialize Socket Handlers
initSocketHandlers(io);

// Initialize Discord Bot with reference to io for real-time replies
initDiscordBot(io);

// Start listening
server.listen(config.port, config.host, () => {
  console.log(`
  =============================================================
  ⚡ DARK LIVE CHAT & DISCORD RELAY SERVER STARTED
  =============================================================
  📡 HTTP & WebSocket Port : ${config.port}
  🌐 Environment          : ${config.nodeEnv}
  📦 Database             : ${config.dbPath}
  🤖 Discord Bot Status   : ${config.discord.token ? 'Connecting...' : '⚠️ Token Missing in .env'}
  =============================================================
  `);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ HTTP/WS Server closed.');
    process.exit(0);
  });
});
