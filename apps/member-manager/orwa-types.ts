/**
 * The Goal of this file is to:
 * - provide a format to all data types used in the application(s)
 * - create "types as a service" for all ORWA distributed applications
 */

export interface IStrapiUser {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: number;
    created_at: Date;
    updated_at: Date;
}

/**
 * @description An ORWA Passport User
 */
export interface IUser extends IStrapiUser {
}

export interface IContact extends IUser {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface IStaff extends IContact {

}