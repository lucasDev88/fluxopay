import type { State } from "../../components/home/types/State"

export type Payment = {
    id: string,
    name: string,
    price: number,
    situation: State
}