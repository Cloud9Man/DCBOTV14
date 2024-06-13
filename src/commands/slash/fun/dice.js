const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const { log } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll the dice and ruin the lives of your friends'),
    options: {
        cooldown: 500
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        try {
            const diceMessage = Math.floor(Math.random() * 6);

            const diceEmbed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setDescription(`${interaction.user} rolled a dice.`)
                .setFields(
                    { name: 'What did they roll?:', value: `**${diceMessage}**`, inline: true }
                )
                .setColor(config.colors.default)

            await interaction.reply({
                embeds: [diceEmbed]
            });
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
