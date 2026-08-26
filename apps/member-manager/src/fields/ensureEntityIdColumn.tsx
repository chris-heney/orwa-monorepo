import React from "react";
import EntityIdField, { type EntityIdFieldProps } from "./EntityIdField";

type FieldishProps = {
  source?: string;
  reference?: string;
  render?: unknown;
  children?: React.ReactNode;
  label?: React.ReactNode;
  sortBy?: string;
};

const isIdSource = (source: unknown): boolean =>
  source === "id" || source === "entityId";

const componentName = (type: unknown): string => {
  if (typeof type === "string") return type;
  if (typeof type === "function" || (typeof type === "object" && type)) {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || "";
  }
  return "";
};

const isInputLike = (element: React.ReactElement): boolean => {
  const name = componentName(element.type);
  return /Input$/.test(name);
};

/**
 * Display-only id fields (TextField/NumberField source="id") become
 * EntityIdField. ReferenceField / FunctionField / inputs are left alone.
 */
export const shouldRemapToEntityIdField = (
  element: React.ReactElement<FieldishProps>
): boolean => {
  if (!isIdSource(element.props.source)) return false;
  if (element.props.reference) return false;
  if (typeof element.props.render === "function") return false;
  if (isInputLike(element)) return false;
  if (element.type === EntityIdField) return false;
  return true;
};

const childrenChanged = (
  original: React.ReactNode,
  remapped: React.ReactNode
): boolean => {
  const before = React.Children.toArray(original);
  const after = React.Children.toArray(remapped);
  if (before.length !== after.length) return true;
  return before.some((node, i) => node !== after[i]);
};

const remapIdFields = (children: React.ReactNode): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement<FieldishProps>(child)) return child;

    if (shouldRemapToEntityIdField(child)) {
      return (
        <EntityIdField
          {...(child.props as EntityIdFieldProps)}
          source={child.props.source === "entityId" ? "entityId" : "id"}
          sortBy={child.props.sortBy ?? "id"}
          label={
            typeof child.props.label === "string" ? child.props.label : "ID"
          }
        />
      );
    }

    if (child.props.children == null) return child;

    const remappedKids = remapIdFields(child.props.children);
    if (!childrenChanged(child.props.children, remappedKids)) return child;

    // ReferenceField requires a single child element, not Children.map's array.
    const remappedList = React.Children.toArray(remappedKids);
    const nextChildren =
      !Array.isArray(child.props.children) && remappedList.length === 1
        ? remappedList[0]
        : remappedKids;

    return React.cloneElement(child, undefined, nextChildren);
  });

/** Top-level grid columns only — nested ReferenceField `source="id"` does not count. */
const topLevelHasIdSource = (node: React.ReactNode): boolean =>
  React.Children.toArray(node).some((child) => {
    if (!React.isValidElement<FieldishProps>(child)) return false;
    if (child.type === React.Fragment) {
      return topLevelHasIdSource(child.props.children);
    }
    return isIdSource(child.props.source);
  });

/**
 * Remap existing `source="id"` display fields to show `entityId`, and prepend
 * an ID column when the grid has none. Row identity stays `record.id`.
 */
export const ensureEntityIdColumn = (
  children: React.ReactNode
): React.ReactNode => {
  const remapped = remapIdFields(children);
  if (topLevelHasIdSource(remapped)) return remapped;

  return [
    <EntityIdField key="orwa-entity-id" source="id" label="ID" sortBy="id" />,
    ...React.Children.toArray(remapped),
  ];
};
