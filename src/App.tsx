import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { basicRealtimeApiCall } from "./utils/firebase";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SideBar from "./components/SideBar/SideBar";
import Maps from "./pages/Maps";
import Attributions from "./pages/Attributions";
import ItemsFIR from "./pages/ItemsFIR";
import Quests from "./pages/Quests";
import generateTraderGraphData, {
    TraderGraphData,
    Traders,
} from "./utils/buildQuestNodes";
import ThemeProvider from "@mui/system/ThemeProvider";

import "./App.scss";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: "#cecece",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: "14px",
                    fontFamily: "Bender",
                    fontWeight: "normal",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: "Bender",
                    fontWeight: "normal",
                },
            },
        },
    },
});

export type Items = Record<string, Item>;

export interface Item {
    amount: number;
    kappa: boolean;
    name: string;
    url: string;
    icon: {
        url: string;
        width: number;
        height: number;
    };
    requiredFor: Record<string, Array<string>>;
    rewardedFrom: Record<string, Array<string>>;
    craft: Record<string, Array<string>>;
}

export interface TarkovData {
    items: Items;
    quests: Traders;
    lastUpdated: string;
}

const getFirebaseData = async (): Promise<TarkovData> => {
    const lastUpdated: string = (await basicRealtimeApiCall("data/lastUpdated"))
        .data;
    if (
        !localStorage.getItem("lastUpdated") ||
        !localStorage.getItem("tarkovData") ||
        localStorage.getItem("lastUpdated") !== lastUpdated?.toString()
    ) {
        const tarkovData = (await basicRealtimeApiCall("data")).data;
        localStorage.setItem("lastUpdated", lastUpdated);
        localStorage.setItem("tarkovData", JSON.stringify(tarkovData));
    }
    return JSON.parse(localStorage.getItem("tarkovData") as string);
};

const App = () => {
    const [tarkovData, setTarkovData] = useState<TarkovData | null>(null);

    const traderGraphData = useMemo<TraderGraphData[] | null>(() => {
        if (!tarkovData) return null;
        return generateTraderGraphData(tarkovData.quests);
    }, [tarkovData]);

    const itemData = useMemo<Item[] | null>(() => {
        if (!tarkovData) return null;
        return Object.values(tarkovData.items);
    }, [tarkovData]);

    useEffect(() => {
        getFirebaseData().then(setTarkovData);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <SideBar />
                <div className="page-container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                traderGraphData ? (
                                    <Quests traderGraphData={traderGraphData} />
                                ) : (
                                    <p>...Loading</p>
                                )
                            }
                        />
                        <Route path="maps/:map/:subMap" element={<Maps />} />
                        <Route path="attributions" element={<Attributions />} />
                        <Route
                            path="items"
                            element={<ItemsFIR itemData={itemData ?? []} />}
                        />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
