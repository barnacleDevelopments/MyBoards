import React, {useState} from 'react';
import { ScrollView, StyleSheet, Pressable, Text} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import useMyBoardsAPI from "../../../hooks/use-myboards-api";
import Session from "../../../types/models/session";

const SessionsScreen = ({route}) => {
    const {getSessionsByMonth} = useMyBoardsAPI();
    const [sessions, setSessions] = useState<Session[]>();
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setSessions(await getSessionsByMonth(route.params.month));
            })();
        }, [])
    );

    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    return (
        <ScrollView style={{backgroundColor: "#333333", paddingLeft: 10, paddingRight: 10}}>
            <Text style={{color: 'white', fontSize: 50, marginTop: 20, marginBottom: 15}}>{mS[route.params.month - 1]}</Text>
            {sessions?.map(s => {
                const date = new Date(s.dateCompleted)
                return (
                    <Pressable onPress={() => navigation.navigate("Session", {id: s.id})} 
                               style={styles.container}>
                        <Text style={{color:"white"}}> 
                            {date.getDay()} / {date.getMonth()} / {date.getFullYear()}
                        </Text>
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        display: "flex",
        flexDirection: 'row',
        backgroundColor: "#212021",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        borderRadius: 4,
        paddingBottom: 15
    },
    title: {
        color: 'white',
        fontSize: 40
    },
    sessionCount: {
        color: 'white',
        fontSize: 25
    }
})

export default SessionsScreen;