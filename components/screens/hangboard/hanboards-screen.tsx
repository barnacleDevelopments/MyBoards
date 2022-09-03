import React, {useContext, useState} from 'react';

// Hooks
import {useNetInfo} from '@react-native-community/netinfo';

// Types
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Hangboard} from '../../../types/models/hangboard';

// Components
import {Button, ScrollView, Text, View} from 'react-native';
import HangboardItem from './hangboard-item';
import {useFocusEffect} from '@react-navigation/native';
import LoadingPanel from '../../stat-panels/loading-panel';
import ErrorMessage from '../../error-message';
import DescriptionBox from '../../description-box';
import globalStyles from '../../../styles/global';
import OfflineLoader from '../../offline-loader';
import Warning from '../../forms/form-components/warning';
import useAPIError from '../../../hooks/use-api-error';
import PrimaryButton from "../../buttons/primary-btn";
import {UserContext} from "../../../contexts/user-context";
import useMyBoardsAPI from "../../../hooks/use-myboards-api";

type RootStackParamList = {
    HangboardScreen: {
        hangboard: Hangboard,
        error: { status: boolean, message: string }
    };
}

type Props = NativeStackScreenProps<RootStackParamList, 'HangboardScreen'>;

const HangboardScreen = ({navigation}: Props) => {
    const netInfo = useNetInfo();
    const [hangboards, setHangboards] = useState<Array<Hangboard>>([]);
    const [deleteWarning, setDeleteWarning] = useState<boolean>(false);
    const [editWarning, setEditWarning] = useState<boolean>(false);
    const [selectedHangboardId, setSelectedHangboardId] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ status: boolean, message: string }>({status: false, message: ''});
    const {addError} = useAPIError();
    const {getAllHangboards, deleteHangboard} = useMyBoardsAPI();
    const {user, updateUser} = useContext(UserContext)

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                await updateUser()
                setEditWarning(false);
                setDeleteWarning(false);
                try {
                    const result = await getAllHangboards();
                    setHangboards(result);
                } catch (ex: any) {
                    addError("ERROR RETRIEVING HANGBOARDS", ex.status)
                } finally {
                    setLoading(false);
                }
            })();
        }, [netInfo.isConnected])
    );

    const handleDelete = async () => {
        if (typeof selectedHangboardId === "number") {
            try {
                const result = await deleteHangboard(selectedHangboardId);
                setHangboards(hangboards => hangboards.filter(h => h.id !== result));

            } catch (ex) {
                setError(error)
            } finally {
                setDeleteWarning(false);
            }
        }
    }

    const handleErrorConfirm = () => {
        setError({status: false, message: ""});
        navigation.setParams({error: {status: false, message: ""}});
    }

    return (
        <View style={{...globalStyles.container}}>
            {/* Display error if error exists */}
            {error.status ?
                <ErrorMessage
                    message={error.message}
                    onClose={handleErrorConfirm}/> : null}

            {deleteWarning ?
                <Warning
                    text='Are you sure you want to delete this hangboard?
                Deleting this hangboard will also delete any workouts you have created with it.'
                    onConfirm={handleDelete}
                    onClose={() => setDeleteWarning(false)}/>
                : null}

            {editWarning ?
                <Warning
                    text='Are you sure you want to edit this hangboard?
                Editing this hangboard will also delete any workouts you have created with it.'
                    onConfirm={() => navigation.navigate("Edit Hangboard", {hangboardId: selectedHangboardId})}
                    onClose={() => setEditWarning(false)}/>
                : null}

            {/* If no boards exist prompt user to create board */}
            {!user?.hasCreatedFirstHangboard && !loading ?
                <DescriptionBox
                    header="Hangboards List"
                    text={"Here you can add new hangboards. Carefully go through your hangboard's " +
                        "configuration to get the best results!"}>
                    <Button
                        color={"#EBB93E"}
                        title='create first hangboard'
                        onPress={() => navigation.navigate("Create Hangboard")}
                    />
                </DescriptionBox>
                : null}

            <ScrollView style={globalStyles.scrollContainer}>
                {user?.hasCreatedFirstHangboard ? <Text style={globalStyles.pageHeading}>Hangboards</Text> : null}
                {user?.hasCreatedFirstHangboard && !hangboards.length ? <Text style={{...globalStyles.text, textAlign: 'center'}}>No hangboards created. Try creating one!</Text> : null}

                {/* If not connected to the internet, show loader */}
                {loading && netInfo.isConnected ? <LoadingPanel/> : null}

                {/* Offline Loader */}
                {!netInfo.isConnected ? <OfflineLoader/> : null}
                
                {/* Hangboards list */}
                {hangboards?.length > 0 && netInfo.isConnected ?
                    <View>
                        {hangboards.map((x: Hangboard, i: number) =>
                            <HangboardItem
                                onDeletePress={() => {
                                    setSelectedHangboardId(x.id);
                                    setDeleteWarning(true);
                                }}
                                onEditPress={() => {
                                    setSelectedHangboardId(x.id)
                                    setEditWarning(true);
                                }}
                                key={i}
                                hangboard={x}
                            />
                        )}
                    </View> : null}
                <View style={{marginBottom: 15}}></View>
            </ScrollView>

            {deleteWarning || editWarning ? null :
                <View>
                    <PrimaryButton
                        title='Create Hangboard'
                        color={"#EBB93E"}
                        disabled={!netInfo.isConnected}
                        onPress={() => navigation.navigate("Create Hangboard")}></PrimaryButton>
                </View>}
        </View>
    )
}

export default HangboardScreen;