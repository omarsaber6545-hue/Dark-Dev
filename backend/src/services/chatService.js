const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database/connection');
const { sanitizeInput } = require('./securityService');

class ChatService {
  /**
   * Get or create a session for a visitor
   */
  async getOrCreateSession(sessionId, guestName = 'زائر (Guest)', ipHash = '') {
    if (sessionId) {
      const existing = await dbAsync.get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
      if (existing) {
        // Update last active
        await dbAsync.run(
          'UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE id = ?',
          [sessionId]
        );
        return existing;
      }
    }

    // Generate new session
    const newId = sessionId || uuidv4();
    const cleanName = sanitizeInput(guestName) || `زائر #${Math.floor(1000 + Math.random() * 9000)}`;

    await dbAsync.run(
      'INSERT INTO sessions (id, guest_name, ip_hash, status) VALUES (?, ?, ?, ?)',
      [newId, cleanName, ipHash, 'active']
    );

    return {
      id: newId,
      guest_name: cleanName,
      ip_hash: ipHash,
      status: 'active'
    };
  }

  /**
   * Save a chat message to the database
   */
  async saveMessage({ sessionId, sender, content, discordMsgId = null }) {
    const cleanContent = sanitizeInput(content);
    if (!cleanContent) throw new Error('Message content cannot be empty.');

    const result = await dbAsync.run(
      'INSERT INTO messages (session_id, sender, content, discord_msg_id) VALUES (?, ?, ?, ?)',
      [sessionId, sender, cleanContent, discordMsgId]
    );

    // Update session last_active
    await dbAsync.run('UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE id = ?', [sessionId]);

    return {
      id: result.lastID,
      session_id: sessionId,
      sender,
      content: cleanContent,
      discord_msg_id: discordMsgId,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Map a Discord Message ID to a session for replies
   */
  async mapDiscordMessage(discordMsgId, sessionId) {
    if (!discordMsgId || !sessionId) return;
    await dbAsync.run(
      'INSERT OR REPLACE INTO discord_mappings (discord_msg_id, session_id) VALUES (?, ?)',
      [discordMsgId, sessionId]
    );
  }

  /**
   * Find session ID by referenced Discord Message ID
   */
  async getSessionByDiscordMessageId(discordMsgId) {
    const mapping = await dbAsync.get(
      'SELECT session_id FROM discord_mappings WHERE discord_msg_id = ?',
      [discordMsgId]
    );
    if (mapping) return mapping.session_id;

    // Check directly in messages table as fallback
    const msg = await dbAsync.get(
      'SELECT session_id FROM messages WHERE discord_msg_id = ?',
      [discordMsgId]
    );
    return msg ? msg.session_id : null;
  }

  /**
   * Retrieve messages history for a session
   */
  async getMessages(sessionId, limit = 50) {
    const rows = await dbAsync.all(
      'SELECT id, session_id, sender, content, discord_msg_id, created_at FROM messages WHERE session_id = ? ORDER BY id ASC LIMIT ?',
      [sessionId, limit]
    );
    return rows;
  }

  /**
   * Close a chat session
   */
  async closeSession(sessionId) {
    await dbAsync.run('UPDATE sessions SET status = "closed" WHERE id = ?', [sessionId]);
  }
}

module.exports = new ChatService();
