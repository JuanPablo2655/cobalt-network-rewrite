import { ApplicationCommandData } from 'discord.js';
import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '../cobaltClient';
import Interaction from '../Interaction';

const registerInteraction: Function = (cobalt: CobaltClient) => {
	const interactionFiles = sync(resolve(__dirname + '/../../interactions/**/*'));
	console.log(`[Interactions]\tLoaded ${interactionFiles.length} commands`);
	interactionFiles.forEach(async file => {
		if (/\.(j|t)s$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Interaction) {
				const interaction: Interaction = new File();
				interaction.cobalt = cobalt;
				cobalt.interactions.set(interaction.name, interaction);
				const data: ApplicationCommandData = {
					name: interaction.name,
					description: interaction.description ?? 'Empty description',
					options: interaction.options ?? [],
				};
				if (cobalt.devMode) await cobalt.guilds.cache.get('823300821994569748')?.commands.create(data);
				else await cobalt.application?.commands.create(data);
			}
		}
	});
};

export default registerInteraction;
