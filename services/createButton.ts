import { ButtonBuilder, ButtonStyle } from 'discord.js';

const createButton = (buttonName: string, emoji?: string): ButtonBuilder => {
  return new ButtonBuilder()
    .setCustomId(buttonName)
    .setLabel(buttonName)
    .setStyle(ButtonStyle.Primary)
    .setEmoji(emoji ? emoji : '');
}

export default createButton;
