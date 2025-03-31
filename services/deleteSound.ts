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

  const soundPadMessageId = await global.getSoundPadMessageId();
  console.log(soundPadMessageId);
  // @ts-ignore
  await (await interaction.channel.messages.fetch(soundPadMessageId)).delete()
  await interaction.followUp({ content: 'Sound Pad' , components: rows });

  fs.writeFileSync(path.resolve('sounds/map.json'), JSON.stringify(map));
}

export default deleteSound;
