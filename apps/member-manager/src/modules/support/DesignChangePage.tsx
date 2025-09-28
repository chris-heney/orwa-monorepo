import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

const DesignChangePage = () => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Design Change Request
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
                        <InputLabel>Change Type</InputLabel>
                        <Select
                            label="Change Type"
                            defaultValue=""
                        >
                            <MenuItem value="layout">Layout</MenuItem>
                            <MenuItem value="color">Color</MenuItem>
                            <MenuItem value="font">Font</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Requires Approval"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DesignChangePage;
