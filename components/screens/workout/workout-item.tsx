import {useNavigation} from "@react-navigation/native";
import React from "react";
import {StyleSheet, View} from "react-native";
import {ListItem} from "react-native-elements";
import SecondaryButton from "../../buttons/secondary-btn";
import Workout from "../../../types/models/workout";

const WorkoutItem: React.FC<{
    workout: Workout
}> = ({workout}) => {
    const navigation = useNavigation();

    return (
        <ListItem containerStyle={styles.container} hasTVPreferredFocus={undefined} tvParallaxProperties={undefined}>
            <ListItem.Title style={styles.title}>{workout?.name}</ListItem.Title>
            <ListItem.Content>
                <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "flex-end"}}>
                    <View style={{marginRight: 17}}>
                        <SecondaryButton color='#710C10' title='edit'
                                       onPress={() => navigation.navigate("Edit Workout", workout)}></SecondaryButton>
                    </View>
                    <View>
                        <SecondaryButton color='#EBB93E' title='train'
                                       onPress={() => navigation.navigate("Details", workout)}></SecondaryButton>
                    </View>
                </View>
            </ListItem.Content>
        </ListItem>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 17,
        backgroundColor: '#333333',
        borderRadius: 6,
        paddingLeft: 21,
        paddingRight: 21
    },
    title: {
        color: '#f5f5f5',
        fontSize: 19,
        fontWeight: "500"
    }
});

export default WorkoutItem;