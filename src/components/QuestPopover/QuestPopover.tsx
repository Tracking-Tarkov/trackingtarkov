import { MutableRefObject } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { QuestData } from "../../utils/buildQuestNodes";

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
    return (
        <Popover
            open={open}
            onClose={onClose}
            anchorEl={anchor.current}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            transformOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
            <Box display="flex" flexDirection="column" padding="1.5rem">
                <Typography typography="h5">{questInfo.name}</Typography>
                <Typography typography="h5">Type: {questInfo.type}</Typography>
                <Typography typography="h5">Objectives:</Typography>
                {questInfo.objectives.map((obj) => (
                    <Typography typography="h5">{obj}</Typography>
                ))}
                <Typography typography="h5">Rewards:</Typography>
                {questInfo.rewards.map((reward) => (
                    <Typography typography="h5">{reward}</Typography>
                ))}
                <Typography typography="h5">{questInfo.kappa}</Typography>
            </Box>
            <button
                onClick={() => {
                    updateQuestState();
                }}
            >
                Toggle Complete
            </button>
        </Popover>
    );
};

export default QuestPopover;
