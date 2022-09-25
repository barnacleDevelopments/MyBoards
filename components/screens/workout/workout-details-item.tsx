import React from "react";
import {StyleSheet, Text} from "react-native";
import {ListItem} from "react-native-elements";
import {secondsToMinutes} from "../../../functions/utility";

const WorkoutDetailsItem = ({set}) => {
    
    function getHandDepth(holdIndex: number) {
        if(!set.setHolds[holdIndex]) return;
        return `${set.setHolds[holdIndex].hold.depthMM}mm - ${set.setHolds[holdIndex]?.hand === 0 ? "Left Hand" : "Right Hand"}`  
    }
    
    
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
                <Text style={styles.lineItem}>
                    {set.hangTime} lb - Added Weight
                </Text>
                <Text style={styles.lineItem}>
                    {secondsToMinutes(set.hangTime)} - Hang
                </Text>
                <Text style={styles.lineItem}>
                    {secondsToMinutes(set.restTime)} - Rest
                </Text>
                <Text style={styles.lineItem}>
                    {secondsToMinutes(set.restBeforeNextSet)} - Rest before next set
                </Text>
                <Text style={styles.lineItem}>
                    {set.reps} Reps
                </Text>
                <Text style={styles.lineItem}>
                    {getHandDepth(0)}
                </Text>
                <Text style={styles.lineItem}>
                    {getHandDepth(1)}
                </Text>
            </ListItem.Content>
        </ListItem>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#333333'
    },
    lineItem: {color: "#EBB93E", fontWeight: 'bold', fontSize: 20 },
    title: {
        color: '#f5f5f5'
    }
});

export default WorkoutDetailsItem;