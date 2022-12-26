import { container } from '#root/Container';
import { logger } from '#lib/structures';
import { Member } from '@prisma/client';
const { prisma } = container;

export async function createMember(
	userId: string,
	guildId: string,
	data?: Partial<Omit<Member, 'userId' | 'guildId'>>,
) {
	try {
		return prisma.member.create({
			data: {
				user: {
					connectOrCreate: { where: { id: userId }, create: { id: userId } },
				},
				guild: {
					connectOrCreate: { where: { id: guildId }, create: { id: guildId } },
				},
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function deleteMember(userId: string, guildId: string) {
	try {
		return prisma.member.delete({
			where: { MemberId: { userId, guildId } },
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function getMember(userId: string, guildId: string) {
	try {
		return prisma.member.findUniqueOrThrow({
			where: { MemberId: { userId, guildId } },
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export async function updateMember(
	userId: string,
	guildId: string,
	data?: Partial<Omit<Member, 'userId' | 'guildId'>>,
) {
	try {
		return prisma.member.update({
			where: { MemberId: { userId, guildId } },
			data: {
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}
