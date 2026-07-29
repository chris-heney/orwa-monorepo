import React, { useState, useEffect } from 'react'
import { MenuItem, Select, SxProps } from '@mui/material'
import { Identifier } from '../types'
import { useGetDenialReasons } from '../../helpers/API'

interface SelectProjectTypeProps {
    denialReason: Identifier | null;
    sx?: SxProps;
    setDenialReason: React.Dispatch<React.SetStateAction<Identifier | null>>
}

interface Option {
    label: string
    value: Identifier
}

const SelectDenialReason = ({ setDenialReason, denialReason, sx }: SelectProjectTypeProps) => {
    const [options, setOptions] = useState<Option[]>([])
    const getDenialReasons = useGetDenialReasons()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDenialReasons()
                const formattedOptions = data.map((denialReason: any) => ({
                    label: denialReason.name,
                    value: denialReason.id,
                }))
                setOptions(formattedOptions)
            } catch (error) {
                console.error('Error fetching project types:', error)
            }
        };

        fetchData()
    }, [])
    
    return options.length === 0 ? null : (
        <Select
            sx={{
                width: '50%',
                borderRadius: 0,
                padding: 0,
                "&:hover": {
                    backgroundColor: '#f0f0f0',
                },
                ...sx,
            }}
            MenuProps={{
                MenuListProps: {
                    disablePadding: true,
                    disabledItemsFocusable: false,
                },
            }}
            SelectDisplayProps={{
                style: {
                    padding: 2,
                    paddingLeft: 10,
                    paddingRight: 10,
                },
            }}
            value={denialReason?.toString() || ''}
            onChange={(event) => {
                setDenialReason(parseInt(event.target.value))
            }}
            disableInjectingGlobalStyles
            disableUnderline
            variant='filled'>
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
};

export default SelectDenialReason
