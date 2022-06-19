export class Manufacturer {
    name: string
    logo: string
    type: string
    industry: string
    owner: string

    constructor(manufacturer?: Manufacturer) {
        this.name = manufacturer?.name ?? '',
        this.logo = manufacturer?.logo ?? '',
        this.type = manufacturer?.type ?? '',
        this.industry = manufacturer?.industry ?? '',
        this.owner = manufacturer?.owner ?? ''
    }
}