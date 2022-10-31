import {View, Text} from "react-native";
import React from 'react';
import globalStyles from "../../../styles/global";
import SecondaryButton from "../../buttons/secondary-btn";

const ConfirmPopUp: React.FC<{
    onConfirm: () => void,
    onCancel?: () => void,
    text: string, 
    title: string, 
    btnText: string,
    cancelable?: boolean
}> = ({onConfirm, onCancel, text, title, btnText, cancelable = false}) =>
        <View style={{
            position: "absolute",
            display: "flex", 
            justifyContent: 'center', 
            alignItems: 'center',
            width: "100%",
            height: "100%",
            backgroundColor: '#00000090',
            zIndex: 100000000
        }}>
            <View style={{backgroundColor: 'white', width: "80%", padding: 20, borderRadius: 4 }}>
                <Text style={{...globalStyles.textBoxHeading, color: 'black'}}>{title}</Text>
                <Text style={{marginBottom: 10, textAlign: 'center'}}>{text}</Text>
                <View style={{display: 'flex', flexDirection: 'row', marginTop: 5}}>
                    <View style={{ flex: 1, marginRight: 5}}>       
                        <SecondaryButton title={btnText} color={"#EBB93E"} onPress={onConfirm} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {cancelable ? <SecondaryButton title={"Cancel"} color={"#EBB93E"} onPress={onCancel} /> : null}
                    </View>
                </View>
            </View>
        </View>

export default ConfirmPopUp;