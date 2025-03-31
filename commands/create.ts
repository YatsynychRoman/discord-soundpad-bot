import {
  ChatInputCommandInteraction,
  MessageFlagsBitField,
  ApplicationCommandOptionType,
  ActionRowBuilder, ButtonBuilder
} from 'discord.js';
import fs from 'fs';
import https from 'https';
import * as path from 'node:path';
import createButton from '../services/createButton';

export = {
  name: 'create',
  description: 'Додати новий звук',
  options: [
    {
      name: 'name',
      type: ApplicationCommandOptionType.String,
      description: 'Назва звуку',
      required: true,
    },
    {
      name: 'file',
      type: ApplicationCommandOptionType.Attachment,
      description: 'Завантаж файл',
      required: true,
    },
    {
      name: 'emoji',
      type: ApplicationCommandOptionType.String,
      description: 'Emoji',
      required: true,
    },
  ],
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const file = interaction.options.getAttachment('file')!;
    const name = interaction.options.get('name')!.value as string;
    if (name.includes('@')) {
      await interaction.followUp({ content: 'Не можна використовувати символ @ у назві', flags: MessageFlagsBitField.Flags.Ephemeral });
    }
    const emoji = interaction.options.get('emoji')?.value as string | undefined;

    const map = JSON.parse(fs.readFileSync(path.resolve('sounds/map.json'), 'utf8'));
    const [fileName, format] = file.name.split('.') as string[];
    if (format !== 'mp3' && format !== 'wav') {
      await interaction.followUp({ content: 'Я підтримую лише .mp3 та .wav формат', flags: MessageFlagsBitField.Flags.Ephemeral });
      return;
    }
    const downloadedFile = fs.createWriteStream(path.resolve(`sounds/${name}.${format}`), 'utf8');
    https.get(file.url, (res) => {
      res.pipe(downloadedFile).on('finish', async () => {
        map[name] = {
          emoji,
          fileName: `${name}.${format}`,
        }
        fs.writeFileSync(path.resolve('sounds/map.json'), JSON.stringify(map));
        const rows: ActionRowBuilder<ButtonBuilder>[] = [];
        for (let i = 0; i < Math.ceil(map.length / 5); i++) {
          const buttons = new ActionRowBuilder<ButtonBuilder>();
          for (const sound of Object.keys(map)) {
            const button = createButton(sound, map[sound].emoji);
            buttons.addComponents(button);
          }
          rows.push(buttons);
        }
        console.log(rows)
        const messageId = await global.getSoundPadMessageId();

        // @ts-ignore
        await (await interaction.channel.messages.fetch(messageId)).delete()
        await interaction.followUp({ content: 'Sound Pad' , components: rows });
      });
    });
  }
};

