export interface RaFormLayoutTranslationMessages {
    'ra-form-layout': {
        action: {
            next: string;
            previous: string;
            bulk_update: string;
        };
        autosave: {
            last_saved_at?: string;
            saving?: string;
            error?: string;
        };
        filters: {
            apply_filters: string;
            remove_all_filters: string;
            filters_button_label: string;
            source: string;
            operator: string;
            value: string;
            operators: {
                q: string;
                eq: string;
                neq: string;
                gt: string;
                lt: string;
                eq_any: string;
                neq_any: string;
                boolean: string;
                inc: string;
                inc_any: string;
                ninc_any: string;
            };
        };
        input_selector_form: {
            select_inputs: string;
            select_values: string;
        };
    };
}
