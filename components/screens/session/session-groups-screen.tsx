import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Pressable} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import useMyBoardsAPI from "../../../hooks/use-myboards-api";
import Session from "../../../types/models/session";

const SessionGroupScreen = () => {
    const {getGroupedSessionsByMonth} = useMyBoardsAPI();
    const [sessionGroups, setSessionGroups] = useState<{month: number, year: number, sessions: Session[]}[]>();
    const navigation = useNavigation();
    
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const date = new Date()
                setSessionGroups(await getGroupedSessionsByMonth(date.getFullYear()));
            })();
        }, [])
    );

    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];  
    
    return (
        <ScrollView style={{backgroundColor: "#333333", paddingLeft: 10, paddingRight: 10}}>
            {sessionGroups?.map(sg => {
              return (
                  <Pressable onPress={() => navigation.navigate("Sessions", {month: sg.month})} style={styles.container}>
                      <View style={styles.header}>
                          <Text style={styles.title}>
                              {mS[sg.month - 1]} 
                          </Text> 
                          <Text style={styles.subTitle}>
                              {sg.year}
                          </Text>
                      </View>
                    <View>
                        <Text style={styles.sessionCount}>
                            {sg.sessions.length} records
                        </Text>
                    </View>
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
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end'
    },
    title: {
        color: 'white', 
        fontSize: 40
    },
    subTitle: {
        color: 'white',
        fontSize: 20,
        marginLeft: 8,
        marginBottom: 4.5
    },
    sessionCount: {
        color: 'white', 
        fontSize: 25
    }
})

export default SessionGroupScreen;