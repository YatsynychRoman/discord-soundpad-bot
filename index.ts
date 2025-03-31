import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  IntentsBitField,
  Collection, MessageFlagsBitField
} from 'discord.js';
import { Player } from 'discord-player';
import { AttachmentExtractor } from '@discord-player/extractor';
import fs from 'fs';
import 'dotenv/config'
import playSound from './services/playSound';
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
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));

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

  if (message.content === '!init' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands as any)
      .then(() => {
        message.reply('Deployed!');
      })
      .catch(err => {
        message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async (interaction: ChatInputCommandInteraction | ButtonInteraction) => {
  if (interaction instanceof ButtonInteraction) {
    await playSound(interaction);
    return;
  }
  const command = client.commands.get(interaction.commandName.toLowerCase()) as any;

  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: 'There was an error trying to execute that command!',
    });
  }
});
console.log(fs.readFileSync(path.resolve('lastSoundPadMessage'), 'utf8'))
client.login(process.env.DISCORD_BOT_TOKEN).then(async () => console.log('Logged in'));
