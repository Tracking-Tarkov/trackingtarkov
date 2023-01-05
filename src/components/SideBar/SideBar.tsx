import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";

export interface NavItems {
    title: string;
    icon: JSX.Element;
    path: string;
}
const navItems: NavItems[] = [
    { title: "Quests", icon: <AssignmentIcon />, path: "/" },
    { title: "Maps", icon: <MapIcon />, path: "maps" },
    { title: "Attributions", icon: <InfoIcon />, path: "attributions" },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    padding: theme.spacing(0, 1.5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const SideBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const onNav = useCallback(
        (page: string) => () => {
            navigate(page.toLowerCase());
        },
        [navigate]
    );

    const handleDrawerToggle = () => {
        setDrawerOpen((prevState) => !prevState);
        console.log("here");
    };

    const listItemButtonSX = {
        minHeight: 48,
        justifyContent: drawerOpen ? "initial" : "center",
        px: 2.5,
    };

    const listItemIconSx = {
        minWidth: 0,
        mr: drawerOpen ? 3 : "auto",
        justifyContent: "center",
    };

    const drawer = (
        <>
            <DrawerHeader>
                <Typography
                    variant="h6"
                    sx={{ opacity: drawerOpen ? 1 : 0, cursor: "pointer" }}
                    onClick={onNav("/")}
                >
                    Tracking Tarkov
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>

            <Divider />

            <List>
                {navItems.map((item, index) => (
                    <ListItem
                        key={item.title}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            sx={listItemButtonSX}
                            onClick={onNav(item.path)}
                        >
                            <ListItemIcon sx={listItemIconSx}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                sx={{ opacity: drawerOpen ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <>
            <Box component="nav">
                <Drawer
                    variant="permanent"
                    open={drawerOpen}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};

export default SideBar;
