import React from 'react';
import { useInput } from 'react-admin';
import { Paper, Typography } from '@mui/material';
import EditFile from './EditFile';
import EditSelect from './EditSelect';
import EditInputText from './EditInputText';
import EditLongInputText from './EditLongInputText';
import EditInputSelect from './EditInputSelect';
import EditFileSelect from './EditFileSelect';

interface UniversalEditFieldProps {
    source: string;
    label?: string;
    dataType?: 'array' | 'string' | 'commaString' | 'keyValue' | 'boolean' | 'number';
    selectOptions?: string[];
    categoryOptions?: string[];
    unique?: boolean;
    element?: 'select'| 'inputText' | 'longInputText' | 'file' | 'number' | 'inputSelect' | 'fileSelect';
    onChange?: (e: any) => void;
}

export const UniversalEditField: React.FC<UniversalEditFieldProps> = ({
    source,
    label,
    dataType = 'array',
    selectOptions,
    categoryOptions,
    unique = false,
    element,
    onChange
}) => {
    const {
        field,
        fieldState: { isTouched, error },
    } = useInput({ source });

    const [items, setItems] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [category, setCategory] = React.useState<string>('');
    const [showInput, setShowInput] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (dataType === 'commaString' && typeof field.value === 'string') {
            setItems(field.value.split(',').map(item => item.trim()));
        } else if (dataType === 'array' && typeof field.value === 'string') {
            setItems(field.value.split(',').map(item => item.trim()));
        } else if (dataType === 'string' && typeof field.value === 'string') {
            setItems([field.value]);
        } else if (Array.isArray(field.value)) {
            setItems(field.value);
        }
    }, [field.value, dataType]);

    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>{label}</Typography>
          
            {element === 'file' && (
                <EditFile
                    source={source}
                    items={items}
                    setItems={setItems}
                    dataType={dataType}
                    field={field}
                    unique={unique}
                    showInput={showInput}
                    setShowInput={setShowInput}
                />
            )}

            {element === 'select' && (
                <EditSelect
                    source={source}
                    items={items}
                    setItems={setItems}
                    dataType={dataType}
                    field={field}
                    unique={unique}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    selectOptions={selectOptions}
                    label={label}
                    category={category}
                    setInputValue={setInputValue}
                    setEditIndex={setEditIndex}
                    onChange={onChange}
                />
            )}

            {element === 'inputText' && (
                <EditInputText
                    source={source}
                    items={items}
                    setItems={setItems}
                    dataType={dataType}
                    field={field}
                    unique={unique}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    label={label}
                    category={category}
                />
            )}

            {element === 'longInputText' && (
                <EditLongInputText
                    source={source}
                    items={items}
                    setItems={setItems}
                    dataType={dataType}
                    field={field}
                    unique={unique}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    label={label}
                    category={category}
                />
            )}

            {element === 'inputSelect' && !unique && (
                <EditInputSelect
                    source={source}
                    items={items}
                    setItems={setItems}
                    dataType={dataType}
                    field={field}
                    unique={unique}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    label={label}
                    category={category}
                    categoryOptions={categoryOptions}
                    setCategory={setCategory}
                />
            )}

            {element === 'fileSelect' && (
                <EditFileSelect
                    source={source}
                    items={items}
                    setItems={setItems}
                    categoryOptions={categoryOptions || []}
                    field={field}
                    unique={unique}
                />
            )}

            {isTouched && error && <Typography color="error">{error.message}</Typography>}
        </Paper>
    );
};