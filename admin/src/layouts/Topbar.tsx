import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type JSX, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogout } from '@/modules/auth';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/themeSlice';

interface TopbarProps {
  readonly onMobileMenuToggle: () => void;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Topbar — see 05_UI_STANDARDS.md § Topbar: Application Title, Notifications,
 * Profile, Logout. Theme Switch is a documented future enhancement and
 * intentionally omitted for now. The Breadcrumb element of the Page
 * Structure (Topbar → Breadcrumb → Toolbar → ...) is rendered by each page
 * itself, immediately below the Topbar — see `components/Breadcrumbs.tsx`.
 */
export function Topbar({ onMobileMenuToggle }: TopbarProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logout = useLogout();
  const user = useAppSelector((state) => state.auth.user);
  const collapsed = useAppSelector((state) => state.theme.sidebarCollapsed);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);
  const handleCloseMenu = (): void => setAnchorEl(null);

  const handleViewProfile = (): void => {
    handleCloseMenu();
    navigate(ROUTE_PATHS.profile);
  };

  const handleLogout = (): void => {
    handleCloseMenu();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          aria-label="Toggle navigation menu"
          onClick={onMobileMenuToggle}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          aria-label="Collapse sidebar"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <Typography variant="subtitle1" fontWeight={600} flexGrow={1} noWrap>
          Mobile Shop ERP
        </Typography>

        <Tooltip title="Notifications">
          <IconButton aria-label="Notifications">
            <NotificationsNoneOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton onClick={handleOpenMenu} aria-label="Account menu" size="small">
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
              {user ? getInitials(user.firstName, user.lastName) : '?'}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <Box px={2} py={1}>
            <Typography variant="subtitle2">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.roleName}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleViewProfile}>
            <ListItemIcon>
              <PersonOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
