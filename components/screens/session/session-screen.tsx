import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import useMyBoardsAPI from "../../../hooks/use-myboards-api";
import Session from "../../../types/models/session";
import globalStyles from "../../../styles/global";

const SessionScreen = ({route}) => {
    const {getSessionById} = useMyBoardsAPI();
    const [session, setSession] = useState<Session>();

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setSession(await getSessionById(route.params.id));
            })();
        }, [])
    );

    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const date = new Date(session?.dateCompleted);
    
    return (
        <ScrollView style={{backgroundColor: "#333333", paddingLeft: 10, paddingRight: 10}}>
            <View>
                <Text style={globalStyles.pageHeading}>{mS[date?.getMonth()]} {date.getDay()}</Text>
                <Text>Overview</Text>
            </View>
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

export default SessionScreen;