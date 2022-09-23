import {View, Text} from "react-native";
import React from 'react';
import globalStyles from "../../../styles/global";
import SecondaryButton from "../../buttons/secondary-btn";

const ConfirmPopUp = ({onConfirm, text, title}) => {
    return (
        <View style={{
            position: "absolute",
            display: "flex", 
            justifyContent: 'center', 
            alignItems: 'center',
            width: "100%",
            height: "100%",
            backgroundColor: '#00000090'
        }}>
            <View style={{backgroundColor: 'white', width: "80%", padding: 20 }}>
                <Text style={{...globalStyles.textBoxHeading, color: 'black'}}>{title}</Text>
                <Text style={{marginBottom: 10}}>{text}</Text> 
                <SecondaryButton title="Back to Login" color={"#EBB93E"} onPress={onConfirm} />
            </View>
        </View>
    )
}

export default ConfirmPopUp;