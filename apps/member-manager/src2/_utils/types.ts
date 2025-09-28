import { NotificationType } from "react-admin";
import { UpdateMutationFunction } from "react-admin";

export type UseNotifyFunction = (
    message: string | React.ReactNode,
    options?: NotificationOptions & { type?: NotificationType }
) => void;

export type UseRemove = (key?: string | undefined) => void;
export type UseUpdate = UpdateMutationFunction<any, boolean, unknown>;
export type UseCreate = UpdateMutationFunction<any, boolean, unknown>;