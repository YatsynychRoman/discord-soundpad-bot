import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';
import fs from 'fs';
import path from 'node:path';
import createButton from './createButton';

const deleteSound = async (interaction: ButtonInteraction) => {
  await interaction.deferReply();
  const [_prefix, soundName, messageId] = interaction.customId.split('@');
  // @ts-ignore
  await (await interaction.channel.messages.fetch(messageId)).delete();
  const map = JSON.parse(fs.readFileSync(path.resolve('sounds/map.json'), 'utf-8'));
  delete map[soundName as string];
  const buttons = new ActionRowBuilder<ButtonBuilder>();
  for (const sound of Object.keys(map)) {
    const button = createButton(sound, map[sound].emoji);
    buttons.addComponents(button);
  }

  const soundPadMessageId = global.getSoundPadMessageId();

  // @ts-ignore
  await (await interaction.channel.messages.fetch(soundPadMessageId)).delete()
  await interaction.followUp({ content: 'Sound Pad' , components: [buttons] });

  fs.writeFileSync(path.resolve('sounds/map.json'), JSON.stringify(map));
}

export default deleteSound;
