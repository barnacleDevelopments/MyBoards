import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import useMyBoardsAPI from "../../../hooks/use-myboards-api";
import Session from "../../../types/models/session";
import globalStyles from "../../../styles/global";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import PrimaryButton from "../../buttons/primary-btn";

type RootStackParamList = {
    SessionScreen: { 
        id: number
    };
}

type Props = NativeStackScreenProps<RootStackParamList, 'SessionScreen'>;

const SessionScreen: React.FC<Props> = ({route}) => {
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
        <ScrollView style={styles.container}>
            <View>
                <Text style={globalStyles.pageHeading}>{mS[date?.getMonth()]} {date.getDay()}</Text>
                <Text style={{color: 'white', textAlign: 'center', fontSize: 25}}>
                    Overview
                </Text>
                <PrimaryButton title='DELETE' color={"red"} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#333333", 
        paddingLeft: 10, 
        paddingRight: 10
    }
});

export default SessionScreen;