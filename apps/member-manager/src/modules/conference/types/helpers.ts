import React from 'react'
import {  NotificationOptions, NotificationType, UpdateMutationFunction } from 'react-admin'

export type UseNotifyFunction = (
    message: string | React.ReactNode,
    options?: NotificationOptions & { type?: NotificationType }
  ) => void

export type UseRemove = (key?: string | undefined) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseUpdate = UpdateMutationFunction<any, boolean, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCreate = UpdateMutationFunction<any, boolean, unknown>