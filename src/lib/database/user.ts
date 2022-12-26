import { container } from '#root/Container';
import { logger } from '#lib/structures';
import { User } from '@prisma/client';
const { prisma } = container;

export async function createUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return await prisma.user.create({
			data: {
				id,
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function deleteUser(id: string) {
	try {
		return await prisma.user.delete({ where: { id } });
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function getUser(id: string) {
	try {
		return await prisma.user.findUniqueOrThrow({ where: { id } });
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function updateUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return await prisma.user.update({
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
