export interface IPollType {
    name: string;

    /**
     * The parameters available to a poll.
     *
     * **Warning:** In 2.0.0, this field will be required.
     *
     * @todo Make this mandatory in 2.0.0.
     */
    parameters?: string[];
}
