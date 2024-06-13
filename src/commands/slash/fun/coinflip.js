const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

const { log } = require('../../../functions')

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip the coin, baby girl'),
    options: {
        cooldown: 500
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            answers = ['Heads', 'Tails'];

            const message = answers[Math.floor(Math.random() * answers.length)];

            const coinEmbed = new EmbedBuilder()
                .setTitle('Coin Flip')
                .setDescription(`${interaction.user} flipped the coin`)
                .setFields(
                    { name: 'What did they flip?:', value: `**${message}**` }
                )
                .setColor(config.colors.default)

            await interaction.reply({
                embeds: [coinEmbed]
            });
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
