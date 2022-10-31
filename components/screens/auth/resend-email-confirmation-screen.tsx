import React, {useState} from 'react';
import {  StyleSheet, Text, TextInput, View } from 'react-native';
import globalStyles from "../../../styles/global";
import SecondaryButton from "../../buttons/secondary-btn";
import axios from "axios";
import Config from "react-native-config";
import APIErrorNotification from "../../error-notification";
import useAPIError from "../../../hooks/use-api-error";
import ConfirmPopUp from "../../forms/form-components/confirm-pop-up";

const ResendEmailConfirmationScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const {error, addError} = useAPIError();
    const [emailSent, setEmailSent] = useState(false);
    const [formSubmited, setFormSubmited] = useState(false);


    const handleEmail = (value: string) => {
        setEmail(value);
    }

    const resendConfirmationEmail = async () => {
        try {
            setFormSubmited(true);
            await axios.post(`${Config.API_URL}/api/authenticate/re-confirm/${email.trim()}`);
            setEmailSent(true);
        } catch (ex) {
            if(ex.response.status = 404) {
                console.log(ex.response.data.message)
                addError(ex.response.data.message, ex.response.status);
            }
        }
    }

    return (
        <View style={globalStyles.container}>
            {error ? <APIErrorNotification/> : null}
            <View style={styles.inputWrapper}>
                <Text style={styles.headerOne}>Confirm Email</Text>
                <TextInput style={styles.input} 
                           value={email} 
                           placeholder="Email Address..." 
                           onChangeText={handleEmail} />
                <SecondaryButton disabled={formSubmited}
                                 onPress={resendConfirmationEmail} 
                                 color={"#EBB93E"} 
                                 title={"Send Confirmation Email"} />
                <Text style={{...globalStyles.linkText, textAlign: "center"}} 
                      onPress={() => navigation.navigate("SignIn")}>
                    Return to Login
                </Text>
            </View>
            {emailSent ? <ConfirmPopUp title="Email Sent!"
                                       text="Please visit your inbox to reset your password."
                                       btnText="Back to Login"
                                       onConfirm={() => navigation.navigate("SignIn")}/> : null}

        </View>
    );
}

export default ResendEmailConfirmationScreen;

const styles = StyleSheet.create({
    headerOne: { fontSize: 30, textTransform: "uppercase", marginBottom: 10, fontWeight: 'bold', textAlign: "center", color: '#f5f5f5' },
    text: { fontWeight: 'bold', color: '#f5f5f5', lineHeight: 25 },
    input: { backgroundColor: 'white', marginBottom: 15, paddingLeft: 13, fontSize: 20, borderRadius: 4 },
    inputWrapper: { backgroundColor: '#333333', padding: 15, height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' },
});