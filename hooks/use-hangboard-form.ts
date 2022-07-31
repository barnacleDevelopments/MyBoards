import {useEffect, useState} from 'react';
import {Hangboard} from '../types/models/hangboard';
import {fingerCount} from '../types/models/set';
import useMyBoardsAPI from "../functions/api";

const useHangboardForm = (hangboardId?: number) => {
    const [hangboard, setHangboard] = useState<Hangboard>({
        name: "",
        holds: [],
        imageURL: "",
        boardWidth: 0,
        boardHeight: 0
    });
    const {getHangboard} = useMyBoardsAPI();

    useEffect(() => {
        (async () => {
            if (hangboardId) {
                const result = await getHangboard(hangboardId);
                const holds = result.holds.sort((a, b) => a.index < b.index ? -1 : 1)
                setHangboard({...result, holds});
            }
        })();
    }, []);

    /**
     *
     * @param holdIndex hangboard's hold index.
     * @param finderCount new finger count value.
     * @description changes the finger count of a specific hold.
     */
    const handleFingerSelect = (holdIndex: number, finderCount: fingerCount) => {
        setHangboard((hangboard) => {
            hangboard.holds = hangboard.holds.map((hold, i) => {
                if (i === holdIndex)
                    hold.fingerCount = finderCount;
                return hold;
            });
            return {...hangboard};
        });
    }

    /**
     *
     * @param holdIndex hangboard's hold index.
     * @description increments the depth property of a specific hold by one.
     */
    const handleHoldDepthIncrement = (holdIndex: number) => {
        setHangboard((hangboard) => {
            hangboard.holds = hangboard.holds.map((hold, i) => {
                if (i === holdIndex)
                    hold.depthMM || hold.depthMM >= 0 ? hold.depthMM += 1 : hold.depthMM = 0;
                return hold;
            });
            return {...hangboard};
        });
    }

    /**
     *
     * @param holdIndex hangboard's hold index.
     * @description decrements the depth property of a specific hold by one.
     */
    const handleHoldDepthDecrement = (holdIndex: number) => {
        setHangboard((hangboard) => {
            hangboard.holds = hangboard.holds.map((hold, i) => {
                if (i === holdIndex)
                    hold.depthMM || hold.depthMM >= 0 ? hold.depthMM -= 1 : hold.depthMM = 0;
                return hold;
            });
            return {...hangboard};
        });
    }

    /**
     * @description removes all holds from hangboard.
     */
    const emptyHolds = () => {
        setHangboard(hangboard => ({...hangboard, holds: []}))
    }

    return {
        hangboard,
        handleFingerSelect,
        handleHoldDepthIncrement,
        handleHoldDepthDecrement,
        emptyHolds,
        setHangboard
    }
}


export default useHangboardForm;
