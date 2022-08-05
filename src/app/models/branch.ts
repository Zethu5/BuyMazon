export class Branch {
    city: string,
    address: string
    phone: string
    picture: string

    constructor(branch?: Branch) {
        this.city = branch?.city ?? '',
        this.address = branch?.address ?? '',
        this.phone = branch?.phone ?? '',
        this.picture = branch?.picture ?? ''
    }
}