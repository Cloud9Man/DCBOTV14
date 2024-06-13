const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    customId: 'modal-kick',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {

        const logReason = interaction.fields.getTextInputValue('reason');

        await interaction.reply({
            content: logReason
        });

    }
};