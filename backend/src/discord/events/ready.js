const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`🤖 Discord Bot online as: ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: '⚡ DARK Dev Live Chat Support', type: ActivityType.Watching }],
      status: 'online'
    });
  }
};
