import {
    Avatar,
    Box,
    Button,
    styled,
    Tooltip,
    Typography,
    Zoom,
    TooltipProps,
    tooltipClasses,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Person, Share } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const CopyTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltipArrow}`]: {
        backgroundColor: theme.palette.success.dark,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.success.dark,
    },
}));

const Profile = () => {
    const { user } = useAuth();
    const [showCopied, setShowCopied] = useState(false);

    useEffect(() => {
        if (showCopied) {
            setTimeout(() => setShowCopied(false), 1000);
        }
    }, [showCopied]);

    if (!user) {
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
            gap={1}
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
        </Box>
    );
};

export default Profile;
