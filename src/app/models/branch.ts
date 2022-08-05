export class Branch {
    address: string
    phone: string
    picture: string

    constructor(branch?: Branch) {
        this.address = branch?.address ?? '',
        this.phone = branch?.phone ?? '',
        this.picture = branch?.picture ?? ''
    }
}