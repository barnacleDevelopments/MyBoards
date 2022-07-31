import React from "react";
import {StyleSheet, Text} from "react-native";
import {ListItem} from "react-native-elements";
import {secondsToMinutes} from "../../../functions/utility";

const WorkoutDetailsItem = ({set}) => {
    return (
        <ListItem
            style={styles.container}
            containerStyle={{backgroundColor: '#333333', borderRadius: 4, borderColor: '#333333'}}
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}>
            <ListItem.Content>
                <ListItem.Title style={{fontSize: 25, color: '#f5f5f5', fontWeight: 'bold'}}>
                    Set #{set.indexPosition + 1}
                </ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 15, color: '#f5f5f5', marginBottom: 10}}>
                    {set.instructions ? set.instructions : "no instructions"}
                </ListItem.Subtitle>
                <Text style={{color: "#EBB93E", fontWeight: 'bold', fontSize: 15}}>
                    [ {secondsToMinutes(set.hangTime)}] - hang
                </Text>
                <Text style={{color: "#EBB93E", fontWeight: 'bold', fontSize: 15}}>
                    [ {secondsToMinutes(set.restTime)}] - rest
                </Text>
                <Text style={{color: "#EBB93E", fontWeight: 'bold', fontSize: 15}}>
                    [ {secondsToMinutes(set.restBeforeNextSet)}] - Rest before next set
                </Text>
                <Text style={{color: 'grey', fontWeight: 'bold', fontSize: 15}}>
                    {set.reps} Reps
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
    title: {
        color: '#f5f5f5'
    }
});

export default WorkoutDetailsItem;