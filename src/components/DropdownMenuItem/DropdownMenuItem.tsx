import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export interface INavbarProps {
    name: string;
    menuItems: string[];
}

const DropdownMenuItem = ({ name, menuItems }: INavbarProps) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickMenuItem = (menuItem: string) => {
        handleClose();
        navigate(`/maps/${name}/${menuItem}`);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onMouseOver={handleClick}
                style={{
                    color: "white",
                }}
            >
                {name}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                    onMouseLeave: handleClose,
                }}
            >
                {menuItems.map((menuItem) => (
                    <MenuItem onClick={() => onClickMenuItem(menuItem)}>
                        {menuItem.toUpperCase()}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default DropdownMenuItem;
