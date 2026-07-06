/**
 * @author marcos
 * @date 2023-11-03
 * @version 1.0.0
 * @version 1.0.0
 * @license MIT
 * @repository https://github.com/marcosvmd/tribe-events-api
 * @license
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
 * the rights of any copyright holders to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to be used, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so.
 */

/**
 * Endpoints:
 * /tribe/events/v1
 * /tribe/events/v1/doc
 * /tribe/events/v1/events
 * /tribe/events/v1/events/(?P<id>\\d+)
 * /tribe/events/v1/events/by-slug/(?P<slug>[^/]+)
 * /tribe/events/v1/venues
 * /tribe/events/v1/venues/(?P<id>\\d+)
 * /tribe/events/v1/venues/by-slug/(?P<slug>[^/]+)
 * /tribe/events/v1/organizers
 * /tribe/events/v1/organizers/(?P<id>\\d+)
 * /tribe/events/v1/organizers/by-slug/(?P<slug>[^/]+)
 * /tribe/events/v1/categories
 * /tribe/events/v1/categories/(?P<id>\\d+)
 * /tribe/events/v1/tags
 * /tribe/events/v1/tags/(?P<id>\\d+)
 * 
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/events/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/venues/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/organizers/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/categories/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/tags/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/doc/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/events/by-slug/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/venues/by-slug/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/organizers/by-slug/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/events/(?P<id>\\d+)/
 * @see https://docs.theeventscalendar.com/reference/sdks/tribe-events-rest-api/v1/venues/(?P<id>\\d+)/
 * 
 * Usage:
 * import ModernTribeEventController from './ModernTribeEventController'
 * const eventCalendarController = ModernTribeEventController.getInstance()
 * const events = await eventCalendarController.getEvents()
 */

export interface ModernTribeEvent {
  title: string
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
  starts_before?: string
  starts_after?: string
  ends_before?: string
  ends_after?: string
  strict_dates?: boolean
  search?: string
  categories?: number[]
  tags?: number[]
  venue?: number[]
  organizer?: number[]
  featured?: boolean
  status?: string
  description?: string
  geoloc?: boolean
  geoloc_lat?: number
  geoloc_lng?: number
  include?: number[]
  post_parent?: number
  ticketed?: boolean
  notifyOperators?: boolean
  notifySystemOffices?: boolean
}

/**
 * @class TribeEventsController
 * @constructor
 * @description An API middleware to interface with WordPress' Tribes Events Calendar API to create events.
 */
class ModernTribeEventController {
  private static instance: ModernTribeEventController

  private constructor() {}
  private username = import.meta.env.VITE_EVENT_USER
  private password = import.meta.env.VITE_EVENT_PASSWORD
  private authString = `${this.username}:${this.password}`
  private encodedAuthString = btoa(this.authString)
  private authHeader = `Basic ${this.encodedAuthString}`

  public static getInstance(): ModernTribeEventController {
    if (!this.instance) {
      this.instance = new ModernTribeEventController()
    }

    return this.instance
  }

  private async fetch<T>(url: string, authHeader?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': this.authHeader,
    }
  
    if (authHeader) {
      headers['Authorization'] = this.authHeader
    }
  
    const response = await fetch(url, {
      headers,
    })
  
    return await response.json()
  }

  // Get all events
  public async getEvents(): Promise<Event[]> {
    return await this.fetch(`${import.meta.env.VITE_EVENTS_ENDPOINT}/events`)
  }

  public async createEvent(event: ModernTribeEvent): Promise<Event> {
    const response = await fetch(`${import.meta.env.VITE_EVENTS_ENDPOINT}/events`, {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (response.ok) {
      const createdPost = await response.json()
      return createdPost
    } else {
      throw new Error('Failed to create a new post.')
    }
  }

}

export default ModernTribeEventController