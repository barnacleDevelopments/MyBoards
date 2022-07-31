import { fingerCount } from "./set"

export interface Hold {
   id?: number,
   fingerCount: fingerCount,
   baseUIXCoord: number,
   baseUIYCoord: number,
   depthMM: number,
   index: number
}

export interface Hangboard {
   id?: number,
   name: string,
   holds: Hold[],
   imageURL: string,
   boardHeight: number,
   boardWidth: number,
}