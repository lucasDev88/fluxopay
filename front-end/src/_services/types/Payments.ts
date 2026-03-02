import type { StatePayment } from "../../components/home/types/State"

export type Payment = {
    id: string
    name: string,
    price: number,
    description: string
    situation: StatePayment
}