import * as React from 'react';
import { cloneElement, MouseEventHandler, ReactElement } from 'react';
import { isElement } from 'react-is';
import { DialogTitle, DialogTitleProps, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RaRecord, useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';

export const FormDialogTitle = (props: FormDialogTitleProps) => {
    const translate = useTranslate();
    const { defaultTitle, onClose, record, title } = props;

    return (
        <StyledDialogTitle id="edit-dialog-title">
            {isElement(title)
                ? cloneElement<any>(title, { record })
                : title
                ? translate(title, { _: title })
                : defaultTitle}
            <IconButton
                aria-label={translate('ra.action.close')}
                className={FormDialogTitleClasses.closeButton}
                onClick={onClose}
            >
                <CloseIcon />
            </IconButton>
        </StyledDialogTitle>
    );
};

interface FormDialogTitleProps extends Omit<DialogTitleProps, 'title'> {
    defaultTitle?: string;
    onClose: MouseEventHandler<HTMLButtonElement>;
    record?: Partial<RaRecord>;
    title?: ReactElement | string;
}

const PREFIX = 'RaFormDialogTitle';

export const FormDialogTitleClasses = {
    closeButton: `${PREFIX}-closeButton`,
};

const StyledDialogTitle = styled(DialogTitle, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${FormDialogTitleClasses.closeButton}`]: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));
