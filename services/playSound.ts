import { QueryType, useMainPlayer } from 'discord-player';
import { ButtonInteraction, GuildMember, MessageFlagsBitField } from 'discord.js';
import fs from 'fs';
import * as path from 'node:path';

const isInVoiceChannel = (interaction) => {
  if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
    interaction.reply({
      content: 'Ти не в голосовому чаті!',
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });
    return false;
  }

  if (
    interaction.guild.members.me.voice.channelId &&
    interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
  ) {
    interaction.reply({
      content: 'Ти не зі мною в голосовому чаті!',
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });
    return false;
  }

  return true;
}

const playSound = async (interaction: ButtonInteraction) => {
  try {
    const inVoiceChannel = isInVoiceChannel(interaction);
    if (!inVoiceChannel) {
      return;
    }

    await interaction.deferReply();

    const player = useMainPlayer();
    const soundName = interaction.customId;
    const map = JSON.parse(fs.readFileSync(path.resolve(`sounds/map.json`), 'utf8'));
    console.log(map[soundName]);
    if (!map[soundName]) {
      await interaction.followUp({
        content: 'Не знаю як, але ти нажав на кнопку якої не існує...',
        flags: MessageFlagsBitField.Flags.Ephemeral
      });
      return;
    }

    const filePath = path.resolve(`sounds/${map[soundName].fileName}`);

    // Just ignore this 'if' :p
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      await interaction.followUp({ content: 'Залупа', flags: MessageFlagsBitField.Flags.Ephemeral });
      return;
    }

    await player.play(interaction.member.voice.channel.id, filePath, {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
          client: interaction.guild?.members.me,
          requestedBy: interaction.user.username,
        },
        leaveOnEmptyCooldown: 300000,
        leaveOnEmpty: true,
        leaveOnEnd: false,
      },
      searchEngine: QueryType.FILE
    });

    await interaction.followUp({ content: '.', flags: MessageFlagsBitField.Flags.Ephemeral });
    await interaction.deleteReply();
  } catch (e) {
    console.log(e);
    await interaction.followUp({
      content: 'Ти натворив якоїсь хуйні, спитай в Романа шо сталось',
      flags: MessageFlagsBitField.Flags.Ephemeral,
    })
  }
};

export default playSound;
