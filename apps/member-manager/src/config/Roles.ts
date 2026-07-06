import { guestRole } from "./guestRole"

/**
 * @notes
 * Administrator is the only one with delete capabilities, peroid.
 * Office Admin can edit everything except for training
 * Field Staff can create training
 * Trianing Manager can send to DEQ and post to website
 */
export type TRole = 
    'Admin'   // Relevant
    | 'Staff'
    | 'Guest' // Relevant


export type TCapability = '*'

export type TResourceAction = '*'
  | 'create'
  | 'read'
  | 'export'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'submit'
  | 'view'
  | 'viewAll'
  | 'viewOwn'

export type TResource = '*'
  | 'associates'
  | 'contacts'
  | 'assets'
  | 'training-logs'
  | 'events-contestant-rosters'
  | 'events-fall-conference-booth-rosters'
  | 'events-fall-conference-attendee-rosters'
  | 'events-annual-conference-booth-rosters'
  | 'events-annual-conference-attendee-rosters'
  | 'events-expo-conference-booth-rosters'
  | 'events-expo-conference-attendee-rosters'
  | 'staff'
  | 'training-events'
  | 'training-logs'
  | 'users'
  | 'watersystems'
  | 'membership-items'
  | 'memberships'
  | 'invoices'
  | 'upload/files'
  | 'shared.field-metas'
  | 'components_shared_field_metas'
  | 'upload'
  | 'saved-queries'

export interface IResourcePermission {
  resource: TResource
  action: TResourceAction[]
}

export type IResourcePermissionDb = {
  [key in TRole]: IResourcePermission[]
}

const ResourcePermissions: IResourcePermissionDb = {
  'Admin': [{ resource: '*', action: ['*'] }],
  'Staff': [
    { resource: 'watersystems', action: ['read', 'export'] },
    { resource: 'associates', action: ['read', 'export'] },
    { resource: 'memberships', action: ['read'] },
    { resource: 'upload/files', action: ['read'] },
    { resource: 'shared.field-metas', action: ['read'] },
    { resource: 'components_shared_field_metas', action: ['read'] },
    { resource: 'upload', action: ['read'] },
    { resource: 'saved-queries', action: ['read'] },
  ],
  ...guestRole
}

export default class RoleController {
  private _role: string
  private _permissions: IResourcePermission[]
  private _capabilities: TCapability[]

  constructor(role: TRole) {
    this._role = role
    // @TODO: In the future, we may want to add custom capabilities to roles
    this._capabilities = [] 
    this._permissions = role in ResourcePermissions
      ? ResourcePermissions[role]
      : []
  }

  public get role() {
    return this._role
  }

  public get permissions() {
    return this._permissions
  }

  public hasPermissionTo(action: TResourceAction, resource: TResource) {
    return this._permissions.some((c) => {
      const canPerformAction = c.action.includes('*') || c.action.includes(action)
      const canAccessResource = c.resource === '*' || c.resource === resource

      return canPerformAction && canAccessResource
    })
  }
}
