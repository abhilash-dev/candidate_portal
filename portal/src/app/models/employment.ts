export interface Employment {
    id?: string,
    user_id: string,
    company: string,
    position: string,
    from: Date,
    to?: Date
}