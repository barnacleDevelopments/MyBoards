import React, {useState} from "react"
import {Button, Text, View} from "react-native"
import {RepStack} from "./screens/workout/training-workout-screen";
import globalStyles from "../styles/global";

interface RepCompleterProps {
    onSelection: React.Dispatch<React.SetStateAction<RepStack[]>>,
    repStack: RepStack,
    repLogger: (rep: RepStack) => void,
    index: number
}

const RepCompleter = ({onSelection, repStack, repLogger, index}: RepCompleterProps) => {
    const [inProgress, setInProgress] = useState(false);
    
    const completeRep = async (percentage: number) => {
        setInProgress(true);
        // send rep log to backend
        await repLogger({...repStack, percentage});
        setInProgress(false);
        // remove the rep logger element from page after selection.
        onSelection(rs => rs.filter(r => r.repIndex !== repStack.repIndex));
    }

    return (
        <View style={{backgroundColor: '#333333', marginTop: 10, width: '100%', padding: 15, borderRadius: 4}}>
            <View>
                {!inProgress ? <View style={{display: "flex", justifyContent: "flex-start", flexDirection: "row"}}>
                    <View style={{width: '100%', marginBottom: 15}}>
                        <Text style={{fontSize: 20, textAlign: "center", color: '#f5f5f5'}}>Set
                            - {repStack.setIndex + 1} | Rep
                            - {`${repStack.setRepIndex + 1}/${repStack.totalReps}`}</Text>
                    </View>
                </View> : null}
                {!inProgress ? <View style={{display: 'flex', flexDirection: 'row', justifyContent: "center"}}>
                    <View>
                        <Button disabled={index !== 0} onPress={() => completeRep(20)} title='20%' color="#474747"/>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Button disabled={index !== 0} onPress={() => completeRep(40)} title='40%' color="#555555"/>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Button disabled={index !== 0} onPress={() => completeRep(60)} title='60%' color="#616161"/>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Button disabled={index !== 0} onPress={() => completeRep(80)} title='80%' color="#6D6D6D"/>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Button disabled={index !== 0} onPress={() => completeRep(100)} title='100%' color="#7D7D7D"/>
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

export default RepCompleter;