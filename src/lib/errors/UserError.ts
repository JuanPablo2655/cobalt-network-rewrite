export class UserError extends Error {
	/**
	 * An identifier, useful to localize emitted errors
	 */
	public readonly identifer: string;

	/**
	 * Constructs an UserError
	 * @param options The identifier, useful to localize emitted errors
	 * @param message The error message
	 */
	public constructor(options: UserError.Options, message: string) {
		super(message);
		this.identifer = options.identifer;
	}

	public get name(): string {
		return 'UserError';
	}
}

// eslint-disable-next-line no-redeclare
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserError {
	/**
	 * The options for {@link UserError}
	 */
	export interface Options {
		/**
		 * The identifier for this error
		 */
		identifer: string;
	}
}
