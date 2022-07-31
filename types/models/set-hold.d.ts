import { Hold } from "./hangboard";
import Set, { hand } from "./set";

export interface SetHold {
    set?: Set,
    hold?: Hold,
    holdId: number,
    setId: number,
    hand: hand
}