const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urmom')
		.setDescription('Replies with gay'),
	async execute(interaction) {
		await interaction.reply('gay');
	},
};