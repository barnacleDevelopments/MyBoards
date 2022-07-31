import { Hangboard } from "./hangboard"
import Set from "./set"

export default interface Workout {
    id?: number,
    name: string,
    description: string,
    sets: Array<Set>,
    hangboard?: Hangboard,
    hangboardId?: number,
    userId?: string
}