import {Formik} from "formik";
import React, {useEffect, useMemo, useRef, useState} from "react";
import * as Yup from 'yup';
import {useNavigation} from "@react-navigation/native";

// Components
import {Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";

// Types
import {Hangboard} from "../../types/models/hangboard";
import {BoardDimensions} from "../../types/board-dimensions";
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import DescriptionBox from "../description-box";
import HoldForm from "../screens/hangboard/hold-form";
import globalStyles from "../../styles/global";
import {imageAspectRatio, positionPin} from "../../functions/hangboard-panel";
import {ImageData} from "../../types/image-data";
import SecondaryButton from "../buttons/secondary-btn";
import {HeaderBackButton} from "@react-navigation/elements";
import ConfirmPopUp from "./form-components/confirm-pop-up";

const hangboardSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'name must be at least 2 characters long')
        .max(50, 'name has a maximum of 50 characters')
        .required('name is required'),
});

interface HangboardFormProps {
    hangboard: Hangboard,
    onSubmit: (hangboard: Hangboard) => void,
    onFingerSelect: (holdIndex: number, fingerCount: number) => void,
    onPhoto: () => void,
    handleHangboard: (hangboard: Hangboard) => void
}

const HangboardForm: React.FC<HangboardFormProps> = ({
                           hangboard,
                           onSubmit,
                           onFingerSelect,
                           onPhoto,
                           handleHangboard
                       }) => {

    const navigation = useNavigation();
    const [image, setImage] = useState<ImageData>({path: "", mime: "", name: "", width: 0, height: 0});
    const [screenSize, setScreenSize] = useState<BoardDimensions>({width: 0, height: 0});
    const [isEditPrompt, setIsEditPrompt] = useState(false);
    const originalHangboardHoldsRef = useRef<string>();

    useEffect(() => {
        originalHangboardHoldsRef.current = JSON.stringify(hangboard.holds);
    },[])
    
    useEffect(() => {
        setImage(image => ({...image, path: hangboard?.imageURL}))
    }, [hangboard.imageURL]);

    const getImage = async () => {
        try {
            let imageData: ImageOrVideo = await ImagePicker.openCamera({
                cropping: true,
                freeStyleCropEnabled: true,
                height: 400
            });

            onPhoto();
            setImage(imageData);

        } catch (ex) {
            setImage({path: "", mime: "", name: "", width: 0, height: 0})
        }
    }

    const handleLayout = ({nativeEvent}) => {
        setScreenSize(nativeEvent.layout);
    }

    const isFormFinished = image?.path?.length > 0 && hangboard?.holds.length > 0;

    const aspectRatio = imageAspectRatio(image.width || hangboard?.boardWidth, image.height || hangboard?.boardHeight);

    const updateHoldDepth = (holdIndex: number, value: number) => {
        if (value !== 0) {
            const hangboardToUpdate = {...hangboard};

            hangboardToUpdate.holds = hangboard.holds.map((hold, i) => {
                if (i === holdIndex) {
                    hold.depthMM = Math.round(value);
                }
                return hold;
            });

            handleHangboard({...hangboardToUpdate});
        }
    }
    
    const displayEditPrompt = () => {
        // check if the state of the hangboard changed
        setIsEditPrompt(true);
        navigation.setOptions({
            headerShown: false
        });
    }
    
    const hideEditPrompt = () => {
        // check if the state of the hangboard changed
        setIsEditPrompt(false);
        navigation.setOptions({
            headerShown: true
        });
        
    }

    return (
        <Formik
            validationSchema={hangboardSchema}
            initialValues={{
                id: hangboard?.id,
                name: hangboard?.name,
                imageURL: hangboard?.imageURL,
            }}
            onSubmit={(values) => onSubmit({
                ...values,
                image
            })}
        >
            {/* Form Handling */}
            {({handleChange, handleSubmit, touched, values, errors}) => {
                useEffect(() => {
                    if(hangboard.id) {
                        navigation.setOptions({
                            headerLeft: (props: any) =>
                                <HeaderBackButton {...props} onPress={() => {
                                    if(typeof originalHangboardHoldsRef.current === 'string' &&
                                        (originalHangboardHoldsRef.current !== JSON.stringify(hangboard.holds))) {
                                        
                                        displayEditPrompt();
                                        return
                                    }

                                    // otherwise navigate back to hangboard list
                                    navigation.navigate("Hangboards")
                                }} />
                        });
                    } else {
                        navigation.setOptions({
                            headerRight: () =>
                                <SecondaryButton
                                    color="#EBB93E"
                                    title='Finished'
                                    disabled={!isFormFinished}
                                    onPress={handleSubmit}/>,

                        });
                    }
                    
                }, [image.path, hangboard?.holds.length]);

                return (
                    <View style={{...globalStyles.container}}>
                        {isEditPrompt ? <ConfirmPopUp title={"Save"} 
                                                      text={"Want to save your changes?"}
                                                      btnText={"Save"}
                                                      cancelable={true}
                                                      onConfirm={() => {
                                                          hideEditPrompt()
                                                          handleSubmit();
                                                      }}  
                                                      onCancel={() => {
                                                          setIsEditPrompt(false);
                                                          navigation.setOptions({
                                                              headerShown: true
                                                          });
                                                      } }/> : null}
                        {/* Form fields */}
                        <ScrollView contentContainerStyle={styles.holdConfigContainer}>
                            {hangboard.holds.length < 0 ?
                                <View style={{marginTop: 15, width: '100%'}}>
                                    {!image.path ?
                                        <DescriptionBox
                                            header="Tip!"
                                            text="Use your phones camera FLASH to get the best results."/>
                                        : null}

                                    {image.path && hangboard.holds.length < 1 ?
                                        <DescriptionBox
                                            header="Nice Shot!"
                                            text="Time to configure your boards holds."/>
                                        : null}
                                </View> : null}
                            <View style={styles.formFieldsContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="hanboard name..."
                                    autoCapitalize="none"
                                    onChangeText={handleChange("name")}
                                    value={values.name}
                                />
                                {errors.name && touched.name ? (
                                    <Text style={styles.validationMessage}>{errors.name}</Text>
                                ) : null}
                                <View
                                    onLayout={handleLayout}
                                    style={{
                                        width: "100%",
                                        borderRadius: 5,
                                    }
                                    }>
                                    {image?.path ? <Image
                                        source={{uri: image?.path}}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: aspectRatio,
                                            resizeMode: 'contain',
                                            borderRadius: 1,
                                            width: '100%',
                                        }}
                                    /> : null}
                                    {screenSize.height > 0 && screenSize.width > 0 ? hangboard?.holds?.map((hold, i) =>
                                        <View
                                            key={i}
                                            style={{
                                                ...styles.pin,
                                                top: positionPin(
                                                    hold.baseUIYCoord,
                                                    hangboard?.boardHeight || screenSize.height,
                                                    screenSize.height
                                                ) - 10 || 0,
                                                left: positionPin(
                                                    hold.baseUIXCoord,
                                                    hangboard?.boardWidth || screenSize.width,
                                                    screenSize.width
                                                ) - 10 || 0
                                            }}>
                                            <Text style={styles.pinText}>{i + 1}</Text>
                                        </View>
                                    ) : null}
                                </View>
                                {!hangboard.id ? <View style={styles.mainButtons}>
                                    <Button
                                        color="#EBB93E"
                                        title={image.path ? 'Change Image' : 'Upload Image'}
                                        onPress={getImage}
                                    />
                                    {image.path ? <Pressable
                                        onPress={() => navigation.navigate("Configure Hangboard", {
                                            hangboard,
                                            image,
                                            screenSize
                                        })}
                                        style={{
                                            borderColor: "#EBB93E",
                                            borderStyle: "dotted",
                                            borderWidth: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 6.3,
                                            marginTop: 10,
                                        }}
                                    >
                                        <Text style={{
                                            color: "#EBB93E",
                                            fontSize: 15
                                        }}>{hangboard.holds.length > 0 ? 'Re-Position Holds' : 'Position Holds'}</Text>
                                    </Pressable> : null}
                                </View> : null}
                            </View>
                            {/* Hold configuration */}
                            {hangboard?.holds?.sort((a, b) => a.index < b.index ? -1 : 1).map((hold, i) => (
                                <HoldForm
                                    key={i}
                                    onDepthUpdate={updateHoldDepth}
                                    holdIndex={i}
                                    onFingerSelect={onFingerSelect}
                                    hold={hold}
                                />
                            ))}
                        </ScrollView>
                    </View>

                )

            }}
        </Formik>
    );
}

const styles = StyleSheet.create({
    selectButton: {
        borderStyle: 'solid',
        borderColor: 'grey',
        width: "100%",
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: '#b4b1ac'
    },
    holdConfigContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: "center",
        paddingBottom: 65,
    },
    mainButtons: {
        marginTop: 10
    },
    formFieldsContainer: {
        width: "100%",
        backgroundColor: '#333333',
        padding: 10,
        marginTop: 15
    },
    setContainer: {
        paddingLeft: 15,
        paddingRight: 15
    },
    setInstructionContainer: {
        display: "flex",
        marginBottom: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%"
    },
    input: {
        backgroundColor: '#f5f5f5',
        color: 'black',
        marginBottom: 10,
        borderRadius: 4,
        paddingLeft: 15
    },
    validationMessage: {
        color: 'red',
        marginBottom: 8
    },
    pin: {
        backgroundColor: '#84a6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 23,
        width: 23,
        borderRadius: 50,
        position: 'absolute',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    pinText: {
        fontSize: 13,
        color: '#f5f5f5',
        fontWeight: 'bold'
    }

});

export default HangboardForm;