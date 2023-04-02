import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { basicRealtimeApiCall } from './utils/firebase';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SideBar from './components/SideBar/SideBar';
import Maps from './pages/Maps';
import Attributions from './pages/Attributions';
import ItemsFIR from './pages/ItemsFIR';
import Quests from './pages/Quests';
import Goons from './pages/Goons';
import generateTraderGraphData, { TraderGraphData, Traders } from './utils/buildQuestNodes';
import ThemeProvider from '@mui/system/ThemeProvider';

import './App.scss';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#cecece',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    fontFamily: 'Bender',
                    fontWeight: 'normal',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                    fontFamily: 'Bender',
                    fontWeight: 'normal',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Bender',
                    fontWeight: 'normal',
                },
            },
        },
    },
});

export type Items = Record<string, Item>;

export interface ItemQuest {
    amount: number;
    quest: string;
    trader: string;
}

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
    requiredFor: Record<string, ItemQuest>;
    rewardedFrom: Record<string, ItemQuest>;
    craft: Record<string, Array<string>>;
}

export interface TarkovData {
    items: Items;
    quests: Traders;
    lastUpdated: string;
}

const getFirebaseData = async (): Promise<TarkovData> => {
    const lastUpdated: string = (await basicRealtimeApiCall('data/lastUpdated'))
        .data;
    if (
        !localStorage.getItem('lastUpdated') ||
        !localStorage.getItem('tarkovData') ||
        localStorage.getItem('lastUpdated') !== lastUpdated?.toString()
    ) {
        const tarkovData = (await basicRealtimeApiCall('data')).data;
        localStorage.setItem('lastUpdated', lastUpdated);
        localStorage.setItem('tarkovData', JSON.stringify(tarkovData));
    }
    return JSON.parse(localStorage.getItem('tarkovData') as string);
};

const App = () => {
    const [tarkovData, setTarkovData] = useState<TarkovData | null>(null);

    const traderGraphData = useMemo<TraderGraphData[] | null>(() => {
        if (!tarkovData) return null;
        return generateTraderGraphData(tarkovData.quests);
    }, [tarkovData]);

    const items = useMemo<Item[] | null>(() => {
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
                        <Route
                            path="items"
                            element={<ItemsFIR items={items ?? []} />}
                        />
                        <Route path="attributions" element={<Attributions />} />
                        <Route
                            index
                            element={
                                traderGraphData ? (
                                    <Navigate
                                        to={`quests/${traderGraphData[0].name}`}
                                    />
                                ) : (
                                    <p>...Loading</p>
                                )
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
