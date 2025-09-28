import { Box, Grid } from '@mui/material';
import { useListContext } from 'react-admin';
import { FileGridCard } from './FileGridCard';

export const GridView = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) {
        return <Box sx={{ p: 2 }}>Loading...</Box>;
    }

    return (
        <Box sx={{ 
            p: 2, 
            height: '100%', 
            overflow: 'auto',
            flex: 1,
        }}>
            <Grid container spacing={2}>
                {data.map((record: any) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
                        <FileGridCard record={record} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};