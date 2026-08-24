const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('../config');
const readyEvent = require('./events/ready');
const messageCreateEvent = require('./events/messageCreate');

let client = null;

function initDiscordBot(io) {
  if (!config.discord.token) {
    console.warn('⚠️ DISCORD_BOT_TOKEN is not set in .env. Discord Bot relay will run in simulated mode.');
    return null;
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message]
  });

  client.once(readyEvent.name, () => readyEvent.execute(client));
  client.on(messageCreateEvent.name, (message) => messageCreateEvent.execute(message, client, io));

  client.login(config.discord.token).catch((err) => {
    console.error('❌ Failed to login to Discord Bot:', err.message);
  });

  return client;
}

function getDiscordClient() {
  return client;
}

module.exports = {
  initDiscordBot,
  getDiscordClient
};
