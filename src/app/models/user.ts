import { Product } from "./product"

export class User {
    username: string
    password: string
    email: string
    creationDate: Date
    firstName: string
    lastName: string
    dateOfBirth: Date
    isAdmin: boolean
    products: []

    constructor(user?: User) {
        this.username = user?.username ?? '',
        this.password = user?.password ?? '',
        this.email = user?.email ?? '',
        this.creationDate = user?.creationDate ?? new Date(Date.now()),
        this.firstName = user?.firstName ?? '',
        this.lastName = user?.lastName ?? ''
        this.dateOfBirth = user?.dateOfBirth ?? new Date(Date.now()),
        this.isAdmin = user?.isAdmin ?? false,
        this.products = user?.products ?? []
    }
}