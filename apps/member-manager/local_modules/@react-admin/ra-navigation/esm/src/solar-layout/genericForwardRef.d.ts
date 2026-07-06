import { FC } from 'react';
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
export declare function genericForwardRef<T extends FC<any>>(render: T): T;
//# sourceMappingURL=genericForwardRef.d.ts.map