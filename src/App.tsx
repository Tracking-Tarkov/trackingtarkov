import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { basicRealtimeApiCall } from "./utils/firebase";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SideBar from "./components/SideBar/SideBar";
import Maps from "./pages/Maps";
import Attributions from "./pages/Attributions";
import Quests from "./pages/Quests";
import Goons from "./pages/Goons";
import generateTraderGraphData, {
    TraderGraphData,
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
    },
});

const getFirebaseData = async () => {
    let lastUpdated = (await basicRealtimeApiCall("data/lastUpdated")).data;
    if (
        !localStorage.getItem("lastUpdated") ||
        !localStorage.getItem("traderQuests") ||
        localStorage.getItem("lastUpdated") !== lastUpdated?.toString()
    ) {
        localStorage.setItem("lastUpdated", lastUpdated);
        const traderQuests = (await basicRealtimeApiCall("data/quests")).data;
        localStorage.setItem("traderQuests", JSON.stringify(traderQuests));
        return traderQuests;
    }
    return JSON.parse(localStorage.getItem("traderQuests") as string);
};

const App = () => {
    const [traderGraphData, setTraderGraphData] = useState<
        TraderGraphData[] | null
    >(null);

    useEffect(() => {
        getFirebaseData()
            .then(generateTraderGraphData)
            .then(setTraderGraphData);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <SideBar />
                <div className="page-container">
                    <Routes>
                        <Route
                            path="quests/:trader"
                            element={
                                traderGraphData ? (
                                    <Quests traderGraphData={traderGraphData} />
                                ) : (
                                    <p>...Loading</p>
                                )
                            }
                        />
                        <Route path="maps/:map/:subMap" element={<Maps />} />
                        <Route path="goons" element={<Goons />} />
                        <Route path="attributions" element={<Attributions />} />
                        <Route index element={traderGraphData ? (
                            <Navigate to={`quests/${traderGraphData[0].name}`} />
                        ) : (
                            <p>...Loading</p>
                        )} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
