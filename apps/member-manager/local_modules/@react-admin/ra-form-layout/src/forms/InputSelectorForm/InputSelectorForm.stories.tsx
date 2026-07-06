import { Box, Dialog } from '@mui/material';
import { createMemoryHistory } from 'history';
import fakeRestProvider from 'ra-data-fakerest';
import * as React from 'react';
import {
    Admin,
    AdminContext,
    BooleanField,
    BooleanInput,
    DataProvider,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    List,
    LocalesMenuButton,
    NullableBooleanInput,
    ReferenceField,
    ReferenceInput,
    Resource,
    SelectArrayInput,
    SelectInput,
    TextField,
    TextInput,
    TopToolbar,
    memoryStore,
    mergeTranslations,
    required,
} from 'react-admin';
import { raFormLayoutLanguageEnglish, raFormLayoutLanguageFrench } from '../..';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { BulkUpdateFormButton } from '..';
import { TextArrayField } from '../../../stories/TextArrayField';
import { InputSelectorForm } from './InputSelectorForm';

export default {
    title: 'ra-form-layout/InputSelectorForm',
    excludeStories: ['dataProvider'],
};

const customEnglishMessages = {
    resources: {
        posts: {
            fields: {
                title: 'Title',
                body: 'Body',
                published_at: 'Published at',
                is_public: 'Is public',
                tags: 'Tags',
            },
        },
    },
};

const customFrenchMessages = {
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                title: 'Titre',
                body: 'Contenu',
                published_at: 'Publié le',
                is_public: 'Public',
                tags: 'Catégories',
            },
        },
        comments: {
            name: 'Commentaire |||| Commentaires',
        },
    },
};

const getI18nProvider = () =>
    polyglotI18nProvider(
        locale =>
            locale === 'en'
                ? mergeTranslations(
                      customEnglishMessages,
                      englishMessages,
                      raFormLayoutLanguageEnglish
                  )
                : mergeTranslations(
                      customFrenchMessages,
                      frenchMessages,
                      raFormLayoutLanguageFrench
                  ),
        'en',
        [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ]
    );

export const Basic = ({
    dataProvider: dataProviderProp = dataProvider,
}: {
    dataProvider?: DataProvider;
}) => (
    <AdminContext
        dataProvider={dataProviderProp}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit resource="posts" id="1" mutationMode="pessimistic">
            <InputSelectorForm
                inputs={[
                    {
                        label: 'Title',
                        element: <TextInput source="title" />,
                    },
                    {
                        label: 'Body',
                        element: <TextInput source="body" multiline />,
                    },
                    {
                        label: 'Published at',
                        element: <DateInput source="published_at" />,
                    },
                    {
                        label: 'Is public',
                        element: <BooleanInput source="is_public" />,
                    },
                    {
                        label: 'Tags',
                        element: (
                            <SelectArrayInput
                                source="tags"
                                choices={[
                                    { id: 'react', name: 'React' },
                                    { id: 'vue', name: 'Vue' },
                                    { id: 'solid', name: 'Solid' },
                                    { id: 'programming', name: 'Programming' },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </Edit>
    </AdminContext>
);

export const InDialog = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit resource="posts" id="1" mutationMode="pessimistic">
            <Dialog
                open
                sx={{
                    '& .MuiDialog-paper': { minWidth: { md: '50%' } },
                }}
            >
                <InputSelectorForm
                    inputs={[
                        {
                            label: 'Title',
                            element: <TextInput source="title" />,
                        },
                        {
                            label: 'Body',
                            element: <TextInput source="body" multiline />,
                        },
                        {
                            label: 'Published at',
                            element: <DateInput source="published_at" />,
                        },
                        {
                            label: 'Is public',
                            element: <BooleanInput source="is_public" />,
                        },
                        {
                            label: 'Tags',
                            element: (
                                <SelectArrayInput
                                    source="tags"
                                    choices={[
                                        { id: 'react', name: 'React' },
                                        { id: 'vue', name: 'Vue' },
                                        { id: 'solid', name: 'Solid' },
                                        {
                                            id: 'programming',
                                            name: 'Programming',
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                />
            </Dialog>
        </Edit>
    </AdminContext>
);

export const Validation = ({
    dataProvider: dataProviderProp = dataProvider,
}: {
    dataProvider?: DataProvider;
}) => (
    <AdminContext
        dataProvider={dataProviderProp}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit resource="posts" id="1" mutationMode="pessimistic">
            <InputSelectorForm
                inputs={[
                    {
                        label: 'Title',
                        element: (
                            <TextInput source="title" validate={required()} />
                        ),
                    },
                    {
                        label: 'Body',
                        element: (
                            <TextInput
                                source="body"
                                multiline
                                validate={required()}
                            />
                        ),
                    },
                    {
                        label: 'Published at',
                        element: (
                            <DateInput
                                source="published_at"
                                validate={required()}
                            />
                        ),
                    },
                    {
                        label: 'Is public',
                        element: (
                            <NullableBooleanInput
                                source="is_public"
                                validate={required()}
                            />
                        ),
                    },
                    {
                        label: 'Tags',
                        element: (
                            <SelectArrayInput
                                source="tags"
                                choices={[
                                    { id: 'react', name: 'React' },
                                    { id: 'vue', name: 'Vue' },
                                    { id: 'solid', name: 'Solid' },
                                    { id: 'programming', name: 'Programming' },
                                ]}
                                validate={required()}
                            />
                        ),
                    },
                ]}
            />
        </Edit>
    </AdminContext>
);

export const I18N = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit
            resource="posts"
            id="1"
            mutationMode="pessimistic"
            actions={
                <TopToolbar>
                    <LocalesMenuButton />
                    <Box sx={{ flex: 1 }} />
                </TopToolbar>
            }
        >
            <InputSelectorForm
                inputs={[
                    {
                        label: 'resources.posts.fields.title',
                        element: <TextInput source="title" />,
                    },
                    {
                        label: 'resources.posts.fields.body',
                        element: <TextInput source="body" multiline />,
                    },
                    {
                        label: 'resources.posts.fields.published_at',
                        element: <DateInput source="published_at" />,
                    },
                    {
                        label: 'resources.posts.fields.is_public',
                        element: <BooleanInput source="is_public" />,
                    },
                    {
                        label: 'resources.posts.fields.tags',
                        element: (
                            <SelectArrayInput
                                source="tags"
                                choices={[
                                    { id: 'react', name: 'React' },
                                    { id: 'vue', name: 'Vue' },
                                    { id: 'solid', name: 'Solid' },
                                    { id: 'programming', name: 'Programming' },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </Edit>
    </AdminContext>
);

export const NumerousInputs = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit resource="posts" id="1" mutationMode="pessimistic">
            <InputSelectorForm
                inputs={Array.from(Array(20).keys()).map(index => ({
                    label: `Field ${index}`,
                    element: <TextInput source={`field-${index}`} />,
                }))}
            />
        </Edit>
    </AdminContext>
);

export const NumerousInputsInDialog = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={getI18nProvider()}
        store={memoryStore({})}
        history={createMemoryHistory()}
    >
        <Edit resource="posts" id="1" mutationMode="pessimistic">
            <Dialog
                open
                sx={{
                    '& .MuiDialog-paper': { minWidth: { md: '50%' } },
                }}
            >
                <InputSelectorForm
                    inputs={Array.from(Array(20).keys()).map(index => ({
                        label: `Field ${index}`,
                        element: <TextInput source={`field-${index}`} />,
                    }))}
                />
            </Dialog>
        </Edit>
    </AdminContext>
);

export const InBulkUpdateFormButton = ({
    dataProvider: dataProviderProp = dataProvider,
}: {
    dataProvider?: DataProvider;
}) => {
    const history = createMemoryHistory();
    return (
        <Admin
            dataProvider={dataProviderProp}
            i18nProvider={getI18nProvider()}
            history={history}
            store={memoryStore({})}
        >
            <Resource
                name="posts"
                list={PostList}
                recordRepresentation={record => record.title}
            />
            <Resource name="comments" list={CommentList} />
        </Admin>
    );
};

const PostBulkUpdateFormButton = () => (
    <BulkUpdateFormButton>
        <InputSelectorForm
            inputs={[
                {
                    label: 'Published at',
                    element: <DateInput source="published_at" />,
                },
                {
                    label: 'Is public',
                    element: <BooleanInput source="is_public" />,
                },
            ]}
        />
    </BulkUpdateFormButton>
);

const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkUpdateFormButton />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
            <TextArrayField source="tags" />
        </Datagrid>
    </List>
);

const CommentBulkUpdateFormButton = () => (
    <BulkUpdateFormButton>
        <InputSelectorForm
            inputs={[
                {
                    label: 'Post',
                    element: (
                        <ReferenceInput source="post_id" reference="posts">
                            <SelectInput />
                        </ReferenceInput>
                    ),
                },
                {
                    label: 'Author',
                    element: <TextInput source="author.name" />,
                },
            ]}
        />
    </BulkUpdateFormButton>
);

const CommentList = () => (
    <List>
        <Datagrid bulkActionButtons={<CommentBulkUpdateFormButton />}>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" />
        </Datagrid>
    </List>
);

const addDelay = (dataProvider: DataProvider, delay = 300) =>
    new Proxy(dataProvider, {
        get: (target, name) => (resource: string, params: any) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return new Promise(resolve =>
                setTimeout(
                    () => resolve(dataProvider[name](resource, params)),
                    delay
                )
            );
        },
    });

export const dataProvider = addDelay(
    fakeRestProvider(
        {
            posts: [
                {
                    id: 1,
                    title: 'Accusantium qui nihil voluptatum quia voluptas maxime ab similique',
                    body: 'In facilis aut aut odit hic doloribus. Fugit possimus perspiciatis sit molestias in. Sunt dignissimos sed quis at vitae veniam amet. Sint sunt perspiciatis quis doloribus aperiam numquam consequatur et. Blanditiis aut earum incidunt eos magnam et voluptatem. Minima iure voluptatum autem. At eaque sit aperiam minima aut in illum.',
                    published_at: new Date('2012-08-06').toISOString(),
                    is_public: false,
                    tags: ['react', 'programming'],
                },
                {
                    id: 2,
                    title: 'Sint dignissimos in architecto aut',
                    body: 'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
                    published_at: new Date('2012-08-08').toISOString(),
                    is_public: true,
                    tags: ['react', 'programming'],
                },
                {
                    id: 3,
                    title: 'Perspiciatis adipisci vero qui ipsam iure porro',
                    body: 'Ut ad consequatur esse illum. Ex dolore porro et ut sit. Commodi qui sed et voluptatibus laudantium.',
                    published_at: new Date('2012-08-08').toISOString(),
                    is_public: true,
                    tags: ['react', 'programming'],
                },
                {
                    id: 4,
                    title: 'Maiores et itaque aut perspiciatis',
                    body: 'Et quo voluptas odit veniam omnis dolores. Odit commodi consequuntur necessitatibus dolorem officia. Reiciendis quas exercitationem libero sed. Itaque non facilis sit tempore aut doloribus.',
                    published_at: new Date('2012-08-12').toISOString(),
                    is_public: false,
                    tags: ['react', 'programming'],
                },
                {
                    id: 5,
                    title: 'Sed quo et et fugiat modi',
                    body: 'Consequuntur id aut soluta aspernatur sit. Aut doloremque recusandae sit saepe ut quas earum. Quae pariatur iure et ducimus non. Cupiditate dolorem itaque in sit.',
                    published_at: new Date('2012-08-05').toISOString(),
                    is_public: true,
                    tags: ['react', 'programming'],
                },
                {
                    id: 6,
                    title: 'Minima ea vero omnis odit officiis aut',
                    body: 'Omnis rerum voluptatem illum. Amet totam minus id qui aspernatur. Adipisci commodi velit sapiente architecto et molestias. Maiores doloribus quis occaecati quidem laborum. Quae quia quaerat est itaque. Vero assumenda quia tempora libero dicta quis asperiores magnam. Necessitatibus accusantium saepe commodi ut.',
                    published_at: new Date('2012-09-05').toISOString(),
                    is_public: false,
                    tags: ['react', 'programming'],
                },
                {
                    id: 7,
                    title: 'Illum veritatis corrupti exercitationem sed velit',
                    body: 'Omnis hic quo aperiam fugiat iure amet est. Molestias ratione aut et dolor earum magnam placeat. Ad a quam ea amet hic omnis rerum.',
                    published_at: new Date('2012-09-29').toISOString(),
                    is_public: true,
                    tags: ['vue', 'programming'],
                },
                {
                    id: 8,
                    title: 'Culpa possimus quibusdam nostrum enim tempore rerum odit excepturi',
                    body: 'Qui quos exercitationem itaque quia. Repellat libero ut recusandae quidem repudiandae ipsam laudantium. Eveniet quos et quo omnis aut commodi incidunt.',
                    published_at: new Date('2012-10-02').toISOString(),
                    is_public: true,
                    tags: ['react', 'programming'],
                },
                {
                    id: 9,
                    title: 'A voluptas eius eveniet ut commodi dolor',
                    body: 'Sed necessitatibus nesciunt nesciunt aut non sunt. Quam ut in a sed ducimus eos qui sint. Commodi illo necessitatibus sint explicabo maiores. Maxime voluptates sit distinctio quo excepturi. Qui aliquid debitis repellendus distinctio et aut. Ex debitis et quasi id.',
                    published_at: new Date('2012-10-16').toISOString(),
                    is_public: false,
                    tags: ['solid', 'programming'],
                },
                {
                    id: 10,
                    title: 'Totam vel quasi a odio et nihil',
                    body: 'Excepturi veritatis velit rerum nemo voluptatem illum tempora eos. Et impedit sed qui et iusto. A alias asperiores quia quo.',
                    published_at: new Date('2012-10-19').toISOString(),
                    is_public: true,
                    tags: ['vue', 'programming'],
                },
                {
                    id: 11,
                    title: 'Omnis voluptate enim similique est possimus',
                    body: 'Velit eos vero reprehenderit ut assumenda saepe qui. Quasi aut laboriosam quas voluptate voluptatem. Et eos officia repudiandae quaerat. Mollitia libero numquam laborum eos.',
                    published_at: new Date('2012-10-22').toISOString(),
                    is_public: false,
                    tags: ['solid', 'programming'],
                },
                {
                    id: 12,
                    title: 'Qui tempore rerum et voluptates',
                    body: 'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.',
                    published_at: new Date('2012-11-07').toISOString(),
                    is_public: true,
                    tags: ['solid', 'programming'],
                },
                {
                    id: 13,
                    title: 'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi',
                    body: 'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
                    published_at: new Date('2012-12-01').toISOString(),
                    is_public: true,
                    tags: ['solid', 'programming'],
                },
            ],
            comments: [
                {
                    id: 1,
                    author: {},
                    post_id: 6,
                    body: "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
                    created_at: new Date('2012-08-02').toISOString(),
                },
                {
                    id: 2,
                    author: {
                        name: 'Kiley Pouros',
                        email: 'kiley@gmail.com',
                    },
                    post_id: 9,
                    body: "White Rabbit: it was indeed: she was out of the ground--and I should frighten them out of its right paw round, 'lives a March Hare. 'Sixteenth,'.",
                    created_at: new Date('2012-08-08').toISOString(),
                },
                {
                    id: 3,
                    author: {
                        name: 'Justina Hegmann',
                    },
                    post_id: 3,
                    body: "I'm not Ada,' she said, 'and see whether it's marked \"poison\" or.",
                    created_at: new Date('2012-08-02').toISOString(),
                },
                {
                    id: 4,
                    author: {
                        name: 'Ms. Brionna Smitham MD',
                    },
                    post_id: 6,
                    body: "Dormouse. 'Fourteenth of March, I think I can say.' This was such a noise inside, no one else seemed inclined.",
                    created_at: new Date('2014-09-24').toISOString(),
                },
                {
                    id: 5,
                    author: {
                        name: 'Edmond Schulist',
                    },
                    post_id: 1,
                    body: "I ought to tell me your history, you know,' the Hatter and the happy summer days. THE.",
                    created_at: new Date('2012-08-07').toISOString(),
                },
                {
                    id: 6,
                    author: {
                        name: 'Danny Greenholt',
                    },
                    post_id: 6,
                    body: 'Duchess asked, with another hedgehog, which seemed to be lost: away went Alice after it, never once considering how in the other. In the very tones of.',
                    created_at: new Date('2012-08-09').toISOString(),
                },
                {
                    id: 7,
                    author: {
                        name: 'Luciano Berge',
                    },
                    post_id: 5,
                    body: "While the Panther were sharing a pie--' [later editions continued as follows.",
                    created_at: new Date('2012-09-06').toISOString(),
                },
                {
                    id: 8,
                    author: {
                        name: 'Annamarie Mayer',
                    },
                    post_id: 5,
                    body: "I tell you, you coward!' and at once and put it more clearly,' Alice.",
                    created_at: new Date('2012-10-03').toISOString(),
                },
                {
                    id: 9,
                    author: {
                        name: 'Breanna Gibson',
                    },
                    post_id: 2,
                    body: "THAT. Then again--\"BEFORE SHE HAD THIS FIT--\" you never tasted an egg!' 'I HAVE tasted eggs, certainly,' said Alice, as she spoke. Alice did not like to have it.",
                    created_at: new Date('2012-11-06').toISOString(),
                },
                {
                    id: 10,
                    author: {
                        name: 'Logan Schowalter',
                    },
                    post_id: 3,
                    body: "I'd been the whiting,' said the Hatter, it woke up again with a T!' said the Gryphon. '--you advance twice--' 'Each with a growl, And concluded the banquet--] 'What IS the fun?' said.",
                    created_at: new Date('2012-12-07').toISOString(),
                },
                {
                    id: 11,
                    author: {
                        name: 'Logan Schowalter',
                    },
                    post_id: 1,
                    body: "I don't want to be?' it asked. 'Oh, I'm not Ada,' she said, 'and see whether it's marked \"poison\" or not'; for she had asked it aloud; and in despair she put her hand on the end of the.",
                    created_at: new Date('2012-08-05').toISOString(),
                },
            ],
        },
        process.env.NODE_ENV !== 'test'
    )
);
