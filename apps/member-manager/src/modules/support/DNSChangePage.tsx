import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

const DNSChangePage = () => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    DNS Change Request
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        required
                        label="Domain"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        label="DNS Record"
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Record Type</InputLabel>
                        <Select
                            label="Record Type"
                            defaultValue=""
                        >
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="CNAME">CNAME</MenuItem>
                            <MenuItem value="MX">MX</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Active"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DNSChangePage;
