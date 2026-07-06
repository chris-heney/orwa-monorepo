import React from 'react';
import {
    cleanup,
    fireEvent,
    waitFor,
    render,
    screen,
    within,
} from '@testing-library/react';
import {
    TextField,
    List,
    TextInput,
    required,
    AdminContext,
    undoableEventEmitter,
} from 'react-admin';
import EditableDatagrid, { EditableDatagridProps } from './EditableDatagrid';
import RowForm from './RowForm';
import { useRowContext } from './useRowContext';
import {
    Undoable,
    NoSubmitOnEnter,
    WithMeta,
    WithListContextProvider,
    Pessimistic,
    Optimistic,
    CustomSideEffectsPessimistic,
    CustomSideEffectsUndoable,
    CustomSideEffectsOptimistic,
} from '../stories/editable.basic.stories';
import { Expand } from '../stories/expand.stories';
import {
    WithReferenceManyField,
    WithReferenceManyFieldCustomActions,
    WithListContextProvider as WithListContextProviderInForm,
} from '../stories/insideForm.stories';
import {
    CustomEmptyInList,
    CustomEmptyStandalone,
} from '../stories/empty.stories';

const defaultListProps = {
    match: { path: '/artists', params: {}, isExact: false, url: '' },
    resource: 'artists',
};

const FreePropsWrapper = ({ children }: any) => <span>{children}</span>;

const CreateForm = () => (
    <RowForm>
        <FreePropsWrapper>CREATE FORM</FreePropsWrapper>
    </RowForm>
);

const EditForm = () => (
    <RowForm>
        <FreePropsWrapper>EDIT FORM</FreePropsWrapper>
    </RowForm>
);

const EditFormWithValidation = () => (
    <RowForm>
        <TextInput source="name" validate={required()} />
    </RowForm>
);

describe('EditableDatagrid', () => {
    let dataProvider;

    beforeEach(() => {
        dataProvider = {
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            deleteMany: jest.fn(() => Promise.resolve({ data: [] })),
            update: jest.fn(() =>
                Promise.resolve({ data: { id: 1, title: 'Foo' } })
            ),
            updateMany: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Foo' }], total: 1 })
            ),
            getMany: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 1, title: 'Foo' } })
            ),
            getManyReference: jest.fn(() =>
                Promise.resolve({
                    data: [],
                    total: 0,
                })
            ),
        };
    });

    afterEach(cleanup);

    it('should render a datagrid', async () => {
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [
                    { id: 1, title: 'Foo' },
                    { id: 2, title: 'Bar' },
                ],
                total: 2,
            })
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        mutationMode="undoable"
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        expect(screen.queryByText('Foo')).not.toBeNull();
        expect(screen.queryByText('Bar')).not.toBeNull();
    });

    it('should display an edit form on datagrid row click', async () => {
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [{ id: 1, title: 'Baz' }],
                total: 1,
            })
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        mutationMode="undoable"
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        expect(screen.queryByText('Baz')).not.toBeNull();
        expect(screen.queryByText('EDIT FORM')).toBeNull();

        fireEvent.click(screen.queryByText('Baz') as HTMLElement);

        expect(screen.queryByText('EDIT FORM')).not.toBeNull();
        expect(screen.queryByText('Baz')).toBeNull();
    });

    it('should submit the form and quit edit mode when the enter key is pressed and the form is valid', async () => {
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [{ id: 1, title: 'Baz' }],
                total: 1,
            })
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        editForm={<EditFormWithValidation />}
                        rowClick="edit"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        fireEvent.click(screen.queryByText('Baz') as HTMLElement);

        const input = screen.queryByLabelText(
            'resources.artists.fields.name *'
        );

        fireEvent.change(input as HTMLElement, { target: { value: '' } });
        fireEvent.keyDown(input as HTMLElement, { key: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText('ra.validation.required')).not.toBeNull();
        });

        // Shouldn't have quit the edit mode
        expect(
            screen.queryByLabelText('resources.artists.fields.name *')
        ).not.toBeNull();

        fireEvent.change(input as HTMLElement, {
            target: { value: 'Bazinga' },
        });
        fireEvent.keyDown(input as HTMLElement, { key: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText('ra.validation.required')).toBeNull();
        });
        // Should have quit the edit mode
        expect(
            screen.queryByLabelText('resources.artists.fields.name *')
        ).toBeNull();
    });

    it('should accept a transform fn for the edit form and call it on submit with button', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {
            /* Do nothing */
        });
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [{ id: 1, title: 'Baz' }],
                total: 1,
            })
        );
        dataProvider.update = jest
            .fn()
            .mockResolvedValueOnce({ data: { id: 1, title: 'Baz' } });

        const transform = jest.fn().mockImplementation(values => values);
        const EditForm = () => (
            <RowForm transform={transform}>
                <FreePropsWrapper>EDIT FORM</FreePropsWrapper>
            </RowForm>
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                        mutationMode="optimistic"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        fireEvent.click(screen.queryByText('Baz') as HTMLElement);

        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(transform).toHaveBeenCalled();
            expect(screen.queryByLabelText('ra.action.save')).toBeNull();
        });
    });

    it('should accept a transform fn for the edit form and call it on submit with enter', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {
            /* Do nothing */
        });
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [{ id: 1, title: 'Baz' }],
                total: 1,
            })
        );
        dataProvider.update = jest
            .fn()
            .mockResolvedValueOnce({ data: { id: 1, title: 'Baz' } });

        const transform = jest.fn().mockImplementation(values => values);
        const EditForm = () => (
            <RowForm transform={transform}>
                <TextInput source="name" />
            </RowForm>
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                        mutationMode="optimistic"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        fireEvent.click(screen.queryByText('Baz') as HTMLElement);

        const input = screen.queryByLabelText('resources.artists.fields.name');

        fireEvent.change(input as HTMLElement, { target: { value: '' } });
        fireEvent.keyDown(input as HTMLElement, { key: 'Enter' });

        await waitFor(() => {
            expect(transform).toHaveBeenCalled();
            expect(screen.queryByLabelText('ra.action.save')).toBeNull();
        });
    });

    it('should display a create form on datagrid create button click', async () => {
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [{ id: 1, title: 'Baz' }],
                total: 1,
            })
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                >
                    <EditableDatagrid
                        mutationMode="undoable"
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve));

        expect(screen.queryByText('Baz')).not.toBeNull();
        expect(screen.queryByText('CREATE FORM')).toBeNull();

        fireEvent.click(screen.getByLabelText('ra.action.create'));

        expect(screen.queryByText('CREATE FORM')).not.toBeNull();
        expect(screen.queryByText('Baz')).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.cancel'));
    });

    it('should still display a list when page is empty and empty prop is false', async () => {
        dataProvider.getList = jest.fn(() =>
            Promise.resolve({
                data: [],
                total: 0,
            })
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <List
                    {...defaultListProps}
                    hasCreate
                    sort={{ field: 'id', order: 'DESC' }}
                    empty={false}
                >
                    <EditableDatagrid
                        mutationMode="undoable"
                        createForm={<CreateForm />}
                        editForm={<EditForm />}
                        rowClick="edit"
                    >
                        <TextField source="title" />
                    </EditableDatagrid>
                </List>
            </AdminContext>
        );

        expect(screen.queryByText('ra.action.create')).not.toBeNull();
    });

    it('should allow to edit a row', async () => {
        render(<Undoable />);
        await waitFor(() => {
            expect(screen.queryByText('Meryl')).not.toBeNull();
        });
        const row = screen.getByText('Meryl').closest('tr');
        fireEvent.mouseEnter(row as HTMLElement);
        fireEvent.click(within(row as HTMLElement).getByLabelText('Edit'));
        const input = screen.queryByDisplayValue('Meryl');
        await waitFor(() => {
            expect(input).not.toBeNull();
        });

        fireEvent.change(input as HTMLElement, {
            target: { value: 'test' },
        });
        fireEvent.keyDown(input as HTMLElement, {
            key: 'Enter',
            code: 'Enter',
        });
        await waitFor(() => {
            expect(screen.queryByText('test')).not.toBeNull();
        });
    });

    it('should not submit on enter if disabled', async () => {
        render(<NoSubmitOnEnter />);
        await waitFor(() => {
            expect(screen.queryByText('Meryl')).not.toBeNull();
        });
        const row = screen.getByText('Meryl').closest('tr');
        fireEvent.mouseEnter(row as HTMLElement);
        fireEvent.click(within(row as HTMLElement).getByLabelText('Edit'));
        const input = screen.queryByDisplayValue('Meryl');
        await waitFor(() => {
            expect(input).not.toBeNull();
        });

        fireEvent.change(input as HTMLElement, {
            target: { value: 'test' },
        });
        fireEvent.keyPress(screen.queryByDisplayValue('test') as HTMLElement, {
            key: 'Enter',
            code: 'Enter',
        });
        await waitFor(() => {
            expect(screen.queryByText('test')).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(screen.queryByText('test')).not.toBeNull();
        });
    });

    it('should allow to use expand rows', async () => {
        render(<Expand />);
        await screen.findByText('Meryl');
        const row = screen.getByText('Meryl').closest('tr');
        fireEvent.mouseEnter(row as HTMLElement);
        fireEvent.click(within(row as HTMLElement).getByLabelText('Expand'));
        await waitFor(() => {
            expect(screen.queryAllByText('Meryl')).toHaveLength(2);
        });

        // close the first row
        fireEvent.click(
            within(row as HTMLElement).getByTestId('ExpandMoreIcon')
        );
        await waitFor(() => {
            expect(screen.queryAllByText('Meryl')).toHaveLength(1);
        });
    });

    it('should only expand one line at a time', async () => {
        render(<Expand />);
        await screen.findByText('Meryl');
        const row = screen.getByText('Meryl').closest('tr');
        fireEvent.mouseEnter(row as HTMLElement);
        fireEvent.click(within(row as HTMLElement).getByLabelText('Expand'));
        await waitFor(() => {
            expect(screen.queryAllByText('Harrison')).toHaveLength(1);
        });
        // close the first row
        fireEvent.click(
            within(row as HTMLElement).getByTestId('ExpandMoreIcon')
        );
        await waitFor(() => {
            expect(screen.queryAllByText('Meryl')).toHaveLength(1);
        });
    });

    it('should be usable inside a ReferenceManyField in a custom form', async () => {
        render(<WithReferenceManyField />);
        await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        fireEvent.click(
            screen.getByText(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            )
        );
        await waitFor(() => {
            fireEvent.mouseEnter(screen.getByText(/Logan Schowalter/));
            fireEvent.click(screen.getAllByLabelText('Edit')[0]);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByDisplayValue('Logan Schowalter'), {
                target: { value: 'test' },
            });
        });

        fireEvent.click(screen.getByLabelText('Save', { selector: 'tr *' }));

        await waitFor(() => {
            expect(screen.queryByText('test')).not.toBeNull();
        });
    });

    it('should display a create button when using custom actions', async () => {
        render(<WithReferenceManyFieldCustomActions />);
        await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        fireEvent.click(
            screen.getByText(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            )
        );

        await waitFor(() => {
            const createButton = screen.getByLabelText('Create');
            fireEvent.click(createButton);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('Author *'), {
                target: { value: 'test create' },
            });
            fireEvent.change(screen.getByLabelText('Body *'), {
                target: { value: 'test create body' },
            });
            fireEvent.change(screen.getByLabelText('Created at *'), {
                target: { value: '2022-10-01' },
            });
        });
        fireEvent.click(screen.getByLabelText('Save', { selector: 'tr *' }));
        await waitFor(() => {
            expect(screen.queryByText('test create')).not.toBeNull();
        });
    });

    it('should display a custom create button', async () => {
        render(<CustomEmptyInList />);

        await waitFor(() => {
            const createButton = screen.getByText('Create the first book');
            fireEvent.click(createButton);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('Title'), {
                target: { value: 'test create' },
            });
            fireEvent.change(screen.getByLabelText('Published at'), {
                target: { value: '2022-10-01' },
            });
        });
        fireEvent.click(screen.getByLabelText('Save', { selector: 'tr *' }));
        await waitFor(() => {
            expect(screen.queryByText('test create')).not.toBeNull();
        });
    });

    it('should display a custom create button in standalone mode', async () => {
        render(<CustomEmptyStandalone />);
        await screen.findByText('Totam vel quasi a odio et nihil');
        fireEvent.click(screen.getByText('Totam vel quasi a odio et nihil'));

        await waitFor(() => {
            const createButton = screen.getByText('Custom Create Button');
            fireEvent.click(createButton);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('Author'), {
                target: { value: 'test create' },
            });
            fireEvent.change(screen.getByLabelText('Body'), {
                target: { value: 'test create body' },
            });
            fireEvent.change(screen.getByLabelText('Created at'), {
                target: { value: '2022-10-01' },
            });
        });
        fireEvent.click(screen.getByLabelText('Save', { selector: 'tr *' }));
        await waitFor(() => {
            expect(screen.queryByText('test create')).not.toBeNull();
        });
    });

    it('should display a create button (and only one) when used in List view', async () => {
        render(<Undoable />);
        await screen.findByText('Meryl');
        expect(screen.getAllByLabelText('Create')).toHaveLength(1);
    });

    it('should display a create button when used inside a ReferenceManyField', async () => {
        render(<WithReferenceManyField />);
        const firstPost = await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        fireEvent.click(firstPost);
        await screen.findByText('Logan Schowalter');
        expect(screen.getAllByLabelText('Create')).toHaveLength(1);
    });

    it('should display a create button when used inside a ListContextProvider', async () => {
        render(<WithListContextProviderInForm />);
        const firstPost = await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        fireEvent.click(firstPost);
        await screen.findByText('Logan Schowalter');
        expect(screen.getAllByLabelText('Create')).toHaveLength(1);
    });

    it('should use the list context when used inside a ListContextProvider', async () => {
        dataProvider.update = jest.fn(() =>
            Promise.resolve({
                data: { id: 1, title: 'La Métamorphose' },
            } as any)
        );
        render(<WithListContextProvider dataProvider={dataProvider} />);
        const firstBook = await screen.findByText(
            'Le Dernier Jour d’un condamné'
        );

        fireEvent.click(firstBook);

        const input = await screen.findByLabelText('Title *');
        fireEvent.change(input, { target: { value: 'La Métamorphose' } });

        const save = await screen.findByLabelText('Save');
        fireEvent.click(save);

        await waitFor(() => {
            expect(screen.queryByText('test')).toBeNull();
        });

        await screen.findByText('Element updated');
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith(
                'books',
                expect.objectContaining({
                    data: { id: 1, title: 'La Métamorphose' },
                })
            );
        });

        expect(screen.queryByText('La Métamorphose')).toBeDefined();
    });

    it('should show validation errors even on pristine inputs', async () => {
        render(<Pessimistic />);
        await screen.findByText('Meryl');
        fireEvent.click(screen.getByLabelText('Create'));
        fireEvent.click(await screen.findByLabelText('Save'));
        const input = await screen.findByLabelText('Born *');
        await screen.findByText('Required');
        expect(input.attributes.getNamedItem('aria-invalid')).not.toBeFalsy();
    });

    it('should show validation errors even on pristine inputs when submitted with enter', async () => {
        render(<Pessimistic />);
        await screen.findByText('Meryl');
        fireEvent.click(screen.getByLabelText('Create'));
        const nameInput = await screen.findByLabelText('Name *');
        fireEvent.keyDown(nameInput, { key: 'Enter' });
        const input = await screen.findByLabelText('Born *');
        await screen.findByText('Required');
        expect(input.attributes.getNamedItem('aria-invalid')).not.toBeFalsy();
    });

    describe('mutationMode', () => {
        it('should call the dataProvider.update() function on save when mutationMode is pessimistic', async () => {
            dataProvider.getList = jest.fn(() =>
                Promise.resolve({
                    data: [
                        {
                            id: 1,
                            firstname: 'Fizz',
                            name: 'Buzz',
                            dob: '1949-06-22',
                            prof: 'actor',
                        },
                    ],
                    total: 1,
                })
            );

            render(<Pessimistic dataProvider={dataProvider} />);
            await screen.findByText('Buzz');

            fireEvent.mouseEnter(screen.queryByText('Buzz') as HTMLElement);
            fireEvent.click(screen.queryByLabelText('Edit') as HTMLElement);
            const input = screen.queryByLabelText('Name *');

            fireEvent.change(input as HTMLElement, {
                target: { value: 'Buzinga' },
            });
            fireEvent.click(screen.getByLabelText('Save'));

            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'artists',
                    expect.objectContaining({
                        data: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzinga',
                            prof: 'actor',
                        },
                        id: 1,
                        meta: undefined,
                        previousData: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzz',
                            prof: 'actor',
                        },
                    })
                );
            });
        });

        it('should call the dataProvider.update() function on save when mutationMode is optimistic', async () => {
            dataProvider.getList = jest.fn(() =>
                Promise.resolve({
                    data: [
                        {
                            id: 1,
                            firstname: 'Fizz',
                            name: 'Buzz',
                            dob: '1949-06-22',
                            prof: 'actor',
                        },
                    ],
                    total: 1,
                })
            );

            render(<Optimistic dataProvider={dataProvider} />);
            await screen.findByText('Buzz');

            fireEvent.mouseEnter(screen.queryByText('Buzz') as HTMLElement);
            fireEvent.click(screen.queryByLabelText('Edit') as HTMLElement);
            const input = screen.queryByLabelText('Name *');

            fireEvent.change(input as HTMLElement, {
                target: { value: 'Buzinga' },
            });
            fireEvent.click(screen.getByLabelText('Save'));

            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'artists',
                    expect.objectContaining({
                        data: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzinga',
                            prof: 'actor',
                        },
                        id: 1,
                        meta: undefined,
                        previousData: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzz',
                            prof: 'actor',
                        },
                    })
                );
            });
        });

        it('should call the update function when the undoable event emitter ends', async () => {
            dataProvider.getList = jest.fn(() =>
                Promise.resolve({
                    data: [
                        {
                            id: 1,
                            firstname: 'Fizz',
                            name: 'Buzz',
                            dob: '1949-06-22',
                            prof: 'actor',
                        },
                    ],
                    total: 1,
                })
            );

            render(<Undoable dataProvider={dataProvider} />);
            await screen.findByText('Buzz');

            fireEvent.mouseEnter(screen.queryByText('Buzz') as HTMLElement);
            fireEvent.click(screen.queryByLabelText('Edit') as HTMLElement);
            const input = screen.queryByLabelText('Name *');
            fireEvent.change(input as HTMLElement, {
                target: { value: 'Buzinga' },
            });
            fireEvent.keyDown(input as HTMLElement, {
                key: 'Enter',
                code: 'Enter',
            });

            await waitFor(() => {
                expect(screen.queryByText('Buzinga')).not.toBeNull();
            });

            await screen.findByText('Element updated');
            expect(dataProvider.update).not.toHaveBeenCalled();
            undoableEventEmitter.emit('end', { isUndo: false });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'artists',
                    expect.objectContaining({
                        data: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzinga',
                            prof: 'actor',
                        },
                        id: 1,
                        meta: undefined,
                        previousData: {
                            dob: '1949-06-22',
                            firstname: 'Fizz',
                            id: 1,
                            name: 'Buzz',
                            prof: 'actor',
                        },
                    })
                );
            });
        });
    });

    describe('mutationOptions', () => {
        describe('optimistic mode', () => {
            it('should call success side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });

                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );

                dataProvider.update = jest.fn().mockResolvedValueOnce({
                    data: {
                        id: 1,
                        name: 'Mercury',
                        firstname: 'Fred',
                        dob: new Date('1946-09-05'),
                        prof: 'singer',
                    },
                });

                const onSuccess = jest.fn();

                render(
                    <CustomSideEffectsOptimistic
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onSuccess: () => {
                                onSuccess();
                            },
                        }}
                    />
                );

                await new Promise(resolve => setTimeout(resolve));
                await screen.findByText('Freddy');
                fireEvent.click(
                    (await screen.findByText('Freddy')) as HTMLElement
                );
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Fred' },
                });
                fireEvent.click(screen.getByLabelText('Save'));
                await waitFor(() => {
                    expect(onSuccess).toHaveBeenCalled();
                });
            });

            // FIXME: find a way to pass sideEffects at definition time to make it work
            // eslint-disable-next-line jest/no-disabled-tests
            it.skip('should call error side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });

                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );

                dataProvider.update = jest.fn().mockImplementationOnce(
                    () =>
                        new Promise((_, reject) => {
                            setTimeout(() => reject('Ouch'), 1000);
                        })
                );

                const onFailure = jest.fn();

                render(
                    <CustomSideEffectsOptimistic
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onError: () => {
                                onFailure();
                            },
                        }}
                    />
                );

                await new Promise(resolve => setTimeout(resolve));

                fireEvent.click(screen.queryByText('Freddy') as HTMLElement);
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Freddy' },
                });

                await waitFor(() => {
                    screen.getByLabelText('Save');
                });

                fireEvent.click(screen.getByLabelText('Save'));

                await waitFor(() => {
                    expect(onFailure).toHaveBeenCalled();
                });
            });
        });

        describe('pessimistic mode', () => {
            it('a should call success side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });

                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.update = jest.fn().mockResolvedValueOnce({
                    data: {
                        id: 1,
                        name: 'Mercury',
                        firstname: 'Fred',
                        dob: new Date('1946-09-05'),
                        prof: 'singer',
                    },
                });

                const onSuccess = jest.fn();

                render(
                    <CustomSideEffectsPessimistic
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onSuccess: () => {
                                onSuccess();
                            },
                        }}
                    />
                );

                fireEvent.click(
                    (await screen.findByText('Freddy')) as HTMLElement
                );
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Fred' },
                });
                fireEvent.click(screen.getByLabelText('Save'));
                await waitFor(() => {
                    expect(onSuccess).toHaveBeenCalled();
                });
            });
            it('a should call error side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });

                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.update = jest.fn().mockRejectedValueOnce('Ouch');

                const onFailure = jest.fn();

                render(
                    <CustomSideEffectsPessimistic
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onError: () => {
                                onFailure();
                            },
                        }}
                    />
                );
                await screen.findByText('Freddy');
                fireEvent.click(screen.getByText('Freddy') as HTMLElement);
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Freddy' },
                });

                await waitFor(() => {
                    screen.getByLabelText('Save');
                });

                fireEvent.click(screen.getByLabelText('Save'));

                await waitFor(() => {
                    expect(onFailure).toHaveBeenCalled();
                });
            });
        });

        describe('undoable mode', () => {
            it('should call success side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });
                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.update = jest.fn().mockResolvedValueOnce({
                    data: {
                        id: 1,
                        name: 'Mercury',
                        firstname: 'Fred',
                        dob: new Date('1946-09-05'),
                        prof: 'singer',
                    },
                });

                const onSuccess = jest.fn();

                render(
                    <CustomSideEffectsUndoable
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onSuccess: () => {
                                onSuccess();
                            },
                        }}
                    />
                );

                await new Promise(resolve => setTimeout(resolve));

                fireEvent.click(
                    (await screen.findByText('Freddy')) as HTMLElement
                );
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Fred' },
                });
                fireEvent.click(screen.getByLabelText('Save'));
                undoableEventEmitter.emit('end', { isUndo: false });
                await waitFor(() => {
                    expect(onSuccess).toHaveBeenCalled();
                });
            });

            it('should call error side effects in edition form', async () => {
                jest.spyOn(console, 'error').mockImplementation(() => {
                    /* Do nothing */
                });
                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.update = jest.fn().mockRejectedValueOnce('Ouch');
                const onFailure = jest.fn();

                render(
                    <CustomSideEffectsUndoable
                        dataProvider={dataProvider}
                        mutationOptions={{
                            onError: () => {
                                onFailure();
                            },
                        }}
                    />
                );

                await new Promise(resolve => setTimeout(resolve));

                fireEvent.click(
                    (await screen.queryByText('Freddy')) as HTMLElement
                );
                fireEvent.change(await screen.findByLabelText('Firstname *'), {
                    target: { value: 'Fred' },
                });
                await waitFor(() => {
                    screen.getByLabelText('Save');
                });
                fireEvent.click(screen.getByLabelText('Save'));
                undoableEventEmitter.emit('end', { isUndo: false });
                await waitFor(
                    () => {
                        expect(onFailure).toHaveBeenCalled();
                    },
                    {
                        timeout: 5000,
                    }
                );
            });
        });

        it('should accept custom side effects for the create form', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {
                /* Do nothing */
            });
            dataProvider.getList = jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'Baz' }],
                    total: 1,
                })
            );
            dataProvider.create = jest
                .fn()
                .mockResolvedValueOnce({ data: { id: 1 } })
                .mockRejectedValueOnce('Ouch');

            const onSuccess = jest.fn();
            const onFailure = jest.fn();
            const CreateForm = () => {
                const { close } = useRowContext();

                return (
                    <RowForm
                        mutationOptions={{
                            onSuccess: () => {
                                onSuccess();
                                close();
                            },
                            onError: () => {
                                onFailure();
                                close();
                            },
                        }}
                    >
                        <FreePropsWrapper>CREATE FORM</FreePropsWrapper>
                    </RowForm>
                );
            };

            render(
                <AdminContext dataProvider={dataProvider}>
                    <List
                        {...defaultListProps}
                        hasCreate
                        sort={{ field: 'id', order: 'DESC' }}
                    >
                        <EditableDatagrid
                            mutationMode="undoable"
                            createForm={<CreateForm />}
                            editForm={<EditForm />}
                            rowClick="edit"
                        >
                            <TextField source="title" />
                        </EditableDatagrid>
                    </List>
                </AdminContext>
            );

            await new Promise(resolve => setTimeout(resolve));

            fireEvent.click(screen.getByLabelText('ra.action.create'));

            fireEvent.click(screen.getByLabelText('ra.action.save'));

            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalled();
            });

            fireEvent.click(screen.getByLabelText('ra.action.create'));

            await waitFor(() => {
                screen.getByLabelText('ra.action.save');
            });

            fireEvent.click(screen.getByLabelText('ra.action.save'));

            await waitFor(() => {
                expect(onFailure).toHaveBeenCalled();
            });
        });

        it('should show validation errors even on pristine inputs when there are custom side effects', async () => {
            render(<CustomSideEffectsPessimistic />);
            await screen.findByText('Meryl');
            fireEvent.click(screen.getByLabelText('Create'));
            fireEvent.click(await screen.findByLabelText('Save'));
            const input = await screen.findByLabelText('Born *');
            await screen.findByText('Required');
            expect(
                input.attributes.getNamedItem('aria-invalid')
            ).not.toBeFalsy();
        });

        it('should show validation errors even on pristine inputs when there are custom side effects and submitted with enter', async () => {
            render(<CustomSideEffectsPessimistic />);
            await screen.findByText('Meryl');
            fireEvent.click(screen.getByLabelText('Create'));
            const nameInput = await screen.findByLabelText('Name *');
            fireEvent.keyDown(nameInput, { key: 'Enter' });
            const input = await screen.findByLabelText('Born *');
            await screen.findByText('Required');
            expect(
                input.attributes.getNamedItem('aria-invalid')
            ).not.toBeFalsy();
        });
    });

    describe('meta', () => {
        const mutationModes: EditableDatagridProps['mutationMode'][] = [
            'undoable',
            'pessimistic',
            'optimistic',
        ];

        test.each(mutationModes)(
            'should use provided meta prop when calling create in %s mode',
            async mutationMode => {
                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.create = jest.fn().mockResolvedValueOnce({
                    data: {
                        id: 2,
                        dob: '2020-01-01',
                        firstname: 'John',
                        name: 'Doe',
                        prof: undefined,
                    },
                });

                render(
                    <WithMeta
                        dataProvider={dataProvider}
                        mutationMode={mutationMode}
                    />
                );

                fireEvent.click(await screen.findByLabelText('Create'));
                fireEvent.change(await screen.findByLabelText('Born *'), {
                    target: { value: '2020-01-01' },
                });
                fireEvent.click(screen.getByLabelText('Save'));

                await waitFor(() => {
                    expect(dataProvider.create).toHaveBeenCalledWith(
                        'artists',
                        {
                            data: {
                                dob: '2020-01-01',
                                firstname: 'John',
                                name: 'Doe',
                                prof: undefined,
                            },
                            meta: { foo: 'bar' },
                        }
                    );
                });
            }
        );

        test.each(mutationModes)(
            'should use provided meta prop when calling update in %s mode',
            async mutationMode => {
                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.update = jest.fn().mockResolvedValueOnce({
                    data: {
                        id: 1,
                        name: 'Mercury',
                        firstname: 'Freddy',
                        dob: '2020-01-01',
                        prof: 'singer',
                    },
                });

                render(
                    <WithMeta
                        dataProvider={dataProvider}
                        mutationMode={mutationMode}
                    />
                );

                fireEvent.click(await screen.findByLabelText('Edit'));
                fireEvent.change(await screen.findByLabelText('Born *'), {
                    target: { value: '2020-01-01' },
                });
                fireEvent.click(screen.getByLabelText('Save'));

                await waitFor(
                    () => {
                        expect(dataProvider.update).toHaveBeenCalledWith(
                            'artists',
                            {
                                id: 1,
                                data: {
                                    id: 1,
                                    name: 'Mercury',
                                    firstname: 'Freddy',
                                    dob: '2020-01-01',
                                    prof: 'singer',
                                },
                                previousData: {
                                    id: 1,
                                    name: 'Mercury',
                                    firstname: 'Freddy',
                                    dob: new Date('1946-09-05'),
                                    prof: 'singer',
                                },
                                meta: { foo: 'bar' },
                            }
                        );
                    },
                    { timeout: 5000 }
                );
            }
        );

        test.each(mutationModes)(
            'should use provided meta prop when calling delete in %s mode',
            async mutationMode => {
                dataProvider.getList = jest.fn(() =>
                    Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'Mercury',
                                firstname: 'Freddy',
                                dob: new Date('1946-09-05'),
                                prof: 'singer',
                            },
                        ],
                        total: 1,
                    })
                );
                dataProvider.delete = jest.fn();

                render(
                    <WithMeta
                        dataProvider={dataProvider}
                        mutationMode={mutationMode}
                    />
                );

                const rowContainer = (
                    await screen.findByText('Mercury')
                ).closest('tr');
                expect(rowContainer).not.toBeNull();
                fireEvent.click(
                    await within(rowContainer!).findByLabelText('Delete')
                );

                if (mutationMode !== 'undoable') {
                    fireEvent.click(await screen.findByText('Confirm'));
                }

                await waitFor(
                    () => {
                        expect(dataProvider.delete).toHaveBeenCalledWith(
                            'artists',
                            {
                                id: 1,
                                previousData: {
                                    id: 1,
                                    name: 'Mercury',
                                    firstname: 'Freddy',
                                    dob: new Date('1946-09-05'),
                                    prof: 'singer',
                                },
                                meta: { foo: 'bar' },
                            }
                        );
                    },
                    { timeout: 5000 }
                );
            }
        );
    });
});
