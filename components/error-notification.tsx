import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import useAPIError from '../hooks/use-api-error';

function APIErrorNotification() {
    const {error, removeError} = useAPIError();

    const handleSubmit = () => {
        removeError();
    };

    return (
        <ScrollView style={{
            zIndex: 10000,
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: '#710C10',
            padding: 15
        }}>
            {!!error ? <View>
                <Pressable style={{backgroundColor: '#f5f5f5'}} onPress={handleSubmit}>
                    <Text style={{fontSize: 20, color: '#710C10', textAlign: 'center'}}>Ok</Text>
                </Pressable>
                <Text style={{
                    textAlign: 'center',
                    color: '#f5f5f5',
                    paddingBottom: 10
                }}> {error && error.message ? error.message : ""}</Text>
                <Text style={{
                    textAlign: 'center',
                    color: '#f5f5f5',
                    paddingBottom: 10
                }}> {error && error.status ? error.status : ""}</Text>
             
            </View> : null}
        </ScrollView>
    )
}

export default APIErrorNotification;