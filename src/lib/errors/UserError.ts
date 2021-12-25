export class UserError extends Error {
	public readonly identifer: string;
	public constructor(options: UserError.Options, message: string) {
		super(message);
		this.identifer = options.identifer;
	}

	public get name(): string {
		return 'UserError';
	}
}

export namespace UserError {
	export interface Options {
		identifer: string;
	}
}
