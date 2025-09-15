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

export interface IResourcePermission {
  resource: TResource
  action: TResourceAction[]
}

export type IResourcePermissionDb = {
  [key in TRole]: IResourcePermission[]
}

const ResourcePermissions: IResourcePermissionDb = {
  'Admin': [{ resource: '*', action: ['*'] }],
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
      return c.action.includes('*') || c.action.includes(action) && c.resource === resource
    })
  }
}
