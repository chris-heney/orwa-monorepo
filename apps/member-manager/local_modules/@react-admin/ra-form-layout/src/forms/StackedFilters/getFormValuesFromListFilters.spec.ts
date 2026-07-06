import { getFormValuesFromListFilters } from './getFormValuesFromListFilters';

describe('getFormValuesFromListFilters', () => {
    test('should return the correct values from the list filters', () => {
        const config = {
            title: {
                operators: [
                    { value: 'eq', label: 'Equals' },
                    { value: 'not_eq', label: 'Not equals' },
                ],
            },
            category: {
                operators: [
                    { value: 'eq', label: 'Equals' },
                    { value: 'not_eq', label: 'Not equals' },
                ],
            },
            tags_ids: {
                operators: [
                    { value: 'inc', label: 'Equals' },
                    { value: 'inc_any', label: 'Not equals' },
                ],
            },
            published: {
                operators: [{ value: 'eq', label: 'Equals' }],
            },
        };
        const filterValues = {
            title_eq: 'React',
            category_not_eq: 'programming',
            tags_ids_inc_any: [1, 2, 3],
            published_eq: false,
        };
        const formValues = getFormValuesFromListFilters(filterValues, config);
        expect(formValues).toEqual([
            { source: 'title', operator: 'eq', value: 'React' },
            { source: 'category', operator: 'not_eq', value: 'programming' },
            { source: 'tags_ids', operator: 'inc_any', value: [1, 2, 3] },
            { source: 'published', operator: 'eq', value: false },
        ]);
    });
});
