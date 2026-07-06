import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { Chip, Stack } from '@mui/material';
export var TextArrayField = function (_a) {
    var source = _a.source;
    var record = useRecordContext();
    var array = record[source];
    if (typeof array === 'undefined' || array === null || array.length === 0) {
        return React.createElement("div", null);
    }
    else {
        return (React.createElement(Stack, { direction: "row", gap: 1 }, array.map(function (item) { return (React.createElement(Chip, { label: item, key: item, size: "small" })); })));
    }
};
TextArrayField.defaultProps = { addLabel: true };
