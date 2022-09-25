import { SetHold } from "./set-hold";

export enum fingerCount { oneFinger = 1, twoFinger = 2, threeFinger = 3, fourFinger = 4 }
export enum gripType { fullCrimp, halfCrimp, opendHand }
export enum hand { left = 0, right = 1 }

export default interface Set {
    [key: string]: any,
    id?: number,
    instructions: string,
    instructionAudioURL: string,
    hangTime: number,
    restTime: number,
    reps: number,
    restBeforeNextSet: number,
    leftGripType: gripType,
    rightGripType: gripType,
    indexPosition: number,
    setHolds?: Array<SetHold>,
    weight: number
}

