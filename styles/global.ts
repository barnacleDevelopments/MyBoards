import { StyleSheet } from "react-native";
import colors from "./colors";

const globalStyles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: '#212021'
    },
    scrollContainer: {
        marginLeft: 15,
        marginRight: 15,
        height: "100%"
    },
    pageHeading: {
        fontSize: 50,
        marginBottom: 25,
        marginTop: 25,
        textAlign: 'center',
        color: '#f5f5f5'
    },
    textBoxHeading: {
        color: '#f5f5f5', 
        textAlign: 'center', 
        marginBottom: 10, 
        fontSize: 20
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    linkText: {
        color: colors.primary,
        fontSize: 20,
        marginTop: 10,
        textDecorationLine: 'underline'
    }
});

export default globalStyles;
