import { Box, ListItemDecorator, Stack, Tab, TabPanel, TabList, Tabs } from "@mui/joy";

import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Person from "@mui/icons-material/Person";
import Search from "@mui/icons-material/Search";
import HomeRounded from "@mui/icons-material/HomeRounded";

export default function Layout({children}) {
  return (
      <Tabs defaultValue="foryoupage">
            <Box sx={{height: "100vh"}}>
                <Stack direction="column" height={1}>
                    <Box sx={{height: 50, overflowY: "scroll"}} flexGrow={1}>
                        {children}
                    </Box>
                    <Box>
                        <TabList
                        variant="plain"
                        size="sm"
                        disableUnderline
                        tabFlex={1}
                        >
                            <Tab
                                disableIndicator
                                orientation="vertical"
                                value="foryoupage"
                            >
                                <ListItemDecorator>
                                <HomeRounded />
                                </ListItemDecorator>
                                Home
                            </Tab>
                            <Tab
                                disableIndicator
                                orientation="vertical"
                            >
                                <ListItemDecorator>
                                <FavoriteBorder />
                                </ListItemDecorator>
                                Likes
                            </Tab>
                            <Tab
                                disableIndicator
                                orientation="vertical"
                            >
                                <ListItemDecorator>
                                <Search />
                                </ListItemDecorator>
                                Search
                            </Tab>
                            <Tab
                                disableIndicator
                                orientation="vertical"
                            >
                                <ListItemDecorator>
                                <Person />
                                </ListItemDecorator>
                                Profile
                            </Tab>
                        </TabList>
                    </Box>
            </Stack>
        </Box>
    </Tabs>
  );
}