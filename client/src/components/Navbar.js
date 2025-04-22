import React, { useContext, useEffect, useState } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    const fetchAlertsCount = async () => {
      if (user && axios.defaults.headers.common['Authorization']) {
        try {
          console.log('Navbar axios Authorization header:', axios.defaults.headers.common['Authorization']);
          const res = await axios.get('/api/users/alerts');
          setAlertsCount(res.data.length);
        } catch (err) {
          console.error('Failed to fetch alerts:', err);
        }
      }
    };
    fetchAlertsCount();
  }, [user]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
    handleClose();
  };

  const handleAlertsClick = () => {
    navigate('/alerts');
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
          <Button color="inherit" component={NavLink} to="/messaging" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            הודעות
          </Button>
          <IconButton color="inherit" onClick={handleAlertsClick} aria-label="התראות">
            <Badge badgeContent={alertsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {user.role === 'recruiter' && (
            <Button color="inherit" component={NavLink} to="/post-job" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              פרסם משרה
            </Button>
          )}
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
            <MenuItem component={NavLink} to="/messaging" onClick={handleClose}>
              הודעות
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); handleAlertsClick(); }}>
              התראות {alertsCount > 0 ? `(${alertsCount})` : ''}
            </MenuItem>
            {user.role === 'recruiter' && (
              <MenuItem component={NavLink} to="/post-job" onClick={handleClose}>
                פרסם משרה
              </MenuItem>
            )}
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
          <Box component="img" src="/image/לוגו.png" alt="Logo" sx={{ height: 40, mr: 2, cursor: 'pointer' }} onClick={() => navigate('/')} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            techbridge
          </Typography>
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
          {user && (
            <>
              <Button color="inherit" component={NavLink} to="/dashboard" style={({ isActive }) => (isActive ? { textDecoration: 'underline' } : undefined)}>
                דשבורד
              </Button>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user.profileImage ? (
                  <Avatar alt={user.username} src={`/uploads/${user.profileImage}`} />
                ) : (
                  <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                )}
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={profileMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(profileMenuAnchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem component={NavLink} to="/profile" onClick={handleProfileMenuClose}>
                  פרופיל
                </MenuItem>
                <MenuItem onClick={handleLogout}>התנתק</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
