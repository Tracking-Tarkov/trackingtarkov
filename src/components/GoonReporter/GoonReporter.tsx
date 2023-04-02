import {
    Alert,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';
import { auth, database } from '../../utils/firebase';
import { onValue, ref, set } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useState
} from 'react';

const HOUR_IN_MS = 60 * 60 * 1000;

const mapOptions = [
    'Customs',
    'Shoreline',
    'Woods',
    'Lighthouse',
];

const GoonReporter = () => {
    const [user] = useAuthState(auth);
    const [selectedMap, setSelectedMap] = useState<string>('');
    const [lastReported, setLastReported] = useState<{ location: string; time: number; }>({ location: '', time: 0 });

    useEffect(() => {
        if (!user) return;
        return onValue(ref(database, `goons/votes/${user.uid}`), (snapshot) => {
            const lastUserVote = snapshot.val();
            if (lastUserVote) {
                setLastReported(lastUserVote);
                setSelectedMap(lastUserVote.location);
            } else {
                setLastReported({ location: '', time: 0 });
            }
        });
    }, [user]);

    const selectMap = useCallback((event: ChangeEvent<HTMLInputElement>, value: string) => {
        setSelectedMap(value);
    }, [setSelectedMap]);

    const report = useCallback(() => {
        if (!user) return;
        if (Date.now() - lastReported.time < HOUR_IN_MS) return;
        const reporterRef = ref(database, `goons/votes/${user.uid}`);
        set(reporterRef, {
            location: selectedMap,
            time: Date.now()
        });
    }, [user, lastReported, selectedMap]);

    const canVote = Date.now() > lastReported.time + HOUR_IN_MS;

    return (
        <>
            <RadioGroup
                name="goons-radio-group"
                row
                value={selectedMap}
                onChange={selectMap}
            >
                {mapOptions.map(map =>
                    <FormControlLabel
                        key={map}
                        disabled={!!lastReported.location}
                        value={map}
                        control={<Radio />}
                        label={map}
                        labelPlacement="top"
                    />
                )}
            </RadioGroup>
            {canVote && selectedMap &&
                <Button variant="outlined" onClick={report} sx={{ marginTop: '5px' }}>Vote</Button>}
            {!canVote &&
                <Alert severity="info">
                    <Typography variant="subtitle2">
                        You last reported the goons at:
                        {new Date(lastReported.time).toLocaleTimeString()}.
                        <br />
                        You can report them again at:
                        {new Date(lastReported.time + HOUR_IN_MS).toLocaleTimeString()}.
                    </Typography>
                </Alert>
            }
        </>
    );
};

export default GoonReporter;
