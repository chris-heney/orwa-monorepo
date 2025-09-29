import React, { useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import {
    Button,
    IconButton,
    Stack,
    Grid,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Phone number formatter
const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    // Strip all non-digit characters
    const digitsOnly = value.replace(/[^\d]/g, '');

    // Take only the first 10 digits
    const phoneNumber = digitsOnly.slice(0, 10);

    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 10)}`;
};

interface ArrayPhoneInputProps {
    source: string;
    label?: string;
}

const ArrayPhoneInput: React.FC<ArrayPhoneInputProps> = ({
    source,
    label = 'Phone Numbers',
}) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: source,
    });

    const addPhoneNumber = useCallback(() => {
        append('');
    }, [append]);

    return (
        <Stack spacing={2}>
            {fields.map((field, index) => (
                <Grid container spacing={1} alignItems="center" key={field.id}>
                    <Grid
                        size={{
                            xs: 12,
                            md: 11,
                        }}
                    >
                        <Controller
                            control={control}
                            name={`${source}[${index}]`}
                            render={({
                                field: controllerField,
                                fieldState,
                            }) => (
                                <TextField
                                    {...controllerField}
                                    label={`Phone Number ${index + 1}`}
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ||
                                        '(123) 456-7890'
                                    }
                                    placeholder="(___) ___-____"
                                    onChange={e => {
                                        const input = e.target.value;
                                        const digitsOnly = input.replace(
                                            /[^\d]/g,
                                            ''
                                        );

                                        // Always limit to 10 digits max
                                        const limitedDigits = digitsOnly.slice(
                                            0,
                                            10
                                        );
                                        controllerField.onChange(
                                            formatPhoneNumber(limitedDigits)
                                        );
                                    }}
                                    value={
                                        controllerField.value
                                            ? formatPhoneNumber(
                                                  controllerField.value
                                              )
                                            : ''
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            md: 1,
                        }}
                    >
                        <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                            sx={{
                                mt: -2,
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                startIcon={<AddIcon />}
                onClick={addPhoneNumber}
                variant="outlined"
                size="small"
                sx={{
                    alignSelf: 'flex-start',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                    },
                }}
            >
                Add Phone Number
            </Button>
        </Stack>
    );
};

export default ArrayPhoneInput;
