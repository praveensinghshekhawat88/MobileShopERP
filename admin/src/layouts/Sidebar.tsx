import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NAVIGATION_ITEMS } from '@/layouts/navigationConfig';
import { useAppSelector } from '@/store/hooks';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

interface SidebarProps {
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
}

/**
 * Sidebar navigation — see 05_UI_STANDARDS.md § Sidebar: Collapsed/Expanded,
 * Icons, Labels, Role Based Menu, Scrollable, Persistent on Desktop, Drawer
 * on Mobile.
 */
export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useAppSelector((state) => state.theme.sidebarCollapsed);
  const currentUserRole = useAppSelector((state) => state.auth.user?.roleName);

  const visibleItems = NAVIGATION_ITEMS.filter(
    (item) => !currentUserRole || item.roles.includes(currentUserRole)
  );

  const drawerWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  const content = (
    <Box display="flex" flexDirection="column" height="100%">
      <Toolbar>
        <Typography variant="h6" noWrap fontWeight={700} color="primary.main">
          {collapsed ? 'MSE' : 'Mobile Shop ERP'}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ overflowY: 'auto', flex: 1 }} aria-label="Main navigation">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                onMobileClose();
              }}
              sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} /> : null}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
}
