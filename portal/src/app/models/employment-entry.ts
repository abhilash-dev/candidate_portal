import { Employment } from "../models/employment"

export class EmploymentEntry implements Employment {
    company: string;
    position: string;
    from: Date;
    to?: Date;
}