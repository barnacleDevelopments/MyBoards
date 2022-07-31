import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../../auth/auth_context';
import RegisterScreen from './register-screen';

type SignInProps = {

};

const SignInScreen = ({ }: SignInProps) => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setRegister] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleUsername = (value: string) => {
    setUsername(value.trim());
  }

  const handlePassword = (value: string) => {
    setPassword(value.trim());
  }

  const signInAsync = async () => {
    setSigningIn(true);
    const response = await authContext.signIn(username, password);
    setSigningIn(false);
    switch (response?.status) {
      case 401: {
        setErrorMessage("Username or password is incorrect.")
      }
        break;
      default:
        setErrorMessage("These was a problem loging in. Please try again.")
    }
  };

  return (
    <View>
      {!isRegister ?
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
          {errorMessage ? <Text style={{ color: "red", fontSize: 18, marginBottom: 13 }}>{errorMessage}</Text> : null}
          <Button color={"#EBB93E"} title={signingIn ? 'Signing In...' : 'Sign In'} onPress={signInAsync} />
          <Text
            onPress={() => setRegister(true)}
            style={{ color: "#EBB93E", fontSize: 18, marginTop: 10, textAlign: 'center' }}>Aren't registered yet? Register</Text>
        </View>
        :
        <RegisterScreen onLoginSwitch={() => setRegister(false)} />}
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