import {Dimensions} from "react-native";

export const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

export const secondsToMinutes = (seconds: number): string => {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
}