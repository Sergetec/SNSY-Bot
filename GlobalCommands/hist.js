const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
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
            guildID: guildId,
        })
        if (!result.rolesHist){
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' });
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
                    guilID: guildId,
                    userID: user.id,
                })
                if (results.length === 0) {
                    let mesaj = new MessageEmbed()
                    .setColor('RED')
                    .addField(
                        `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                        'clean',
                    )
                    .setFooter(`Page: 1 • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                    return await interaction.reply({ embeds: [mesaj] });
                }
                let reply = ''
                const embeds = []
                var pages = {}
                var numberCheck = 0
                var existsPunishments = false;
                var pagina = 0
                for (const result of results){
                    if (result.guildID === guildId){
                        reply += `[${result._id}] **${result.type.toUpperCase()}** at ${new Date(result.createdAt).toLocaleDateString()} by <@${result.staffID}> for \`${result.reason}\`\n\n`
                        numberCheck++
                        if (numberCheck % 5 == 0){
                            pagina++
                            embeds.push(new MessageEmbed()
                                .setColor('RED')
                                .setFooter(`Page: ${pagina} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                                .addField(
                                    `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                                    `${reply}`,
                                )
                            )
                            reply = ''
                            existsPunishments = true
                        }
                    }
                }
                if (numberCheck % 5 != 0){
                    existsPunishments = true
                    pagina++
                    embeds.push(new MessageEmbed()
                        .setColor('RED')
                        .setFooter(`Page: ${pagina} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                        .addField(
                            `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                            `${reply}`,
                        )
                    )
                }
                if (reply == '' && !existsPunishments){
                    let mesaj = new MessageEmbed()
                    .setColor('RED')
                    .addField(
                        `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                        'clean',
                    )
                    .setFooter(`Page: 1 • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                    return await interaction.reply({ embeds: [mesaj] });
                }
                const getRow = (id) => {
                    const row = new MessageActionRow()

                    row.addComponents(
                        new MessageButton()
                        .setCustomId('prev_embed')
                        .setStyle('SECONDARY')
                        .setEmoji('⬅️')
                        .setDisabled(pages[id] === 0)
                    )

                    row.addComponents(
                        new MessageButton()
                        .setCustomId('next_embed')
                        .setStyle('SECONDARY')
                        .setEmoji('➡️')
                        .setDisabled(pages[id] === embeds.length - 1)
                    )
                    return row
                }
                const deadRow = new MessageActionRow()
                deadRow.addComponents(
                    new MessageButton()
                    .setCustomId('prev_disabled')
                    .setStyle('SECONDARY')
                    .setEmoji('⬅️')
                    .setDisabled(true)
                )

                deadRow.addComponents(
                    new MessageButton()
                    .setCustomId('next_disabled')
                    .setStyle('SECONDARY')
                    .setEmoji('➡️')
                    .setDisabled(true)
                )
                const id = interaction.user.id
                pages[id] = pages[id] || 0
                const embed = embeds[pages[id]]
                let collector
                const filter = (interaction) => interaction.user.id === id
                const time = 1000 * 60 * 5
                await interaction.reply({ embeds: [embed], components: [getRow(id)] })
                collector = interaction.channel.createMessageComponentCollector({ filter, time })
                collector.on('collect', async (btnInt) => {
                    if (!btnInt){
                        return;
                    }
                    // interaction.deferReply()
                    if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed'){
                        return;
                    }
                    await btnInt.deferUpdate()
                    switch (btnInt.customId){
                        case 'prev_embed':
                            --pages[id]
                            break;
                        case 'next_embed':
                            ++pages[id]
                            break;
                    }
                    await interaction.editReply({ embeds: [embeds[pages[id]]], components: [getRow(id)] })
                })
                collector.on('end', async () => {
                    await interaction.editReply({ embeds: [embeds[pages[id]]], components: [deadRow] })
                })
                return;
            }
        }
        await interaction.reply({ content: '**❌ You are not authorized to use this**' });
    }
}