import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiActivityRelationActivityRelation
  extends Struct.CollectionTypeSchema {
  collectionName: 'activity_relations';
  info: {
    description: '';
    displayName: 'Activity Relation';
    pluralName: 'activity-relations';
    singularName: 'activity-relation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activity: Schema.Attribute.Relation<'oneToOne', 'api::activity.activity'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entity: Schema.Attribute.String;
    entity_id: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::activity-relation.activity-relation'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiActivityActivity extends Struct.CollectionTypeSchema {
  collectionName: 'activities';
  info: {
    description: '';
    displayName: 'Activity';
    pluralName: 'activities';
    singularName: 'activity';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::activity.activity'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAleinAlein extends Struct.CollectionTypeSchema {
  collectionName: 'aleins';
  info: {
    displayName: 'alein';
    pluralName: 'aleins';
    singularName: 'alein';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::alein.alein'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAssetAsset extends Struct.CollectionTypeSchema {
  collectionName: 'assets';
  info: {
    description: '';
    displayName: 'Asset';
    pluralName: 'assets';
    singularName: 'asset';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_to: Schema.Attribute.Relation<
      'manyToOne',
      'api::staff-member.staff-member'
    >;
    category: Schema.Attribute.Enumeration<
      [
        'Camera',
        'Camera Drone',
        'Camera Video',
        'Copier',
        'Display Monitor',
        'Display Projector',
        'Display Projector Screen',
        'Display Television',
        'Display Wifi Module',
        'Equipment Drone',
        'Equipment Measurement',
        'Equipment Test',
        'Network Hardware',
        'PC Desktop',
        'PC Embedded',
        'PC Group Tote',
        'PC Laptop',
        'PC Tablet',
        'PC Workstation',
        'Phone Hotspot',
        'Phone KSU Hardware',
        'Phone Smart',
        'Printer',
        'Printer AIO',
        'Printer Fax',
        'Printer LGF',
        'Printer Mobile',
        'Printer Postage',
        'Printer Tag',
        'Security Hardware',
        'Signage Conference',
        'Signage State Event',
        'Software Management',
        'Software OS',
        'Software Productivity',
        'Tool',
        'Tool Fixed',
        'Tool Set',
        'Vehicle Gator',
        'Vehicle Mower',
        'Vehicle Trailer',
        'Vehicle Truck',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    fair_market_value: Schema.Attribute.Decimal;
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::asset.asset'> &
      Schema.Attribute.Private;
    location: Schema.Attribute.Enumeration<
      [
        'Boardroom',
        'Building 3',
        'Storage Closet - Floor 1',
        'Storage Closet - Floor 2',
        'Floor 1',
        'Floor 2',
        'Floor 3',
        'Mobile',
        'Vault - Floor 1',
        'Vault - Floor 2',
        'Warehouse 1',
        'Warehouse 2',
      ]
    >;
    make: Schema.Attribute.String;
    model: Schema.Attribute.String;
    name: Schema.Attribute.String;
    organization: Schema.Attribute.Enumeration<['ORWA', 'ORWAAG']>;
    publishedAt: Schema.Attribute.DateTime;
    serial_number: Schema.Attribute.String;
    sub_assets: Schema.Attribute.Relation<'oneToMany', 'api::asset.asset'>;
    tangible: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAssociateAssociate extends Struct.CollectionTypeSchema {
  collectionName: 'associates';
  info: {
    description: '';
    displayName: 'Associate';
    pluralName: 'associates';
    singularName: 'associate';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address_city: Schema.Attribute.String;
    address_state: Schema.Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]
    >;
    address_street: Schema.Attribute.String;
    address_zip: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    application_date: Schema.Attribute.Date;
    category: Schema.Attribute.Enumeration<
      [
        'Accountant',
        'Attorneys Bond Counsel',
        'Automated Controls',
        'Automatic Flushing',
        'Automatic Meter Reading',
        'Automotive Dealer',
        'CNG',
        'Car Dealership',
        'Commercial',
        'Communications',
        'Community Service',
        'Computers and Software',
        'Construction',
        'Consulting Service',
        'Control Valve Sales and Service',
        'Damage Prevention',
        'Distributor',
        'Electric Motor and Pump Repair',
        'Electronic Fusion',
        'Engineer',
        'Environmental Service',
        'Equipment Service Rental and Sales',
        'Financial Service',
        'Flow Meters',
        'GIS',
        'GPS Mapping and Survey Equipment',
        'Geophysical Water Well Logging',
        'Government Accounting Software',
        'Health Care',
        'Insurance',
        'Lagoon Cleanouts',
        'Landscape and Lawn Care',
        'Manufacturer',
        'Manufactures Rep',
        'Mechanical/Plumbing and Maintenance',
        'Meter and Automation',
        'Meters and Meter Reading Equipment',
        'Motor Carriers',
        'Motor and Pump Repair',
        'Municipal Services',
        'Non-Destructive Testing',
        'Oil Field Construction',
        'Oilfield Flowback Services',
        'Oilfield Service Company',
        'Other',
        'Painting and Coatings',
        'Print and Mail Services',
        'Pumps',
        'Rail Car Maintenance and Repair',
        'Ranching',
        'Residential and Industrial',
        'Roofing',
        'SCADA/Telemetry',
        'Sales Representative',
        'Sales Representatives',
        'Sanitary Sewer Evaluation Services',
        'Software and Supplies',
        'Storage Tanks',
        'Suppliers',
        'Tank Inspection',
        'Tank Maintenance',
        'Training',
        'Truck Equipment',
        'Valves',
        'Vehicles',
        'Water Analysis',
        'Water Metering',
        'Water Meters',
        'Water Operator Training',
        'Water Tanks',
        'Water Treatment',
        'Water Well Drilling and Pump Installation',
        'Website Provider',
        'Welding/Fabrication',
      ]
    >;
    contact_primary: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact.contact'
    >;
    contact_secondary: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact.contact'
    >;
    contacts: Schema.Attribute.Relation<'oneToMany', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directory_mailed: Schema.Attribute.Boolean;
    directory_sent_date: Schema.Attribute.Date;
    email: Schema.Attribute.Email;
    fee_apprenticeship: Schema.Attribute.Decimal;
    fee_membership: Schema.Attribute.Decimal;
    fee_scholarship: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::associate.associate'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    mailing_address_city: Schema.Attribute.String;
    mailing_address_state: Schema.Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]
    >;
    mailing_address_street: Schema.Attribute.String;
    mailing_address_zip: Schema.Attribute.String;
    member_level: Schema.Attribute.Enumeration<
      ['None', 'Basic', 'Bronze', 'Silver', 'Gold', 'Platinum']
    >;
    membership: Schema.Attribute.Relation<
      'manyToOne',
      'api::membership.membership'
    >;
    membership_directory_type: Schema.Attribute.Enumeration<
      ['Digital', 'Mail', 'Both', 'None']
    >;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    payment_amount: Schema.Attribute.Decimal;
    payment_details: Schema.Attribute.Text;
    payment_last_date: Schema.Attribute.Date;
    payment_method: Schema.Attribute.Enumeration<['Card', 'eCheck', 'Invoice']>;
    payment_previous_date: Schema.Attribute.Date;
    phone: Schema.Attribute.String;
    primary_ad: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    publishedAt: Schema.Attribute.DateTime;
    total_years: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    website: Schema.Attribute.String;
    wp_eid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceAttendeeConferenceAttendee
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_attendees';
  info: {
    description: '';
    displayName: 'Conference Attendee';
    pluralName: 'conference-attendees';
    singularName: 'conference-attendee';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    conference_ticket: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-ticket.conference-ticket'
    >;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    first: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.field-meta', true>;
    last: Schema.Attribute.String;
    license: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-attendee.conference-attendee'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    orwa_voting_status: Schema.Attribute.Enumeration<
      ['Non Voting', 'Voting Delegate', 'Voting Alternate']
    >;
    orwaag_voting_status: Schema.Attribute.Enumeration<
      ['Non Voting', 'Voting Delegate', 'Voting Alternate']
    >;
    passport_id: Schema.Attribute.Integer;
    phone: Schema.Attribute.String;
    promotional_emails: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    qr_url: Schema.Attribute.String;
    registration: Schema.Attribute.Relation<
      'manyToOne',
      'api::conference-registration.conference-registration'
    >;
    speaker: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
    training_type: Schema.Attribute.Enumeration<
      ['None', 'Both', 'Operator', 'Board']
    >;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceBoothConferenceBooth
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_booths';
  info: {
    description: '';
    displayName: 'Conference Booth';
    pluralName: 'conference-booths';
    singularName: 'conference-booth';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    booth_number: Schema.Attribute.Integer;
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    items: Schema.Attribute.Component<'shared.field-meta', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-booth.conference-booth'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration: Schema.Attribute.Relation<
      'manyToOne',
      'api::conference-registration.conference-registration'
    >;
    secondary_email: Schema.Attribute.Email;
    subtotal: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceContestantConferenceContestant
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_contestants';
  info: {
    description: '';
    displayName: 'Conference Contestant';
    pluralName: 'conference-contestants';
    singularName: 'conference-contestant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    conference_ticket: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-ticket.conference-ticket'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    fee: Schema.Attribute.Decimal;
    first: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.field-meta', true>;
    last: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-contestant.conference-contestant'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration: Schema.Attribute.Relation<
      'manyToOne',
      'api::conference-registration.conference-registration'
    >;
    team: Schema.Attribute.Relation<
      'manyToOne',
      'api::conference-team.conference-team'
    >;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceExtraConferenceExtra
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_extras';
  info: {
    description: '';
    displayName: 'Conference Extra';
    pluralName: 'conference-extras';
    singularName: 'conference-extra';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conferences: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference.conference'
    >;
    context: Schema.Attribute.String;
    counted: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    details: Schema.Attribute.RichText;
    excluded: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-ticket.conference-ticket'
    >;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    included: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-ticket.conference-ticket'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-extra.conference-extra'
    > &
      Schema.Attribute.Private;
    max_qty: Schema.Attribute.Integer;
    max_qty_each: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
    price_event: Schema.Attribute.Decimal;
    price_online: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiConferenceFeedbackConferenceFeedback
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_feedbacks';
  info: {
    description: '';
    displayName: 'Conference Feedback';
    pluralName: 'conference-feedbacks';
    singularName: 'conference-feedback';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    feedback: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-feedback.conference-feedback'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceRegistrationConferenceRegistration
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_registrations';
  info: {
    description: '';
    displayName: 'Conference Registration';
    pluralName: 'conference-registrations';
    singularName: 'conference-registration';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'simple.address', false>;
    attendees: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-attendee.conference-attendee'
    >;
    booths: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-booth.conference-booth'
    >;
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    conference_sponsor: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-sponsor.conference-sponsor'
    >;
    contestants: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-contestant.conference-contestant'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    items: Schema.Attribute.Component<'conference.line-items', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-registration.conference-registration'
    > &
      Schema.Attribute.Private;
    non_member_fee: Schema.Attribute.Boolean;
    organization: Schema.Attribute.String;
    passport_id: Schema.Attribute.Integer;
    payment_method: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrant: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    registration_date: Schema.Attribute.Date;
    registration_source: Schema.Attribute.Enumeration<['online', 'kiosk']>;
    sponsorships: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-sponsorship.conference-sponsorship'
    >;
    taste_test_contestants: Schema.Attribute.Relation<
      'oneToMany',
      'api::taste-test-contestant.taste-test-contestant'
    >;
    team: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-team.conference-team'
    >;
    total: Schema.Attribute.Decimal;
    type: Schema.Attribute.Enumeration<['Attendee', 'Vendor']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceScheduleConferenceSchedule
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_schedules';
  info: {
    description: '';
    displayName: 'Conference Schedule';
    pluralName: 'conference-schedules';
    singularName: 'conference-schedule';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    company: Schema.Attribute.String;
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    end: Schema.Attribute.Time;
    event: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-schedule.conference-schedule'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    speaker: Schema.Attribute.String;
    start: Schema.Attribute.Time;
    training_hours: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceSponsorConferenceSponsor
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_sponsors';
  info: {
    description: '';
    displayName: 'Conference Sponsor';
    pluralName: 'conference-sponsors';
    singularName: 'conference-sponsor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.BigInteger;
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-sponsor.conference-sponsor'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    organization: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-registration.conference-registration'
    >;
    sponsorship_items: Schema.Attribute.Component<
      'conference.sponsorships',
      true
    >;
    sponsorships: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-sponsorship.conference-sponsorship'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceSponsorshipConferenceSponsorship
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_sponsorships';
  info: {
    description: '';
    displayName: 'Conference Sponsorship';
    pluralName: 'conference-sponsorships';
    singularName: 'conference-sponsorship';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    available: Schema.Attribute.Integer;
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-sponsorship.conference-sponsorship'
    > &
      Schema.Attribute.Private;
    max_purchasable: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiConferenceTeamConferenceTeam
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_teams';
  info: {
    description: '';
    displayName: 'conference-team';
    pluralName: 'conference-teams';
    singularName: 'conference-team';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    contestants: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-contestant.conference-contestant'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-team.conference-team'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-registration.conference-registration'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiConferenceTicketConferenceTicket
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_tickets';
  info: {
    description: '';
    displayName: 'Conference Ticket';
    pluralName: 'conference-tickets';
    singularName: 'conference-ticket';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conferences: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference.conference'
    >;
    context: Schema.Attribute.Enumeration<['Attendee', 'Contestant', 'Vendor']>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    excludes: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-extra.conference-extra'
    >;
    includes: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-extra.conference-extra'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-ticket.conference-ticket'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    price_event: Schema.Attribute.Decimal;
    price_online: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiConferenceTransactionConferenceTransaction
  extends Struct.CollectionTypeSchema {
  collectionName: 'conference_transactions';
  info: {
    description: '';
    displayName: 'Conference Transaction';
    pluralName: 'conference-transactions';
    singularName: 'conference-transaction';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    auth_code: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference-transaction.conference-transaction'
    > &
      Schema.Attribute.Private;
    network_trans_id: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    transaction_id: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiConferenceConference extends Struct.CollectionTypeSchema {
  collectionName: 'conferences';
  info: {
    description: '';
    displayName: 'Conference';
    pluralName: 'conferences';
    singularName: 'conference';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attendee_information: Schema.Attribute.Component<
      'conference.conference-details',
      true
    >;
    attendee_price: Schema.Attribute.Decimal;
    available_contestants: Schema.Attribute.Integer;
    booth_map: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    booth_price: Schema.Attribute.Integer;
    booth_price_2: Schema.Attribute.Decimal;
    booths_available: Schema.Attribute.Integer;
    brochure_link: Schema.Attribute.String;
    closed_message: Schema.Attribute.Text;
    conference_details: Schema.Attribute.Component<
      'conference.conference-details',
      true
    >;
    conference_extras: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-extra.conference-extra'
    >;
    conference_tickets: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference-ticket.conference-ticket'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Blocks;
    end_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::conference.conference'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    non_member_fee: Schema.Attribute.Decimal;
    online_registration_end: Schema.Attribute.Date;
    publishedAt: Schema.Attribute.DateTime;
    purchasable_booths: Schema.Attribute.Integer;
    recipient_email: Schema.Attribute.Email;
    registration_addons: Schema.Attribute.Relation<
      'manyToMany',
      'api::registration-addon.registration-addon'
    >;
    registration_cost: Schema.Attribute.Decimal;
    registration_end: Schema.Attribute.Date;
    registration_start: Schema.Attribute.Date;
    slug: Schema.Attribute.String;
    start_date: Schema.Attribute.Date;
    status: Schema.Attribute.Enumeration<
      [
        'Coming Soon',
        'Online Registration',
        'Online Registration Closed',
        'Kiosk Registration',
        'Closed',
        'Archived',
      ]
    >;
    training_hours_available: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vendor_information: Schema.Attribute.Component<
      'conference.conference-details',
      true
    >;
    vendor_price: Schema.Attribute.Decimal;
    venue: Schema.Attribute.Component<'simple.address', false>;
  };
}

export interface ApiContactBadgeContactBadge
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_badges';
  info: {
    description: '';
    displayName: 'Contact Badge';
    pluralName: 'contact-badges';
    singularName: 'contact-badge';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    color_code: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    invert: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-badge.contact-badge'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactContact extends Struct.CollectionTypeSchema {
  collectionName: 'contacts';
  info: {
    description: '';
    displayName: 'Contact';
    pluralName: 'contacts';
    singularName: 'contact';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    avatar: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    badges: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-badge.contact-badge'
    >;
    contact_type: Schema.Attribute.Enumeration<
      ['associate', 'watersystem', 'instructor', 'staff', 'administrator']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Unique;
    first: Schema.Attribute.String;
    last: Schema.Attribute.String;
    license: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact.contact'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiCorporateSponsorCorporateSponsor
  extends Struct.CollectionTypeSchema {
  collectionName: 'corporate_sponsors';
  info: {
    description: '';
    displayName: 'Corporate Sponsor';
    pluralName: 'corporate-sponsors';
    singularName: 'corporate-sponsor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::corporate-sponsor.corporate-sponsor'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEmailLogEmailLog extends Struct.CollectionTypeSchema {
  collectionName: 'email_logs';
  info: {
    description: '';
    displayName: 'Email Log';
    pluralName: 'email-logs';
    singularName: 'email-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    from: Schema.Attribute.String;
    html: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-log.email-log'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    to: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEmailTemplateEmailTemplate
  extends Struct.CollectionTypeSchema {
  collectionName: 'email_templates';
  info: {
    description: '';
    displayName: 'Email Template';
    pluralName: 'email-templates';
    singularName: 'email-template';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attachments: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    bcc: Schema.Attribute.String;
    body: Schema.Attribute.RichText;
    cc: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email_name: Schema.Attribute.String;
    from_email: Schema.Attribute.String;
    from_name: Schema.Attribute.String;
    grant_status: Schema.Attribute.Relation<
      'manyToOne',
      'api::grant-status.grant-status'
    >;
    grant_sub_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-sub-status.grant-sub-status'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-template.email-template'
    > &
      Schema.Attribute.Private;
    module: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resource: Schema.Attribute.String;
    subject: Schema.Attribute.String;
    to: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEventsAnnualConferenceAttendeeRosterEventsAnnualConferenceAttendeeRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_annual_conference_attendee_rosters';
  info: {
    description: '';
    displayName: 'Events Annual Conference Attendee Roster';
    pluralName: 'events-annual-conference-attendee-rosters';
    singularName: 'events-annual-conference-attendee-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    license_number: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-annual-conference-attendee-roster.events-annual-conference-attendee-roster'
    > &
      Schema.Attribute.Private;
    meal_breakfast: Schema.Attribute.Boolean;
    meal_dinner: Schema.Attribute.Boolean;
    meal_lunch: Schema.Attribute.Boolean;
    meal_social: Schema.Attribute.Boolean;
    organization: Schema.Attribute.String;
    orwa_voting_status: Schema.Attribute.Enumeration<
      ['Non Voting', 'Voting Delegate', 'Voting Alternate']
    >;
    orwaag_voting_status: Schema.Attribute.Enumeration<
      ['Non Voting', 'Voting Delegate', 'Voting Alternate']
    >;
    passport_id: Schema.Attribute.Integer;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    qr_code: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    training_type: Schema.Attribute.Enumeration<
      ['None', 'Both', 'Operator', 'Board']
    >;
    type: Schema.Attribute.Enumeration<
      [
        'Award',
        'Attendee',
        'Attendee-Full',
        'Attendee-Partial',
        'Attendee-Guest',
        'ORWA Board Member',
        'ORWAAG Board Member',
        'Speaker',
        'Staff',
        'Vendor',
        'Voting',
        'VIP',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsAnnualConferenceBoothRosterEventsAnnualConferenceBoothRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_annual_conference_booth_rosters';
  info: {
    description: '';
    displayName: 'Events Annual Conference Booth Roster';
    pluralName: 'events-annual-conference-booth-rosters';
    singularName: 'events-annual-conference-booth-roster';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    electric: Schema.Attribute.Boolean;
    fee_booth: Schema.Attribute.Decimal;
    fee_electric: Schema.Attribute.Decimal;
    fee_tables: Schema.Attribute.Decimal;
    fee_total: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-annual-conference-booth-roster.events-annual-conference-booth-roster'
    > &
      Schema.Attribute.Private;
    member_level: Schema.Attribute.Enumeration<
      ['Non Member', 'Basic', 'Bronze', 'Silver', 'Gold', 'Platinum']
    >;
    organization: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    tables: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsContestantRosterEventsContestantRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_contestant_rosters';
  info: {
    description: '';
    displayName: 'Events Contestant Roster';
    pluralName: 'events-contestant-rosters';
    singularName: 'events-contestant-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    event: Schema.Attribute.String;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-contestant-roster.events-contestant-roster'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    organization: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration_fee: Schema.Attribute.Decimal;
    team: Schema.Attribute.String;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsExpoAttendeeRosterEventsExpoAttendeeRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_expo_attendee_rosters';
  info: {
    description: '';
    displayName: 'Events Expo Attendee Roster';
    pluralName: 'events-expo-attendee-rosters';
    singularName: 'events-expo-attendee-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dinner: Schema.Attribute.Boolean;
    email: Schema.Attribute.Email;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    license_number: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-expo-attendee-roster.events-expo-attendee-roster'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    passport_id: Schema.Attribute.Integer;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    qr_code: Schema.Attribute.String;
    sponsor: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
    training_demo_participant: Schema.Attribute.Boolean;
    training_type: Schema.Attribute.Enumeration<
      ['None', 'Both', 'Operator', 'Board']
    >;
    type: Schema.Attribute.Enumeration<
      [
        'Attendee',
        'ORWA Board Member',
        'ORWAAG Board Member',
        'Dinner Attendee',
        'Speaker',
        'Staff',
        'Vendor',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsExpoBoothRosterEventsExpoBoothRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_expo_booth_rosters';
  info: {
    description: '';
    displayName: 'Events Expo Booth Roster';
    pluralName: 'events-expo-booth-rosters';
    singularName: 'events-expo-booth-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    fee_booth: Schema.Attribute.Decimal;
    fee_total: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-expo-booth-roster.events-expo-booth-roster'
    > &
      Schema.Attribute.Private;
    member_level: Schema.Attribute.Enumeration<
      ['Non Member', 'Basic', 'Bronze', 'Silver', 'Gold', 'Platinum']
    >;
    organization: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    training_demo_participant: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsFallConferenceAttendeeRosterEventsFallConferenceAttendeeRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_fall_conference_attendee_rosters';
  info: {
    description: '';
    displayName: 'Events Fall Conference Attendee Roster';
    pluralName: 'events-fall-conference-attendee-rosters';
    singularName: 'events-fall-conference-attendee-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dinner: Schema.Attribute.Boolean;
    email: Schema.Attribute.Email;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    license_number: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-fall-conference-attendee-roster.events-fall-conference-attendee-roster'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    passport_id: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    qr_code: Schema.Attribute.String;
    title: Schema.Attribute.String;
    training_type: Schema.Attribute.Enumeration<
      ['None', 'Both', 'Operator', 'Board']
    >;
    type: Schema.Attribute.Enumeration<
      [
        'Attendee',
        'ORWA Board Member',
        'ORWAAG Board Member',
        'Dinner Attendee',
        'Speaker',
        'Staff',
        'Vendor',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiEventsFallConferenceBoothRosterEventsFallConferenceBoothRoster
  extends Struct.CollectionTypeSchema {
  collectionName: 'events_fall_conference_booth_rosters';
  info: {
    description: '';
    displayName: 'Events Fall Conference Booth Roster';
    pluralName: 'events-fall-conference-booth-rosters';
    singularName: 'events-fall-conference-booth-roster';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    fee_booth: Schema.Attribute.Decimal;
    fee_total: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::events-fall-conference-booth-roster.events-fall-conference-booth-roster'
    > &
      Schema.Attribute.Private;
    member_level: Schema.Attribute.String;
    organization: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wp_eid: Schema.Attribute.Integer;
    wp_seid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiGrantApplicationFinalGrantApplicationFinal
  extends Struct.CollectionTypeSchema {
  collectionName: 'grant_application_finals';
  info: {
    description: '';
    displayName: 'Grant Application';
    pluralName: 'grant-application-finals';
    singularName: 'grant-application-final';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    additional_files: Schema.Attribute.Text;
    additional_funding_requested: Schema.Attribute.Integer;
    additional_information: Schema.Attribute.Text;
    applicant_pdf: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    application_date: Schema.Attribute.Date;
    application_id: Schema.Attribute.String;
    application_status: Schema.Attribute.String;
    applied_to_other_loans: Schema.Attribute.Boolean;
    approved_project_cost: Schema.Attribute.Integer;
    approved_projects: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-type.project-type'
    >;
    award_amount: Schema.Attribute.Integer;
    award_letter: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    chairman: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    chairman_also_mayer_of_municipal_city: Schema.Attribute.Boolean;
    change_order_request: Schema.Attribute.String;
    closed_out: Schema.Attribute.Boolean;
    combined_cost_of_projects: Schema.Attribute.BigInteger;
    committee_date: Schema.Attribute.Date;
    consent_order: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    consent_order_number: Schema.Attribute.String;
    county: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deq_action: Schema.Attribute.String;
    description_justification_estimated_cost: Schema.Attribute.Text;
    drinking_or_wastewater: Schema.Attribute.Enumeration<
      ['Drinking Water', 'Wastewater']
    >;
    drinking_water_projects_selected: Schema.Attribute.String;
    email: Schema.Attribute.String;
    engineer: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    engineering_report: Schema.Attribute.String;
    engineering_report_deq_approved: Schema.Attribute.Boolean;
    expected_utility_match: Schema.Attribute.Integer;
    facility_id: Schema.Attribute.String;
    grant: Schema.Attribute.Relation<'oneToOne', 'api::grant.grant'>;
    grant_application_score: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-application-score.grant-application-score'
    >;
    has_engineer: Schema.Attribute.Boolean;
    legal_entity_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-application-final.grant-application-final'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.JSON;
    lrsp_plan: Schema.Attribute.Boolean;
    mailing_address_city: Schema.Attribute.String;
    mailing_address_line_two: Schema.Attribute.String;
    mailing_address_state: Schema.Attribute.String;
    mailing_address_street: Schema.Attribute.String;
    mailing_address_zip: Schema.Attribute.String;
    minimum_utility_financial_contribution: Schema.Attribute.String;
    money_set_aside: Schema.Attribute.Boolean;
    notice_of_violation: Schema.Attribute.Text;
    other_describe: Schema.Attribute.Text;
    other_entities: Schema.Attribute.Text;
    other_needs: Schema.Attribute.Text;
    payouts: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-payout.grant-payout'
    >;
    physical_address_city: Schema.Attribute.String;
    physical_address_line_two: Schema.Attribute.String;
    physical_address_state: Schema.Attribute.String;
    physical_address_street: Schema.Attribute.String;
    physical_address_zip: Schema.Attribute.String;
    physical_same_as_mailing: Schema.Attribute.Boolean;
    point_of_contact: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact.contact'
    >;
    population_served: Schema.Attribute.Integer;
    portion_matched_by_recipient: Schema.Attribute.BigInteger;
    previous_application_id: Schema.Attribute.String;
    project_proposal_birds: Schema.Attribute.Text;
    projects_approved: Schema.Attribute.Text;
    proposals: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    regions: Schema.Attribute.JSON;
    report_approved_by_deq: Schema.Attribute.String;
    requested_grant_amount: Schema.Attribute.BigInteger;
    resolves_violation: Schema.Attribute.String;
    satisfy_deq_issued_order: Schema.Attribute.Boolean;
    selected_projects: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-type.project-type'
    >;
    signatory_name: Schema.Attribute.String;
    signatory_title: Schema.Attribute.String;
    signature: Schema.Attribute.Text;
    status: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-status.grant-status'
    >;
    sub_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-sub-status.grant-sub-status'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upload_engineering_report: Schema.Attribute.Text;
    uploaded_additional_files: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    uploaded_engineering_report: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    uploaded_notice_of_violation: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    wastewater_projects_selected: Schema.Attribute.String;
  };
}

export interface ApiGrantApplicationScoreGrantApplicationScore
  extends Struct.CollectionTypeSchema {
  collectionName: 'grant_application_scores';
  info: {
    description: '';
    displayName: 'Grant Application Score';
    pluralName: 'grant-application-scores';
    singularName: 'grant-application-score';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approved: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date;
    deq_member_email: Schema.Attribute.String;
    deq_member_name: Schema.Attribute.String;
    deq_signature: Schema.Attribute.Text;
    grant: Schema.Attribute.Relation<'oneToOne', 'api::grant.grant'>;
    grant_application: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-application-final.grant-application-final'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-application-score.grant-application-score'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    orwa_member_email: Schema.Attribute.String;
    orwa_member_name: Schema.Attribute.String;
    orwa_signature: Schema.Attribute.Text;
    other_describe: Schema.Attribute.Text;
    other_describe_2: Schema.Attribute.Text;
    projects_approved: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-type.project-type'
    >;
    publishedAt: Schema.Attribute.DateTime;
    score: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantApplicationScoringGrantApplicationScoring
  extends Struct.CollectionTypeSchema {
  collectionName: 'grant_application_scorings';
  info: {
    description: '';
    displayName: 'Grant Application Scoring';
    pluralName: 'grant-application-scorings';
    singularName: 'grant-application-scoring';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    grant: Schema.Attribute.Relation<'oneToOne', 'api::grant.grant'>;
    icon: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-application-scoring.grant-application-scoring'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.String;
    project_type: Schema.Attribute.Relation<
      'oneToOne',
      'api::project-type.project-type'
    >;
    publishedAt: Schema.Attribute.DateTime;
    score: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantPayoutGrantPayout extends Struct.CollectionTypeSchema {
  collectionName: 'grant_payouts';
  info: {
    description: '';
    displayName: 'Grant Payout';
    pluralName: 'grant-payouts';
    singularName: 'grant-payout';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    application: Schema.Attribute.Relation<
      'manyToOne',
      'api::grant-application-final.grant-application-final'
    >;
    comments: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date_approved: Schema.Attribute.Date;
    grant: Schema.Attribute.Relation<'oneToOne', 'api::grant.grant'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-payout.grant-payout'
    > &
      Schema.Attribute.Private;
    payout_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::payout-status.payout-status'
    >;
    project_type: Schema.Attribute.Relation<
      'oneToOne',
      'api::project-type.project-type'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['Requested', 'Approved', 'Denied', 'Paid', 'Paid in Full']
    >;
    supporting_documents: Schema.Attribute.Text;
    transaction_date: Schema.Attribute.Date;
    type: Schema.Attribute.Enumeration<['Administrative', 'Reimbursement']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantScoringTokenGrantScoringToken
  extends Struct.CollectionTypeSchema {
  collectionName: 'grant_scoring_tokens';
  info: {
    description: '';
    displayName: 'Grant Scoring Token';
    pluralName: 'grant-scoring-tokens';
    singularName: 'grant-scoring-token';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    application_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-status.grant-status'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    default_member_email: Schema.Attribute.String;
    default_member_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-scoring-token.grant-scoring-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    next_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::grant-status.grant-status'
    >;
    order: Schema.Attribute.Integer;
    private_key: Schema.Attribute.String;
    public_key: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantStatusGrantStatus extends Struct.CollectionTypeSchema {
  collectionName: 'grant_statuses';
  info: {
    description: '';
    displayName: 'Grant Status';
    pluralName: 'grant-statuses';
    singularName: 'grant-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    email_templates: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-template.email-template'
    >;
    grant_sub_statuses: Schema.Attribute.Relation<
      'manyToMany',
      'api::grant-sub-status.grant-sub-status'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-status.grant-status'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    next_statuses: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-status.grant-status'
    >;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantSubStatusGrantSubStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'grant_sub_statuses';
  info: {
    description: '';
    displayName: 'Grant Sub Status';
    pluralName: 'grant-sub-statuses';
    singularName: 'grant-sub-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    email_template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    grant_statuses: Schema.Attribute.Relation<
      'manyToMany',
      'api::grant-status.grant-status'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-sub-status.grant-sub-status'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantTypeGrantType extends Struct.CollectionTypeSchema {
  collectionName: 'grant_types';
  info: {
    description: '';
    displayName: 'Grant Type';
    pluralName: 'grant-types';
    singularName: 'grant-type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    eligibility: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::grant-type.grant-type'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGrantGrant extends Struct.CollectionTypeSchema {
  collectionName: 'grants';
  info: {
    description: '';
    displayName: 'Grant';
    pluralName: 'grants';
    singularName: 'grant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    admin_amount: Schema.Attribute.BigInteger;
    closes: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eligibility: Schema.Attribute.Text;
    funds_approved: Schema.Attribute.BigInteger;
    funds_provided: Schema.Attribute.BigInteger;
    grant_amount: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::grant.grant'> &
      Schema.Attribute.Private;
    max_award: Schema.Attribute.Integer;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    opens: Schema.Attribute.Date;
    publishedAt: Schema.Attribute.DateTime;
    reimbursement_type: Schema.Attribute.Enumeration<
      ['Lump Sum', 'Reimbursement']
    >;
    status: Schema.Attribute.Enumeration<['Open', 'Closed', 'Suggested']>;
    type: Schema.Attribute.Relation<'oneToOne', 'api::grant-type.grant-type'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiInvoiceInvoice extends Struct.CollectionTypeSchema {
  collectionName: 'invoices';
  info: {
    description: '';
    displayName: 'Invoice';
    pluralName: 'invoices';
    singularName: 'invoice';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    auth_code: Schema.Attribute.String;
    company: Schema.Attribute.String;
    context: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    data: Schema.Attribute.JSON;
    email: Schema.Attribute.Text;
    entity_id: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::invoice.invoice'
    > &
      Schema.Attribute.Private;
    network_trans_id: Schema.Attribute.Text;
    payment_date: Schema.Attribute.Date;
    payment_details: Schema.Attribute.Text;
    payment_method: Schema.Attribute.Enumeration<['Card', 'Invoice']>;
    publishedAt: Schema.Attribute.DateTime;
    reciept: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    resource: Schema.Attribute.String;
    transaction_id: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiLogLog extends Struct.CollectionTypeSchema {
  collectionName: 'logs';
  info: {
    description: '';
    displayName: 'log';
    pluralName: 'logs';
    singularName: 'log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    data: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::log.log'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    resource: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMembershipItemMembershipItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'membership_items';
  info: {
    displayName: 'membership-item';
    pluralName: 'membership-items';
    singularName: 'membership-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::membership-item.membership-item'
    > &
      Schema.Attribute.Private;
    max_price: Schema.Attribute.Decimal;
    max_purchasable: Schema.Attribute.Integer;
    memberships: Schema.Attribute.Relation<
      'manyToMany',
      'api::membership.membership'
    >;
    min_purchasable: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMembershipMembership extends Struct.CollectionTypeSchema {
  collectionName: 'memberships';
  info: {
    description: '';
    displayName: 'membership';
    pluralName: 'memberships';
    singularName: 'membership';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    associates: Schema.Attribute.Relation<
      'oneToMany',
      'api::associate.associate'
    >;
    context: Schema.Attribute.Enumeration<['Watersystem', 'Associate']>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::membership.membership'
    > &
      Schema.Attribute.Private;
    membership_items: Schema.Attribute.Relation<
      'manyToMany',
      'api::membership-item.membership-item'
    >;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPayoutStatusPayoutStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'payout_statuses';
  info: {
    description: '';
    displayName: 'Payout Status';
    pluralName: 'payout-statuses';
    singularName: 'payout-status';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email_template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payout-status.payout-status'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    next_statuses: Schema.Attribute.Relation<
      'oneToMany',
      'api::payout-status.payout-status'
    >;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProgramProgram extends Struct.CollectionTypeSchema {
  collectionName: 'programs';
  info: {
    description: '';
    displayName: 'Program';
    pluralName: 'programs';
    singularName: 'program';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::program.program'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProjectTypeProjectType extends Struct.CollectionTypeSchema {
  collectionName: 'project_types';
  info: {
    description: '';
    displayName: 'Project Type';
    pluralName: 'project-types';
    singularName: 'project-type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    classification: Schema.Attribute.Enumeration<
      ['Wastewater', 'Drinking Water', 'Both']
    >;
    context: Schema.Attribute.Enumeration<
      ['Project Type', 'Project Status and Impact']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-type.project-type'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRegistrationAddonRegistrationAddon
  extends Struct.CollectionTypeSchema {
  collectionName: 'registration_addons';
  info: {
    description: '';
    displayName: 'Registration Addon';
    pluralName: 'registration-addons';
    singularName: 'registration-addon';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conferences: Schema.Attribute.Relation<
      'manyToMany',
      'api::conference.conference'
    >;
    context: Schema.Attribute.Enumeration<
      ['Attendee', 'Contestant', 'Vendor', 'Booth']
    >;
    counted: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    details: Schema.Attribute.RichText;
    icon: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::registration-addon.registration-addon'
    > &
      Schema.Attribute.Private;
    max_qty: Schema.Attribute.Integer;
    max_qty_each: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    price_event: Schema.Attribute.Decimal;
    price_online: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRequestStatusRequestStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'request_statuses';
  info: {
    description: '';
    displayName: 'Request Status';
    pluralName: 'request-statuses';
    singularName: 'request-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    email_template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::request-status.request-status'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    next_statuses: Schema.Attribute.Relation<
      'oneToMany',
      'api::request-status.request-status'
    >;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSavedQuerySavedQuery extends Struct.CollectionTypeSchema {
  collectionName: 'saved_queries';
  info: {
    description: '';
    displayName: 'Saved Query';
    pluralName: 'saved-queries';
    singularName: 'saved-query';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    filters: Schema.Attribute.JSON;
    is_public: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-query.saved-query'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resource: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiScheduledEmailTaskScheduledEmailTask
  extends Struct.CollectionTypeSchema {
  collectionName: 'scheduled_email_tasks';
  info: {
    description: '';
    displayName: 'scheduled-email-task';
    pluralName: 'scheduled-email-tasks';
    singularName: 'scheduled-email-task';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    condition: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cron_rule: Schema.Attribute.String;
    email_template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    entity: Schema.Attribute.String;
    last_sent: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::scheduled-email-task.scheduled-email-task'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSettingSetting extends Struct.CollectionTypeSchema {
  collectionName: 'settings';
  info: {
    description: '';
    displayName: 'Settings';
    pluralName: 'settings';
    singularName: 'setting';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    field_type: Schema.Attribute.Enumeration<
      [
        'text',
        'textarea',
        'number',
        'boolean',
        'autocomplete',
        'radio',
        'select',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::setting.setting'
    > &
      Schema.Attribute.Private;
    module: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    props: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSoonerwarnRequestSoonerwarnRequest
  extends Struct.CollectionTypeSchema {
  collectionName: 'soonerwarn_requests';
  info: {
    description: '';
    displayName: 'Soonerwarn Request';
    pluralName: 'soonerwarn-requests';
    singularName: 'soonerwarn-request';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::soonerwarn-request.soonerwarn-request'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Relation<
      'oneToOne',
      'api::request-status.request-status'
    >;
    system: Schema.Attribute.Relation<'oneToOne', 'api::soonerwarn.soonerwarn'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSoonerwarnStatusSoonerwarnStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'soonerwarn_statuses';
  info: {
    description: '';
    displayName: 'Soonerwarn Status';
    pluralName: 'soonerwarn-statuses';
    singularName: 'soonerwarn-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    email_template: Schema.Attribute.Relation<
      'oneToOne',
      'api::email-template.email-template'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::soonerwarn-status.soonerwarn-status'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    next_statuses: Schema.Attribute.Relation<
      'oneToMany',
      'api::soonerwarn-status.soonerwarn-status'
    >;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSoonerwarnSoonerwarn extends Struct.CollectionTypeSchema {
  collectionName: 'soonerwarns';
  info: {
    description: '';
    displayName: 'Soonerwarn';
    pluralName: 'soonerwarns';
    singularName: 'soonerwarn';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    application_date: Schema.Attribute.Date;
    contacts: Schema.Attribute.Relation<'oneToMany', 'api::contact.contact'>;
    county: Schema.Attribute.Enumeration<
      [
        'Adair',
        'Alfalfa',
        'Atoka',
        'Beaver',
        'Beckham',
        'Blaine',
        'Bryan',
        'Caddo',
        'Canadian',
        'Carter',
        'Cherokee',
        'Choctaw',
        'Cimarron',
        'Cleveland',
        'Coal',
        'Comanche',
        'Cotton',
        'Craig',
        'Creek',
        'Custer',
        'Delaware',
        'Dewey',
        'Ellis',
        'Garfield',
        'Garvin',
        'Grady',
        'Grant',
        'Greer',
        'Harmon',
        'Harper',
        'Haskell',
        'Hughes',
        'Jackson',
        'Jefferson',
        'Johnston',
        'Kay',
        'Kingfisher',
        'Kiowa',
        'Latimer',
        'LeFlore',
        'Lincoln',
        'Logan',
        'Love',
        'Major',
        'Marshall',
        'Mayes',
        'McClain',
        'McCurtain',
        'McIntosh',
        'Murray',
        'Muskogee',
        'Noble',
        'Nowata',
        'Okfuskee',
        'Oklahoma',
        'Okmulgee',
        'Osage',
        'Ottawa',
        'Pawnee',
        'Payne',
        'Pittsburg',
        'Pontotoc',
        'Pottawatomie',
        'Pushmataha',
        'Roger Mills',
        'Rogers',
        'Seminole',
        'Sequoyah',
        'Stephens',
        'Texas',
        'Tillman',
        'Tulsa',
        'Wagoner',
        'Washington',
        'Washita',
        'Woods',
        'Woodward',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::soonerwarn.soonerwarn'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.JSON;
    member_since: Schema.Attribute.Date;
    phone: Schema.Attribute.String;
    physical_address_city: Schema.Attribute.String;
    physical_address_state: Schema.Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]
    >;
    physical_address_street: Schema.Attribute.String;
    physical_address_zip: Schema.Attribute.String;
    primary_contact: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact.contact'
    >;
    publishedAt: Schema.Attribute.DateTime;
    regions: Schema.Attribute.JSON;
    secondary_contact: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact.contact'
    >;
    status: Schema.Attribute.Relation<
      'oneToOne',
      'api::soonerwarn-status.soonerwarn-status'
    >;
    system_name: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStaffMemberStaffMember extends Struct.CollectionTypeSchema {
  collectionName: 'staff';
  info: {
    description: '';
    displayName: 'Staff';
    pluralName: 'staff';
    singularName: 'staff-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_assets: Schema.Attribute.Relation<'oneToMany', 'api::asset.asset'>;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::staff-member.staff-member'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTasteTestContestantTasteTestContestant
  extends Struct.CollectionTypeSchema {
  collectionName: 'taste_test_contestants';
  info: {
    description: '';
    displayName: 'Taste Test Contestant';
    pluralName: 'taste-test-contestants';
    singularName: 'taste-test-contestant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conference: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference.conference'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    first: Schema.Attribute.String;
    last: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::taste-test-contestant.taste-test-contestant'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registration: Schema.Attribute.Relation<
      'manyToOne',
      'api::conference-registration.conference-registration'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    watersystem: Schema.Attribute.Relation<
      'oneToOne',
      'api::watersystem.watersystem'
    >;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiTrainingEventLogTrainingEventLog
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_event_logs';
  info: {
    description: '';
    displayName: 'Training Event Log';
    pluralName: 'training-event-logs';
    singularName: 'training-event-log';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    block: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-schedule-block.training-schedule-block'
    >;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date;
    event: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-event.training-event'
    >;
    hours: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-event-log.training-event-log'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    session: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-session.training-session'
    >;
    type: Schema.Attribute.Enumeration<['Session', 'Block']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingEventRegistrationTrainingEventRegistration
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_event_registrations';
  info: {
    description: '';
    displayName: 'Training Event Registration';
    pluralName: 'training-event-registrations';
    singularName: 'training-event-registration';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    attendee_id: Schema.Attribute.Integer;
    class_number: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.String;
    first: Schema.Attribute.String;
    last: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-event-registration.training-event-registration'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    training_event: Schema.Attribute.Relation<
      'manyToOne',
      'api::training-event.training-event'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingEventTrainingEvent
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_events';
  info: {
    description: '';
    displayName: 'Training Event';
    pluralName: 'training-events';
    singularName: 'training-event';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'simple.address', false>;
    audience: Schema.Attribute.Enumeration<
      [
        'Operators & Managers',
        'Decision Makers',
        'Bookkeepers/Office Managers',
        'All System Personnel',
        'Board Members',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deq_class_number: Schema.Attribute.String;
    deq_exam: Schema.Attribute.Boolean;
    end: Schema.Attribute.DateTime;
    exam_datetime: Schema.Attribute.DateTime;
    hours: Schema.Attribute.Integer;
    instructor: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-instructor.training-instructor'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-event.training-event'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    phone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    private_notes: Schema.Attribute.Text;
    program_billed: Schema.Attribute.Relation<
      'oneToOne',
      'api::program.program'
    >;
    public_notes: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    schedule: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-schedule.training-schedule'
    >;
    start: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['DRAFT', 'REVIEW', 'DEQ', 'RSVP', 'LIVE', 'COMPLETE', 'CANCELLED']
    > &
      Schema.Attribute.DefaultTo<'DRAFT'>;
    training_event_registrations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-event-registration.training-event-registration'
    >;
    training_type: Schema.Attribute.Enumeration<
      [
        'Certification Renewal',
        'Board Member',
        'New Board Member',
        'Class A Water',
        'Class B Water',
        'Class C Water',
        'Class D Water',
        'Class A Wastewater',
        'Class B Wastewater',
        'Class C Wastewater',
        'Class D Wastewater',
        'Class A Water Lab',
        'Class B Water Lab',
        'Class C Water Lab',
        'Class A Wastewater Lab',
        'Class B Wastewater Lab',
        'Class C Wastewater Lab',
      ]
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue_id: Schema.Attribute.Integer;
  };
}

export interface ApiTrainingInstructorCertificationTrainingInstructorCertification
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_instructor_certifications';
  info: {
    description: '';
    displayName: 'Training Instructor Certification';
    pluralName: 'training-instructor-certifications';
    singularName: 'training-instructor-certification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    certification_date: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    instructor: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-instructor.training-instructor'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-instructor-certification.training-instructor-certification'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    renewal_date: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    waste_water_certification: Schema.Attribute.Enumeration<
      [
        'Class A Wastewater',
        'Class B Wastewater',
        'Class C Wastewater',
        'Class D Wastewater',
      ]
    >;
    waste_water_lab_certification: Schema.Attribute.Enumeration<
      [
        'Class A Wastewater Lab',
        'Class B Wastewater Lab',
        'Class C Wastewater Lab',
      ]
    >;
    water_certification: Schema.Attribute.Enumeration<
      ['Class A Water', 'Class B Water', 'Class C Water', 'Class D Water']
    >;
    water_lab_certification: Schema.Attribute.Enumeration<
      ['Class A Water Lab', 'Class B Water Lab', 'Class C Water Lab']
    >;
  };
}

export interface ApiTrainingInstructorTrainingInstructor
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_instructors';
  info: {
    description: '';
    displayName: 'Training Instructor';
    pluralName: 'training-instructors';
    singularName: 'training-instructor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    instructor: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-instructor.training-instructor'
    > &
      Schema.Attribute.Private;
    operator_license: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    staff: Schema.Attribute.Relation<
      'oneToOne',
      'api::staff-member.staff-member'
    >;
    training_instructor_certification: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-instructor-certification.training-instructor-certification'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingLogTrainingLog extends Struct.CollectionTypeSchema {
  collectionName: 'training_logs';
  info: {
    description: '';
    displayName: 'Training Log';
    pluralName: 'training-logs';
    singularName: 'training-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attendee_id: Schema.Attribute.Integer;
    auth_uid: Schema.Attribute.Integer;
    class_name: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    event: Schema.Attribute.String;
    latitude: Schema.Attribute.Float;
    license: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-log.training-log'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    longitude: Schema.Attribute.Float;
    passport_id: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    training_minutes: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingScheduleBlockTrainingScheduleBlock
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_schedule_blocks';
  info: {
    description: '';
    displayName: 'Training Schedule Block';
    pluralName: 'training-schedule-blocks';
    singularName: 'training-schedule-block';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    am_pm: Schema.Attribute.Enumeration<['AM', 'PM']>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-schedule-block.training-schedule-block'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    training_sessions: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-session.training-session'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingScheduleTrainingSchedule
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_schedules';
  info: {
    description: '';
    displayName: 'Training Schedule';
    pluralName: 'training-schedules';
    singularName: 'training-schedule';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    event: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-event.training-event'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-schedule.training-schedule'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    training_schedule_blocks: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-schedule-block.training-schedule-block'
    >;
    training_sessions: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-session.training-session'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingSessionTrainingSession
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_sessions';
  info: {
    description: '';
    displayName: 'Training Session';
    pluralName: 'training-sessions';
    singularName: 'training-session';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    end: Schema.Attribute.Time;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-session.training-session'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    start: Schema.Attribute.Time;
    summary: Schema.Attribute.Text;
    topic: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-topic.training-topic'
    >;
    training_instructor: Schema.Attribute.Relation<
      'oneToOne',
      'api::training-instructor.training-instructor'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrainingSettingTrainingSetting
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_settings';
  info: {
    description: '';
    displayName: 'Training Setting';
    pluralName: 'training-settings';
    singularName: 'training-setting';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    city: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    fax: Schema.Attribute.String;
    hours: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-setting.training-setting'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    zip: Schema.Attribute.String;
  };
}

export interface ApiTrainingTopicTrainingTopic
  extends Struct.CollectionTypeSchema {
  collectionName: 'training_topics';
  info: {
    description: '';
    displayName: 'Training Topic';
    pluralName: 'training-topics';
    singularName: 'training-topic';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['Certificate Training', 'Renewals', 'Board Training']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    hours: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-topic.training-topic'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVenueVenue extends Struct.CollectionTypeSchema {
  collectionName: 'venues';
  info: {
    description: '';
    displayName: 'Venue';
    pluralName: 'venues';
    singularName: 'venue';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    latitude: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::venue.venue'> &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.String;
    origin: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    province: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
    venue_name: Schema.Attribute.String;
    wp_uid: Schema.Attribute.Integer;
    zip: Schema.Attribute.String;
  };
}

export interface ApiWatersystemWatersystem extends Struct.CollectionTypeSchema {
  collectionName: 'watersystems';
  info: {
    description: '';
    displayName: 'Watersystem';
    pluralName: 'watersystems';
    singularName: 'watersystem';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address_mailing_city: Schema.Attribute.String;
    address_mailing_pobox: Schema.Attribute.String;
    address_mailing_state: Schema.Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]
    > &
      Schema.Attribute.DefaultTo<'Oklahoma'>;
    address_mailing_zip: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    address_physical_city: Schema.Attribute.String;
    address_physical_line1: Schema.Attribute.String;
    address_physical_line2: Schema.Attribute.String;
    address_physical_state: Schema.Attribute.Enumeration<
      [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]
    > &
      Schema.Attribute.DefaultTo<'Oklahoma'>;
    address_physical_zip: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    application_date: Schema.Attribute.Date;
    board_meeting: Schema.Attribute.String;
    contacts: Schema.Attribute.Relation<'oneToMany', 'api::contact.contact'>;
    county: Schema.Attribute.Enumeration<
      [
        'Adair',
        'Alfalfa',
        'Atoka',
        'Beaver',
        'Beckham',
        'Blaine',
        'Bryan',
        'Caddo',
        'Canadian',
        'Carter',
        'Cherokee',
        'Choctaw',
        'Cimarron',
        'Cleveland',
        'Coal',
        'Comanche',
        'Cotton',
        'Craig',
        'Creek',
        'Custer',
        'Delaware',
        'Dewey',
        'Ellis',
        'Garfield',
        'Garvin',
        'Grady',
        'Grant',
        'Greer',
        'Harmon',
        'Harper',
        'Haskell',
        'Hughes',
        'Jackson',
        'Jefferson',
        'Johnston',
        'Kay',
        'Kingfisher',
        'Kiowa',
        'Latimer',
        'LeFlore',
        'Lincoln',
        'Logan',
        'Love',
        'Major',
        'Marshall',
        'Mayes',
        'McClain',
        'McCurtain',
        'McIntosh',
        'Murray',
        'Muskogee',
        'Noble',
        'Nowata',
        'Okfuskee',
        'Oklahoma',
        'Okmulgee',
        'Osage',
        'Ottawa',
        'Pawnee',
        'Payne',
        'Pittsburg',
        'Pontotoc',
        'Pottawatomie',
        'Pushmataha',
        'Roger Mills',
        'Rogers',
        'Seminole',
        'Sequoyah',
        'Stephens',
        'Texas',
        'Tillman',
        'Tulsa',
        'Wagoner',
        'Washington',
        'Washita',
        'Woods',
        'Woodward',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directory_mailed: Schema.Attribute.Boolean;
    directory_sent_date: Schema.Attribute.Date;
    email: Schema.Attribute.Email;
    expiration_notification_sent: Schema.Attribute.DateTime;
    fax: Schema.Attribute.String;
    fee_apprenticeship: Schema.Attribute.Decimal;
    fee_connections: Schema.Attribute.Decimal;
    fee_membership: Schema.Attribute.Decimal;
    fee_scholarship: Schema.Attribute.Decimal;
    funding: Schema.Attribute.Boolean;
    latitude: Schema.Attribute.String;
    legal_entity_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::watersystem.watersystem'
    > &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.String;
    member_type: Schema.Attribute.Enumeration<['RWC', 'RWD', 'TN']>;
    membership_directory_type: Schema.Attribute.Enumeration<
      ['Digital', 'Mail', 'Both', 'None']
    >;
    meters: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    office_hours: Schema.Attribute.String;
    orwaag: Schema.Attribute.Boolean;
    payment_amount: Schema.Attribute.Decimal;
    payment_details: Schema.Attribute.Text;
    payment_last_date: Schema.Attribute.Date;
    payment_method: Schema.Attribute.Enumeration<['Card', 'eCheck', 'Invoice']>;
    payment_previous_date: Schema.Attribute.Date;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    region: Schema.Attribute.Enumeration<
      ['Region 1', 'Region 2', 'Region 3', 'Region 4']
    >;
    soonerwarn: Schema.Attribute.Boolean;
    system_type_dirty: Schema.Attribute.Enumeration<
      [
        'Pur',
        'Sew',
        'Sur',
        'Well',
        'Pur, Sew',
        'Pur, Sur',
        'Pur, Well',
        'Sew, Pur',
        'Sew, Sur',
        'Sew, Well',
        'Sur, Pur',
        'Sur, Sew',
        'Sur, Well',
        'Well, Pur',
        'Well, Sew',
        'Well, Sur',
        'Pur, Sew, Sur',
        'Pur, Sew, Well',
        'Pur, Sur, Sew',
        'Pur, Sur, Well',
        'Pur, Well, Sew',
        'Pur, Well, Sur',
        'Sew, Pur, Sur',
        'Sew, Pur, Well',
        'Sew, Sur, Pur',
        'Sew, Sur, Well',
        'Sew, Well, Pur',
        'Sew, Well, Sur',
        'Sur, Pur, Sew',
        'Sur, Pur, Well',
        'Sur, Sew, Pur',
        'Sur, Sew, Well',
        'Sur, Well, Pur',
        'Sur, Well, Sew',
        'Well, Pur, Sew',
        'Well, Pur, Sur',
        'Well, Sew, Pur',
        'Well, Sew, Sur',
        'Well, Sur, Pur',
        'Well, Sur, Sew',
        'Pur, Sew, Sur, Well',
        'Pur, Sew, Well, Sur',
        'Pur, Sur, Sew, Well',
        'Pur, Sur, Well, Sew',
        'Pur, Well, Sew, Sur',
        'Pur, Well, Sur, Sew',
        'Sew, Pur, Sur, Well',
        'Sew, Pur, Well, Sur',
        'Sew, Sur, Pur, Well',
        'Sew, Sur, Well, Pur',
        'Sew, Well, Pur, Sur',
        'Sew, Well, Sur, Pur',
        'Sur, Pur, Sew, Well',
        'Sur, Pur, Well, Sew',
        'Sur, Sew, Pur, Well',
        'Sur, Sew, Well, Pur',
        'Sur, Well, Pur, Sew',
        'Sur, Well, Sew, Pur',
        'Well, Pur, Sew, Sur',
        'Well, Pur, Sur, Sew',
        'Well, Sew, Pur, Sur',
        'Well, Sew, Sur, Pur',
        'Well, Sur, Pur, Sew',
        'Well, Sur, Sew, Pur',
      ]
    >;
    total_years: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
    workmans_comp: Schema.Attribute.Boolean;
    wp_eid: Schema.Attribute.Integer;
    wp_uid: Schema.Attribute.Integer;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    saved_queries: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-query.saved-query'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_preferences: Schema.Attribute.JSON;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    wp_uid: Schema.Attribute.Integer & Schema.Attribute.Unique;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::activity-relation.activity-relation': ApiActivityRelationActivityRelation;
      'api::activity.activity': ApiActivityActivity;
      'api::alein.alein': ApiAleinAlein;
      'api::asset.asset': ApiAssetAsset;
      'api::associate.associate': ApiAssociateAssociate;
      'api::conference-attendee.conference-attendee': ApiConferenceAttendeeConferenceAttendee;
      'api::conference-booth.conference-booth': ApiConferenceBoothConferenceBooth;
      'api::conference-contestant.conference-contestant': ApiConferenceContestantConferenceContestant;
      'api::conference-extra.conference-extra': ApiConferenceExtraConferenceExtra;
      'api::conference-feedback.conference-feedback': ApiConferenceFeedbackConferenceFeedback;
      'api::conference-registration.conference-registration': ApiConferenceRegistrationConferenceRegistration;
      'api::conference-schedule.conference-schedule': ApiConferenceScheduleConferenceSchedule;
      'api::conference-sponsor.conference-sponsor': ApiConferenceSponsorConferenceSponsor;
      'api::conference-sponsorship.conference-sponsorship': ApiConferenceSponsorshipConferenceSponsorship;
      'api::conference-team.conference-team': ApiConferenceTeamConferenceTeam;
      'api::conference-ticket.conference-ticket': ApiConferenceTicketConferenceTicket;
      'api::conference-transaction.conference-transaction': ApiConferenceTransactionConferenceTransaction;
      'api::conference.conference': ApiConferenceConference;
      'api::contact-badge.contact-badge': ApiContactBadgeContactBadge;
      'api::contact.contact': ApiContactContact;
      'api::corporate-sponsor.corporate-sponsor': ApiCorporateSponsorCorporateSponsor;
      'api::email-log.email-log': ApiEmailLogEmailLog;
      'api::email-template.email-template': ApiEmailTemplateEmailTemplate;
      'api::events-annual-conference-attendee-roster.events-annual-conference-attendee-roster': ApiEventsAnnualConferenceAttendeeRosterEventsAnnualConferenceAttendeeRoster;
      'api::events-annual-conference-booth-roster.events-annual-conference-booth-roster': ApiEventsAnnualConferenceBoothRosterEventsAnnualConferenceBoothRoster;
      'api::events-contestant-roster.events-contestant-roster': ApiEventsContestantRosterEventsContestantRoster;
      'api::events-expo-attendee-roster.events-expo-attendee-roster': ApiEventsExpoAttendeeRosterEventsExpoAttendeeRoster;
      'api::events-expo-booth-roster.events-expo-booth-roster': ApiEventsExpoBoothRosterEventsExpoBoothRoster;
      'api::events-fall-conference-attendee-roster.events-fall-conference-attendee-roster': ApiEventsFallConferenceAttendeeRosterEventsFallConferenceAttendeeRoster;
      'api::events-fall-conference-booth-roster.events-fall-conference-booth-roster': ApiEventsFallConferenceBoothRosterEventsFallConferenceBoothRoster;
      'api::grant-application-final.grant-application-final': ApiGrantApplicationFinalGrantApplicationFinal;
      'api::grant-application-score.grant-application-score': ApiGrantApplicationScoreGrantApplicationScore;
      'api::grant-application-scoring.grant-application-scoring': ApiGrantApplicationScoringGrantApplicationScoring;
      'api::grant-payout.grant-payout': ApiGrantPayoutGrantPayout;
      'api::grant-scoring-token.grant-scoring-token': ApiGrantScoringTokenGrantScoringToken;
      'api::grant-status.grant-status': ApiGrantStatusGrantStatus;
      'api::grant-sub-status.grant-sub-status': ApiGrantSubStatusGrantSubStatus;
      'api::grant-type.grant-type': ApiGrantTypeGrantType;
      'api::grant.grant': ApiGrantGrant;
      'api::invoice.invoice': ApiInvoiceInvoice;
      'api::log.log': ApiLogLog;
      'api::membership-item.membership-item': ApiMembershipItemMembershipItem;
      'api::membership.membership': ApiMembershipMembership;
      'api::payout-status.payout-status': ApiPayoutStatusPayoutStatus;
      'api::program.program': ApiProgramProgram;
      'api::project-type.project-type': ApiProjectTypeProjectType;
      'api::registration-addon.registration-addon': ApiRegistrationAddonRegistrationAddon;
      'api::request-status.request-status': ApiRequestStatusRequestStatus;
      'api::saved-query.saved-query': ApiSavedQuerySavedQuery;
      'api::scheduled-email-task.scheduled-email-task': ApiScheduledEmailTaskScheduledEmailTask;
      'api::setting.setting': ApiSettingSetting;
      'api::soonerwarn-request.soonerwarn-request': ApiSoonerwarnRequestSoonerwarnRequest;
      'api::soonerwarn-status.soonerwarn-status': ApiSoonerwarnStatusSoonerwarnStatus;
      'api::soonerwarn.soonerwarn': ApiSoonerwarnSoonerwarn;
      'api::staff-member.staff-member': ApiStaffMemberStaffMember;
      'api::taste-test-contestant.taste-test-contestant': ApiTasteTestContestantTasteTestContestant;
      'api::training-event-log.training-event-log': ApiTrainingEventLogTrainingEventLog;
      'api::training-event-registration.training-event-registration': ApiTrainingEventRegistrationTrainingEventRegistration;
      'api::training-event.training-event': ApiTrainingEventTrainingEvent;
      'api::training-instructor-certification.training-instructor-certification': ApiTrainingInstructorCertificationTrainingInstructorCertification;
      'api::training-instructor.training-instructor': ApiTrainingInstructorTrainingInstructor;
      'api::training-log.training-log': ApiTrainingLogTrainingLog;
      'api::training-schedule-block.training-schedule-block': ApiTrainingScheduleBlockTrainingScheduleBlock;
      'api::training-schedule.training-schedule': ApiTrainingScheduleTrainingSchedule;
      'api::training-session.training-session': ApiTrainingSessionTrainingSession;
      'api::training-setting.training-setting': ApiTrainingSettingTrainingSetting;
      'api::training-topic.training-topic': ApiTrainingTopicTrainingTopic;
      'api::venue.venue': ApiVenueVenue;
      'api::watersystem.watersystem': ApiWatersystemWatersystem;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
