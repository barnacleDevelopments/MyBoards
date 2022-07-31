import React, {useEffect, useState} from 'react';

// Types
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Hangboard} from '../../../types/models/hangboard';

// Components
import {View} from 'react-native';
import HangboardForm from '../../forms/hangboard-form';
import useMyBoardsAPI from '../../../functions/api';
import globalStyles from '../../../styles/global';
import useHangboardForm from '../../../hooks/use-hangboard-form';
import useAPIError from '../../../hooks/use-api-error';
import TextLoader from "../../text-loader";

type RootStackParamList = {
    EditHangboardScreen: {
        hangboardId: number,
        hangboard: Hangboard
    }
}

type Props = NativeStackScreenProps<RootStackParamList, 'EditHangboardScreen'>;

const EditHangboardScreen = ({navigation, route}: Props) => {
    const [submittedUI, setSubmittedUI] = useState(false);
    const {addError} = useAPIError();
    const {updateHangboard} = useMyBoardsAPI();
    let submited = false;
    const {
        hangboard,
        handleFingerSelect,
        emptyHolds,
        setHangboard
    } = useHangboardForm(route.params?.hangboardId);

    useEffect(() => {
        if (route.params.hangboard)
            setHangboard({...hangboard, ...route.params.hangboard})
    }, [route.params.hangboard]);

    const handleUpdate = async (data) => {
        if (!submited) {
            submited = true;
            navigation.setOptions({headerShown: false})
            setSubmittedUI(true);
            let body: FormData = new FormData();

            const imagePathArray = data.image.path.split("/");

            if (data.image.mime) {
                const imageFile = {
                    uri: data.image.path,
                    name: imagePathArray[imagePathArray.length - 1],
                    type: data.image.mime
                }

                body.append("image", imageFile);
            }

            const hangboardData = {
                Id: data.id,
                Name: data.name,
                ImageURL: data.imageURL,
                BoardHeight: hangboard?.boardHeight,
                BoardWidth: hangboard?.boardWidth,
                Holds: hangboard.holds.map((hold, i) => {
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
                })
            }

            body.append("hangboard", JSON.stringify(hangboardData));

            try {
                await updateHangboard(body);
            } catch (ex: any) {
                addError("ERROR UPDATING HANGBOARD", ex.status);
            } finally {
                navigation.navigate("Hangboards");
            }
        }
    }

    return (
        <View style={{...globalStyles.container, paddingLeft: 10, paddingRight: 10}}>
            {!submittedUI && hangboard.name ?
                <HangboardForm
                    hangboard={hangboard}
                    onFingerSelect={handleFingerSelect}
                    onPhoto={emptyHolds}
                    onSubmit={handleUpdate}
                    handleHangboard={setHangboard}
                /> : <TextLoader text={`Updating your ${hangboard.name} hangboard.`}/>}
        </View>
    )
}

export default EditHangboardScreen;
