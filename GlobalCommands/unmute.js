const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'unmute',
    description: 'unmutes a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be unmute',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the unmute',
            required: true,
        },
    ],
    async execute(client, interaction){
        const guildId = interaction.guild.id;
        let ok = false
        const result = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result.rolesUnmute){
            return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
        const roles = result.rolesUnmute.split(" ")

        if (interaction.member.roles.cache.some(r => roles.includes(r.id))){
            ok = true;
        }
        if (ok == true){ 
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const mutedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (user){
                const result2 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result2.warnsChannel){
                    return interaction.followUp({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' });
                }
                const channel = result2.warnsChannel

                let memberTarget = interaction.guild.members.cache.get(user.id);
                var unmuteReason = interaction.options.getString('reason');
                await memberTarget.roles.remove(muteRole);
                interaction.followUp(`<@${memberTarget.user.id}> has been unmuted`);
                if (!unmuteReason){
                    unmuteReason = 'No reason provided'
                }
                
                //DELETING FRMO DATABASE
                const query = {
                    userID: memberTarget.user.id,
                }
                const results = await punishmentSchema.find(query)
                for (const result of results){
                    const { type } = result
                    if (type === 'mute'){
                        await punishmentSchema.deleteMany(query)
                    }
                }

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: unmuteReason,
                    type: 'unmute',
                })
                arhiva.save();

                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('UNMUTE')
                    .setColor('GREEN')
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Nickname',
                        memberTarget.nickname || mutedMember.tag.substring(0, mutedMember.tag.length - 5),
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Unmuted by',
                        `<@${interaction.user.id}>`,
                        true
                    )
                    .addField(
                        'Nickname',
                        interaction.user.nickname || interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                        true
                    )
                    .addField(
                        'Reason',
                        `${unmuteReason}`,
                        true
                    )
                    client.channels.cache.get(channel).send({ embeds: [mesaj] });
                    return;
            }
        }
        return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}