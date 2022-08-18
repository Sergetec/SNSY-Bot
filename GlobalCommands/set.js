const { Client, CommandInteraction } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'set',
    description: 'Setup channel/roles',
    options: [
        {
            name: 'main-role',
            type: 'SUB_COMMAND',
            description: 'The member role',
            options: [
                {
                    name: 'role',
                    description: 'The member role',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'banned-role',
            type: 'SUB_COMMAND',
            description: 'The banned role',
            options: [
                {
                    name: 'role',
                    description: 'The banned role',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'muted-role',
            type: 'SUB_COMMAND',
            description: 'The muted role',
            options: [
                {
                    name: 'role',
                    description: 'The muted role',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'warns-channel',
            type: 'SUB_COMMAND',
            description: 'The warns channel to display warns',
            options: [
                {
                    name: 'channel',
                    description: 'The warns channel',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'banned-channel',
            type: 'SUB_COMMAND',
            description: 'The banned channel for banned users',
            options: [
                {
                    name: 'channel',
                    description: 'The banned channel for banned users',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'banned-category',
            type: 'SUB_COMMAND',
            description: 'The banned category for banned users',
            options: [
                {
                    name: 'category',
                    description: 'The banned category for banned users',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'notifications-channel',
            type: 'SUB_COMMAND',
            description: 'The banned-notifications channel for banned users',
            options: [
                {
                    name: 'channel',
                    description: 'The banned-notification channel for banned users',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'staff-role',
            type: 'SUB_COMMAND',
            description: 'The staff-role to be tagged',
            options: [
                {
                    name: 'role',
                    description: 'The staff-role to be tagged',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction){
        const guildID = interaction.guild.id;
        let schema
        const subCommand = interaction.options.getSubcommand()
        switch (subCommand){
            case 'main-role':
                const mainRole = interaction.options.getRole('role')
                interaction.followUp(`✅ Role: ${mainRole} have been set as the main role.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.mainRole = mainRole
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        mainRole: mainRole,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newMainRole = schema.mainRole
                newMainRole = newMainRole.replaceAll('<', '');
                newMainRole = newMainRole.replaceAll('@', '');
                newMainRole = newMainRole.replaceAll('&', '');
                newMainRole = newMainRole.replaceAll('>', '');
                schema.mainRole = newMainRole
                await schema.save()

                break;
            case 'banned-role':
                const bannedRole = interaction.options.getRole('role')
                interaction.followUp(`✅ Role: ${bannedRole} have been set as the banned role.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.bannedRole = bannedRole
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        bannedRole: bannedRole,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newBannedRole = schema.bannedRole
                newBannedRole = newBannedRole.replaceAll('<', '');
                newBannedRole = newBannedRole.replaceAll('@', '');
                newBannedRole = newBannedRole.replaceAll('&', '');
                newBannedRole = newBannedRole.replaceAll('>', '');
                schema.bannedRole = newBannedRole
                await schema.save()

                break;
            case 'muted-role':
                const mutedRole = interaction.options.getRole('role')
                interaction.followUp(`✅ Role: ${mutedRole} have been set as the muted role.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.mutedRole = mutedRole
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        mutedRole: mutedRole,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newMutedRole = schema.mutedRole
                newMutedRole = newMutedRole.replaceAll('<', '');
                newMutedRole = newMutedRole.replaceAll('@', '');
                newMutedRole = newMutedRole.replaceAll('&', '');
                newMutedRole = newMutedRole.replaceAll('>', '');
                schema.mutedRole = newMutedRole
                await schema.save()

                break;
            case 'warns-channel':
                const warnsChannel = interaction.options.getChannel('channel')
                interaction.followUp(`✅ Channel: ${warnsChannel} have been set as the warns channel.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.warnsChannel = warnsChannel
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        warnsChannel: warnsChannel,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newWarnsChannel = schema.warnsChannel
                newWarnsChannel = newWarnsChannel.replaceAll('<', '');
                newWarnsChannel = newWarnsChannel.replaceAll('#', '');
                newWarnsChannel = newWarnsChannel.replaceAll('>', '');
                schema.warnsChannel = newWarnsChannel
                await schema.save()

                break;
            case 'banned-channel':
                const bannedChannel = interaction.options.getChannel('channel')
                interaction.followUp(`✅ Channel: ${bannedChannel} have been set as the banned channel.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.bannedChannel = bannedChannel
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        bannedChannel: bannedChannel,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newBannedChannel = schema.bannedChannel
                newBannedChannel = newBannedChannel.replaceAll('<', '');
                newBannedChannel = newBannedChannel.replaceAll('#', '');
                newBannedChannel = newBannedChannel.replaceAll('>', '');
                schema.bannedChannel = newBannedChannel
                await schema.save()

                break;
            case 'banned-category':
                const bannedCategory = interaction.options.getChannel('category')
                interaction.followUp(`✅ Category: ${bannedCategory} have been set as the banned category.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.bannedCategory = bannedCategory
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        bannedCategory: bannedCategory,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newBannedCategory = schema.bannedCategory
                newBannedCategory = newBannedCategory.replaceAll('<', '');
                newBannedCategory = newBannedCategory.replaceAll('#', '');
                newBannedCategory = newBannedCategory.replaceAll('>', '');
                schema.bannedCategory = newBannedCategory
                await schema.save()

                break;
            case 'notifications-channel':
                const noticationsChannel = interaction.options.getChannel('channel')
                interaction.followUp(`✅ Channel: ${noticationsChannel} have been set as the notifications channel.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.notificationsChannel = noticationsChannel
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        notificationsChannel: noticationsChannel,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newNotificationsChannel = schema.notificationsChannel
                newNotificationsChannel = newNotificationsChannel.replaceAll('<', '');
                newNotificationsChannel = newNotificationsChannel.replaceAll('#', '');
                newNotificationsChannel = newNotificationsChannel.replaceAll('>', '');
                schema.notificationsChannel = newNotificationsChannel
                await schema.save()

                break;
            case 'staff-role':
                const staffRole = interaction.options.getRole('role')
                interaction.followUp(`✅ Role: ${staffRole} have been set as the staff role.`)

                //Check for the same guild -> update
                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                if (schema){
                    schema.staffRole = staffRole
                    await schema.save();
                }
                else{
                    //DATABASE
                    schema = await guildCommandsSchema.create({
                        guildID: guildID,
                        staffRole: staffRole,
                    })
                    await schema.save();
                }

                schema = await guildCommandsSchema.findOne({
                    guildID: guildID,
                })
                var newStaffRole = schema.staffRole
                newStaffRole = newStaffRole.replaceAll('<', '');
                newStaffRole = newStaffRole.replaceAll('@', '');
                newStaffRole = newStaffRole.replaceAll('&', '');
                newStaffRole = newStaffRole.replaceAll('>', '');
                schema.staffRole = newStaffRole
                await schema.save()
        }
    }
}