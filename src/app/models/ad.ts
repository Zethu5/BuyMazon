export class Ad {
    info: String
    publisher: String
    active: Boolean

    constructor(ad?: Ad) {
        this.info = ad?.info ?? ''
        this.publisher = ad?.publisher ?? ''
        this.active = ad?.active ?? false
    }
}