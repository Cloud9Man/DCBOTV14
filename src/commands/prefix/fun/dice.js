const { Message, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

module.exports = {
    structure: {
        name: 'dice',
        description: 'Roll the dice and ruin the lives of your friends',
        aliases: ['d'],
        permissions: 'Administrator',
        cooldown: 500
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const diceMessage = Math.floor(Math.random() * 6);

        const diceEmbed = new EmbedBuilder()
        .setTitle('Dice Roll')
        .setDescription(`${message.author} rolled a dice.`)
        .setFields(
            { name: 'What did they roll?:', value: `**${diceMessage}**`, inline: true }
        )
        .setColor(config.colors.default)

        await message.reply({
            embeds: [diceEmbed]
        });

    }
};
