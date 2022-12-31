import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { basicRealtimeApiCall, auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import ThemeProvider from "@mui/system/ThemeProvider";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header/Header";
import Maps from "./pages/Maps";
import Attributions from "./pages/Attributions";
import Quests from "./pages/Quests";

import "./App.scss";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

const getBaseData = async () => {
    let lastUpdated = (await basicRealtimeApiCall("traders/lastUpdated")).data;
    if (
        !localStorage.getItem("lastUpdated") ||
        !localStorage.getItem("traderQuests") ||
        localStorage.getItem("lastUpdated") !== lastUpdated?.toString()
    ) {
        localStorage.setItem("lastUpdated", lastUpdated);
        const traderQuests = (await basicRealtimeApiCall("traders/quests"))
            .data;
        localStorage.setItem("traderQuests", JSON.stringify(traderQuests));
    }
};

const App = () => {
    const [uid, setUid] = useState<string>("");

    onAuthStateChanged(auth, (user) => {
        if (user && user.uid !== uid) {
            setUid(user.uid);
        }
    });

    useEffect(() => {
        getBaseData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <CssBaseline />
                <Header />
                <Routes>
                    <Route path="/" element={<Quests />} />
                    <Route path="maps" element={<Maps />} />
                    <Route path="attributions" element={<Attributions />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
