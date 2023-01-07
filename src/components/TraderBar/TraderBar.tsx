import { useCallback, useState } from "react";
import { TraderGraphData } from "../../utils/buildQuestNodes";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export interface ITraderBarProps {
    traders: TraderGraphData[];
    currentTrader: number;
    setCurrentTrader: (value: number) => void;
}

const TraderBar = ({
    traders,
    currentTrader,
    setCurrentTrader,
}: ITraderBarProps) => {
    const handleChange = useCallback(
        (event: React.SyntheticEvent, newTrader: number) => {
            setCurrentTrader(newTrader);
        },
        [setCurrentTrader]
    );

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs
                value={currentTrader}
                onChange={handleChange}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
            >
                {traders.map((trader) => (
                    <Tab key={trader.name} label={trader.name} />
                ))}
            </Tabs>
        </Box>
    );
};

export default TraderBar;
