import React from "react";
import { describe, expect, it } from "vitest";
import {
  ensureEntityIdColumn,
  shouldRemapToEntityIdField,
} from "./ensureEntityIdColumn";
import EntityIdField from "./EntityIdField";

const TextField = (props: { source?: string; label?: string }) => (
  <span>{props.source}</span>
);
TextField.displayName = "TextField";

const NumberField = (props: { source?: string; label?: string }) => (
  <span>{props.source}</span>
);
NumberField.displayName = "NumberField";

const ReferenceField = (props: {
  source?: string;
  reference?: string;
  children?: React.ReactNode;
}) => <div>{props.children}</div>;
ReferenceField.displayName = "ReferenceField";

const FunctionField = (props: {
  source?: string;
  render?: (record: unknown) => React.ReactNode;
}) => <span>{props.source}</span>;
FunctionField.displayName = "FunctionField";

const NumberInput = (props: { source?: string }) => <input />;
NumberInput.displayName = "NumberInput";

describe("shouldRemapToEntityIdField", () => {
  it("remaps TextField/NumberField source=id", () => {
    expect(
      shouldRemapToEntityIdField(<TextField source="id" label="ID" />)
    ).toBe(true);
    expect(shouldRemapToEntityIdField(<NumberField source="id" />)).toBe(true);
  });

  it("leaves relation, function, and input fields alone", () => {
    expect(
      shouldRemapToEntityIdField(
        <ReferenceField source="id" reference="assets" />
      )
    ).toBe(false);
    expect(
      shouldRemapToEntityIdField(
        <FunctionField source="id" render={() => "x"} />
      )
    ).toBe(false);
    expect(shouldRemapToEntityIdField(<NumberInput source="id" />)).toBe(false);
  });
});

describe("ensureEntityIdColumn", () => {
  it("prepends EntityIdField when no id column exists", () => {
    const result = ensureEntityIdColumn(<TextField source="name" />);
    const list = React.Children.toArray(result);
    expect(list).toHaveLength(2);
    const first = list[0] as React.ReactElement<{ source?: string; label?: string }>;
    expect(first.type).toBe(EntityIdField);
    expect(first.props.source).toBe("id");
    expect(first.props.label).toBe("ID");
  });

  it("replaces an existing source=id display field instead of adding a second", () => {
    const result = ensureEntityIdColumn(
      <>
        <TextField source="id" label="Asset ID" />
        <TextField source="name" />
      </>
    );
    const list = React.Children.toArray(result);
    const fields = list.flatMap((node) => {
      if (!React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return [node];
      }
      if (node.type === React.Fragment) {
        return React.Children.toArray(node.props.children);
      }
      return [node];
    });
    const idFields = fields.filter(
      (node) =>
        React.isValidElement<{ source?: string }>(node) &&
        (node.props.source === "id" || node.type === EntityIdField)
    );
    expect(idFields).toHaveLength(1);
    const idField = idFields[0] as React.ReactElement<{ label?: string }>;
    expect(idField.type).toBe(EntityIdField);
    expect(idField.props.label).toBe("Asset ID");
  });

  it("does not wrap a ReferenceField name child as an array", () => {
    const name = <TextField source="name" />;
    const result = ensureEntityIdColumn(
      <ReferenceField source="conference_ticket" reference="conference-tickets">
        {name}
      </ReferenceField>
    );
    const list = React.Children.toArray(result);
    const ref = list.find(
      (node) => React.isValidElement(node) && node.type === ReferenceField
    ) as React.ReactElement<{ children?: React.ReactNode }>;
    expect(Array.isArray(ref.props.children)).toBe(false);
    expect(React.isValidElement(ref.props.children)).toBe(true);
    expect(
      (ref.props.children as React.ReactElement<{ source?: string }>).props
        .source
    ).toBe("name");
  });

  it("remaps nested TextField source=id inside ReferenceField", () => {
    const result = ensureEntityIdColumn(
      <ReferenceField source="block" reference="training-schedule-blocks">
        <TextField source="id" />
      </ReferenceField>
    );
    const list = React.Children.toArray(result);
    // Injected top-level ID + the ReferenceField
    expect(list.length).toBeGreaterThanOrEqual(2);
    const ref = list.find(
      (node) => React.isValidElement(node) && node.type === ReferenceField
    ) as React.ReactElement<{ children?: React.ReactNode }>;
    const nested = React.Children.toArray(ref.props.children);
    expect((nested[0] as React.ReactElement).type).toBe(EntityIdField);
  });
});
