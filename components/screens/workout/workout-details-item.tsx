import React, {useMemo} from "react";
import {StyleSheet, Text, View} from "react-native";

import Set from "../../../types/models/set";
import {ListItem} from "react-native-elements";
import {secondsToMinutes} from "../../../functions/utility";

const WorkoutDetailsItem: React.FC<{set: Set}> = ({set}) => {
    
    function getHandDepth(holdIndex: number) {
        if(set && !set.setHolds[holdIndex]) return;
        return `${set?.setHolds[holdIndex].hold.depthMM}mm`  
    }

    function getHandSide(holdIndex: number) {
        if(!set.setHolds[holdIndex]) return;
        return `${set.setHolds[holdIndex]?.hand === 0 ? "Left Hand" : "Right Hand"}`
    }
    
    const workDisplay = useMemo(()=> {
        if(set.hangTime < 60) {
            return `${set.reps} x ${set.hangTime}s`
        }
        
        return  `${set.reps} x ${secondsToMinutes(set.hangTime)}m`
    }, [])

    const restDisplay = useMemo(()=> {
        if(set.restTime < 60) {
            return `Rest for ${set.restTime}s`
        }

        return  `Rest for ${secondsToMinutes(set.restTime)}m`
    }, []);
    
    const intermissionDisplay = useMemo(()=> {
        if(set.restBeforeNextSet < 60) {
            return `Wait ${set.restBeforeNextSet}s until next set`
        }

        return  `Wait ${secondsToMinutes(set.restBeforeNextSet)}m until next set`
    }, []);
    
    return (
        <ListItem
            style={styles.container}
            containerStyle={{backgroundColor: '#333333', borderRadius: 4, borderColor: '#333333'}}
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}>
            <ListItem.Content>
                <ListItem.Title style={{fontSize: 30, color: '#f5f5f5', fontWeight: 'bold'}}>
                    Set #{set.indexPosition + 1}
                </ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 15, color: '#f5f5f5', marginBottom: 10}}>
                    {set.instructions ? set.instructions : "no instructions"}
                </ListItem.Subtitle>
                <View style={{width: '100%'}}>
                    <Text style={styles.lineItem}>
                        Add {set.hangTime}lb
                    </Text>
                    <Text style={styles.lineItem}>
                        {workDisplay}
                    </Text>
                    <Text style={styles.lineItem}>
                        {restDisplay}
                    </Text>
                    <Text style={styles.lineItem}>
                         {intermissionDisplay}
                    </Text> 
                </View>
                <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                    <View style={{backgroundColor: 'white', padding: 10, borderRadius: 2, flex: 1}}>
                        <Text style={{...styles.lineItem, textAlign: 'center'}}>
                            {getHandSide(0)}
                        </Text>
                        <Text style={{...styles.lineItem, textAlign: 'center'}}>
                            {getHandDepth(0)}
                        </Text>
                    </View>
                    <View style={{backgroundColor: 'white', padding: 10, borderRadius: 2, flex: 1, marginLeft: 10}}>
                        <Text style={{...styles.lineItem, textAlign: 'center'}}>
                            {getHandSide(1)}
                        </Text>
                        <Text style={{...styles.lineItem, textAlign: 'center'}}>
                            {getHandDepth(1)}
                        </Text>
                    </View>
                </View>
            </ListItem.Content>
        </ListItem>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#333333'
    },
    lineItem: {
        color: "#EBB93E",
        fontWeight: 'bold', 
        fontSize: 25
    },
    title: {
        color: '#f5f5f5'
    }
});

export default WorkoutDetailsItem;