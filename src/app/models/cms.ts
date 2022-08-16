export class CMS {
    array0: number[]
    array1: number[]
    array2: number[]

    constructor(cms?: CMS) {
        this.array0 = cms?.array0 ?? []
        this.array1 = cms?.array1 ?? []
        this.array2 = cms?.array2 ?? []
    }
}