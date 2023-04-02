import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export interface INavbarProps {
    navData: string[];
    currentNav: number;
    setCurrentNav: (value: number) => void;
}

const GenericNavbar = ({
    navData,
    currentNav,
    setCurrentNav,
}: INavbarProps) => {
    const handleChange = useCallback(
        (event: React.SyntheticEvent, newNavElement: number) => {
            setCurrentNav(newNavElement);
        },
        [setCurrentNav]
    );

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs
                value={currentNav}
                onChange={handleChange}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
            >
                {navData.map((navElement) => (
                    <Tab key={navElement} label={navElement} />
                ))}
            </Tabs>
        </Box>
    );
};

export default GenericNavbar;
