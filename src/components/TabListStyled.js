import { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';

export default function TabListStyled({children}){
    return(
        <TabList
            tabFlex={1}
            size="sm"
            sx={{
                marginTop: '5px!important',
                justifyContent: 'left',
                [`&& .${tabClasses.root}`]: {
                    fontWeight: '600',
                    flex: { xs: '1', md: 'initial' },
                    color: 'text.tertiary',
                    [`&.${tabClasses.selected}`]: {
                    bgcolor: 'transparent',
                    color: 'text.primary',
                        '&::after': {
                            height: '2px',
                            bgcolor: 'primary.500',
                        },
                    },
                },
            }}
        >
            {children}
        </TabList>
    );
}