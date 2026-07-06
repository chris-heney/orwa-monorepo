import * as React from 'react';
import { DataProvider, HttpError, testDataProvider } from 'react-admin';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { InSimpleForm as InSimpleFormOptimistic } from '../../../stories/AutoSave.optimistic.stories';
import { InSimpleForm as InSimpleFormPessimistic } from '../../../stories/AutoSave.pessimistic.stories';

const wait = (time: number) =>
    new Promise(resolve => setTimeout(resolve, time));

const getDataProvider = (dataProvider?: Partial<DataProvider>) => {
    return testDataProvider({
        // @ts-ignore
        getOne: jest.fn(() =>
            Promise.resolve({
                data: {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    dob: new Date('1966-09-05'),
                    sex: 'male',
                    employer_id: 2,
                },
            })
        ),
        // @ts-ignore
        update: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
        ...dataProvider,
    });
};

describe('AutoSave', () => {
    describe('optimistic', () => {
        it('should autosave at the specified interval if the form is dirty and valid', async () => {
            const dataProvider = getDataProvider();
            render(
                <InSimpleFormOptimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            await wait(600);
            // Not called because the form is not dirty
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: '' },
            });

            await wait(600);
            // Not called because the form is not valid
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledWith(
                'customers',
                expect.objectContaining({
                    data: {
                        id: 1,
                        first_name: 'Hello',
                        last_name: 'Doe',
                        dob: new Date('1966-09-05'),
                        sex: 'male',
                        employer_id: 2,
                    },
                })
            );
        });

        it('should autosave only once per change', async () => {
            const dataProvider = getDataProvider();
            render(
                <InSimpleFormOptimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'customers',
                    expect.objectContaining({
                        data: {
                            id: 1,
                            first_name: 'Hello',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                );
            });
            expect(dataProvider.update).toHaveBeenCalledTimes(1);

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledTimes(1);
        });

        it('should display an error message when the update failed and restart saving after a change', async () => {
            const dataProvider = testDataProvider({
                // @ts-ignore
                getOne: jest.fn(() =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                ),
                // @ts-ignore
                update: jest.fn((resource, { data }) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (data.first_name === 'test') {
                                return reject(
                                    new HttpError('Forbidden name', 400)
                                );
                            }
                            // @ts-ignore
                            resolve({ data: { id: 1 } });
                        }, 100);
                    });
                }),
            });
            render(
                <InSimpleFormOptimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            await wait(600);

            const consoleError = jest
                .spyOn(console, 'error')
                .mockImplementation(() => undefined);
            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'test' },
            });

            await wait(1000);
            expect(dataProvider.update).toHaveBeenCalledWith(
                'customers',
                expect.objectContaining({
                    data: {
                        id: 1,
                        first_name: 'test',
                        last_name: 'Doe',
                        dob: new Date('1966-09-05'),
                        sex: 'male',
                        employer_id: 2,
                    },
                })
            );

            await screen.findByText(
                'Server error, changes are not saved: Forbidden name'
            );

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledWith(
                'customers',
                expect.objectContaining({
                    data: {
                        id: 1,
                        first_name: 'Hello',
                        last_name: 'Doe',
                        dob: new Date('1966-09-05'),
                        sex: 'male',
                        employer_id: 2,
                    },
                })
            );
            // make sure the error message is not displayed anymore
            expect(
                screen.queryByText(
                    'Server error, changes are not saved: Forbidden name'
                )
            ).toBeNull();
            consoleError.mockRestore();
            // see test-setup
            restoreConsoleError();
        });
    });
    describe('pessimistic', () => {
        it('should autosave at the specified interval if the form is dirty and valid', async () => {
            const dataProvider = getDataProvider();
            render(
                <InSimpleFormPessimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            await wait(600);
            // Not called because the form is not dirty
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: '' },
            });

            await wait(600);
            // Not called because the form is not valid
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledWith(
                'customers',
                expect.objectContaining({
                    data: {
                        id: 1,
                        first_name: 'Hello',
                        last_name: 'Doe',
                        dob: new Date('1966-09-05'),
                        sex: 'male',
                        employer_id: 2,
                    },
                })
            );
        });

        it('should autosave only once per change', async () => {
            const dataProvider = getDataProvider();
            render(
                <InSimpleFormPessimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledTimes(0);

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'customers',
                    expect.objectContaining({
                        data: {
                            id: 1,
                            first_name: 'Hello',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                );
            });

            expect(dataProvider.update).toHaveBeenCalledTimes(1);

            await wait(600);
            expect(dataProvider.update).toHaveBeenCalledTimes(1);
        });

        it('should display an error message when the update failed and restart saving after a change', async () => {
            const dataProvider = testDataProvider({
                // @ts-ignore
                getOne: jest.fn(() =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                ),
                // @ts-ignore
                update: jest.fn((resource, { data }) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (data.first_name === 'test') {
                                return reject(
                                    new HttpError('Forbidden name', 400)
                                );
                            }
                            // @ts-ignore
                            resolve({ data: { id: 1 } });
                        }, 100);
                    });
                }),
            });
            const consoleError = jest
                .spyOn(console, 'error')
                .mockImplementation(() => undefined);
            render(
                <InSimpleFormPessimistic
                    dataProvider={dataProvider}
                    debounce={100}
                    confirmationDuration={100}
                />
            );

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'test' },
            });

            await waitFor(() =>
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'customers',
                    expect.objectContaining({
                        data: {
                            id: 1,
                            first_name: 'test',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                )
            );

            await screen.findByText(
                'Server error, changes are not saved: Forbidden name'
            );

            fireEvent.change(screen.getByLabelText('First name *'), {
                target: { value: 'Hello' },
            });

            await waitFor(() =>
                expect(dataProvider.update).toHaveBeenCalledWith(
                    'customers',
                    expect.objectContaining({
                        data: {
                            id: 1,
                            first_name: 'Hello',
                            last_name: 'Doe',
                            dob: new Date('1966-09-05'),
                            sex: 'male',
                            employer_id: 2,
                        },
                    })
                )
            );
            consoleError.mockRestore();
            restoreConsoleError();
        });
    });
});

// see test-setup, we silence some errors
const restoreConsoleError = () => {
    const originalError = console.error;
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return;
        }
        originalError.call(console, ...args);
    });
};
