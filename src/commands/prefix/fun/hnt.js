const { Message, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

module.exports = {
    structure: {
        name: 'coinflip',
        description: 'Flip the coin and scew your friends over',
        aliases: ['cf'],
        permissions: 'Administrator',
        cooldown: 500
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        answers = [ 'Heads', 'Tails' ];

        const coinMessage = answers[Math.floor(Math.random() * answers.length)];

        const coinEmbed = new EmbedBuilder()
        .setTitle('Coin Flip')
        .setDescription(`${message.author} flipped the coin`)
        .setFields(
            { name: 'What did they flip?:', value: `**${coinMessage}**`, inline: true }
        )
        .setColor(config.colors.default)

        await message.reply({
            embeds: [coinEmbed]
        });

    }
};
