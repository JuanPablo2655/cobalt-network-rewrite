export class UserError extends Error {
	public readonly context: unknown;
	public constructor(options: UserError.Options, message: string) {
		super(message);
		this.context = options.context ?? null;
	}

	public get name(): string {
		return 'UserError';
	}
}

export namespace UserError {
	export interface Options {
		context?: unknown;
	}
}
