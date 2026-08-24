const chatService = require('../services/chatService');
const { checkRateLimit, hashIp, sanitizeInput } = require('../services/securityService');
const { createGuestMessageEmbed, createSessionEndEmbed } = require('../discord/embeds');
const { getDiscordClient } = require('../discord/client');
const config = require('../config');

function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    const ipHash = hashIp(clientIp);
    let currentSessionId = null;

    console.log(`🔌 Client connected to live chat WebSocket: ${socket.id} (IP Hash: ${ipHash})`);

    // 1. Join / Initialize Live Chat Session
    socket.on('init_session', async ({ sessionId, guestName }, callback) => {
      try {
        const session = await chatService.getOrCreateSession(sessionId, guestName, ipHash);
        currentSessionId = session.id;

        // Join dedicated Socket.IO room for this session
        socket.join(`session:${session.id}`);

        // Fetch recent messages
        const history = await chatService.getMessages(session.id, 50);

        if (typeof callback === 'function') {
          callback({
            success: true,
            session: {
              id: session.id,
              guestName: session.guest_name,
              status: session.status
            },
            history
          });
        }
      } catch (err) {
        console.error('❌ Error initializing chat session:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Failed to initialize session.' });
        }
      }
    });

    // 2. Handle Visitor Message
    socket.on('send_message', async ({ sessionId, content, guestName, guestContact, guestTopic, url }, callback) => {
      try {
        const targetSessionId = sessionId || currentSessionId;
        if (!targetSessionId) {
          if (typeof callback === 'function') callback({ success: false, error: 'No active session.' });
          return;
        }

        // Rate Limit Check
        const rateCheck = checkRateLimit(targetSessionId);
        if (!rateCheck.allowed) {
          const waitSeconds = Math.ceil(rateCheck.resetInMs / 1000);
          socket.emit('rate_limit_exceeded', {
            message: `⚠️ يرجى الانتظار ${waitSeconds} ثوانٍ قبل إرسال رسالة جديدة لتجنب السبام.`,
            retryAfterMs: rateCheck.resetInMs
          });
          if (typeof callback === 'function') {
            callback({ success: false, error: 'Rate limit exceeded.' });
          }
          return;
        }

        const cleanContent = sanitizeInput(content);
        if (!cleanContent) {
          if (typeof callback === 'function') callback({ success: false, error: 'Empty message.' });
          return;
        }

        // Save message to SQLite database
        const savedMessage = await chatService.saveMessage({
          sessionId: targetSessionId,
          sender: 'user',
          content: cleanContent
        });

        // Broadcast to any other open tabs in visitor's room
        socket.to(`session:${targetSessionId}`).emit('new_message', {
          id: savedMessage.id,
          sessionId: targetSessionId,
          sender: 'user',
          content: cleanContent,
          createdAt: savedMessage.created_at
        });

        // Relay to Discord Channel via Bot
        const discordClient = getDiscordClient();
        if (discordClient && config.discord.channelId) {
          try {
            const channel = await discordClient.channels.fetch(config.discord.channelId);
            if (channel && channel.isTextBased()) {
              const embed = createGuestMessageEmbed({
                guestName: guestName || 'زائر الموقع',
                guestContact: guestContact || '',
                guestTopic: guestTopic || '',
                sessionId: targetSessionId,
                messageId: savedMessage.id,
                content: cleanContent,
                url: url || 'https://dark-dev.vercel.app',
                timestamp: savedMessage.created_at
              });

              const discordMsg = await channel.send({ embeds: [embed] });

              // Map Discord Message ID to this session for fast Reply routing
              await chatService.mapDiscordMessage(discordMsg.id, targetSessionId);
            }
          } catch (discordErr) {
            console.error('❌ Failed to relay message to Discord channel:', discordErr.message);
          }
        }

        if (typeof callback === 'function') {
          callback({ success: true, message: savedMessage });
        }
      } catch (err) {
        console.error('❌ Error handling visitor message:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Server error while sending message.' });
        }
      }
    });

    // 3. Visitor Typing Indicator
    socket.on('visitor_typing', ({ sessionId, isTyping }) => {
      const targetSessionId = sessionId || currentSessionId;
      if (targetSessionId) {
        socket.to(`session:${targetSessionId}`).emit('visitor_typing', { isTyping });
      }
    });

    // 4. Close Session
    socket.on('close_session', async ({ sessionId, guestName }, callback) => {
      try {
        const targetSessionId = sessionId || currentSessionId;
        if (targetSessionId) {
          await chatService.closeSession(targetSessionId);

          const discordClient = getDiscordClient();
          if (discordClient && config.discord.channelId) {
            const channel = await discordClient.channels.fetch(config.discord.channelId).catch(() => null);
            if (channel) {
              const embed = createSessionEndEmbed({
                guestName: guestName || 'الزائر',
                sessionId: targetSessionId
              });
              await channel.send({ embeds: [embed] }).catch(() => {});
            }
          }
        }

        if (typeof callback === 'function') callback({ success: true });
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false });
      }
    });

    // 5. Disconnect handling
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = {
  initSocketHandlers
};
