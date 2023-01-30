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

    const getCurrentElement = (element: DropdownElement) => {
        return element.label === map;
    };

    const currentElement = navData.findIndex(getCurrentElement);

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs
                value={currentElement}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
            >
                {navData.map((navElement, index) => (
                    <DropdownMenuItem
                        key={navElement.label}
                        name={navElement.label}
                        menuItems={navElement.menuItems}
                        selected={index === currentElement}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default DropdownMenu;
