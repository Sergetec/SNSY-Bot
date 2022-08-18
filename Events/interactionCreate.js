const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'interactionCreate',
    description: 'tickets / slash commands',
    on: true,
    async execute(interaction, client){
        /*

        TICKET - UNBAN

        */
        if (interaction.isButton()){
            const guildId = interaction.guild.id
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.bannedChannel){
                return;
            }
            if (!result.bannedCategory){
                return;
            }
            const category = result.bannedCategory

            if (!result.notificationsChannel){
                return;
            }
            const canalStaffNotif = result.notificationsChannel

            if (!result.staffRole){
                return;
            }
            const staff = result.staffRole.split(' ')
            if (interaction.customId === "open-ticket"){

                let user = interaction.member.id;
                let nameOfChannel = "unban-" + user;
                if ((interaction.guild.channels.cache.find(c => c.name === nameOfChannel))){
                    return;
                }
                await interaction.guild.channels.create(`unban-${user}}`, {
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: user,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: guildId,
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                }).then(async channel => {
                    for (const role of staff){
                        channel.permissionOverwrites.edit(role, {
                               VIEW_CHANNEL: true,
                               SEND_MESSAGES: true,
                               READ_MESSAGE_HISTORY: true,
                        });
                    }
                    var row = new MessageActionRow()
                    .addComponents(new MessageButton()
                    .setCustomId("close-ticket")
                    .setLabel("Inchide ticketul")
                    .setStyle("DANGER")
                    );
                    const mesaj = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription('Un membru staff iti va prelua cererea imediat ce va fi notificat.')
                    .setColor('RED')
                    await channel.send({content: `<@${user}> Aici este ticketul tau`, embeds: [mesaj], components: [row]});
                    await client.channels.cache.get(canalStaffNotif).send(`<@&${staff}> membrul <@${user}> a deschis cererea de unban <#${channel.id}>`)
                });
            }
            else if (interaction.customId === "close-ticket" && interaction.member.roles.cache.has(staff[0])){
                interaction.channel.delete();
            }
        }

        /*

        SLASH COMMANDS - HANDLER

        */
        if (interaction.isCommand())
        {
            await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const command = client.commands.get(interaction.commandName)
            if (!command){
                return;
            }
            command.execute(client, interaction);
        }
    }
}