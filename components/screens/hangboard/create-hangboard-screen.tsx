import React, {useEffect, useState} from 'react';

// Types
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Components
import {StyleSheet, Text, View} from 'react-native';
import HangboardForm from '../../forms/hangboard-form';
import {Hangboard} from '../../../types/models/hangboard';
import TextLoader from "../../text-loader";

// HOOKS
import useHangboardForm from '../../../hooks/use-hangboard-form';
import useAPIError from '../../../hooks/use-api-error';
import useMyBoardsAPI from '../../../hooks/use-myboards-api';

type RootStackParamList = {
    CreateHangboardScreen: {
        hangboard: Hangboard,
    }
}

type Props = NativeStackScreenProps<RootStackParamList, 'CreateHangboardScreen'>;

const CreateHangboardScreen = ({navigation, route}: Props) => {
    let submited = false;
    const [submitedUI, setSubmitedUI] = useState(false);
    const [holdsError, setHoldsError] = useState<boolean>(false);
    const {addError} = useAPIError();
    const {createHangboard} = useMyBoardsAPI();

    const {
        hangboard,
        handleFingerSelect,
        emptyHolds,
        setHangboard
    } = useHangboardForm();

    useEffect(() => {
        if (route.params?.hangboard)
            setHangboard(() => ({...route.params.hangboard}))
    }, [route.params?.hangboard])

    const handleCreate = async (data) => {
        if (hangboard.holds.length > 0) {
            if (!submited) {
                submited = true;
                setSubmitedUI(true);
                navigation.setOptions({
                    headerShown: false
                });
                let body: FormData = new FormData();
                const imagePathArray = data.image.path.split("/");

                // check if new image was taken
                if (data.image.path !== "") {
                    const imageFile = {
                        uri: data.image.path,
                        name: imagePathArray[imagePathArray.length - 1],
                        type: data.image.mime
                    }

                    body.append("image", imageFile);
                }

                // set hold properties to pascal case for request.
                const holds = hangboard.holds.map((hold, i) => {
                    hold.index = i;
                    return Object.keys(hold).reduce((newHold: any, currentKey: string) => {
                        newHold[currentKey.charAt(0).toUpperCase() + currentKey.slice(1)] = hold[currentKey];
                        return newHold;
                    }, {
                        FingerCount: 4,
                        BaseUIXCoord: 0,
                        BaseUIYCoord: 0,
                        DepthMM: 0
                    })
                });

                // add hangboard to request body
                const hangboardContent = {
                    Name: data.name,
                    Holds: holds,
                    BoardHeight: hangboard.boardHeight,
                    BoardWidth: hangboard.boardWidth
                }

                body.append("hangboard", JSON.stringify(hangboardContent));

                try {
                    await createHangboard(body);
                } catch (ex: any) {
                    addError(`ERROR CREATING HANGBOARD. PLEASE TRY AGAIN ${JSON.stringify(ex)}`, ex.status)
                } finally {
                    navigation.navigate("Hangboards");
                }
            }
        } else {
            setHoldsError(true);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                {!submitedUI ?
                    <HangboardForm
                        hangboard={hangboard}
                        onFingerSelect={handleFingerSelect}
                        onSubmit={handleCreate}
                        onPhoto={emptyHolds}
                        handleHangboard={setHangboard}
                    />
                    :
                    <TextLoader text={`Creating your hangboard.`}/>}
                {holdsError && hangboard.holds.length <= 0 ?
                    <Text style={{color: '#710C10', textAlign: 'center'}}>
                        Configure hangboard before submiting.
                    </Text> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#212021'
    },
    formContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'column'
    }
})

export default CreateHangboardScreen;