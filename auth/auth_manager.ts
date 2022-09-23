import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class AuthAPIManager {

    static signInAsync = async (username: string, password: string) => {
        try {
            const url = `${Config.API_URL}/api/Authenticate/login`;

            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            }

            const response = await fetch(url, options);

            if (response.ok) {
                const data = await response.json()
                await AsyncStorage.setItem('accessToken', data.token);
                await AsyncStorage.setItem('refreshToken', data.refreshToken);
            }
            
            return response;

        } catch (ex: any) {
            console.log(ex.message)
        }
    };

    static registerAsync = async (username: string, password: string, email: string) => new Promise<Response>(async (resolve, reject) => {
        try {
            const url = `${Config.API_URL}/api/Authenticate/register`;

            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password, email})
            }

            const response = await fetch(url, options);

            resolve(response);

        } catch (ex: any) {
            console.log(ex.message)
        }
    })
    
    static GetUserInfo = async () => {
        const accessToken = await this.getAccessTokenAsync();
 
        try {
            const url = `${Config.API_URL}/api/Account/user-info`;
            const options = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
            const response = await fetch(url, options);

            return await response.json()
            
        } catch (ex: any) {
            console.log(ex.message)
        }
    }

    static signOutAsync = async () => {
        // Clear storage

        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
    };

    static getAccessTokenAsync = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        // Not expired, just return saved access token
        return accessToken
    };
}