import React, {useContext} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import globalStyles from '../../styles/global';
import {AuthContext} from "../../contexts/auth-context";

const SettingsScreen = () => {

    const context = useContext(AuthContext)
    return (
        <View style={globalStyles.container}>
            <ScrollView
                contentContainerStyle={{
                    flexDirection: 'column',
                    display: 'flex',
                    alignItems:
                        'flex-end',
                    marginRight: 15,
                    marginLeft: 15
                }}>
                <Pressable
                    onPress={() => context.signOut()}
                    style={{
                        display: 'flex',
                        marginTop: 15,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                    <Text style={{marginRight: 8, fontSize: 25, color: '#f5f5f5'}}>Logout</Text>
                    <Icon
                        color={'#f5f5f5'}
                        name='logout'
                        tvParallaxProperties={undefined}
                    />
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({});

export default SettingsScreen;