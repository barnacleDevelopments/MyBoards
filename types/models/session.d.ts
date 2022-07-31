
export interface LoggedRep {
    percentageCompleted: number,
    secondsCompleted: number,
    setId: string
}

export default interface Session {
    totalHangSeconds: number,
    dateCompleted: Date,
    workoutId: string,
    repLog: Array<LoggedRep>
} 