import {
    Avatar,
    Box,
    Button,
    Typography,
    Zoom,
    Popover,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Person, Share } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { ref, remove } from 'firebase/database';
import { database } from '../utils/firebase';
import { User } from 'firebase/auth';
import CopyTooltip from '../components/CopyTooltip/CopyTooltip';

enum WipeData {
    All = 'All',
    Quests = 'Quests',
    Items = 'Items'
}

type DataPath = (user: User) => string;

const itemsPath: DataPath = (user: User) => `users/${user.uid}/items`;
const questPath: DataPath = (user: User) => `users/${user.uid}/completedQuests`;

const wipeDataPaths: Record<WipeData, DataPath[]> = {
    [WipeData.All]: [questPath, itemsPath],
    [WipeData.Quests]: [questPath],
    [WipeData.Items]: [itemsPath],
};

const Profile = () => {
    const { user, readOnly } = useAuth();
    const [showCopied, setShowCopied] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [wipeData, setWipeData] = useState<WipeData | null>(null);

    const handleWipeClick = (event: React.MouseEvent<HTMLButtonElement>, wipeData: WipeData) => {
        setWipeData(wipeData);
        setAnchorEl(event.currentTarget);
    };

    const closePopover = () => setAnchorEl(null);

    const isPopoverOver = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleWipeData = () => {
        if (readOnly || !user || !wipeData) return;

        wipeDataPaths[wipeData].forEach(dataPath => remove(ref(database, dataPath(user))));

        closePopover();
    };

    useEffect(() => {
        if (showCopied) {
            setTimeout(() => setShowCopied(false), 1000);
        }
    }, [showCopied]);

    if (!user || readOnly) {
        return (
            <Box paddingTop={6} display='flex' justifyContent='center' alignItems='center'>
                <Typography>You must be signed in to view profile</Typography>
            </Box>
        );
    }
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            paddingTop={6}
            gap={2}
        >
            {user?.photoURL ? (
                <Avatar
                    src={user.photoURL}
                    imgProps={{
                        referrerPolicy: 'no-referrer'
                    }}
                    sx={{ width: 96, height: 96 }}
                >
                </Avatar>
            ) : (
                <Avatar
                    sx={{ fontSize: '96px', width: 'auto', height: 'auto' }}
                >
                    <Person
                        fontSize='inherit'
                    />
                </Avatar>
            )}
            <CopyTooltip
                title="Copied"
                open={showCopied}
                arrow
                placement='top-end'
                TransitionComponent={Zoom}
            >
                <Button
                    endIcon={<Share />}
                    onClick={() => navigator.clipboard
                        .writeText(`${window.location.origin}?viewAs=${user.uid}`)
                        .then(() => setShowCopied(true))}
                >
                    Share your progress
                </Button>
            </CopyTooltip>
            <Box
                display='flex'
                flexDirection='column'
                gap={1}
            >
                <Typography variant="h5">Profile Management</Typography>
                <Button variant='outlined' onClick={(e) => handleWipeClick(e, WipeData.All)}>Wipe {WipeData.All}</Button>
                <Button variant='outlined' onClick={(e) => handleWipeClick(e, WipeData.Quests)}>Wipe {WipeData.Quests}</Button>
                <Button variant='outlined' onClick={(e) => handleWipeClick(e, WipeData.Items)}>Wipe {WipeData.Items}</Button>
                <Popover
                    open={isPopoverOver}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                >
                    <Typography sx={{ p: 2 }}>Are you sure you want to wipe {wipeData?.toLowerCase()} data?</Typography>
                    <Box
                        display='flex'
                        justifyContent='right'
                        padding={1}
                        gap={1}
                    >
                        <Button variant='outlined' onClick={closePopover}>Cancel</Button>
                        <Button variant='outlined' onClick={handleWipeData}>Yes</Button>
                    </Box>
                </Popover>
            </Box>

        </Box>
    );
};

export default Profile;
