import React, {useState} from 'react';
import {  StyleSheet, Text, TextInput, View } from 'react-native';
import globalStyles from "../../../styles/global";
import SecondaryButton from "../../buttons/secondary-btn";
import axios from "axios";
import Config from "react-native-config";
import APIErrorNotification from "../../error-notification";
import useAPIError from "../../../hooks/use-api-error";

const PasswordResetScreen = () => {
  
  const [email, setEmail] = useState("");
  const {error, addError} = useAPIError();

  const handleEmail = (value: string) => {
    setEmail(value);
  }
  
  const resetPassword = async () => {
      try {
          await axios.post(`${Config.API_URL}/api/authenticate/forgot-password/${email.trim()}`);
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
      <View style={{ backgroundColor: '#333333', padding: 15, height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
       <Text style={styles.headerOne}>PASSWORD RESET</Text>
        <TextInput style={styles.input} value={email} placeholder="Email Address..." onChangeText={handleEmail} />
        <SecondaryButton onPress={resetPassword} color={"#EBB93E"} title={"Reset Password"} />
      </View>
    </View>
  );
}

export default PasswordResetScreen;

const styles = StyleSheet.create({
  headerOne: { fontSize: 30, marginBottom: 10, fontWeight: 'bold', textAlign: "center", color: '#f5f5f5' },
  text: { fontWeight: 'bold', color: '#f5f5f5', lineHeight: 25 },
  input: { backgroundColor: 'white', marginBottom: 15, paddingLeft: 13, fontSize: 20, borderRadius: 4 }
});