import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { Popover, Tab } from '@mui/material';

export interface INavbarProps {
    name: string;
    menuItems: string[];
    selected: boolean;
}

const DropdownMenuItem = ({ name, menuItems, selected }: INavbarProps) => {
    const navigate = useNavigate();
    const [openedPopover, setOpenedPopover] = useState(false);
    const popoverAnchor = useRef<any>(null);

    const popoverEnter = () => {
        setOpenedPopover(true);
    };

    const popoverLeave = () => {
        setOpenedPopover(false);
    };

    const onClickMenuItem = (menuItem: string) => {
        navigate(`/maps/${name}/${menuItem}`);
    };

    return (
        <>
            <Tab
                ref={popoverAnchor}
                id="basic-map-tab"
                aria-owns={'mouse-over-popover'}
                aria-haspopup="true"
                aria-selected={selected}
                onMouseEnter={popoverEnter}
                onMouseLeave={popoverLeave}
                label={name}
                style={{ opacity: selected ? 1 : 0.6 }}
            />
            <Popover
                id="mouse-over-popover"
                open={openedPopover}
                anchorEl={popoverAnchor.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    onMouseEnter: popoverEnter,
                    onMouseLeave: popoverLeave,
                    style: { pointerEvents: 'auto' },
                }}
                sx={{ pointerEvents: 'none' }}
            >
                {menuItems.map((menuItem) => (
                    <MenuItem
                        onClick={() => onClickMenuItem(menuItem)}
                        key={menuItem}
                    >
                        {menuItem.toUpperCase()}
                    </MenuItem>
                ))}
            </Popover>
        </>
    );
};

export default DropdownMenuItem;
