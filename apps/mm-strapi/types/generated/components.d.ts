import type { Schema, Struct } from '@strapi/strapi';

export interface CertificationCertifications extends Struct.ComponentSchema {
  collectionName: 'components_certification_certifications';
  info: {
    displayName: 'certifications';
  };
  attributes: {
    certification: Schema.Attribute.Enumeration<
      [
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
    >;
  };
}

export interface ConferenceConferenceDetails extends Struct.ComponentSchema {
  collectionName: 'components_conference_conference_details';
  info: {
    description: '';
    displayName: 'Conference Details';
    icon: 'information';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    hidden: Schema.Attribute.Boolean;
    important: Schema.Attribute.Boolean;
    order: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface ConferenceExtrasPurchased extends Struct.ComponentSchema {
  collectionName: 'components_extras_purchaseds';
  info: {
    displayName: 'Conference Extras Purchased';
    icon: 'apps';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    extra_type: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-extra.conference-extra'
    >;
  };
}

export interface ConferenceLineItems extends Struct.ComponentSchema {
  collectionName: 'components_conference_line_items';
  info: {
    description: '';
    displayName: 'Line Items';
    icon: 'bulletList';
  };
  attributes: {
    addon: Schema.Attribute.Relation<
      'oneToOne',
      'api::registration-addon.registration-addon'
    >;
    item: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-extra.conference-extra'
    >;
    key: Schema.Attribute.String;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ConferenceSponsorships extends Struct.ComponentSchema {
  collectionName: 'components_conference_sponsorships';
  info: {
    description: '';
    displayName: 'sponsorships';
  };
  attributes: {
    key: Schema.Attribute.String;
    label: Schema.Attribute.String;
    sponsorship: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-sponsorship.conference-sponsorship'
    >;
    value: Schema.Attribute.Decimal;
  };
}

export interface ConferenceTicketsPurchased extends Struct.ComponentSchema {
  collectionName: 'components_tickets_purchaseds';
  info: {
    displayName: 'Tickets Purchased';
    icon: 'file';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    ticket_type: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-ticket.conference-ticket'
    >;
  };
}

export interface LocationCoordinates extends Struct.ComponentSchema {
  collectionName: 'components_location_coordinates';
  info: {
    description: '';
    displayName: 'Coordinates';
  };
  attributes: {
    altitude: Schema.Attribute.Float;
    latitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'35.4828466'>;
    longitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'-97.6192809'>;
  };
}

export interface RenewalMembershipRenewal extends Struct.ComponentSchema {
  collectionName: 'components_renewal_membership_renewals';
  info: {
    displayName: 'Membership Renewal';
    icon: 'air-freshener';
  };
  attributes: {
    application_type: Schema.Attribute.Enumeration<['Paper', 'Electronic']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Paper'>;
    date_renewed: Schema.Attribute.Date &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'2022-01-01'>;
    membership_notes: Schema.Attribute.RichText;
    payment_type: Schema.Attribute.Enumeration<
      ['Invoice', 'Electronic', 'Other']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Invoice'>;
    renewal_amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface SharedFieldMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_field_metas';
  info: {
    description: '';
    displayName: 'Field Meta';
    icon: 'oneToMany';
  };
  attributes: {
    item: Schema.Attribute.Relation<
      'oneToOne',
      'api::conference-extra.conference-extra'
    >;
    key: Schema.Attribute.String;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SimpleAddress extends Struct.ComponentSchema {
  collectionName: 'components_simple_addresses';
  info: {
    description: '';
    displayName: 'address';
    icon: 'address-card';
  };
  attributes: {
    city: Schema.Attribute.String;
    name: Schema.Attribute.String;
    state: Schema.Attribute.Enumeration<
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
    street: Schema.Attribute.String;
    zip: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 12;
      }>;
  };
}

export interface SimpleComplianceVioloations extends Struct.ComponentSchema {
  collectionName: 'components_simple_compliance_violoations';
  info: {
    displayName: 'Compliance Violoations';
  };
  attributes: {
    reference_file: Schema.Attribute.Media<'files'>;
    reference_number: Schema.Attribute.String;
  };
}

export interface SimpleLineItems extends Struct.ComponentSchema {
  collectionName: 'components_simple_line_items';
  info: {
    description: '';
    displayName: 'Line Items';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    estimates: Schema.Attribute.Media<'files', true>;
    name: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['Product', 'Service']>;
  };
}

export interface SimpleProjectFunding extends Struct.ComponentSchema {
  collectionName: 'components_simple_project_fundings';
  info: {
    displayName: 'Project Funding';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    funding_source: Schema.Attribute.Enumeration<
      ['Grants', 'Loans', 'Self Funded']
    >;
  };
}

export interface SimpleSelectedGrantFields extends Struct.ComponentSchema {
  collectionName: 'components_simple_selected_grant_fields';
  info: {
    description: '';
    displayName: 'Selected Grant Fields';
  };
  attributes: {
    field: Schema.Attribute.String;
    name: Schema.Attribute.String;
    type: Schema.Attribute.String;
  };
}

export interface SimpleTrainingBlock extends Struct.ComponentSchema {
  collectionName: 'components_simple_training_blocks';
  info: {
    displayName: 'Training Block';
  };
  attributes: {
    am_pm: Schema.Attribute.Enumeration<['AM', 'PM']>;
    date: Schema.Attribute.Date;
    training_topics: Schema.Attribute.Relation<
      'oneToMany',
      'api::training-topic.training-topic'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'certification.certifications': CertificationCertifications;
      'conference.conference-details': ConferenceConferenceDetails;
      'conference.extras-purchased': ConferenceExtrasPurchased;
      'conference.line-items': ConferenceLineItems;
      'conference.sponsorships': ConferenceSponsorships;
      'conference.tickets-purchased': ConferenceTicketsPurchased;
      'location.coordinates': LocationCoordinates;
      'renewal.membership-renewal': RenewalMembershipRenewal;
      'shared.field-meta': SharedFieldMeta;
      'simple.address': SimpleAddress;
      'simple.compliance-violoations': SimpleComplianceVioloations;
      'simple.line-items': SimpleLineItems;
      'simple.project-funding': SimpleProjectFunding;
      'simple.selected-grant-fields': SimpleSelectedGrantFields;
      'simple.training-block': SimpleTrainingBlock;
    }
  }
}
