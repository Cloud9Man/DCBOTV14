const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'userinfo',
        description: 'Spits out information about a user.',
        aliases: ['ui'],
        permissions: 'Administrator',
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        await message.reply({
            content: `Pong! Your ping is ${client.ws.ping}ms!`
        });

    }
};
