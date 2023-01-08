import { MutableRefObject } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { QuestData } from "../../utils/buildQuestNodes";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

export type QuestPopoverProps = {
    open: boolean;
    onClose: (event: React.MouseEvent) => void;
    questInfo: QuestData;
    anchor: MutableRefObject<HTMLDivElement | null>;
    updateQuestState: () => void;
};

const QuestPopover = ({
    open,
    onClose,
    anchor,
    questInfo,
    updateQuestState,
}: QuestPopoverProps) => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <Popover
            open={open}
            onClose={onClose}
            anchorEl={anchor.current}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            transformOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
            <Box
                display="flex"
                flexDirection="column"
                padding="1.5rem"
                maxWidth="500px"
                gap="6px"
            >
                <Typography typography="h5">{questInfo.name}</Typography>
                <Divider />
                <Typography typography="h7">Type: {questInfo.type}</Typography>
                <List
                    dense
                    subheader={
                        <Typography typography="h7">Objectives</Typography>
                    }
                >
                    {questInfo.objectives.map((obj) => (
                        <ListItem key={questInfo.name + obj}>
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
                            <ListItemText>{reward}</ListItemText>
                        </ListItem>
                    ))}
                </List>
                {!questInfo.kappa && (
                    <Typography>Not required for Kappa</Typography>
                )}
                <button
                    onClick={() => {
                        updateQuestState();
                    }}
                >
                    Toggle Complete
                </button>
            </Box>
        </Popover>
    );
};

export default QuestPopover;
