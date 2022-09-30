import React, {useEffect, useState} from "react"
import {Button, Pressable, StyleSheet, Text, View} from "react-native"
import {RepStack} from "./screens/workout/training-workout-screen";
import globalStyles from "../styles/global";

interface RepCompleterProps {
    onSelection: React.Dispatch<React.SetStateAction<RepStack[]>>,
    repStack: RepStack,
    repLogger: (rep: RepStack) => void,
    index: number
}

const LogButton = ({onPress, disabled, title, color}: {onPress: () => void, disabled: boolean, title: string, color: string}) => {
    return (
        <Pressable disabled={disabled}
                   onPress={onPress}
                   style={{
                       backgroundColor: color,
                       padding: 15,
                       flex: 1,
                       borderRadius: 4
                    }}>
            <Text style={{
                color: "white",
                fontSize: 15,
                fontWeight: 'bold'
            }}>
                {title}
            </Text>
        </Pressable>
    )
}

const RepCompleter = ({onSelection, repStack, repLogger, index}: RepCompleterProps) => {
    const [inProgress, setInProgress] = useState(false);
    const [autoLogProgress, setAutoLogProgress] = useState(100);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setAutoLogProgress((alp) => {
                if(alp === 0) {
                    clearInterval(timer);
                    completeRep(100);
                }
                return alp - 1
            });
        }, 300)
    }, []);

    const completeRep = async (percentage: number) => {
        setInProgress(true);
        // send rep log to backend
        await repLogger({...repStack, percentage});
        setInProgress(false);
        // remove the rep logger element from page after selection.
        onSelection(rs => rs.filter(r => r.repIndex !== repStack.repIndex));
    }

    return (
        <View style={styles.container}>
            {autoLogProgress > 1 ? <View style={{...styles.autoCompleteBar, width: `${autoLogProgress}%`}}>
                {autoLogProgress > 40  ? <Text>
                    Auto Logging In {autoLogProgress}
                </Text> : null}
            </View>: null}
            <View>
                {!inProgress ? <View style={{display: "flex", justifyContent: "flex-start", flexDirection: "row"}}>
                    <View style={{width: '100%', marginBottom: 15}}>
                        <Text style={{fontSize: 35, textAlign: 'center', marginBottom: 10, color: '#f5f5f5'}}>
                            Rep {`${repStack.setRepIndex + 1}/${repStack.totalReps}`}
                        </Text>
                        <Text style={{fontSize: 25, textAlign: 'center', color: '#f5f5f5'}}>
                            Set {repStack.setIndex + 1}
                        </Text>
                    </View>
                </View> : null}
                {!inProgress ? <View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: "center", marginBottom: 15}}>
                            <View style={{marginLeft: 10}}>
                                <LogButton title='70%'
                                           onPress={() => completeRep(70)}
                                           disabled={index !== 0}
                                           color="#454545" />
                            </View>
                            <View style={{marginLeft: 10}}>
                                <LogButton  title='80%'
                                            onPress={() => completeRep(80)}
                                           disabled={index !== 0}
                                           color="#6D6D6D"/>
                            </View>
                            <View style={{marginLeft: 10}}>
                                <LogButton  title='90%'
                                            onPress={() => completeRep(90)}
                                            disabled={index !== 0}
                                            color="#7D7D7D"/>
                            </View>
                            <View style={{marginLeft: 10}}>
                                <LogButton  title='COMPLETED'
                                            onPress={() => completeRep(100)}
                                            disabled={index !== 0}
                                            color="green"/>
                            </View>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: "center"}}>
                            <Pressable style={{backgroundColor: 'red', padding: 10, paddingTop: 15, paddingBottom: 15, borderRadius: 4, width: '100%'}} onPress={() => completeRep(0)} >
                                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
                                    NOT COMPLETE
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    :
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: "center"}}>
                        <Text style={{...globalStyles.text, color: 'white'}}>Logging...</Text>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333', 
        marginTop: 10, 
        width: '100%', 
        padding: 15,
        borderRadius: 4
    },
    autoCompleteBar: {
        height: 40,
        backgroundColor: 'white',
        display: "flex",
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 4
    }
});

export default RepCompleter;