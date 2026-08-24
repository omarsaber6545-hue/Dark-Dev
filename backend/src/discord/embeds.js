const { EmbedBuilder } = require('discord.js');

/**
 * Builds an ultra-sleek, luxury dark obsidian embed for new live chat messages
 */
function createGuestMessageEmbed({ guestName, sessionId, messageId, content, url = 'https://dark-dev.vercel.app', timestamp = new Date() }) {
  const embed = new EmbedBuilder()
    .setColor(0x10b981) // Obsidian Emerald
    .setAuthor({
      name: `💬 LIVE CHAT INBOUND // رسالة جديدة من زائر`,
      iconURL: 'https://raw.githubusercontent.com/omarsaber6545-hue/Dark-Dev/main/assets/images/favicon.svg'
    })
    .setDescription(
      `> 👤 **الاسم / الزائر:** **${guestName}**\n` +
      `> 🔑 **Session ID:** \`${sessionId}\`\n` +
      `> 🆔 **Message ID:** \`#${messageId}\`\n` +
      `> 🌐 **الصفحة:** \`${url}\`\n\n` +
      `**📝 نص الرسالة:**\n` +
      `\`\`\`txt\n${content}\n\`\`\`\n` +
      `*💡 للرد على الزائر مباشرة داخل الموقع: قم بعمل **Reply** على هذه الرسالة.*`
    )
    .setFooter({
      text: `DARK LIVE RELAY ENGINE • ${new Date(timestamp).toLocaleTimeString('ar-EG')}`,
      iconURL: 'https://raw.githubusercontent.com/omarsaber6545-hue/Dark-Dev/main/assets/images/favicon.svg'
    })
    .setTimestamp(new Date(timestamp));

  return embed;
}

/**
 * Builds a notification embed when a session is closed or visitor leaves
 */
function createSessionEndEmbed({ guestName, sessionId }) {
  return new EmbedBuilder()
    .setColor(0x64748b)
    .setDescription(`🔒 **انتهت الجلسة:** قام الزائر **${guestName}** (\`${sessionId}\`) بإغلاق المحادثة.`)
    .setTimestamp();
}

module.exports = {
  createGuestMessageEmbed,
  createSessionEndEmbed
};
