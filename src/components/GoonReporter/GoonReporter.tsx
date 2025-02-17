import {
    Alert,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Tooltip,
    Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { auth, database } from '../../utils/firebase';
import { onValue, ref, set } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useState
} from 'react';

const CAN_VOTE_THRESHOLD = (60 * 60 * 1000) / 2 ;

const mapOptions = [
    'Customs',
    'Shoreline',
    'Woods',
    'Lighthouse',
];

type GoonVote = { location: string; time: number; }

const GoonReporter = () => {
    const [user] = useAuthState(auth);
    const [selectedMap, setSelectedMap] = useState<string>('');
    const [lastReported, setLastReported] = useState<GoonVote>({ location: '', time: 0 });
    const [reportHistory, setReportHistory] = useState<Record<string, GoonVote>>({});

    useEffect(() => {
        if (!user) return;
        return onValue(ref(database, `users/${user.uid}/goonVote`), (snapshot) => {
            const lastUserVote = snapshot.val();
            if (lastUserVote) {
                setLastReported(lastUserVote);
                setSelectedMap(lastUserVote.location);
            } else {
                setLastReported({ location: '', time: 0 });
            }
        });
    }, [user]);

    useEffect(() => {
        const reportHistoryRef = ref(database, 'goons/votes');
        return onValue(reportHistoryRef, (snapshot) => {
            const firebaseData = snapshot.val();
            if (firebaseData) {
                setReportHistory(firebaseData);
            }
        });
    }, []);

    const selectMap = useCallback((event: ChangeEvent<HTMLInputElement>, value: string) => {
        setSelectedMap(value);
    }, [setSelectedMap]);

    const canVote = Date.now() > lastReported.time + CAN_VOTE_THRESHOLD;

    const report = useCallback(() => {
        if (!user) return;
        const userRef = ref(database, `users/${user.uid}/goonVote`);
        const votesRef = ref(database, `goons/votes/${user.uid}-${Date.now()}`);
        set(votesRef, {
            location: selectedMap,
            time: Date.now()
        });
        set(userRef, {
            location: selectedMap,
            time: Date.now()
        });
    }, [user, lastReported, selectedMap]);

    const columns: GridColDef[] = [
        { 
            field: 'location', 
            headerName: 'Map', 
            flex: 1,
            sortable: false,
        },
        { 
            field: 'time', 
            headerName: 'Time', 
            flex: 1,
            sortable: false,
        },
        { 
            field: 'submitter', 
            headerName: 'Submitter', 
            flex: 1,
            sortable: false,
        },
    ];
      
    const rows = Object.entries(reportHistory).map(([submitter, vote]) => {
        return {
            id: submitter, 
            submitter: submitter.includes('bot') ? 'Bot Report' : 'User Report' , 
            time: new Date(vote.time).toLocaleString(), 
            location: vote.location 
        };
    }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' , gap: 15}}>
            <Tooltip
                title={!user && <Typography color="inherit"> You must sign in to use this feature </Typography>}
                arrow
            >
                <RadioGroup
                    name="goons-radio-group"
                    row
                    value={selectedMap}
                    onChange={selectMap}
                >
                    {mapOptions.map(map =>
                        <FormControlLabel
                            key={map}
                            disabled={!canVote || !user}
                            value={map}
                            control={<Radio />}
                            label={map}
                            labelPlacement="top"
                        />
                    )}
                </RadioGroup>
            </Tooltip>
            {canVote && selectedMap &&
                <Button variant="outlined" onClick={report}>Vote</Button>}
            {!canVote &&
                <Alert severity="info">
                    <Typography variant="subtitle2">
                        You last reported the goons at:
                        {new Date(lastReported.time).toLocaleTimeString()}.
                        <br />
                        You can report them again at:
                        {new Date(lastReported.time + CAN_VOTE_THRESHOLD).toLocaleTimeString()}.
                    </Typography>
                </Alert>
            }
            <div style={{ height: 600, width: '50%', marginTop: 0 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default GoonReporter;
