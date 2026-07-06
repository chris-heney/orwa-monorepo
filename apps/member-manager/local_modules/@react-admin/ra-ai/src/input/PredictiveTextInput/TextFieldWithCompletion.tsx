import * as React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * A version of material-ui's `<TextField>` that also renders a completion suggestion.
 *
 * @private for internal use only
 */
export const TextFieldWithCompletion = React.forwardRef<any, any>(
    (
        { completion, multiline, value, defaultValue, fullWidth, ...rest },
        ref
    ) => {
        const inputRef = React.useRef(null);
        const secondInputRef = React.useRef(null);

        // copy the styles from the first input to the second one when the completion changes
        React.useEffect(() => {
            if (!inputRef.current || !secondInputRef.current) return;
            const input = inputRef.current;
            const boundingBox = input.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(input);
            const secondInput = secondInputRef.current;
            // copy styles from the first input to the second one
            secondInput.style.cssText = getCssText(computedStyle);
            secondInput.style.letterSpacing = '0.00938em'; // FIXME: letterSpacing isn't properly copied with getComputedStyle
            // position the second input on top of the first one
            secondInput.style.position = 'absolute';
            secondInput.style.boxSizing = 'content-box';
            secondInput.style.top = `${boundingBox.top + window.scrollY}px`;
            secondInput.style.left = `${boundingBox.left + window.scrollX}px`;
            secondInput.style.opacity = 0.5;
            secondInput.style.pointerEvents = 'none';
        }, [completion]);

        // add a listener to copy the scrollLeft from the first input to the second one
        // so that they are aligned even when the input value overflows
        React.useEffect(() => {
            if (!inputRef.current || !secondInputRef.current) return;
            const input = inputRef.current;
            const eventListener = () => {
                secondInputRef.current.scrollLeft = input.scrollLeft;
                secondInputRef.current.scrollTop = input.scrollTop;
            };
            input.addEventListener('keyup', eventListener);
            input.addEventListener('scroll', eventListener);
            return () => {
                input.removeEventListener('keyup', eventListener);
                input.removeEventListener('scroll', eventListener);
            };
        }, []);

        return (
            <Root
                className={
                    fullWidth ? TextFieldWithCompletionClasses.fullWidth : ''
                }
            >
                <TextField
                    ref={ref}
                    inputRef={inputRef}
                    multiline={multiline}
                    value={value}
                    defaultValue={defaultValue}
                    fullWidth={fullWidth}
                    {...rest}
                />
                {multiline ? (
                    <textarea
                        data-testid={`ra-ai.${rest.name}.completion`}
                        className={
                            TextFieldWithCompletionClasses.multilineCompletion
                        }
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        ref={secondInputRef}
                        value={`${value ?? ''}${defaultValue ?? ''}${
                            completion ?? ''
                        }`}
                        readOnly
                    />
                ) : (
                    <input
                        data-testid={`ra-ai.${rest.name}.completion`}
                        style={{ display: 'none' }}
                        type="text"
                        tabIndex={-1}
                        ref={secondInputRef}
                        value={`${value ?? ''}${defaultValue ?? ''}${
                            completion ?? ''
                        }`}
                        readOnly
                    />
                )}
            </Root>
        );
    }
);
TextFieldWithCompletion.displayName = 'TextFieldWithCompletion';

const PREFIX = 'RaTextFieldWithCompletion';

const TextFieldWithCompletionClasses = {
    fullWidth: `${PREFIX}-fullWidth`,
    multilineCompletion: `${PREFIX}-multilineCompletion`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`&.${TextFieldWithCompletionClasses.fullWidth}`]: {
        width: '100%',
    },
    [`& .${TextFieldWithCompletionClasses.multilineCompletion}::-webkit-scrollbar`]:
        {
            display: 'none',
        },
});

/**
 * Convert the output of window.getComputedStyle() to a CSS string
 * @returns {string}
 */
const getCssText = (cssStyleDeclaration: CSSStyleDeclaration) => {
    const nbProperties = cssStyleDeclaration.length;
    let css = '';
    for (let i = 0; i < nbProperties; i++) {
        const propertyName = cssStyleDeclaration.item(i);
        const propertyValue =
            cssStyleDeclaration.getPropertyValue(propertyName);
        if (propertyValue !== '') {
            css += `${propertyName}:${propertyValue}; `;
        }
    }
    return css;
};
