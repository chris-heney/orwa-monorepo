import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

const popularEmojis = [
    '🚀', '⚡', '🔥', '💡', '🎨', '📊', '📈', '📝', '✅', '📚',
    '🛠️', '⚙️', '🔧', '💬', '📱', '💻', '🌐', '📊', '📧', '🔔',
    '📁', '📂', '🔍', '🔎', '📌', '🔗', '🎯', '💰', '📢', '🎮',
    '🎭', '🎬', '🎵', '📷', '🎤', '👥', '🤝', '🧩', '🔒', '🔑',
    '🧪', '🔬', '📡', '📅', '🎓', '🌍', '🔋', '📤', '📥', '⏱️'
];

const categoryEmojis = {
    'CONTENT': ['📝', '📚', '📊', '📈', '📄', '📑', '📃', '📜', '📰', '📋'],
    'DESIGN': ['🎨', '🖌️', '✏️', '🖍️', '🖊️', '🔍', '📐', '📏', '✂️', '🧵'],
    'DEVELOPMENT': ['💻', '⚙️', '🔧', '🛠️', '🔨', '🧰', '⚡', '🚀', '🔌', '💾'],
    'SUPPORT': ['🛟', '🆘', '🔔', '📞', '📱', '💬', '🗣️', '👂', '📢', '🤝'],
    'MARKETING': ['📣', '📈', '🎯', '💰', '📊', '🔍', '📱', '💻', '🌐', '📧'],
    'ADMIN': ['👑', '🔑', '🔒', '📂', '⚖️', '📅', '⏰', '📊', '👥', '📈'],
    'OTHER': ['🧩', '🎮', '🎭', '🎬', '🎵', '📷', '🎤', '🎓', '🌍', '🔋']
};

interface EmojiSelectorProps {
    value: string;
    onChange: (value: string) => void;
    category?: string;
}

export const EmojiSelector = ({ value, onChange, category }: EmojiSelectorProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(value || '');

    const handleOpen = () => {
        setOpen(true);
        setSelectedEmoji(value || '');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (emoji: string) => {
        setSelectedEmoji(emoji);
        // Apply immediately while in the dialog for better feedback
        onChange(emoji);
    };

    const handleSave = () => {
        handleClose();
    };

    // Filter emojis based on search
    const filteredEmojis = search
        ? popularEmojis.filter(emoji => 
            emoji.toLowerCase().includes(search.toLowerCase()))
        : [];

    // Get category-specific emojis if a category is provided
    const categorySpecificEmojis = category && categoryEmojis[category as keyof typeof categoryEmojis] 
        ? categoryEmojis[category as keyof typeof categoryEmojis]
        : [];

    // Determine which emojis to show based on context
    const emojisToShow = search 
        ? filteredEmojis 
        : (category && categorySpecificEmojis.length > 0)
            ? categorySpecificEmojis
            : popularEmojis;

    return (
        <>
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        fontSize: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'scale(1.05)',
                        },
                    }}
                    onClick={handleOpen}
                >
                    {value || '🔍'}
                </Box>
                <Button 
                    size="small" 
                    onClick={handleOpen}
                    variant="outlined"
                >
                    Choose Emoji
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Select an Emoji
                    {category && (
                        <Typography variant="caption" display="block" color="textSecondary">
                            Suggested emojis for {category.toLowerCase()} category
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search emojis..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        margin="normal"
                    />

                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            {search ? 'Search Results' : category ? 'Suggested Emojis' : 'Popular Emojis'}
                        </Typography>
                        <Grid container spacing={1}>
                            {emojisToShow.map((emoji, index) => (
                                <Grid item key={index}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid',
                                            borderColor: selectedEmoji === emoji ? 'primary.main' : 'divider',
                                            borderRadius: 1,
                                            bgcolor: selectedEmoji === emoji ? 'primary.light' : 'background.paper',
                                            fontSize: '24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                bgcolor: 'primary.light',
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                        onClick={() => handleSelect(emoji)}
                                    >
                                        {emoji}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {!search && category && (
                        <Box sx={{ mt: 3, mb: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Other Popular Emojis
                            </Typography>
                            <Grid container spacing={1}>
                                {popularEmojis.slice(0, 20).map((emoji, index) => (
                                    <Grid item key={index}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid',
                                                borderColor: selectedEmoji === emoji ? 'primary.main' : 'divider',
                                                borderRadius: 1,
                                                bgcolor: selectedEmoji === emoji ? 'primary.light' : 'background.paper',
                                                fontSize: '24px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'primary.light',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                            onClick={() => handleSelect(emoji)}
                                        >
                                            {emoji}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Selected: <span style={{ fontSize: '24px' }}>{selectedEmoji || 'None'}</span>
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Select
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
