const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'guildMemberAdd',
    description: 'when someone joins the server',
    on: true,
    async execute(member, client, interaction){
        const guildId = member.guild.id;
        const results = await punishmentSchema.find({
            userID: member.id,
            guildID: guildId,
        })
        if (results.length == 0){
            if (guildId == '999749692239904929'){
                const mesaj = new MessageEmbed()
                .setColor("RED")
                .setAuthor(member.displayName, member.displayAvatarURL({ dynamic: true, size: 128 }))
                .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 128 }))
                .setDescription(
                    '<a:6417redcrown:993567797835735050> ◊ W E L C O M E ◊ <a:6417redcrown:993567797835735050>\n\n• [**Rules**](https://ptb.discord.com/channels/999749692239904929/999749693250744421) 📜\n• [**Self Roles**](https://ptb.discord.com/channels/999749692239904929/999749694102196260) 🎭\n• [**Roles Info**](https://ptb.discord.com/channels/999749692239904929/1001591448677920819) 📩\n\n **© Heaven Knights. All rights reserved.**'
                )
                let channel = '999749693762437187'
                await client.channels.cache.get(channel).send({ content: `<@${member.id}>`, embeds: [mesaj] });
            }
            if (guildId == '1011213883358326897'){
                const mesaj = new MessageEmbed()
                .setColor("RED")
                .setAuthor(member.displayName, member.displayAvatarURL({ dynamic: true, size: 128 }))
                .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 128 }))
                .setDescription(
                    '<a:6417redcrown:993567797835735050> ◊ W E L C O M E ◊ <a:6417redcrown:993567797835735050>\n\n• [**Rules**](https://ptb.discord.com/channels/1011213883358326897/1011213884520144949) 📜\n• [**Self Roles**](https://ptb.discord.com/channels/1011213883358326897/1011213884834709595) 🎭\n• [**Staff Apply**](https://ptb.discord.com/channels/1011213883358326897/1011213885082185781) 📩\n\n **© Liberty Social. All rights reserved.**'
                )
                let channel = '1011213884683730950'
                await client.channels.cache.get(channel).send({ content: `<@${member.id}>`, embeds: [mesaj] });
            }
            return;
        }
        for (const result of results){
            if (result.type == 'ban'){
    
                const result2 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result2.bannedRole){
                    return;
                }
                const banRole = result2.bannedRole
    
                member.roles.add(banRole);
            }
            if (result.type == 'mute'){
                const result3 = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result3.mutedRole){
                    return;
                }
                const muteRole = result3.mutedRole
    
                member.roles.add(muteRole);
            }
        }
    }
}