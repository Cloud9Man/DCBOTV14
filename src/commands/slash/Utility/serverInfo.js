const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription("Get info about the server"),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const arr = [
            `**Server name**: ${interaction.guild.name}`,
            `**Server description**: ${interaction.guild.description || "none / undefined"}`,
            `**ID**: ${interaction.guild.id}`,
            `**Created at**: ${interaction.guild.createdAt}`,
            `**Guild ownerID**: (${interaction.guild.ownerId})`,
        ];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Server info')
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`${arr.join('\n')}`)
                    .setFooter({
                         text: `Requested by ${interaction.user.displayName}`,
                         iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .setColor('Blurple')
            ]
        });

    }
};
