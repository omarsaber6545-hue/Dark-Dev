const { ActivityType, ChannelType } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`🤖 Discord Bot online as: ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: '⚡ DARK Dev Live Chat Support', type: ActivityType.Watching }],
      status: 'online'
    });

    client.guilds.cache.forEach(guild => {
      console.log(`🏰 Connected to Discord Server: ${guild.name} (ID: ${guild.id})`);
    });

    if (!config.discord.channelId) {
      for (const guild of client.guilds.cache.values()) {
        const textChannel = guild.channels.cache.find(
          c => (c.type === ChannelType.GuildText || c.type === 0) &&
               c.permissionsFor(guild.members.me)?.has('SendMessages')
        );
        if (textChannel) {
          config.discord.channelId = textChannel.id;
          console.log(`📢 Auto-selected Support Channel: #${textChannel.name} (ID: ${textChannel.id})`);
          break;
        }
      }
    }
  }
};
