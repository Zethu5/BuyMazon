export class Order {
    addressInformation: {
        firstName: String
        lastName: String
        firstAddress: String
        secondAddress: String
        city: String
        region: String
        zipCode: String
        phone: String
        email: String
    }
    billingInformation: {
        cardNumber: String,
        nameOnCard: String,
        expirationDate: Date,
        securityCode: String
    }

    constructor(order?: Order) {
        this.addressInformation = order?.addressInformation ?? {
            firstName: '',
            lastName: '',
            firstAddress:  '',
            secondAddress: '',
            city:  '',
            region:  '',
            zipCode:  '',
            phone:  '',
            email:  ''
        },
        this.billingInformation = order?.billingInformation ?? {
                cardNumber: '',
                nameOnCard: '',
                expirationDate: new Date(),
                securityCode: ''
        }
    }
}