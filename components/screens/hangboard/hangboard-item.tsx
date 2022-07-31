import React from "react";

// Components
import {Image, StyleSheet, Text, View} from "react-native";
import {Hangboard} from "../../../types/models/hangboard";
import SecondaryButton from "../../buttons/secondary-btn";

interface HangboardItemProps {
    hangboard: Hangboard,
    onDeletePress: () => void,
    onEditPress: () => void
}

const Clip = ({depthMM}: { depthMM: number }) => {
    if (depthMM <= 10) {
        return (
            <View style={{width: "33.33%", padding: 5}}>
                <Text style={{
                    ...styles.depthClipText,
                    borderColor: '#d25330',
                }}>{depthMM}mm</Text>
            </View>
        )
    }

    if (depthMM <= 20) {
        return (
            <View style={{width: "33.33%", padding: 5}}>
                <Text style={{
                    ...styles.depthClipText,
                    borderColor: '#2c6c49',
                }}>{depthMM}mm</Text>
            </View>
        )
    }

    if (depthMM >= 30) {
        return (
            <View style={{width: "33.33%", padding: 5}}>
                <Text style={{
                    ...styles.depthClipText,
                    borderColor: '#0f3f91',
                }}>{depthMM}mm</Text>
            </View>
        )
    }

    return (
        <View style={{width: "33.33%", padding: 5}}>
            <Text style={{
                ...styles.depthClipText,
                borderColor: '#0f3f91',
            }}>{depthMM}mm</Text>
        </View>
    )
}

const HangboardItem = ({hangboard, onDeletePress, onEditPress}: HangboardItemProps) => {

    // filter out duplicates, find deepest, mid deepest and most shallow. 
    const getHoldDepthRange = () => {
        const sortedHolds = hangboard.holds
            .map(hold => hold.depthMM)
            .sort((a, b) => a > b ? 1 : -1)
            .reduce((acumulator: number[], depth: number) => {
                if (!acumulator.includes(depth)) return [...acumulator, depth]
                return acumulator
            }, []);

        const shallowest = sortedHolds[0];

        const mid = sortedHolds[Math.ceil(sortedHolds.length / 2)];

        const deepest = sortedHolds[sortedHolds.length - 1];

        return [shallowest, mid, deepest]
    }

    const depthRange = getHoldDepthRange()

    return (
        <View style={styles.container}>
            {hangboard?.imageURL ?
                <Image
                    source={{uri: hangboard?.imageURL}}
                    style={styles.boardImage}/> : null}
            <View style={styles.content}>
                <Text style={styles.hangboardName}>{hangboard?.name}</Text>
                <View style={styles.buttonContainer}>
                    <View style={{marginRight: 17}}>
                        <SecondaryButton
                            color='#710C10'
                            title='delete'
                            onPress={onDeletePress}
                        />
                    </View>
                    <View>
                        <SecondaryButton
                            title='edit'
                            color={"#EBB93E"}
                            onPress={onEditPress}
                        />
                    </View>
                </View>
            </View>
            <View style={{display: "flex", flexDirection: 'row', marginTop: 7}}>
                {depthRange.map((depth, i) => <Clip key={i} depthMM={depth}/>)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 4
    },
    title: {
        color: '#f5f5f5'
    },
    depthClipText: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        textAlign: 'center',
        borderRadius: 5,
        color: 'white'
    },
    hangboardName: {
        fontSize: 20,
        flex: 1,
        color: '#f5f5f5'
    },
    boardImage: {
        position: 'relative',
        aspectRatio: 3.49 / 2.03,
        marginBottom: 10,
        resizeMode: 'contain',
        width: "100%"
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    buttonContainer: {
        marginRight: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});

export default HangboardItem;