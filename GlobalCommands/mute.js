const { Client, CommandInteraction } = require('discord.js')
const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'mute',
    description: 'mutes a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be muted',
            required: true,
        },
        {
            name: 'duration',
            type: 'STRING',
            description: 'The duration of the mute',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the mute',
            required: true,
        },
    ],
    async execute(client, interaction){
        const guildId = interaction.guild.id;
        let ok = false
        const result = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result.rolesMute){
            return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
        const roles = result.rolesMute.split(" ")

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
                if (!result2.mutedRole){
                    return interaction.followUp({ content: '**❌ The muted role have not been set up. Please use `/set muted-role`**' });
                }
                const muteRole = result2.mutedRole

                const result3 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result3.warnsChannel){
                    return interaction.followUp({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' });
                }
                const channel = result3.warnsChannel

                let memberTarget = interaction.guild.members.cache.get(user.id);
                if (memberTarget.roles.cache.some(r => roles.includes(r.id))){
                    return interaction.followUp('**CAN\'T MUTE THAT MEMBER**');
                }
                const result = await punishmentSchema.findOne({
                    userID: user.id,
                    type: 'mute',
                })
                if (result){
                    return interaction.followUp(`<@${user.id}> is already muted.`)
                }
                var time = interaction.options.getString('duration');
                var muteReason = interaction.options.getString('reason');
                if (!containsNumber(time)){
                    return interaction.followUp('Invalid format');
                }
                let split = time.match(/\d+|\D+/g)
                let time2 = parseInt(split[0])
                let type = split[1].toLowerCase();
                if (type === 'h'){
                    time2 *= 60;
                }
                else if (type === 'd'){
                    time2 *= 60 * 24
                }
                else if (type !== 'm'){
                    return interaction.followUp('Invalid format.');
                }
                if (!time){
                    return interaction.followUp('Time not specified.');
                }
                if (!muteReason){
                    muteReason = 'No reason provided'
                    interaction.followUp(`<@${memberTarget.user.id}> has been muted for ${ms(ms(time))}`);
                }
                else{
                    interaction.followUp(`<@${memberTarget.user.id}> has been muted for ${muteReason}, ${ms(ms(time))}`);
                }

                await memberTarget.roles.add(muteRole);
                
                //SANCTIUNI
                const expires1 = new Date()
                expires1.setMinutes(expires1.getMinutes() + time2)
                let schema = await punishmentSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: muteReason,
                    expires: expires1,
                    type: 'mute',
                })
                schema.save();

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: muteReason,
                    type: 'mute',
                })
                arhiva.save();
                
                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('MUTE')
                    .setColor('RED')
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
                        'Muted by',
                        `<@${interaction.user.id}>`,
                        true
                    )
                    .addField(
                        'Nickname',
                        interaction.user.nickname ||interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                        true
                    )
                    .addField(
                        'Reason',
                        `${muteReason}`,
                        true
                    )
                    .addField(
                        'Time',
                        `${time}`,
                        true
                    )
                    client.channels.cache.get(channel).send({ embeds: [mesaj] });
                    return;
            }
        }
        interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}

function containsNumber(str){
    return /\d/.test(str);
  }