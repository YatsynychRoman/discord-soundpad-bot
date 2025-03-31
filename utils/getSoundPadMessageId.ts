import { Client } from 'discord.js';

const getSoundPadMessageIdFactory = (client: Client) => async () => {
  // @ts-ignore
  const map = await (await client.channels.fetch('1356194736750460989')).messages.fetch();
  for (const message of map) {
    if (message[1].author.username === 'Krikun Pad' && message[1].content === 'Sound Pad') {
      return message[1].id;
    }
  }
};

export default getSoundPadMessageIdFactory;
