import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../../auth/auth_context';

type RegisterProps = {
    onLoginSwitch: () => void
};

const RegisterScreen = ({ onLoginSwitch }: RegisterProps) => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCopy, setPasswordCopy] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        setPasswordsMatch(password === passwordCopy)
    }, [passwordCopy])

    const handleUsername = (value: string) => {
        setErrorMessage("")
        setUsername(value.trim());
    }

    const handlePassword = (value: string) => {
        setPassword(value.trim());
    }

    const handleEmail = (value: string) => {
        setEmail(value);
    }

    const handlePasswordCopy = (value: string) => {
        setPasswordCopy(value);
    }

    const registerAsync = async () => {
        if (!passwordsMatch) return;
        const response = await authContext.register(username, password, email);
        const data = await response.json()
        switch (response?.status) {
            case 200:
                onLoginSwitch();
                break;
            case 500: {
                setErrorMessage(data.message)
            }
                break;
            default:
                setErrorMessage("There was a problem registering you. Please try again.");
        }
    };

    return (
        <View style={{ backgroundColor: '#333333', padding: 15, height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40, textAlign: 'center', color: "#f5f5f5", marginBottom: 15 }}>REGISTER</Text>
            <View>
                <TextInput
                    style={{ ...styles.input, marginBottom: 6 }}
                    onChangeText={handleUsername}
                    textContentType="username"
                    placeholder='Username...'></TextInput>
                <Text style={{ color: "#f5f5f5", fontSize: 15, marginBottom: 13 }}>username will be used to refer to you</Text>
                <TextInput
                    style={{ ...styles.input, marginBottom: 6 }}
                    onChangeText={handleEmail}
                    textContentType="username"
                    placeholder='Email Address...'></TextInput>
                <Text style={{ color: "#f5f5f5", fontSize: 15, marginBottom: 13 }}>email is used to verify that you are legit</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handlePassword}
                    textContentType='password'
                    placeholder='Password...'
                    secureTextEntry={true}></TextInput>
                <TextInput
                    style={styles.input}
                    onChangeText={handlePasswordCopy}
                    textContentType='password'
                    placeholder='Repeat Password...'
                    secureTextEntry={true}></TextInput>
                {errorMessage ? <Text style={{ color: "red", fontSize: 18, marginBottom: 13 }}>{errorMessage}</Text> : null}
                {!passwordsMatch ? <Text style={{ color: "red", fontSize: 18, marginBottom: 13 }}>Passwords must match.</Text> : null}
            </View>
            <Button color={"#EBB93E"} title='Register' onPress={registerAsync} />
            <Text onPress={onLoginSwitch} style={{ color: "#EBB93E", fontSize: 18, marginTop: 10, textAlign: 'center' }}>Back to login</Text>
        </View>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    headerOne: { fontSize: 30, fontWeight: 'bold', textAlign: "center", color: '#f5f5f5' },
    headerTwo: { fontSize: 20, fontWeight: 'bold', color: '#f5f5f5' },
    text: { fontWeight: 'bold', color: '#f5f5f5', lineHeight: 25 },
    input: { backgroundColor: 'white', marginBottom: 15, paddingLeft: 13, fontSize: 20, borderRadius: 4 }
});