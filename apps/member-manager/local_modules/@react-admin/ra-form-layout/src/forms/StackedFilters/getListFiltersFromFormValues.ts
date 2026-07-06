/**
 * Transforms the form values into a list of filters. The form values are an array of objects
 * with the following shape: { source: 'foo', operator: 'eq', value: 'bar' }.
 * The list of filters is an object with the following shape: { foo_eq: 'bar' }.
 *
 * @param filters The form values for the filters field (an ArrayInput)
 */
export const getListFiltersFromFormValues = (filters: any) => {
    return filters != null
        ? filters.reduce((acc, filter) => {
              const { source, operator, value } = filter;
              if (source && operator && value != null) {
                  acc[`${source}${operator ? `_${operator}` : ''}`] = value;
              }
              return acc;
          }, {})
        : {};
};
