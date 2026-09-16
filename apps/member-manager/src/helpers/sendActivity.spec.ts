import { describe, expect, it, vi } from 'vitest'
import type { DataProvider } from 'react-admin'
import { resolveActivityEntityId, sendActivity } from './sendActivity'

const DOC_ID = 'z0qee4nrq9pjg92ecbj9iyzf'

const makeProvider = () => {
  const create = vi.fn(async (resource: string, params: { data: Record<string, unknown> }) => {
    if (resource === 'activities') {
      return { data: { id: 'activitydocid0000000000', entityId: 210647, ...params.data } }
    }
    return { data: { id: 'relationdocid00000000000', ...params.data } }
  })
  return { provider: { create } as unknown as DataProvider, create }
}

describe('resolveActivityEntityId', () => {
  it('prefers the numeric entityId the data provider preserves', () => {
    expect(resolveActivityEntityId({ id: DOC_ID, entityId: 20421 })).toBe(20421)
  })

  it('accepts a bare numeric id or numeric string', () => {
    expect(resolveActivityEntityId(20421)).toBe(20421)
    expect(resolveActivityEntityId('20421')).toBe(20421)
    expect(resolveActivityEntityId({ id: 20421 })).toBe(20421)
  })

  it('never turns a documentId into an id', () => {
    expect(resolveActivityEntityId(DOC_ID)).toBeUndefined()
    expect(resolveActivityEntityId({ id: DOC_ID })).toBeUndefined()
    expect(resolveActivityEntityId(null)).toBeUndefined()
    expect(resolveActivityEntityId(undefined)).toBeUndefined()
  })
})

describe('sendActivity', () => {
  it('writes the numeric PK as entity_id for a documentId-keyed record', async () => {
    const { provider, create } = makeProvider()

    await sendActivity(provider, 'Grant Application Was Updated to Approved', [
      { entity: 'grant-application', record: { id: DOC_ID, entityId: 20421 } },
    ])

    expect(create).toHaveBeenCalledTimes(2)
    expect(create.mock.calls[0][0]).toBe('activities')
    expect(create.mock.calls[0][1].data).toMatchObject({ description: 'Grant Application Was Updated to Approved' })
    expect(create.mock.calls[1][0]).toBe('activity-relations')
    expect(create.mock.calls[1][1].data).toEqual({
      activity: 'activitydocid0000000000',
      entity: 'grant-application',
      entity_id: 20421,
    })
  })

  it('writes one relation per target under its own entity name', async () => {
    const { provider, create } = makeProvider()

    await sendActivity(provider, 'Grant Payout for X was Approved', [
      { entity: 'grant-payouts', record: { id: 'payoutdocid0000000000000', entityId: 3614 } },
      { entity: 'grant-application', record: { id: DOC_ID, entityId: 20308 } },
    ])

    const relationWrites = create.mock.calls.filter(([resource]) => resource === 'activity-relations')
    expect(relationWrites.map(([, params]) => params.data)).toEqual([
      expect.objectContaining({ entity: 'grant-payouts', entity_id: 3614 }),
      expect.objectContaining({ entity: 'grant-application', entity_id: 20308 }),
    ])
  })

  it('skips targets without a numeric id instead of writing entity_id 0', async () => {
    const { provider, create } = makeProvider()
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await sendActivity(provider, 'msg', [
      { entity: 'grant-application', record: { id: DOC_ID } },
      { entity: 'grant-payouts', record: { id: 'payoutdocid0000000000000', entityId: 3614 } },
    ])

    const relationWrites = create.mock.calls.filter(([resource]) => resource === 'activity-relations')
    expect(relationWrites).toHaveLength(1)
    expect(relationWrites[0][1].data).toMatchObject({ entity: 'grant-payouts', entity_id: 3614 })
    expect(relationWrites.some(([, params]) => params.data.entity_id === 0)).toBe(false)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('writes nothing at all when no target resolves', async () => {
    const { provider, create } = makeProvider()
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await sendActivity(provider, 'msg', [{ entity: 'grant-application', record: { id: DOC_ID } }])

    expect(create).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it('resolves only after every relation write has settled', async () => {
    let releaseRelation: () => void = () => undefined
    const create = vi.fn(async (resource: string, params: { data: Record<string, unknown> }) => {
      if (resource === 'activities') return { data: { id: 'act', ...params.data } }
      await new Promise<void>((resolve) => { releaseRelation = resolve })
      return { data: { id: 'rel', ...params.data } }
    })
    const provider = { create } as unknown as DataProvider

    let settled = false
    const pending = sendActivity(provider, 'msg', [{ entity: 'contact', record: { id: 'abc', entityId: 7 } }]).then(() => { settled = true })
    await Promise.resolve()
    await Promise.resolve()
    expect(settled).toBe(false)
    releaseRelation()
    await pending
    expect(settled).toBe(true)
  })
})
