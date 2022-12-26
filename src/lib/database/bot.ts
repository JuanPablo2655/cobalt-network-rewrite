import { container } from '#root/Container';
import { logger } from '#lib/structures';
import { Bot } from '@prisma/client';
const { prisma } = container;

export async function createBot(id: string, data?: Partial<Omit<Bot, 'id'>>) {
	try {
		return await prisma.bot.create({
			data: {
				id: id,
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function deleteBot(id: string) {
	try {
		return await prisma.bot.delete({
			where: { id },
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function getBot(id: string) {
	try {
		return await prisma.bot.findUniqueOrThrow({
			where: { id },
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function updateBot(id: string, data?: Partial<Omit<Bot, 'id'>>) {
	try {
		return await prisma.bot.update({
			where: { id },
			data: {
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}
