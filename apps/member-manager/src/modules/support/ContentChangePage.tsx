import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

const ContentChangePage = () => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Content Change Request
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        required
                        label="Page"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        label="Change Description"
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            label="Priority"
                            defaultValue=""
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Urgent"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ContentChangePage;
