const { EmbedBuilder } = require('discord.js');

/**
 * Builds an ultra-sleek, luxury dark obsidian embed for new live chat messages
 */
function createGuestMessageEmbed({ guestName, guestContact, guestTopic, sessionId, messageId, content, url = 'https://dark-dev.vercel.app', timestamp = new Date() }) {
  const embed = new EmbedBuilder()
    .setColor(0x000000) // Pure Obsidian Black
    .setAuthor({
      name: `💬 LIVE CHAT | رسالة من عميل`,
      iconURL: 'https://raw.githubusercontent.com/omarsaber6545-hue/Dark-Dev/main/assets/images/favicon.svg'
    })
    .setDescription(
      `> 👤 **اسم العميل:** \`${guestName}\`\n` +
      (guestContact ? `> 📫 **وسيلة التواصل:** \`${guestContact}\` *(اضغط للنسخ)*\n` : '') +
      (guestTopic ? `> 🎯 **نوع الاستفسار:** **${guestTopic}**\n` : '') +
      `> 🔑 **Session ID:** \`${sessionId}\`\n\n` +
      `**📝 نص الرسالة:**\n` +
      `\`\`\`txt\n${content}\n\`\`\`\n` +
      `*💡 للرد على العميل مباشرة داخل الموقع: قم بعمل **Reply** على هذه الرسالة.*`
    )
    .setFooter({
      text: `DARK LIVE CHAT ENGINE • 2026`,
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
