import { MutableRefObject } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import LinkIcon from '@mui/icons-material/Link';
import { QuestData } from '../../utils/buildQuestNodes';
import {
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Tooltip,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export type QuestPopoverProps = {
    open: boolean;
    onClose: (event: React.MouseEvent) => void;
    questInfo: QuestData;
    completed: boolean;
    anchor: MutableRefObject<HTMLDivElement | null>;
    updateQuestState: () => void;
    readOnly: boolean;
};

const QuestPopover = ({
    readOnly,
    open,
    onClose,
    completed,
    anchor,
    questInfo,
    updateQuestState,
}: QuestPopoverProps) => {
    const { user } = useAuth();
    return (
        <Popover
            open={open}
            onClose={onClose}
            anchorEl={anchor.current}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
            <Box
                display="flex"
                flexDirection="column"
                padding="1.5rem"
                maxWidth="500px"
                gap="6px"
            >
                <Box display="flex" justifyContent="space-between">
                    <Typography typography="h5" sx={{ marginRight: '5px' }}>
                        {questInfo.name}
                    </Typography>
                    <Button
                        href={questInfo.link}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        color="primary"
                    >
                        <LinkIcon />
                    </Button>
                </Box>
                <Divider />
                <List
                    dense
                    subheader={
                        <Typography typography="h7">Objectives</Typography>
                    }
                >
                    {questInfo.objectives.map((obj) => (
                        <ListItem key={questInfo.name + obj}>
                            <CircleIcon
                                sx={{ fontSize: '0.75rem', marginRight: '5px' }}
                            />
                            <ListItemText>{obj}</ListItemText>
                        </ListItem>
                    ))}
                </List>
                <List
                    dense
                    subheader={<Typography typography="h7">Rewards</Typography>}
                >
                    {questInfo.rewards.map((reward) => (
                        <ListItem key={questInfo.name + reward}>
                            <CircleIcon
                                sx={{ fontSize: '0.75rem', marginRight: '5px' }}
                            />
                            <ListItemText>{reward}</ListItemText>
                        </ListItem>
                    ))}
                </List>
                {!questInfo.kappa && (
                    <Typography>Not required for Kappa</Typography>
                )}
                {!readOnly ? (
                    <Tooltip
                        title={!user && <Typography color="inherit"> You must sign in to use this feature </Typography>}
                        arrow
                    >
                        <Box display="flex" justifyContent="center">
                            <Button disabled={!user} onClick={updateQuestState}>
                                Mark as {completed ? 'Incomplete' : 'Complete'}
                            </Button>
                        </Box>
                    </Tooltip>
                ) : (
                    <Typography
                        variant='button'
                        color='primary'
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        {completed ? 'Incomplete' : 'Complete'}
                    </Typography>
                )}
            </Box>
        </Popover>
    );
};

export default QuestPopover;
