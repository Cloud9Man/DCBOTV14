const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Config = require('../../../config');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const answers = [
            `I'd love to play ping pong, but I assume you wanted to see the latency -`,
            `ping pong :3 | the latency is`,
            `The latency is`,
            `meow meow meow meow meow meow meow meow meow | the latency is`,
            `oh? daddy wants to see the latency? | the latency is`,
            `Rawwwwrr! | the latency is`,
            `pong pong pong pong pong pong pong pong pong pong pong pong pong pong pong pong pong pong | the latency is`,
        ]

        try {
            const randomAnswer = answers[(Math.floor(Math.random() * answers.length))]

            const pingEmbed = new EmbedBuilder()
            .setTitle("Pong!")
            .setColor(Config.colors.default)
            .setDescription(`${randomAnswer} ${client.ws.ping}ms`)
            await interaction.reply({
                embeds: [pingEmbed]
            });
        } catch (error) {
            await interaction.reply({
                content: `Uh oh! Something went wrong, err: ${error}`,
                ephemeral: true
            })

            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
