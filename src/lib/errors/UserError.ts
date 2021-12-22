export class UserError extends Error {
	public constructor(message: string) {
		super(message);
	}

	public get name(): string {
		return 'UserError';
	}
}
