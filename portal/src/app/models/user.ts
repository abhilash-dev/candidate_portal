import { Employment } from "./employment"

export interface User {
    id: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    age: string,
    experience: number,
    employment_history?: Employment[]
}