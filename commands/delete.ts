import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import fs from 'fs';
import path from 'node:path';
import createButton from '../services/createButton';

export = {
  name: 'delete',
  description: 'Видалити звук',
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const map = JSON.parse(fs.readFileSync(path.resolve('sounds/map.json'), 'utf-8'));
    const message = await interaction.fetchReply();

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < Math.ceil(Object.keys(map).length / 5); i++) {
      const buttons = new ActionRowBuilder<ButtonBuilder>();
      const sounds = Object.keys(map);
      for (let j = 0; j < 5; j++) {
        const sound = sounds[j + i * 5];
        if (!sound) continue;
        const button = createButton(`delete@${sound}@${message.id}`, map[sound].emoji, true);
        buttons.addComponents(button);
      }
      rows.push(buttons);
    }

    await interaction.followUp({ content: 'Обери звук який хочеш видалити', components: rows });
  }
}
