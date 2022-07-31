import React from 'react';
import {Pressable, Text, View} from 'react-native';

const ErrorMessage = ({message, onClose}: { message: string, onClose: () => void }) => {
    return (
        <View style={{
            zIndex: 10000,
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: '#710C10',
            padding: 15
        }}>
            <Text style={{textAlign: 'center', color: '#f5f5f5', paddingBottom: 10}}>{message}</Text>
            <Pressable style={{backgroundColor: '#f5f5f5'}} onPress={onClose}>
                <Text style={{fontSize: 20, color: '#710C10', textAlign: 'center'}}>Ok</Text>
            </Pressable>
        </View>
    )
}

export default ErrorMessage;
