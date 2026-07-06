# ra-ai: AI Superpowers For React-Admin

Components powered by Artificial Intelligence (AI) to boost user productivity. Suggest completion for user inputs, fix and improve large chunks of text in React-Admin forms.

<video controls autoplay playsinline muted loop>
  <source src="./assets/PredictiveTextInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live in the [Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-ai-input-predictivetextinput--context).

## Installation

```sh
npm install --save @react-admin/ra-ai
# or
yarn add @react-admin/ra-ai
```

**Tip**: `ra-ai` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

## `<PredictiveTextInput>`

An alternative to `<TextInput>` that suggests completion for the input value. Users can accept the completion by pressing the `Tab` key. It's like Intellisense or Copilot for your forms.

<video controls autoplay playsinline muted loop>
  <source src="./assets/PredictiveTextInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The actual completion is fetched from your Data Provider, based on the current record and input value, using the `dataProvider.getCompletion()` method. This allows you to use any completion API, such as [OpenAI Completion API](https://beta.openai.com/docs/api-reference/completions), [Anthropic](https://console.anthropic.com/docs/api), or your own completion model.

### Usage

Use `<PredictiveTextInput>` instead of `<TextInput>` in your forms:

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { PredictiveTextInput } from '@react-admin/ra-ai';

const PersonEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="company" />
            <PredictiveTextInput source="email" />
            <PredictiveTextInput source="website" />
            <PredictiveTextInput source="bio" multiline />
        </SimpleForm>
    </Edit>
);
```

You must define a `dataProvider.getCompletion()` method to fetch the completion suggestions from your API. This method must return a promise that resolves to a `{ data: completionString }` object.

For instance, to use the OpenAI Completion API:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addGetCompletionBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addGetCompletionBasedOnOpenAIAPI({ dataProvider: baseDataProvider }),
```

`addGetCompletionBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to add the key to the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`)

### Props

`<PredictiveTextInput>` accepts the following props:

| Prop              | Required | Type     | Default   | Description                                                                                                             |
| ----------------- | -------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `source`          | Required | string   |           | The field name in the record                                                                                            |
| `debounce`        | Optional | number   | 1000      | The debounce delay in milliseconds. The completion request will be sent only after this delay without any input change. |
| `maxSize`         | Optional | number   | undefined | The maximum completion size. Usually expressed in number of tokens.                                                     |
| `meta`            | Optional | object   | undefined | Additional parameters to pass to the completion API.                                                                    |
| `multiline`       | Optional | boolean  | false     | Set to true to use a `<TextArea>` instead of an `<Input>`                                                               |
| `locale`          | Optional | string   | 'en'      | The locale to use for the completion.                                                                                   |
| `promptGenerator` | Optional | function | undefined | A function that returns the prompt to send to the completion API.                                                       |
| `queryOptions`    | Optional | object   | undefined | Additional options to pass to the `getCompletion` query.                                                                |
| `stop`            | Optional | string[] | undefined | A list of tokens where the API should stop generating.                                                                  |
| `temperature`     | Optional | number   | undefined | Amount of randomness injected into the response.                                                                        |
| `type`            | Optional | string   | 'text'    | The type of the input. Can be 'text', 'email', etc.                                                                     |

`<PredictiveTextInput>` also accepts the [common input props](https://marmelab.com/react-admin/Inputs.html#common-input-props) except `resettable`.

### `debounce`

The debounce delay in milliseconds. The completion request will be sent only after this delay without any input change. Defaults to 1000ms.

Use a longer delay to avoid sending too many requests to the completion API. Use a shorter delay to get faster completion suggestions.

```jsx
<PredictiveTextInput source="title" debounce={1500} />
```

### `maxSize`

Defines the maximum length of the completion. When using Large Language Models, this is the maximum number of [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) in the completion. Defaults to 256.

```jsx
<PredictiveTextInput source="title" maxSize={50} />
```

### `meta`

Lets you pass additional parameters to the `getCompletion()` query.

For instance, the OpenAI implementation uses the `meta` parameter as a way to adjust the completion settings:

```jsx
<PredictiveTextInput
    source="email"
    meta={{
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }}
/>
```

### `multiline`

![PredictiveTextInput multiline](./assets/PredictiveTextInput-multiline.png)

Set to true to use a `<textarea>` instead of an `<input>`. Defaults to false.

```jsx
<PredictiveTextInput source="description" multiline />
```

By default, `<PredictiveTextInput multiline>` renders [a material-ui `<TextareaAutosize>` component](https://mui.com/base/react-textarea-autosize/components-api/#textarea-autosize), which automatically resizes the textarea to fit its content. If you want to use a regular `<textarea>` element, set the `rows` prop:

```jsx
<PredictiveTextInput source="description" multiline rows={5} />
```

### `locale`

By default, the completion uses the current use locale (or English if you don't use internationalization). But the content locale and the interface locale can be different. For instance, you may want to use French for the completion, even if the interface is in English.

That's why `<PredictiveTextInput>` accepts a `locale` prop. It defaults to 'en'.

```jsx
<PredictiveTextInput source="title" locale="fr" />
```

### `promptGenerator`

By default, `<PredictiveTextInput>` generates a prompt for the completion API based on the resource name and the record. For instance, for the following page:

```jsx
const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <PredictiveTextInput source="email" />
        </SimpleForm>
    </Edit>
);
```

With the following record:

```json
{ "firstName": "John", "lastName": "Doe" }
```

When the end users types 'john' in the email input, the prompt sent to the completion API will be:

```
The following describes one of users:
firstName:John
lastName:Doe
email:john
```

and the expected data provider response is:

```json
{ "data": ".doe@example.com" }
```

You can customize the generated prompt by passing a `promptGenerator` function. This function receives a parameter object `{ name, value, resource, record }`, and must return a string.

For instance:

```jsx
const myPromptGenerator = ({ name, value, resource, record = {} }) => {
    const cleanedRecord = lodashOmit(record, ['id', 'password', name]);
    const keyValues = Object.keys(cleanedRecord)
        .map(key => `${key}:${cleanedRecord[key]}`)
        .join('\n');
    const prompt = `
    The following describes a ${resource}:
    ${keyValues}
    ${name}:${value}`;

    return prompt;
};

<PredictiveTextInput source="email" promptGenerator={myPromptGenerator} />;
```

### `queryOptions`

`<PredictiveTextInput>` uses react-query to fetch the related record. You can set [any of `useQuery` options](https://react-query-v3.tanstack.com/reference/useQuery) via the the `queryOptions` prop.

For instance, if you want to disable the refetch on window focus for this query, you can use:

```jsx
<PredictiveTextInput
    source="email"
    queryOptions={{ refetchOnWindowFocus: false }}
/>
```

### `source`

Specifies the field of the record that the input should edit. It is required.

```jsx
<Form record={{ id: 123, title: 'Hello, world!' }}>
    <PredictiveTextInput source="title" />{' '}
    {/* default value is "Hello, world!" */}
</Form>
```

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

```jsx
{
    id: 1234,
    title: 'War and Peace',
    author: {
        firstName: 'Leo',
        lastName: 'Tolstoi'
    }
}
```

Then you can display a text input to edit the author's first name as follows:

```jsx
<PredictiveTextInput source="author.firstName" />
```

### `stop`

List of sequences that will cause the model to stop generating completion text. The default is `["\n"]`.

```jsx
<PredictiveTextInput source="title" stop={['\n', '.']} />
```

### `temperature`

Amount of randomness injected into the response. Defaults to 1. Ranges from 0 to 1. Use a temperature closer to 0 for analytical / multiple choice, and closer to 1 for creative and generative tasks.

```jsx
<PredictiveTextInput source="title" temperature={0.5} />
```

### `type`

The type of the input. Defaults to 'text'.

```jsx
<PredictiveTextInput source="email" type="email" />
```

Supported types are:

-   'email'
-   'number' (warning: the value will be an unparsed string, not a number - add your own `parse` prop)
-   'search'
-   'tel'
-   'text'
-   'url'

### Privacy

By default, `<PredictiveTextInput>` sends the entire form values to the completion API on focus and on change (with a debounce). If this is a privacy concern, you can use the `promptGenerator` prop to generate a prompt that only contains the field values you want to send to the completion API.

For instance, if you want to send only the `firstName` and `lastName` fields to the completion API, you can use:

```jsx
import lodashPick from 'lodash/pick';

const myPromptGenerator = ({ name, value, resource, record = {} }) => {
    const cleanedRecord = lodashPick(record, ['firstName', 'lastName']);
    const keyValues = Object.keys(cleanedRecord)
        .map(key => `${key}:${cleanedRecord[key]}`)
        .join('\n');
    const prompt = `
    The following describes a ${resource}:
    ${keyValues}
    ${name}:${value}`;

    return prompt;
};

<PredictiveTextInput source="email" promptGenerator={myPromptGenerator} />;
```

## `<SmartRichTextInput>`

An alternative to `<RichTextInput>` that allows users to quickly fix, improve, or complete the textarea content using an AI backend.

<video controls playsinline muted loop poster="./assets/SmartRichTextInput.png">
  <source src="./assets/SmartRichTextInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<SmartRichTextInput>` adds 4 buttons on the right side of the toolbar:

-   `<AutoCorrectButton>`: Correct the misspelled words and grammar errors
-   `<RephraseButton>`: Rephrase the selection
-   `<SummarizeButton>`: Summarize the selection
-   `<ContinueButton>`: Generate more content based on the current text

The improved text is fetched from your Data Provider, using the `dataProvider.getCompletion()` method. This allows you to use any completion API, such as [OpenAI Completion API](https://beta.openai.com/docs/api-reference/completions), [Anthropic](https://console.anthropic.com/docs/api), or your own completion model.

Note that completions don't contain any HTML formatting, so the 3 first buttons will erase the formatting of the selection.

### Usage

Use `<SmartRichTextInput>` instead of `<RichTextInput>` in a form. Use the `source` prop to specify the field name in the record that the input should allow to edit.

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { SmartRichTextInput } from '@react-admin/ra-ai';

export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <SmartRichTextInput source="body" />
        </SimpleForm>
    </Edit>
);
```

You must define a `dataProvider.getCompletion()` method to fetch the completion suggestions from your API. This method must return a promise that resolves to a `{ data: completionString }` object.

For instance, to use the OpenAI Completion API:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addGetCompletionBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addGetCompletionBasedOnOpenAIAPI({ dataProvider: baseDataProvider }),
```

`addGetCompletionBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to add the key to the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`)

### Props

`<SmartRichTextInput>` accepts the same props as `<RichTextInput>`, as well as some additional props:

| Prop              | Required | Type       | Default | Description                                                         |
| ----------------- | -------- | ---------- | ------- | ------------------------------------------------------------------- |
| `source`          | Required | `string`   | -       | The field name in the record.                                       |
| `editorOptions`   | Optional | `Object`   | -       | Options object to pass to the underlying TipTap editor.             |
| `maxSize`         | Optional | `number`   | 256     | The maximum completion size. Usually expressed in number of tokens. |
| `meta`            | Optional | `object`   | -       | Additional parameters to pass to the completion API.                |
| `mutationOptions` | Optional | `object`   | -       | Additional options to pass to the `useMutation` hook.               |
| `locale`          | Optional | `string`   | 'en'    | The locale to use for the completion.                               |
| `stop`            | Optional | `string[]` | -       | A list of tokens where the API should stop generating.              |
| `sx`              | Optional | `SxProps`  | -       | Custom styles for the component and its children                    |
| `temperature`     | Optional | `number`   | -       | Amount of randomness injected into the response.                    |
| `toolbar`         | Optional | ReactNode  | -       | The toolbar to use. If not set, the default toolbar is used.        |

`<SmartRichTextInput>` also accepts the [common input props](https://marmelab.com/react-admin/Inputs.html#common-input-props).

### `editorOptions`

You might want to add more Tiptap extensions. The `<SmartRichTextInput>` component accepts an `editorOptions` prop which is the [object passed to Tiptap Editor](https://www.tiptap.dev/guide/configuration).

If you just want to **add** extensions, don't forget to include those needed by default for our implementation. For instance, to add the [Tiptap Code Block Extension](https://tiptap.dev/api/nodes/code-block):

```jsx
import { SmartRichTextInput, DefaultEditorOptions } from '@react-admin/ra-ai';
import { CodeBlock } from '@tiptap/extension-code-block';

const editorOptions = {
    ..DefaultEditorOptions,
    extensions: [
        ...DefaultEditorOptions.extensions,
        new CodeBlock({
            HTMLAttributes: {
                class: 'ra-rich-text-code-block',
            },
        }),
    ],
};

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <SmartRichTextInput source="body" editorOptions={editorOptions} />
        </SimpleForm>
    </Edit>
);
```

### `maxSize`

Defines the maximum length of the completion. When using Large Language Models, this is the maximum number of [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) in the completion. Defaults to 256.

```jsx
<SmartRichTextInput source="bio" maxSize={500} />
```

### `meta`

Lets you pass additional parameters to the `getCompletion()` query.

For instance, the OpenAI implementation uses the `meta` parameter as a way to adjust the completion settings:

```jsx
<SmartRichTextInput
    source="body"
    meta={{
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }}
/>
```

### `mutationOptions`

`<SmartRichTextInput>` uses react-query's `useMutation`' to fetch the corrected text when users press a smart button. You can set [any of `useMutation` options](https://react-query-v3.tanstack.com/reference/useMutation) via the the `mutationOptions` prop.

For instance, if you want to disable the retry on failure for this mutation, you can use:

```jsx
<SmartRichTextInput source="body" mutationOptions={{ retry: false }} />
```

### `locale`

By default, the smart buttons use the current locale (or English if you don't use internationalization). But the interface locale and the content locale can be different. For instance, you may want to use French for the content, even if the interface is in English.

That's why `<SmartRichTextInput>` accepts a `locale` prop. It defaults to 'en'.

```jsx
<SmartRichTextInput source="body" locale="fr" />
```

### `source`

Specifies the field of the record that the input should edit. It is required.

```jsx
<Form record={{ id: 123, title: 'Hello, world!', body: '<p>Lorem Ipsum</p>' }}>
    <SmartRichTextInput source="body" />{' '}
    {/* default value is "<p>Lorem Ipsum</p>" */}
</Form>
```

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

```jsx
{
    id: 1234,
    title: 'War and Peace',
    author: {
        firstName: 'Leo',
        lastName: 'Tolstoi',
        bio: 'Leo Tolstoi is a Russian writer.'
    }
}
```

Then you can display a rich text input to edit the author's biography as follows:

```jsx
<SmartRichTextInput source="author.bio" />
```

### `stop`

List of sequences that will cause the model to stop generating completion text. The default is `["\n"]`.

```jsx
<SmartRichTextInput source="body" stop={['\n', '.']} />
```

### `sx`

The sx prop lets you style the component and its children using Material-ui's [sx syntax](https://mui.com/system/the-sx-prop/).

```jsx
<SmartRichTextInput source="body" sx={{ width: 500 }} />
```

### `temperature`

Amount of randomness injected into the response. Defaults to 1. Ranges from 0 to 1. Use a temperature closer to 0 for analytical / multiple choice, and closer to 1 for creative and generative tasks.

```jsx
<SmartRichTextInput source="body" temperature={0.5} />
```

### `toolbar`

If you want to add or remove buttons, you can use the `toolbar` prop to pass your own toolbar. You will need the `<SmartEditToolbar>` component to add the 4 AI-powered buttons.

```jsx
import {
    LevelSelect,
    FormatButtons,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    ClearButtons,
} from 'ra-input-rich-text';
import {
    SmartRichTextInput,
    SmartRichTextInputToolbar,
    SmartEditToolbar,
} from '@react-admin/ra-ai';

const MyRichTextInput = ({ size, ...props }) => (
    <SmartRichTextInput
        toolbar={
            <SmartRichTextInputToolbar size={size}>
                <LevelSelect />
                <FormatButtons />
                <ListButtons />
                <LinkButtons />
                <QuoteButtons />
                <ClearButtons />
                <SmartEditToolbar />
            </SmartRichTextInputToolbar>
        }
        label="Body"
        source="body"
        {...props}
    />
);
```

## `dataProvider.getCompletion()`

In order to use the AI-powered components, your Data Provider must expose a `getCompletion()` method to suggest a completion for a prompt.

-   input format: `{ prompt, stop, temperature, maxSize, meta }` (only the `prompt` property is required)
-   output: `Promise({ data: completionString })`

```jsx
dataProvider
    .getCompletion({ prompt: 'Lorem ipsum' })
    .then(response => console.log(response.data));
// ' dolor sit amet, consectetur adipiscing elit.'
```

It's your responsibility to implement the `dataProvider.getCompletion()` method. You can rely on an API to fetch the completion, or use a local completion model.

If you rely on the [OpenAI Completion API](https://platform.openai.com/docs/api-reference/completions), you can use the `addGetCompletionBasedOnOpenAIAPI()` helper:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addGetCompletionBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addGetCompletionBasedOnOpenAIAPI({ dataProvider: baseDataProvider }),
```

`addGetCompletionBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to store the key in the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`).

**Tip**: A more secure way of using the OpenAI API is to add a proxy route in your API backend to the OpenAI API. That way, `getCompletion` will use the same credentials as the other data provider methods, and your OpenAI API key will never transit in the browser.

If you rely on another API, you'll need to fetch it yourself.

Finally, you don't need a completion API to use `<PredictiveTextInput>` in simple cases. For example, here is an implementation that deduces an email address from the first and last name directly in the browser:

```jsx
const getCompletionLocal = async ({ prompt = '' }) => {
    const { key, value, record } = getParamsFromPrompt(prompt);
    if (key === 'email') {
        if (value) {
            if (!value.includes('@')) {
                if (record.company) {
                    return {
                        data: `@${record.company
                            .toLowerCase()
                            .replace(' ', '-')}.com`,
                    };
                } else {
                    return { data: '@gmail.com' };
                }
            } else {
                return { data: '' };
            }
        } else {
            if (record.firstName && record.lastName) {
                return {
                    data: `${record.firstName.toLowerCase()}.${record.lastName.toLowerCase()}@${
                        record.company
                            ? record.company.toLowerCase().replace(' ', '-')
                            : 'gmail'
                    }.com`,
                };
            } else {
                return { data: '' };
            }
        }
    } else {
        return { data: '' };
    }
};

const getParamsForPrompt = (prompt) => {
    // Grab individual key/values from the prompt, which looks like this:
    // The following describes a users:
    // firstName:John
    // lastName:Doe
    // email:john
    const promptLines = prompt.split('\n');
    // key and value are the last line of the prompt
    // with the previous example, key = 'email' and value = 'john'
    const [key, value] = promptLines[promptLines.length - 1].split(':');
    // params are all the other lines of the prompt except the header
    // with the previous example, params = { firstName: 'John', lastName: 'Doe' }
    const promptForParams = promptLines.slice(1, -1);
    const record = promptForParams.reduce((acc, line) => {
        const [key, value] = line.split(':');
        acc[key] = value;
        return acc;
    }, {} as any);
    return { key, value, record };
}
```
