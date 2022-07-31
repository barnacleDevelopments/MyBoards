import {useRef, useState} from "react";
import Sound from "react-native-sound";
import {LoggedRep} from "../types/models/session";
import Workout from "../types/models/workout";
import Set from "../types/models/set";
import Tts from 'react-native-tts';
import {RepStack} from "../types/models/rep-stack";

interface SetRef {
    set: Set
}

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
}

const useTrainer = (workout: Workout): Trainer => {
    const currentSet = useRef<SetRef>({setHolds: []});
    const remainingReps = useRef(0);
    let currentSetIndex = useRef(0);
    const session = useRef({repLog: [], workoutId: workout.id});
    let bundleSound: Sound;
    let timerState;

    const workoutResolve = useRef();
    const workTimerId = useRef<NodeJS.Timer | null>(null)
    const restTimerId = useRef<NodeJS.Timer | null>(null)
    const countdownTimerId = useRef<NodeJS.Timer | null>(null)
    const [UISet, setUISet] = useState<Set>();
    const [UIClock, setUIClock] = useState<Date>();
    const [UIColor, setUIColor] = useState<string>();
    const [UIRepStack, setUIRepStack] = useState<Array<RepStack>>([]);
    const [UIProgress, setUIProgress] = useState<number>();
    const [UITimerState, setUITimerState] = useState<boolean>(true)
    const [activeTimerName, setActiveTimerName] = useState<string>()
    const [UIRemainingReps, setUIRemainingReps] = useState<number>(0)
    const timerCount = useRef<number>(0);

    /**
     *
     * @description starts the workout timer
     */
    const startWorkout = () => {
        const promise = new Promise((resolve) => {
            setUIColor('#b4b1ac');
            currentSet.current = workout.sets[0];
            currentSetIndex.current = 0;
            setUISet(workout.sets[0]);
            remainingReps.current = currentSet.current.reps;
            timerCount.current = currentSet.current.hangTime;
            setTimeout(() => {
                if (workout.sets[currentSetIndex.current].instructions) {
                    playText(workout.sets[currentSetIndex.current].instructions);
                }
            }, 2000)

            timerCount.current = 10;
            setActiveTimerName("CountdownTimer");
            workoutResolve.current = resolve;

            // begin workout countdown
            startCountdown().then(() => {
                setAudioFromBundle("hold_tone.wav").then(() => {
                    bundleSound.play();
                    setAudioFromBundle("beep_tone.mp3");
                });
                bundleSound.play();
                timerState = true;
                timerCount.current = currentSet.current.hangTime;
                startWork();
            });
        })
        return promise;
    }

    /**
     * @description pauses the workout state
     */
    const pauseWorkout = () => {
        stopWorkout()
        setUITimerState(false)
    }

    /**
     * @description resumes the workout at current state
     */
    const resumeWorkout = () => {
        stopSound();
        setUITimerState(true)
        switch (activeTimerName) {
            case "WorkoutTimer":
                startWork();
                break;

            case "RestTimer":
                startRest();
                break;

            case "CountdownTimer":
                startCountdown()
                    .then(() => {
                        timerCount.current = currentSet.current.hangTime
                        startWork()
                    });
                break;
        }
    }

    /**
     * @description resets the workout to begining state
     */
    const resetWorkout = () => {
        stopSound();
        setUITimerState(true)
        setUIRemainingReps(0);
        stopWorkout();
        startWorkout();
        setUIRepStack([]);

    }

    /**
     * @description  move to next set and set the current rep to first rep of the set.
     */
    const nextSet = () => {
        setUITimerState(true)
        stopSound();

        if (currentSetIndex.current !== workout.sets.length - 1) {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            stopWorkout();
            setUIColor('#b4b1ac');
            setActiveTimerName("CountdownTimer");
            timerCount.current = 10;
            currentSetIndex.current += 1;
            setUISet(workout.sets[currentSetIndex.current]);
            currentSet.current = workout.sets[currentSetIndex.current];
            remainingReps.current = currentSet.current.reps;
            startCountdown().then(() => {
                timerCount.current = currentSet.current.hangTime;
                startWork()
            });
        }
    }

    /**
     * @description sets the current set to the previous set if any
     * @todo insure current set is checked before trying to move back.
     */
    const previousSet = () => {
        stopSound();
        setUITimerState(true)
        setUIRemainingReps(0);
        remainingReps.current = 0;
        stopWorkout();
        setUIColor('#b4b1ac');
        setActiveTimerName("CountdownTimer");
        timerCount.current = 10;
        currentSetIndex.current = currentSetIndex.current - 1;
        currentSet.current = workout.sets[currentSetIndex.current];
        setUISet(workout.sets[currentSetIndex.current]);
        remainingReps.current = currentSet.current.reps;
        startCountdown().then(() => {
            timerCount.current = currentSet.current.hangTime;
            startWork();
        });
    }

    /**
     * @description moves to next rep within set
     */
    const nextRep = () => {
        stopSound();
        if (remainingReps.current !== 1) {
            stopWorkout();
            setUITimerState(true);
            setUIColor("red");
            remainingReps.current -= 1;
            setUIRemainingReps(remainingReps => remainingReps + 1);
            setActiveTimerName("RestTimer");
            timerCount.current = 10
            startRest();
        } else {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            nextSet();
        }
    }

    /**
     * @description moves to previous rep within set
     */
    const previousRep = () => {
        stopSound();
        if (remainingReps.current !== currentSet.current.reps) {
            stopWorkout();
            setUITimerState(true);
            setUIColor("red");
            remainingReps.current += 1;
            setUIRemainingReps(remainingReps => remainingReps - 1);
            setActiveTimerName("RestTimer");
            timerCount.current = 10
            startRest();
        } else {
            setUIRemainingReps(0);
            remainingReps.current = 0;
            previousSet();
        }
    }

    /**
     * @description starts the work/hold timer
     */
    const startWork = () => {
        stopSound();
        setUIClock(formatTime(new Date(), timerCount.current))
        setActiveTimerName("WorkoutTimer");
        const promise: Promise<void> = new Promise((resolve) => {
            setUIColor("#EBB93E");
            setAudioFromBundle("hold_tone.wav").then(() => {
                bundleSound.play();
                setAudioFromBundle("beep_tone.mp3");
            });

            const workTimeFraction: number = 100 / currentSet.current.hangTime;

            setUIProgress(workTimeFraction * timerCount.current);

            workTimerId.current = setInterval(() => {
                if (timerCount.current > 1) {
                    bundleSound.play();
                }
                performWorkChecks(workTimeFraction);
            }, 1000);
        });
        return promise;
    }

    /**
     * @description starts the rest timer
     */
    const startRest = () => {
        stopSound();
        setUIClock(formatTime(new Date(), timerCount.current));
        setActiveTimerName("RestTimer");
        setUIColor("red")
        let restFraction = 100 / currentSet.current.restTime;
        setUIProgress(restFraction * timerCount.current);
        // TODO: check if audio file exists
        setAudioFromBundle("rest_tone.wav").then(() => {
            bundleSound.play();
            setAudioFromBundle("beep_tone.mp3");
        });
        let halfMinuteCounter: number = 0;

        restTimerId.current = setInterval(() => {
            // every thirty seconds play the remaining seconds
            let timeLeft: string = `${timerCount.current} seconds left`
            if (halfMinuteCounter === 30) {
                halfMinuteCounter = 0;
                playText(timeLeft);
            }
            halfMinuteCounter++

            if (timerCount.current <= 0) {
                clearInterval(restTimerId.current);
                timerCount.current = currentSet.current.hangTime;
                startWork()
                return;
            } else {
                subtractFromClock();
                if (timerCount.current > 1 && timerCount.current < 6) {
                    bundleSound.play();
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
    const performWorkChecks = (workTimeFraction: number) => {
        if (timerCount.current > 0) {
            // do the work 
            timerCount.current -= 1;
            subtractFromClock();
            setUIProgress(workTimeFraction * timerCount.current);
            return;
        }

        if (timerCount.current <= 0) {
            setUIRepStack((repStack: Array<RepStack>) => {
                return [{
                    percentage: 100,
                    setIndex: currentSetIndex.current,
                    setRepIndex: currentSet.current.reps - remainingReps.current,
                    totalReps: currentSet.current.reps,
                    repIndex: repStack.length - 1,
                    setId: currentSet.current.id,
                },
                    ...repStack
                ]
            });
        }

        if (remainingReps.current <= 1) {
            // move to next set
            clearInterval(workTimerId.current);
            setUIRemainingReps(0)
            // add set to backlog
            currentSetIndex.current += 1;
            // if the at last set
            if (currentSetIndex.current >= workout.sets.length) {
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
            setTimeout(() => {
                playAudioAtPath(workout.sets[currentSetIndex.current].instructionAudioURL)
            }, 2000)

            setActiveTimerName("CountdownTimer");
            startCountdown().then(() => {
                timerCount.current = currentSet.current.hangTime;
                startWork()
            });

            return;
        }

        if (timerCount.current <= 0) {
            // start rest
            clearInterval(workTimerId.current);
            remainingReps.current -= 1;
            setUIRemainingReps(remainingReps => remainingReps + 1)
            timerCount.current = currentSet.current.restTime;
            startRest();
            return;
        }
    }

    /**
     *
     * @description starts countdown and returns promise.
     */
    const startCountdown = () => {
        setUIColor('#b4b1ac');
        setUIClock(formatTime(new Date(), timerCount.current))
        let timerFraction: number = 100 / timerCount.current
        const promise: Promise<void> = new Promise((resolve) => {
            countdownTimerId.current = setInterval(() => {
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
        return promise;
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
    const stopWorkout = () => {
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
    const stopSound = () => {
        Tts.stop();
        bundleSound?.stop();
    }

    /**
     * @param RepStack object to log
     * @description Logs a rep stack object to rep log.
     */
    const logRep = ({percentage, setIndex, setId}: RepStack) => {
        let loggedRep: LoggedRep = {
            secondsCompleted: (workout.sets[setIndex].hangTime / 100) * percentage,
            percentageCompleted: percentage,
            setId,
        }

        // add rep to logged reps
        session.current.repLog = [loggedRep, ...session.current.repLog]
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
            bundleSound = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    return;
                }
                resolve();
            });
        })

    const playAudioAtPath = (audioPath: string) => (
        new Promise<void>((resolve, reject) => {
            pathSound = new Sound(audioPath, null, (error) => {
                if (error) {
                    return;
                }
                // when loaded successfully
                pathSound?.play(success => {
                    if (success) {
                        resolve()
                    } else {

                        reject()
                    }
                })

                pathSound.release();
            });
        })
    )

    const playText = (text: string) => {
        Tts.stop();
        Tts.setDefaultLanguage('en-US');
        Tts.getInitStatus().then(() => {
            Tts.speak(text);
        });
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