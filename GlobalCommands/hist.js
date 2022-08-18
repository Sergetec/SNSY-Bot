const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'hist',
    description: 'shows the hist of a user',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to show the hist',
            required: true,
        },
    ],
    async execute (client, interaction){
        const guildId = interaction.guild.id;
        let ok = false
        const result = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result.rolesHist){
            return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
        const roles = result.rolesHist.split(" ")

        if (interaction.member.roles.cache.some(r => roles.includes(r.id))){
            ok = true;
        }
        if (ok == true){
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const targetedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            let memberTarget = interaction.options.getUser('user');
            if (user){
                const results = await archiveSchema.find({
                    userID: user.id,
                })
                if (results.length === 0) {
                    let mesaj = new MessageEmbed()
                    .setColor('RED')
                    .addField(
                        `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                        'clean',
                    )
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                    return interaction.followUp({ embeds: [mesaj] });
                }
                let reply = ''
                for (const result of results) {
                    reply += `[${result._id}] **${result.type.toUpperCase()}** at ${new Date(result.createdAt).toLocaleDateString()} by <@${result.staffID}> for \`${result.reason}\`\n\n`
                }
                let mesaj = new MessageEmbed()
                .setColor('RED')
                .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                .addField(
                    `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                    `${reply}`,
                )
                interaction.followUp({ embeds: [mesaj] });
                return;
            }
        }
        interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}