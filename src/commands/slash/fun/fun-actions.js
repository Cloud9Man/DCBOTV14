const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Embed, EmbedAssertions, RoleFlagsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const { log } = require("../../../functions");

//Schemas

const ThanksSchema = require('../../../schemas/ThanksSchema');
const { config } = require('dotenv');
const { Tags } = require('nekosapi/v3/types/Tags');
const { link } = require('fs');

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName('fun-actions')
        .setDescription(`Request a fun attachement of some sort`)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('hug')
                .setDescription('Hug someone!')
                .addUserOption((opt) =>
                    opt
                        .setName('user')
                        .setDescription(`Who do you want to hug?`)
                        .setRequired(false)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('kiss')
                .setDescription('kiss someone!')
                .addUserOption((opt) =>
                    opt
                        .setName('user')
                        .setDescription(`Who do you want to hug?`)
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('cuddle')
                .setDescription('Cuddle with someone!')
                .addUserOption((opt) =>
                    opt
                        .setName('user')
                        .setDescription(`Who do you want to hug?`)
                        .setRequired(false))),

    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "hug") {

            await interaction.deferReply();

            const user = interaction.options.getUser('user');

            const url = `https://api.otakugifs.xyz/gif?reaction=hug`;

            if (user == null || user.id == null || user.id != interaction.user.id) {
                try {

                    const meow = await fetch(url, { method: 'GET' })
                        .then(res => res.json())
                        .then(data => interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(user ? `${interaction.user.displayName} hugged ${user.displayName}~` : `${interaction.user.displayName} hugged themselves :[`)
                                    .setImage(data.url)
                                    .setColor('Random')
                            ]
                        }));
                } catch (error) {
                    log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                    return;
                }
            }

            if (user.id == interaction.user.id) {
                try {

                    const meow = await fetch(url, { method: 'GET' })
                        .then(res => res.json())
                        .then(data => interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${interaction.user.displayName} hugged themselves :[`)
                                    .setImage(data.url)
                                    .setColor('Random')
                            ]
                        }));
                } catch (error) {
                    log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                    return;
                }
            }
        } else if (subcommand == "kiss") {

            await interaction.deferReply();

            const user = interaction.options.getUser('user');

            try {

                const url = `https://api.otakugifs.xyz/gif?reaction=kiss`;

                const meow = await fetch(url, { method: 'GET' })
                    .then(res => res.json())
                    .then(data => interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${interaction.user.displayName} kissed ${user.displayName}~`)
                                .setImage(data.url)
                                .setColor('Random')
                        ]
                    }));
            } catch (error) {
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }

        } else if (subcommand == "cuddle") {

            await interaction.deferReply();

            const user = interaction.options.getUser('user');

            const url = `https://api.otakugifs.xyz/gif?reaction=cuddle`;

            if (user == null || user.id == null || user.id != interaction.user.id) {
                try {

                    const meow = await fetch(url, { method: 'GET' })
                        .then(res => res.json())
                        .then(data => interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(user ? `${interaction.user.displayName} cuddled with ${user.displayName}~` : `${interaction.user.displayName} cuddled with themselves :[`)
                                    .setImage(data.url)
                                    .setColor('Random')
                            ]
                        }));
                } catch (error) {
                    log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                    return;
                }
            }

            if (user.id == interaction.user.id) {
                try {

                    const meow = await fetch(url, { method: 'GET' })
                        .then(res => res.json())
                        .then(data => interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${interaction.user.displayName} cuddled with themselves :[`)
                                    .setImage(data.url)
                                    .setColor('Random')
                            ]
                        }));
                } catch (error) {
                    log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                    return;
                }
            }
        }
    }
};
