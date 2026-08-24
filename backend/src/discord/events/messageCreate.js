const chatService = require('../../services/chatService');
const config = require('../../config');

module.exports = {
  name: 'messageCreate',
  async execute(message, client, io) {
    // Ignore messages from bots (including self)
    if (message.author.bot) return;

    // Check if the message is in the designated support channel
    if (config.discord.channelId && message.channelId !== config.discord.channelId) {
      return;
    }

    // Check if this message is a Reply to another message
    if (!message.reference || !message.reference.messageId) {
      return;
    }

    const referencedMsgId = message.reference.messageId;

    try {
      // Find the session ID matching this Discord Message
      const sessionId = await chatService.getSessionByDiscordMessageId(referencedMsgId);

      if (!sessionId) {
        // Not a reply to a live chat ticket
        return;
      }

      const content = message.content.trim();
      if (!content) return;

      // Save support reply to database
      const savedMessage = await chatService.saveMessage({
        sessionId,
        sender: 'support',
        content,
        discordMsgId: message.id
      });

      // Map this new response message ID too so replies to replies also work!
      await chatService.mapDiscordMessage(message.id, sessionId);

      // Emit real-time message via Socket.IO to the specific visitor's room
      if (io) {
        io.to(`session:${sessionId}`).emit('support_message', {
          id: savedMessage.id,
          sessionId,
          sender: 'support',
          content,
          supportName: message.member?.displayName || message.author.username,
          avatarUrl: message.author.displayAvatarURL({ dynamic: true }),
          createdAt: savedMessage.created_at
        });

        // Send typing stop signal
        io.to(`session:${sessionId}`).emit('support_typing', { isTyping: false });
      }

      // Add a reaction to confirm to support in Discord that the reply was delivered
      await message.react('✅').catch(() => {});

      console.log(`📡 Relayed Discord reply to website session: ${sessionId} by ${message.author.tag}`);
    } catch (err) {
      console.error('❌ Error handling Discord reply relay:', err);
      await message.react('❌').catch(() => {});
    }
  }
};
