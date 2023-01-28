import DropdownMenuItem from "../DropdownMenuItem/DropdownMenuItem";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

export interface DropdownElement {
    label: string;
    menuItems: string[];
}

export interface IDropdownMenu {
    navData: DropdownElement[];
}

const DropdownMenu = ({ navData }: IDropdownMenu) => {
    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs textColor="inherit" variant="scrollable" scrollButtons="auto">
                {navData.map((navElement) => (
                    <DropdownMenuItem
                        key={navElement.label}
                        name={navElement.label}
                        menuItems={navElement.menuItems}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default DropdownMenu;
