import { ButtonBuilder, ButtonStyle } from 'discord.js';

const createButton = (buttonName: string, emoji?: string, isDelete = false): ButtonBuilder => {
  return new ButtonBuilder()
    .setCustomId(buttonName)
    .setLabel(isDelete ? buttonName.split('@')[1] as string : buttonName)
    .setStyle(isDelete ? ButtonStyle.Danger : ButtonStyle.Primary)
    .setEmoji(emoji ? emoji : '');
}

export default createButton;
