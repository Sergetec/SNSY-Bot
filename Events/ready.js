const mongoose = require("mongoose");
const mongoPath = process.env.MONGO_URI;
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ready',
    description: 'on startup | expired punishments',
    on: true,
    async execute (client){
        console.log('SNSY Bot online!');

        await mongoose.connect(mongoPath, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err);
        });
        
        client.user.setActivity('over wonderful communities', { type: 'WATCHING'});
        client.user.setStatus('online');

        // CHECK FOR EXPIRED PUNISHMENTS
        const check = async () => {
            //console.log('Checking database!')
            const query = {
                expires: { $lt: new Date() },
            }
            const results = await punishmentSchema.find(query)
            for (const result of results){
                const { userID, type } = result
                const guild = client.guilds.cache.get('984505316462981190')
                if (!await guild.members.cache.get(userID)){
                    await punishmentSchema.deleteMany(query)
                }
                const muteRole = guild.roles.cache.get('984869290194903060')
                const memberTarget = await guild.members.fetch(userID)
                if (type === 'mute'){
                    memberTarget.roles.remove(muteRole)

                    //ARHIVA
                    let arhiva = await archiveSchema.create({
                        userID: result.userID,
                        staffID: client.user.id,
                        reason: 'Mute expired',
                        type: 'unmute',
                    })
                    arhiva.save();

                    //#SANCTIUNI
                    const mesaj = new MessageEmbed()
                    .setTitle('UNMUTE')
                    .setColor('GREEN')
                    .setFooter(`${process.env.VERSION}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Unmuted by',
                        'MidNight Bot',
                        true
                    )
                    .addField(
                        'Reason',
                        'Mute expired',
                        true
                    )
                    let channel = '995766750266278019'
                    client.channels.cache.get(channel).send({ embeds: [mesaj] });
                }
            }
            await punishmentSchema.deleteMany(query)
            setTimeout(check, 2000 * 60)
        }
        check()
    }
}