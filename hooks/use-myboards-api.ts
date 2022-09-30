import Config from "react-native-config";
import {AuthAPIManager} from "../auth/auth_manager";
import {Hangboard} from "../types/models/hangboard";
import Workout from "../types/models/workout";
import Set from "../types/models/set";
import GripUsage from "../types/models/grip-usage";
import {Coordinates} from "../types/coordinates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {useContext} from "react";
import useAPIError from "../hooks/use-api-error";
import {AuthContext} from "../contexts/auth-context";
import Session, {LoggedRep} from "../types/models/session";

export enum YearFraction {
    week = 'week',
    month = 'month',
    quarter = 'quarter'
}

const useMyBoardsAPI = () => {
    const authContext = useContext(AuthContext);
    const {addError} = useAPIError();

    // for multiple requests
    let isRefreshing = false;
    let failedQueue: {
        resolve: (value: unknown) => void;
        reject: (reason?: any) => void;
    }[] = [];

    const processQueue = (error: unknown, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        })

        failedQueue = [];
    }

    axios.interceptors.response.use(async function (response) {
        
        return response;
    }, async function (error) {
        console.log(error.response)
        const originalRequest = error.config;

        // if request is not authorized
        if (error.response.status === 401 && !originalRequest._retry) {

            // if in the middle of refresh use old token
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject})
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const accessToken = await AsyncStorage.getItem('accessToken')
            return new Promise(function (resolve, reject) {
                axios.post(`${Config.API_URL}/api/authenticate/refresh-token`, {refreshToken, accessToken})
                    .then(({data, status}) => {

                        (async () => {
                            await AsyncStorage.setItem('accessToken', data.accessToken);
                            await AsyncStorage.setItem('refreshToken', data.refreshToken);
                        })()

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;

                        processQueue(null, data.accessToken);
                        resolve(axios(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            })
        }

        // refresh token expired or is invalid
        if (error.response.status === 400) {
            addError("Logged in on other device", 400);
            authContext.signOut();
        }

        return Promise.reject(error);
    });

// Workout Functions
    /**
     * @param workoutId the ID of the workout to retrieve.
     * @returns one workout.
     */
    const getWorkout = async (workoutId: string): Promise<Workout> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/workout/${workoutId}`;

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    };

    /**
     *
     * @returns all the workouts of the logged in user.
     */
    const getWorkouts = async (): Promise<Workout[]> => {
        const URL = `${Config.API_URL}/api/workout`;
        const accessToken = await AuthAPIManager.getAccessTokenAsync();

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });


        return response.data
    };

    /**
     * @param workout new workout data.
     * @returns new workout.
     */
    const createWorkout = async (workout: Workout): Promise<Workout> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();

        const response = await axios.post(`${Config.API_URL}/api/Workout`, workout, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    };

    /**
     * @param workout the new workout data.
     * @returns updated workout.
     */
    const updateWorkout = async (workout: Workout): Promise<Workout> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const response = await axios.put(`${Config.API_URL}/api/Workout`, workout, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    };

    /**
     * @param workoutId the id of the workout to delete.
     * @returns the deleted workout's ID.
     */
    const deleteWorkout = async (workoutId: number): Promise<number> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const response = await axios.delete(`${Config.API_URL}/api/Workout/${workoutId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
    /**
     * @param workoutId workout's ID.
     * @returns the sets of a specific workout.
     */
    const getWorkoutSets = async (workoutId: number): Promise<Set[]> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();

        const URL = `${Config.API_URL}/api/Workout/${workoutId}/sets`;
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }

// Hangboard API Functions


    /**
     * @returns single hangboard by id.
     */
    const getHangboard = async (hanboardId: number): Promise<Hangboard> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/hangboard/${hanboardId}`;
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }


    /**
     *
     * @returns count of all the users hangboards.
     */
    const getHangboardCount = async (): Promise<string> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/hangboard/count`;
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data;
    };

    /**
     *
     * @returns a array of all the logged in users hangboards.
     */
    const getAllHangboards = async (): Promise<Hangboard[]> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();

        const URL = `${Config.API_URL}/api/Hangboard`;
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return await response.data;
    };

    /**
     *
     * @param hangboardId ID of hangboard.
     * @returns The deleted hangboard ID.
     */
    const deleteHangboard = async (hangboardId: number): Promise<number> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Hangboard/${hangboardId}`;
        await axios.delete(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return hangboardId;
    };

    /**
     *
     * @param formData data to update hangboard.
     * @returns The updated hangboard.
     */
    const updateHangboard = async (formData: FormData): Promise<Hangboard> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Hangboard`;

        const response = await axios.put(URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    };

    const createHangboard = async (formData: FormData): Promise<Hangboard> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Hangboard`;

        const response = await axios.post(URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`
            }
        });

        return await response.data;
    }


// Statistic Routes
    /**
     * @param yearFraction the fraction of the year to retrieve data from week/month/quarter.
     * @returns Grip usage of sessions.
     */
    const getGripUsage = async (yearFraction: YearFraction): Promise<GripUsage> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Statistic/GripUsage/${yearFraction}`;

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        /*  const data = await cacheIt(response, URL);*/
        return response.data;
    };

    /**
     *
     * @returns Seconds trained daily based on session data.
     */
    const getTrainingTime = async (): Promise<Coordinates[]> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync()
        const URL = `${Config.API_URL}/api/Statistic/PerformedTime/week`;

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        /*  const data = await cacheIt(response, URL);*/
        return response.data;
    };

    // Session Routes
    const getGroupedSessionsByMonth = async (year: number): Promise<{month: string, year: number, sessions: Session[]}[]> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Session/GroupedByMonth/${year}`;

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
    
    const getSessionsByMonth = async (month: number): Promise<Session[]> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Session/Month/${month}`;
        
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        console.log("WHATUP!")
        
        return response.data;
    }

    const getSessionById = async (id: number): Promise<Session> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Session/${id}`;

        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
    
    
    const logSession = async (session: Session): Promise<string> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Session`;

        const response = await axios.post(URL, session, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        return response.data.sessionId;
    };
    
    const logRepetition = async (sessionId: string, rep: LoggedRep): Promise<void> => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync();
        const URL = `${Config.API_URL}/api/Session/LogRepetition/${sessionId}`;
        
        await axios.post(URL, rep, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        return;
    }

    return {
        getWorkout,
        getWorkouts,
        getWorkoutSets,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        getAllHangboards,
        getHangboard,
        getHangboardCount,
        createHangboard,
        updateHangboard,
        deleteHangboard,
        getGripUsage,
        getTrainingTime,
        logSession,
        logRepetition,
        getSessionsByMonth,
        getGroupedSessionsByMonth,
        getSessionById
    }
}

export default useMyBoardsAPI;