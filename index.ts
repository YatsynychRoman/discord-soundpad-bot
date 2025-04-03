import fs from 'fs';
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  IntentsBitField,
  Collection,
} from 'discord.js';
import { Player, QueryType, useMainPlayer } from 'discord-player';
import { AttachmentExtractor } from '@discord-player/extractor';

import 'dotenv/config'

import playSound from './services/playSound';
import deleteSound from './services/deleteSound';
import getSoundPadMessageIdFactory from './utils/getSoundPadMessageId';
import path from 'node:path';

const intents = new IntentsBitField();
intents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildVoiceStates,
  IntentsBitField.Flags.MessageContent,
);
const client: Client & { commands: Collection<unknown, unknown> } = new Client({ intents }) as Client & { commands: Collection<unknown, unknown> };
client.commands = new Collection();

// change to ./commands when developing locally
const commandFiles = fs
  .readdirSync(
    process.env.ENVIRONMENT === 'prod' ? './dist/commands' : './commands',
  )
  .filter(
    file => process.env.ENVIRONMENT === 'prod' ? file.endsWith('.js') : file.endsWith('.ts'),
  );

for (const file of commandFiles) {
  const command = require('./commands/' + file);
  client.commands.set(file.split('.')[0], command);
}

const player = new Player(client);
player.extractors.register(AttachmentExtractor, {});

client.on('ready', function () {
  console.log('Ready!');
  client.user?.presence.set({
    activities: [{name: 'жопі пальцем', type: 0}],
    status: 'online',
  });
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (oldState.member?.user.bot) {
    return;
  }
  const player = useMainPlayer();

  if (newState.channelId) {
    await player.play(newState.channelId, path.join(__dirname, 'sounds/pipe.mp3'), {
      nodeOptions: {
        leaveOnEnd: true,
      },
      searchEngine: QueryType.FILE,
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
  global.getSoundPadMessageId = getSoundPadMessageIdFactory(client);
  console.log('Logged in');
});

