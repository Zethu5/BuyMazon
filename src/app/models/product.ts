import { Manufacturer } from "./manufacturer"

export class Product {
    name: string
    picture: string
    code: string
    price: number
    weight: number
    weightUnit: string
    ingredients: string
    productionCountry: string
    manufacturer: Manufacturer

    constructor(product?: Product) {
        this.name = product?.name ?? '',
        this.picture = product?.picture ?? '',
        this.code = product?.code ?? '',
        this.price = product?.price ?? 0,
        this.weight = product?.weight ?? 0,
        this.weightUnit = product?.weightUnit ?? ''
        this.ingredients = product?.ingredients ?? '',
        this.productionCountry = product?.productionCountry ?? '',
        this.manufacturer = product?.manufacturer ?? new Manufacturer()
    }
}