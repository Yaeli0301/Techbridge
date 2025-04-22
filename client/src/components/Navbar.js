import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const activeStyle = {
    textDecoration: 'underline',
  };

  const renderDesktopMenu = () => (
    <>
      <Button color="inherit" component={NavLink} to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        דף הבית
      </Button>
      <Button color="inherit" component={NavLink} to="/jobs" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        משרות
      </Button>
      {user ? (
        <>
          <Button color="inherit" component={NavLink} to="/profile" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            {user.username}
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            התנתק
          </Button>
        </>
      ) : (
        <>
          <Button color="inherit" component={NavLink} to="/login" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            התחבר
          </Button>
          <Button color="inherit" component={NavLink} to="/register" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            הרשמה
          </Button>
        </>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={NavLink} to="/" onClick={handleClose}>
          דף הבית
        </MenuItem>
        <MenuItem component={NavLink} to="/jobs" onClick={handleClose}>
          משרות
        </MenuItem>
        {user ? (
          <>
            <MenuItem component={NavLink} to="/profile" onClick={handleClose}>
              {user.username}
            </MenuItem>
            <MenuItem onClick={handleLogout}>התנתק</MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={NavLink} to="/login" onClick={handleClose}>
              התחבר
            </MenuItem>
            <MenuItem component={NavLink} to="/register" onClick={handleClose}>
              הרשמה
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            גיוס אייטק
          </Typography>
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
