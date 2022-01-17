import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem"; 
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppRoutes from "./AppRoutes";

export default function AppBarMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}>
                    {AppRoutes.map((prop, key) => (
                        <MenuItem key={key} onClick={handleClose} component={Link} to={prop.path}>{prop.menuName}</MenuItem>
                    ))}
                </Menu>
                <Typography variant="h6">
                UpVote
                </Typography>
            </Toolbar>

        </AppBar>
    );
}