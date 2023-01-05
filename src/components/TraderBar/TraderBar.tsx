import { useState } from "react";
import { TraderGraphData } from "../../utils/buildQuestNodes";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./styles/traderbar.scss";

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
    const [value, setValue] = useState<number>(currentTrader);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTrader(newValue);
        setValue(newValue);
    };

    return (
        <div className="trader-bar-container">
            <Box sx={{ width: "50%", bgcolor: "background.paper" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons="auto"
                    centered
                >
                    {traders.map((trader, index) => (
                        <Tab label={trader.name} />
                    ))}
                </Tabs>
            </Box>
        </div>
    );
};

export default TraderBar;
