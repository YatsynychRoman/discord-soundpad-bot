import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, MessageFlagsBitField } from 'discord.js';
import fs from 'fs';
import createButton from '../services/createButton';
import * as path from 'node:path';

export = {
  name: 'init',
  description: 'Ініціалізація (не вжимайте будь ласка)',
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const map = JSON.parse(fs.readFileSync(path.resolve('sounds/map.json'), 'utf-8'));
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < Math.ceil(Object.keys(map).length / 5); i++) {
      const buttons = new ActionRowBuilder<ButtonBuilder>();
      const sounds = Object.keys(map);
      for (let j = 0; j < 5; j++) {
        const sound = sounds[j + i * 5];
        if (!sound) continue;
        const button = createButton(sound, map[sound].emoji);
        buttons.addComponents(button);
      }
      rows.push(buttons);
    }

    await interaction.followUp({ content: 'Sound Pad' , components: rows });
  }
};

