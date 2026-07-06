var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { forwardRef } from 'react';
/**
 * The same as `React.forwardRef` but passes the 'ref as a prop and returns a
 * component with the same generic type.
 *
 * @example
 * import { RaRecord, useRecordContext }
 * const MyComponentWithTypeParameter = <RecordType extends RaRecord>(props, ref) => {
 *     const record = useRecordContext<RecordType>();
 *     return (
 *        <div ref={ref}>
 *           {record ? JSON.stringify(record) : 'Loading...'}
 *       </div>
 *     );
 * }
 *
 * export const MyComponent = genericForwardRef(MyComponentWithTypeParameter);
 * // Accepts a generic type parameter
 * const PostComponent = () => <MyComponent<Post> />;
 */
export function genericForwardRef(render) {
    var Role = forwardRef(function (props, ref) {
        return render(__assign(__assign({}, props), { ref: ref }));
    });
    Role.displayName = render.displayName || render.name;
    return Role;
}
