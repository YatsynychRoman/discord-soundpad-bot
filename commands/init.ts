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
    const buttons = new ActionRowBuilder<ButtonBuilder>();
    for (const sound of Object.keys(map)) {
      const button = createButton(sound, map[sound].emoji);
      buttons.addComponents(button);
    }

    await interaction.followUp({ content: 'Sound Pad' , components: [buttons] });
  }
};

