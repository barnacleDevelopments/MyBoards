import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {AuthContext} from "../../../contexts/auth-context";
import RegisterScreen from './register-screen';
import TextLoader from "../../text-loader";
import globalStyles from "../../../styles/global";
import APIErrorNotification from "../../error-notification";
import useAPIError from "../../../hooks/use-api-error";

const SignInScreen = () => {
  const {signIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const {error} = useAPIError();
  
  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleUsername = (value: string) => {
    setUsername(value.trim());
  }

  const handlePassword = (value: string) => {
    setPassword(value.trim());
  }

  const signInAsync = async () => {
    if(!username || !password) {
      setErrorMessage("Both username and password are required. " +
          "If you don't have an account please press register.")
      return;
    }
    setSigningIn(true);
    const response = await signIn(username, password);
    setSigningIn(false);
    switch (response?.status) {
      case 401: {
        setErrorMessage("Username or password is incorrect.")
      }
        break;
      default: {
        const data = await response.json();
        console.log(data)
        setErrorMessage(data.message);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      {error ? <APIErrorNotification/> : null}
      {!isRegister && !signingIn ?
        <View style={{ backgroundColor: '#333333', padding: 15, height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, textAlign: 'center', color: "#f5f5f5", marginBottom: 15 }}>LOGIN</Text>
          {/* <View style={{ marginBottom: 13 }}>
        <Text style={styles.headerOne}>MyBoards Beta</Text>
        <Text style={{ fontSize: 15, textAlign: "center", color: '#f5f5f5' }}>Welcome! I hope you enjoy your time with this early version of my handboard training app.</Text>
      </View> */}
          <View>
            <TextInput
              style={styles.input}
              onChangeText={handleUsername}
              textContentType="username"
              placeholder='Username...'></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={handlePassword}
              textContentType='password'
              placeholder='Password...'
              secureTextEntry={true}></TextInput>
          </View>
          {errorMessage ? <Text style={{ color: "red", textAlign: 'center', fontSize: 18, marginBottom: 13 }}>{errorMessage}</Text> : null}
          <Button color={"#EBB93E"} title={signingIn ? 'Signing In...' : 'Sign In'} onPress={signInAsync} />
          <Text
            onPress={() => setRegister(true)}
            style={{ color: "#EBB93E", fontSize: 18, marginTop: 10, textAlign: 'center' }}>Aren't registered yet? <Text style={{textDecorationLine: 'underline'}}>Register</Text></Text>
        </View> : null}
      {isRegister && !signingIn ? <RegisterScreen onLoginSwitch={() => setRegister(false)} /> : null}
      {signingIn ? <TextLoader text={`Signing In...`}/> : null}

    </View>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  headerOne: { fontSize: 30, fontWeight: 'bold', textAlign: "center", color: '#f5f5f5' },
  headerTwo: { fontSize: 20, fontWeight: 'bold', color: '#f5f5f5' },
  text: { fontWeight: 'bold', color: '#f5f5f5', lineHeight: 25 },
  input: { backgroundColor: 'white', marginBottom: 15, paddingLeft: 13, fontSize: 20, borderRadius: 4 }

});