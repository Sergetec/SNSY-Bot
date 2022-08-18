const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { connection } = require('mongoose')

module.exports = {
    name: 'status',
    description: 'displays status of the bot',
    async execute(client, interaction){
        if (interaction.member.permissions.has('ADMINISTRATOR')){
            const ping = (interaction.createdTimestamp - Date.now()) * (-1)
            const mesaj = new MessageEmbed()
            .setColor('RED')
            .setDescription(`**CLIENT**: \`🟢 ONLINE\`\n**PING**: \`${ping}\`\n**UPTIME**: <t:${Math.floor(parseInt(client.readyAt / 1000))}:R>\n\n**DATABASE**: \`${switchTo(connection.readyState)}\``)
            return interaction.followUp({ embeds: [mesaj] })
        }
        return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}

function switchTo(val){
    var status = ' '
    switch (val) {
        case 0:
            status = '🔴 DISCONNECTED'
            break;
        case 1:
            status = '🟢 CONNECTED'
            break;
        case 2:
            status = '🟠 CONNECTING'
            break;
    }
    return status
}