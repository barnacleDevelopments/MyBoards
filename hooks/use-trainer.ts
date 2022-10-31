import {useRef, useState} from "react";
import Sound from "react-native-sound";
import {LoggedRep} from "../types/models/session";
import Workout from "../types/models/workout";
import Set from "../types/models/set";
import Tts from 'react-native-tts';
import {RepStack} from "../types/models/rep-stack";
import useMyBoardsAPI from "./use-myboards-api";

interface Trainer {
    UISet: Set,
    UIClock: Date,
    UIColor: string,
    UIRepStack: RepStack[],
    UIProgress: number,
    UITimerState: boolean,
    UIRemainingReps: number,
    activeTimerName: string,
    logRep: (repStack: RepStack) => void,
    setUIRepStack: (repStack: RepStack) => void,
    nextRep: () => void,
    previousRep: () => void,
    stopWorkout: () => void
    pauseWorkout: () => void,
    resumeWorkout: () => void,
    resetWorkout: () => void,
    nextSet: () => void,
    previousSet: () => void,
    startWorkout: () => Promise<void>
}

const useTrainer = (workout: Workout): Trainer => {

    let bundleSound = useRef<Sound>();
    let timerState;

    const remainingReps = useRef(0);
    let currentSetIndex = useRef(0);
    const firstRepLogged = useRef(false);
    const currentSet = useRef<Set>();
    const session = useRef({repLog: [], workoutId: workout.id});

    const workoutResolve = useRef();
    const [UISet, setUISet] = useState<Set|null>();
    const timerCount = useRef<number>(0);
    const [UIClock, setUIClock] = useState<Date>();
    const [UIColor, setUIColor] = useState<string>();
    const { logSession, logRepetition } = useMyBoardsAPI();
    const [UIProgress, setUIProgress] = useState<number>();
    const workTimerId = useRef<NodeJS.Timer | null>(null);
    const restTimerId = useRef<NodeJS.Timer | null>(null);
    const [activeTimerName, setActiveTimerName] = useState<string>();
    const countdownTimerId = useRef<NodeJS.Timer | null>(null);
    const [UITimerState, setUITimerState] = useState<boolean>(true);
    const [UIRepStack, setUIRepStack] = useState<Array<RepStack>>([]);
    const [UIRemainingReps, setUIRemainingReps] = useState<number>(0);
    
    /**
     *
     * @description starts the workout timer
     */
    const startWorkout = async () => {
        await setAudioFromBundle("beep_tone.mp3");
        return new Promise(async (resolve) => {
            setUIColor('#b4b1ac');
            currentSet.current = workout.sets[0];
            currentSetIndex.current = 0;
            setUISet(workout.sets[0]);
            remainingReps.current = currentSet.current.reps;
            timerCount.current = currentSet.current.hangTime;
            setTimeout(async () => {
                if (workout.sets[currentSetIndex.current].instructions) {
                    await playText(workout.sets[currentSetIndex.current].instructions);
                }
            }, 2000)

            timerCount.current = 10;
            setActiveTimerName("CountdownTimer");
            workoutResolve.current = resolve;

            // begin workout countdown
            await startCountdown()
            await playText("hang")
            timerState = true;
            timerCount.current = currentSet.current?.hangTime ?? 0;
            await startWork();
        });
    }

    /**
     * @description pauses the workout state
     */
    const pauseWorkout = async () => {
        await stopWorkout()
        setUITimerState(false)
    }

    /**
     * @description resumes the workout at current state
     */
    const resumeWorkout = async () => {
        await stopSound();
        setUITimerState(true)
        switch (activeTimerName) {
            case "WorkoutTimer":
                await startWork();
                break;

            case "RestTimer":
                await startRest();
                break;

            case "CountdownTimer":
                await startCountdown()
                timerCount.current = currentSet.current?.hangTime ?? 0
                await startWork()
                break;
        }
    }

    /**
     * @description resets the workout to begining state
     */
    const resetWorkout = async () => {
        await stopSound();
        setUITimerState(true)
        setUIRemainingReps(0);
        await stopWorkout();
        await startWorkout();
        setUIRepStack([]);
    }

    /**
     * @description  move to next set and set the current rep to first rep of the set.
     */
    const nextSet = async () => {
        setUITimerState(true)
        await stopSound();

        if (currentSetIndex.current !== workout.sets.length - 1) {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            await stopWorkout();
            setUIColor('#b4b1ac');
            setActiveTimerName("CountdownTimer");
            timerCount.current = 10;
            currentSetIndex.current += 1;
            setUISet(workout.sets[currentSetIndex.current]);
            currentSet.current = workout.sets[currentSetIndex.current];
            remainingReps.current = currentSet.current.reps;
            await startCountdown()
            timerCount.current = currentSet.current?.hangTime ?? 0;
            await startWork()
        }
    }

    /**
     * @description sets the current set to the previous set if any
     * @todo insure current set is checked before trying to move back.
     */
    const previousSet = async () => {
        await stopSound();
        setUITimerState(true)
        setUIRemainingReps(0);
        remainingReps.current = 0;
        await stopWorkout();
        setUIColor('#b4b1ac');
        setActiveTimerName("CountdownTimer");
        timerCount.current = 10;
        currentSetIndex.current = currentSetIndex.current - 1;
        currentSet.current = workout.sets[currentSetIndex.current];
        setUISet(workout.sets[currentSetIndex.current]);
        remainingReps.current = currentSet.current.reps;
        await startCountdown();
        timerCount.current = currentSet.current?.hangTime ?? 0;
        await startWork();
    }

    /**
     * @description moves to next rep within set
     */
    const nextRep = async () => {
        if (remainingReps.current !== 1) {
            stopWorkout();
            setUITimerState(true);
            setUIColor("red");
            remainingReps.current -= 1;
            setUIRemainingReps(remainingReps => remainingReps + 1);
            setActiveTimerName("RestTimer");
            timerCount.current = 10
            await startRest();
        } else {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            await nextSet();
        }
    }

    /**
     * @description moves to previous rep within set
     */
    const previousRep = async () => {
        if (remainingReps.current !== currentSet.current?.reps) {
            stopWorkout();
            setUITimerState(true);
            setUIColor("red");
            remainingReps.current += 1;
            setUIRemainingReps(remainingReps => remainingReps - 1);
            setActiveTimerName("RestTimer");
            timerCount.current = 10
            await startRest();
        } else {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            await previousSet();
        }
    }

    /**
     * @description starts the work/hold timer
     */
    const startWork = async () => {
        await stopSound();
        setUIClock(formatTime(new Date(), timerCount.current))
        setActiveTimerName("WorkoutTimer");
        setUIColor("#EBB93E");
        await playText("Hold");
        const workTimeFraction: number = 100 / (currentSet.current?.hangTime ?? 0);
        setUIProgress(workTimeFraction * timerCount.current);
        clearInterval(workTimerId.current);
        workTimerId.current = setInterval(() => {
            if (timerCount.current > 1) {
                bundleSound.current?.play();
            }
            performWorkChecks(workTimeFraction);
            }, 1000);
    }

    /**
     * @description starts the rest timer
     */
    const startRest = async () => {
        await stopSound();
        setUIClock(formatTime(new Date(), timerCount.current));
        setActiveTimerName("RestTimer");
        setUIColor("red")
        let restFraction = 100 / (currentSet.current?.restTime ?? 0);
        setUIProgress(restFraction * timerCount.current);
        await playText("rest");
        let halfMinuteCounter: number = 0;
        
        clearInterval(restTimerId.current);
        restTimerId.current = setInterval(async () => {
            // every thirty seconds play the remaining seconds
            // todo: fix so it also says minutes
            let timeLeft: string = `${timerCount.current} seconds left`;
            
            if (halfMinuteCounter === 30) {
                halfMinuteCounter = 0;
                if(timerCount.current !== 0) {
                    await playText(timeLeft);
                }
            }
            halfMinuteCounter++

            if (timerCount.current < 1) {
                await logRep({
                    percentage: 100,
                    setIndex: currentSetIndex.current,
                    setId: currentSet.current?.id,
                    sessionId: session.current?.id
                });
                
                if(restTimerId?.current) {
                    clearInterval(restTimerId?.current);
                }
                
                timerCount.current = currentSet.current?.hangTime ?? 0;
                await startWork()
                return;
            } else {
                subtractFromClock();
                if (timerCount.current > 1 && timerCount.current < 6) {
                    bundleSound.current?.play();
                }
                timerCount.current -= 1;
                setUIProgress(restFraction * timerCount.current);
                return;
            }
        }, 1000);
    }

    /**
     * @argument workTimeFraction the fraction for the timer bar
     * @description Performs various side effects checks during workout timer.
     */
    const performWorkChecks = async (workTimeFraction: number) => {
        if (timerCount.current > 0) {
            // do the work 
            timerCount.current -= 1;
            subtractFromClock();
            setUIProgress(workTimeFraction * timerCount.current);
            return;
        }

        // if end of rep
        if (timerCount.current <= 0) {
            setUIRepStack((repStack: Array<RepStack>) => {
                return [{
                    percentage: 100,
                    setIndex: currentSetIndex.current,
                    setRepIndex: (currentSet.current?.reps ?? 0) - remainingReps.current,
                    totalReps: currentSet.current?.reps,
                    repIndex: repStack.length - 1,
                    setId: currentSet.current?.id,
                }]
            });
        }

        // if last rep of set
        if (remainingReps.current <= 1) {
            const lastRepDetails = {
                percentage: 100,
                setIndex: currentSetIndex.current,
                setId: currentSet.current?.id,
                sessionId: session.current?.id
            }
            // move to next set
            clearInterval(workTimerId.current);
            setUIRemainingReps(0)
            // add set to backlog
            currentSetIndex.current += 1;
            // if the at last set
            if (currentSetIndex.current >= workout.sets.length) {
                await logRep(lastRepDetails);
                // end workout
                clearInterval(workTimerId.current);
                // output logged session
                workoutResolve.current();
                return;
            }
            setUISet(workout.sets[currentSetIndex.current]);
            timerCount.current = currentSet.current.restBeforeNextSet;
            currentSet.current = workout.sets[currentSetIndex.current];
            remainingReps.current = currentSet.current.reps;
            setUIColor('#b4b1ac')
            setTimeout(async () => {
                await playText(workout.sets[currentSetIndex.current].instructions);
            }, 2000)

            setActiveTimerName("CountdownTimer");           
            await startCountdown();
            // log the previous set's details
            await logRep(lastRepDetails);
            timerCount.current = currentSet.current.hangTime;
            await startWork();
            return;
        }

        if (timerCount.current <= 0) {
            // start rest
            clearInterval(workTimerId.current);
            remainingReps.current -= 1;
            setUIRemainingReps(remainingReps => remainingReps + 1)
            timerCount.current = currentSet.current.restTime;
            await startRest();
            return;
        }
    }

    /**
     *
     * @description starts countdown and returns promise.
     */
    const startCountdown = async () => {
        setUIColor('#b4b1ac');
        setUIClock(formatTime(new Date(), timerCount.current))
        let timerFraction: number = 100 / timerCount.current
        return new Promise((resolve) => {
            clearInterval(countdownTimerId.current)
            countdownTimerId.current = setInterval(() => {
                if (timerCount.current > 1 && timerCount.current < 6) {
                    bundleSound.current?.play();
                }

                timerCount.current -= 1;
                subtractFromClock();

                setUIProgress(timerFraction * timerCount.current)
                if (timerCount.current <= 0) {
                    clearInterval(countdownTimerId.current);
                    resolve();
                    return;
                }
            }, 1000)
        });
    }

    /**
     * @description removes one seconds from remaining clock time
     */
    const subtractFromClock = () => {
        setUIClock((x) => {
            let rm: Date = x;
            rm?.setSeconds(rm.getSeconds() - 1);
            return rm;
        });
    }

    /**
     * @description stops all timers
     */
    const stopWorkout = async () => {
        console.log("INterval Timer: ", countdownTimerId.current)
        stopSound();
        clearInterval(workTimerId.current);
        clearInterval(restTimerId.current);
        clearInterval(countdownTimerId.current);
        workTimerId.current = null;
        restTimerId.current = null;
        countdownTimerId.current = null;
    }

    /**
     * @description stops all sounds
     */
    const stopSound = async () => {
        await Tts.stop();
        bundleSound.current?.stop();
    }

    /**
     * @param RepStack object to log
     * @description Logs a rep stack object to rep log.
     */
    const logRep = async ({percentage, setIndex, setId, sessionId}: RepStack) => {
        setUIRepStack([])
        let loggedRep: LoggedRep = {
            secondsCompleted: (workout.sets[setIndex].hangTime / 100) * percentage,
            percentageCompleted: percentage,
            setId,
        }
        session.current.repLog = [loggedRep, ...session.current.repLog]
        
        if(!firstRepLogged.current) {
            if(session.current) {
                session.current.id =  await logSession(session.current);
            }
            firstRepLogged.current = true;
            return;
        }
     
        await logRepetition(sessionId, loggedRep);
    }

    /**
     * @description gets the current session
     */
    const getSession = () => {
        session.current.dateCompleted = new Date();
        return session.current;
    }

    // UTILITY FUNCTIONS
    const formatTime = (date: Date, seconds: number) => {
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(seconds);
        return date;
    }

    const setAudioFromBundle = (fileName: string) =>
        new Promise<void>((resolve, reject) => {
            bundleSound.current = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    return;
                }
                resolve();
            });
        })

    const playText = async (text: string) => {
        await Tts.stop();
        await Tts.setDefaultLanguage('en-US');
        await Tts.getInitStatus()
        Tts.speak(text);
    }

    return {
        UISet,
        UIClock,
        UIColor,
        UIRepStack,
        UIProgress,
        UITimerState,
        workout,
        UIRemainingReps,
        activeTimerName,
        startWorkout,
        stopWorkout,
        pauseWorkout,
        resumeWorkout,
        resetWorkout,
        nextSet,
        previousSet,
        logRep,
        getSession,
        setUIRepStack,
        previousRep,
        nextRep
    }
}

export default useTrainer;