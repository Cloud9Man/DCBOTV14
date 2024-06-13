const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, AttachmentBuilder, PermissionFlagsBits, Attachment } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const { log } = require("../../../functions");
const superagent = require('superagent');

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(true)
        .setName('gif')
        .setDescription("Ask for a GIF!")
        .addStringOption((opt) =>
            opt.setName('query')
                .setDescription('The gif you want to see')
                .setRequired(true)
        ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const query = interaction.options.getString('query');
            const key = Config.handler.giphy.uri.toString()
            const clientKey = "CloudyBot"
            const limit = 8;

            let randomGif = Math.floor(Math.random() * limit);

            const link = `https://tenor.googleapis.com/v2/search?q=${query}&key=${key}&client_key=${clientKey}&limit=${limit}`;

            const output = await superagent.get(link).catch((err) => {
                log(`Whoops! An error occured in ${__filename}. Error: ${err}`);
                return;
            });


            /*const meow = fetch(link)
                .then(response => response.json())
                .then(data => console.log(data))*/

            try {
                interaction.followUp({ content: `${interaction.user} searched for \`${query}\`~!` });
                interaction.channel.send({ content: output.body.results[randomGif].itemurl });
            } catch (error) {
                interaction.followUp({ content: `Whoops! Looks like I can't find a gif to match \`${query}\`!`});
                
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }
            
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
