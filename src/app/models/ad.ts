export class Ad {
    info: String
    products: []
    discountType: Number
    active: Boolean
    startDate: Date
    endDate: Date

    constructor(ad?: Ad) {
        this.info = ad?.info ?? ''
        this.products = ad?.products ?? []
        this.discountType = ad?.discountType ?? 0
        this.active = ad?.active ?? false
        this.startDate = ad?.startDate ?? new Date()
        this.endDate = ad?.endDate ?? new Date()
    }
}