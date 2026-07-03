import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState, type JSX, type SyntheticEvent } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AttributeGroupsPanel } from '@/modules/attribute/components/AttributeGroupsPanel';
import { AttributesPanel } from '@/modules/attribute/components/AttributesPanel';
import { AttributeValuesPanel } from '@/modules/attribute/components/AttributeValuesPanel';
import { useAuth } from '@/modules/auth';
import { ROUTE_PATHS } from '@/routes/routePaths';

type AttributeTab = 'groups' | 'attributes' | 'values';

interface TabPanelProps {
  readonly activeTab: AttributeTab;
  readonly tab: AttributeTab;
  readonly children: JSX.Element;
}

function TabPanel({ activeTab, tab, children }: TabPanelProps): JSX.Element | null {
  return activeTab === tab ? <Box pt={3}>{children}</Box> : null;
}

/**
 * Attribute Engine screen — see 04_TASKS.md P03-T003..T005 and AGENTS.md §
 * Attribute Engine: "attribute_groups → attributes → attribute_values."
 * The three masters are combined into a single tabbed page rather than
 * three separate sidebar entries because they form one hierarchical
 * workflow (see 01_AGENTS.md § Module Structure, which lists a single
 * `attribute` module, not three).
 */
export function AttributePage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AttributeTab>('groups');

  const handleChange = (_event: SyntheticEvent, value: AttributeTab): void => {
    setActiveTab(value);
  };

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Attributes' }]} />

      <Typography variant="h5" fontWeight={700}>
        Attributes
      </Typography>

      <Box borderBottom={1} borderColor="divider">
        <Tabs value={activeTab} onChange={handleChange} aria-label="Attribute engine tabs">
          <Tab label="Attribute Groups" value="groups" id="attribute-tab-groups" />
          <Tab label="Attributes" value="attributes" id="attribute-tab-attributes" />
          <Tab label="Attribute Values" value="values" id="attribute-tab-values" />
        </Tabs>
      </Box>

      <TabPanel activeTab={activeTab} tab="groups">
        <AttributeGroupsPanel isAdmin={isAdmin} />
      </TabPanel>
      <TabPanel activeTab={activeTab} tab="attributes">
        <AttributesPanel isAdmin={isAdmin} />
      </TabPanel>
      <TabPanel activeTab={activeTab} tab="values">
        <AttributeValuesPanel isAdmin={isAdmin} />
      </TabPanel>
    </Stack>
  );
}
