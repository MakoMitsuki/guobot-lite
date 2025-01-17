const { SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');
const kqmguide = require('../kqmguide.js');

const zzzchoices = [];
zzzguobaguide.zzzcharalist.forEach(character => {
    zzzchoices.push(character.charaname);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kqm')
		.setDescription('Gives the KQM for each character')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('character')
                .setDescription("The character you'd like to pull the KQM Graphic for.")
                .setRequired(true)
                .setAutocomplete(true)),

	async execute(interaction) {
		try {
            const chara = interaction.options.getString('character');
            const foundChara = kqmguide.kqmcharalist.find(g => g.charaname === chara.toString())
            if (foundChara) {
                const guideImages = foundChara.imgFiles;
                if (guideImages.length === 1) {
                    interaction.reply(`https://raw.githubusercontent.com/MakoMitsuki/guobot-lite/main/guides-kqm/${guideImages[0]}`);
                }
                else if (guideImages.length > 1) {
                    const allGuides = guideImages.map(i => `https://raw.githubusercontent.com/MakoMitsuki/guobot-lite/main/guides-kqm/${i}`).join('\n');
                    interaction.reply(allGuides);
                }
                else {
                    interaction.reply('No guide for this character!');
                }
            }
            else {
                await interaction.reply('Not found!');
            }
            
        } catch (error) {
            await interaction.reply('Error using the guoba command! Try again later!');
            console.log(error);
        }
	},

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        //Discord limits autocomplete options to max 25
		const filtered = zzzchoices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
};