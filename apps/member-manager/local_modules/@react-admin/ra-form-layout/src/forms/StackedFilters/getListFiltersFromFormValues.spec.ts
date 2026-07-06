import { getListFiltersFromFormValues } from './getListFiltersFromFormValues';

describe('getListFiltersFromFormValues', () => {
    test('should return the correct filters from the form values', () => {
        const formValues = [
            { source: 'title', operator: 'eq', value: 'React' },
            { source: 'category', operator: 'not_eq', value: 'programming' },
            { source: 'tags_ids', operator: 'inc_any', value: [1, 2, 3] },
            { source: 'published', operator: 'eq', value: false },
        ];
        const filterValues = getListFiltersFromFormValues(formValues);
        expect(filterValues).toEqual({
            title_eq: 'React',
            category_not_eq: 'programming',
            tags_ids_inc_any: [1, 2, 3],
            published_eq: false,
        });
    });
});
