import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { createMemoryHistory } from 'history';
import fakeRestProvider from 'ra-data-fakerest';
import * as React from 'react';
import {
    Admin,
    BooleanField,
    BooleanInput,
    DataProvider,
    Datagrid,
    DateField,
    DateInput,
    EditGuesser,
    List,
    NullableBooleanInput,
    ReferenceField,
    ReferenceInput,
    Resource,
    SelectInput,
    SimpleForm,
    TabbedForm,
    TextField,
    TextInput,
    memoryStore,
    mergeTranslations,
    required,
    useNotify,
    useRefresh,
} from 'react-admin';
import { raFormLayoutLanguageEnglish, raFormLayoutLanguageFrench } from '../..';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { TextArrayField } from '../../../stories/TextArrayField';
import {
    BulkUpdateFormButton,
    BulkUpdateFormButtonProps,
} from './BulkUpdateFormButton';

export default {
    title: 'ra-form-layout/BulkUpdateFormButton',
    excludeStories: ['dataProvider'],
};

const customFrenchMessages = {
    resources: {
        posts: {
            name: 'Article |||| Articles',
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
    mutationMode,
    meta,
    dataProvider: dataProviderProp = dataProvider,
}: {
    mutationMode?: BulkUpdateFormButtonProps['mutationMode'];
    meta?: any;
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
                list={getPostList({ mutationMode, meta })}
                recordRepresentation={record => record.title}
            />
            <Resource
                name="comments"
                list={getCommentList({ mutationMode, meta })}
            />
        </Admin>
    );
};
Basic.argTypes = {
    mutationMode: {
        options: [undefined, 'undoable', 'pessimistic', 'optimistic'],
        control: { type: 'inline-radio' },
    },
    meta: {
        control: 'object',
    },
};

const PostBulkUpdateFormButton = ({
    mutationMode,
    meta,
}: {
    mutationMode: BulkUpdateFormButtonProps['mutationMode'];
    meta: any;
}) => (
    <BulkUpdateFormButton
        mutationMode={mutationMode}
        mutationOptions={{ meta }}
    >
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const getPostList = ({
    mutationMode,
    meta,
}: {
    mutationMode: BulkUpdateFormButtonProps['mutationMode'];
    meta: any;
}) => {
    const PostList = () => (
        <List>
            <Datagrid
                bulkActionButtons={
                    <PostBulkUpdateFormButton
                        mutationMode={mutationMode}
                        meta={meta}
                    />
                }
            >
                <TextField source="id" />
                <TextField source="title" />
                <DateField source="published_at" />
                <BooleanField source="is_public" />
                <TextArrayField source="tags" />
            </Datagrid>
        </List>
    );
    return PostList;
};

const CommentBulkUpdateFormButton = ({
    mutationMode,
    meta,
}: {
    mutationMode: BulkUpdateFormButtonProps['mutationMode'];
    meta: any;
}) => (
    <BulkUpdateFormButton
        mutationMode={mutationMode}
        mutationOptions={{ meta }}
    >
        <SimpleForm>
            <ReferenceInput source="post_id" reference="posts">
                <SelectInput fullWidth />
            </ReferenceInput>
            <TextInput source="author.name" />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const getCommentList = ({
    mutationMode,
    meta,
}: {
    mutationMode: BulkUpdateFormButtonProps['mutationMode'];
    meta: any;
}) => {
    const CommentList = () => (
        <List>
            <Datagrid
                bulkActionButtons={
                    <CommentBulkUpdateFormButton
                        mutationMode={mutationMode}
                        meta={meta}
                    />
                }
            >
                <TextField source="id" />
                <ReferenceField source="post_id" reference="posts">
                    <TextField source="title" />
                </ReferenceField>
                <TextField source="author.name" />
            </Datagrid>
        </List>
    );
    return CommentList;
};

export const WithDialogProps = () => {
    const history = createMemoryHistory();
    return (
        <Admin
            dataProvider={dataProvider}
            i18nProvider={getI18nProvider()}
            history={history}
            store={memoryStore({})}
        >
            <Resource
                name="posts"
                list={PostListWithDialogProps}
                recordRepresentation={record => record.title}
            />
        </Admin>
    );
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const PostBulkUpdateFormButtonWithTransition = () => (
    <BulkUpdateFormButton DialogProps={{ TransitionComponent: Transition }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const PostListWithDialogProps = () => (
    <List>
        <Datagrid
            bulkActionButtons={<PostBulkUpdateFormButtonWithTransition />}
        >
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
            <TextArrayField source="tags" />
        </Datagrid>
    </List>
);

export const Validation = ({
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
                list={PostListWithValidation}
                recordRepresentation={record => record.title}
            />
        </Admin>
    );
};

const PostBulkUpdateFormButtonWithValidation = () => (
    <BulkUpdateFormButton DialogProps={{ TransitionComponent: Transition }}>
        <SimpleForm>
            <DateInput source="published_at" validate={required()} />
            <NullableBooleanInput source="is_public" validate={required()} />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const PostListWithValidation = () => (
    <List>
        <Datagrid
            bulkActionButtons={<PostBulkUpdateFormButtonWithValidation />}
        >
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
            <TextArrayField source="tags" />
        </Datagrid>
    </List>
);

export const WithTabbedForm = ({
    dataProvider: dataProviderProp = dataProvider,
}: {
    dataProvider?: DataProvider;
}) => {
    return (
        <Admin
            dataProvider={dataProviderProp}
            i18nProvider={getI18nProvider()}
            store={memoryStore({})}
        >
            <Resource
                name="posts"
                list={PostListWithTabbedForm}
                recordRepresentation={record => record.title}
                edit={EditGuesser}
            />
        </Admin>
    );
};

const PostBulkUpdateFormButtonWithTabbedForm = () => (
    <BulkUpdateFormButton>
        <TabbedForm syncWithLocation={false}>
            <TabbedForm.Tab label="Publication">
                <DateInput source="published_at" validate={required()} />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Visibility">
                <NullableBooleanInput
                    source="is_public"
                    validate={required()}
                />
            </TabbedForm.Tab>
        </TabbedForm>
    </BulkUpdateFormButton>
);

const PostListWithTabbedForm = () => (
    <List>
        <Datagrid
            bulkActionButtons={<PostBulkUpdateFormButtonWithTabbedForm />}
            rowClick="edit"
        >
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
            <TextArrayField source="tags" />
        </Datagrid>
    </List>
);

export const OnSuccess = ({
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
                list={PostListWithOnSuccess}
                recordRepresentation={record => record.title}
            />
        </Admin>
    );
};

const PostBulkUpdateFormButtonWithOnSuccess = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const onSuccess = React.useCallback(() => {
        notify('Custom success message!');
        refresh();
    }, [notify, refresh]);
    return (
        <BulkUpdateFormButton onSuccess={onSuccess}>
            <SimpleForm>
                <DateInput source="published_at" />
                <BooleanInput source="is_public" />
            </SimpleForm>
        </BulkUpdateFormButton>
    );
};

const PostListWithOnSuccess = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkUpdateFormButtonWithOnSuccess />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
            <TextArrayField source="tags" />
        </Datagrid>
    </List>
);

export const dataProvider = fakeRestProvider(
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
);
