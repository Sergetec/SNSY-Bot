const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'kick',
    description: 'kicks someone off the server',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be kicked',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the kick',
            required: true,
        },
    ],
    async execute(client, interaction){
        const guildId = interaction.guild.id;
        let ok = false
        const result = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result.rolesKick){
            return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
        const roles = result.rolesKick.split(" ")

        if (interaction.member.roles.cache.some(r => roles.includes(r.id))){
            ok = true;
        }
        if (ok == true){
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const kickedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (!user){
                return interaction.followUp('Can\'t find that member')
            }
            let memberTarget = interaction.guild.members.cache.get(user.id);
            if (memberTarget.roles.cache.some(r => roles.includes(r.id))){
                return interaction.followUp('**CAN\'T KICK THAT MEMBER**');
            }
            const result = await archiveSchema.findOne({
                userID: user.id,
                type: 'kick',
            })
            if (result){
                return interaction.followUp(`<@${user.id}> is already kicked out.`)
            }
            var kickReason = interaction.options.getString('reason');
            if (!kickReason){
                kickReason = 'No reason provided'
            }
            interaction.followUp(`<@${user.id}> was kicked by <@${interaction.user.id}>`)
            await memberTarget.kick({reason: kickReason});
            
            /*
                Fara sanctiuni-scheme, pt ca nu are rost daca deja e stocat in arhiva
            */

            //ARHIVA
            let arhiva = await archiveSchema.create({
                userID: user.id,
                staffID: interaction.user.id,
                reason: kickReason,
                type: 'kick',
            })
            arhiva.save();

            //#SANCTIUNI
            const mesaj = new MessageEmbed()
                .setTitle('KICK')
                .setColor('RED')
                .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                .addField(
                    'ID',
                    `${memberTarget.id}`,
                    true
                )
                .addField(
                    'Nickname',
                    memberTarget.nickname || kickedMember.tag.substring(0, kickedMember.tag.length - 5),
                    true
                )
                .addField(
                    'Mention',
                    `<@${memberTarget.id}>`,
                    true
                )
                .addField(
                    'Kicked by',
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
                    `${kickReason}`,
                    true
                )
                let channel = '995766750266278019'
                client.channels.cache.get(channel).send({ embeds: [mesaj] });
                return;
        }
        interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}