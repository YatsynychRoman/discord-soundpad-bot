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

    const buttons = new ActionRowBuilder<ButtonBuilder>();
    for (const sound of Object.keys(map)) {

      const button = createButton(`delete@${sound}@${message.id}`, map[sound].emoji, true);
      buttons.addComponents(button);
    }

    await interaction.followUp({ content: 'Обери звук який хочеш видалити', components: [buttons] });
  }
}
