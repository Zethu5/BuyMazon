export class Branch {
    city: string
    address: string
    phone: string
    picture: string
    coordinates: {
        lat: number,
        lng: number
    }

    constructor(branch?: Branch) {
        this.city = branch?.city ?? '',
        this.address = branch?.address ?? '',
        this.phone = branch?.phone ?? '',
        this.picture = branch?.picture ?? ''
        this.coordinates = {
            lat: 0,
            lng: 0
        }
    }
}