import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../../utils/firebase';
import { onValue, ref } from 'firebase/database';
import {
    Button,
    Collapse,
    Grid,
    Paper,
    Typography,
    styled
} from '@mui/material';
import _ from 'lodash';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const GoonData = () => {
    const [user] = useAuthState(auth);
    const [maps, setMaps] = useState<Record<string, number>>({});
    const [latestVote, setLatestVote] = useState<string>('Unknown');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;
        const currentGoonRef = ref(database, 'goons/current');
        return onValue(currentGoonRef, (snapshot) => {
            const firebaseData = snapshot.val();
            if (firebaseData) {
                setMaps(firebaseData['map']);
                setLatestVote(new Date(firebaseData['mostRecentVote']).toLocaleString());
            }
        });
    }, [user]);

    const toggleExpand = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const mostProbableMap = (_.maxBy(Object.entries(maps), '1') ?? ['Unknown'])[0];

    return (
        <>
            <Typography variant="h6">Current Location: {_.capitalize(mostProbableMap)}</Typography>
            <Typography variant="h6">Latest report time: {latestVote}</Typography>
            <Button
                variant="outlined"
                onClick={toggleExpand}
                sx={{ marginTop: '5px' }}
                endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
            >
                Map Probabilities
            </Button>
            <Collapse in={isExpanded} sx={{ width: '75%' }}>
                <Grid
                    sx={{ marginTop: '5px' }}
                    container
                    columnSpacing={2}
                    rowSpacing={2}
                    justifyContent="center">
                    {Object.entries(maps).map(([map, probability]) => (
                        <Grid
                            key={map}
                            item xs={12}
                            sm={6}
                            md={3}
                            justifyContent="center"
                        >
                            <Item>
                                {map}: {(100 * probability).toFixed(2)}%
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Collapse >
        </>
    );
};

export default GoonData;
