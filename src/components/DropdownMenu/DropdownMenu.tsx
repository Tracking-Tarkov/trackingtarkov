import { useMemo } from "react";
import DropdownMenuItem from "../DropdownMenuItem/DropdownMenuItem";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

export interface DropdownElement {
    label: string;
    menuItems: string[];
}

export interface IDropdownMenu {
    navData: DropdownElement[];
}

const DropdownMenu = ({ navData }: IDropdownMenu) => {
    const { map = "" } = useParams();

    const currentValue = useMemo<number>(() => {
        return navData.findIndex((element: DropdownElement) => {
            return element.label === map;
        });
    }, [map, navData]);

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs
                value={currentValue}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
            >
                {navData.map((navElement, index) => (
                    <DropdownMenuItem
                        key={navElement.label}
                        name={navElement.label}
                        menuItems={navElement.menuItems}
                        selected={index === currentValue}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default DropdownMenu;
