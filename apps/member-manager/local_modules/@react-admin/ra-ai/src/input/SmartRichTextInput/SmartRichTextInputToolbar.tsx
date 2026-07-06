import * as React from 'react';
import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import {
    AlignmentButtons,
    ClearButtons,
    FormatButtons,
    LevelSelect,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    ImageButtons,
    ColorButtons,
} from 'ra-input-rich-text';
import { SmartEditToolbar } from './SmartEditToolbar';

/**
 * A toolbar for the <RichTextInput> with smart replace buttons powered by AI.
 */
export const SmartRichTextInputToolbar = (
    props: SmartRichTextInputToolbarProps
) => {
    const {
        size = 'medium',
        children = (
            <>
                <LevelSelect size={size} />
                <FormatButtons size={size} />
                <ColorButtons size={size} />
                <AlignmentButtons size={size} />
                <ListButtons size={size} />
                <LinkButtons size={size} />
                <ImageButtons size={size} />
                <QuoteButtons size={size} />
                <ClearButtons size={size} />
                <SmartEditToolbar size={size} />
            </>
        ),
        ...rest
    } = props;

    return (
        <Root className={classes.root} {...rest}>
            {children}
        </Root>
    );
};

const PREFIX = 'RaSmartRichTextInputToolbar';
const classes = {
    root: `${PREFIX}-root`,
};
const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        '& > *:last-child': {
            marginRight: 0,
        },
        '& button.MuiToggleButton-sizeSmall': {
            padding: theme.spacing(0.3),
            fontSize: theme.typography.pxToRem(18),
        },
        '& button.MuiToggleButton-sizeMedium': {
            padding: theme.spacing(0.5),
            fontSize: theme.typography.pxToRem(24),
        },
        '& button.MuiToggleButton-sizeLarge': {
            padding: theme.spacing(1),
            fontSize: theme.typography.pxToRem(24),
        },
    },
}));

export type SmartRichTextInputToolbarProps = {
    children?: ReactNode;
    size?: 'small' | 'medium' | 'large';
};
