import { DataProvider, Identifier } from 'react-admin'
import { getRelationFilterId } from './strapiIds'

/**
 * A record (or bare id) to attach an activity to, plus the `entity` name the
 * ActivityFeed filters on (`grant-application`, `grant-payouts`, `contact`, …).
 */
export interface ActivityTarget {
  entity: string
  record: { id?: unknown; entityId?: unknown } | Identifier | null | undefined
}

/**
 * `activity_relations.entity_id` is the numeric Strapi PK. The data provider
 * remaps `record.id` to the documentId (a string), so passing `record.id`
 * here used to reach MySQL as a non-numeric string and was stored as `0` —
 * the activity existed but no per-record feed could find it. Always resolve
 * through `getRelationFilterId`, which prefers the preserved `entityId`.
 */
export const resolveActivityEntityId = (record: ActivityTarget['record']): number | undefined => {
  if (record == null) return undefined
  const asRecord = typeof record === 'object' ? record : { id: record }
  const id = getRelationFilterId(asRecord)
  return id != null && id > 0 ? id : undefined
}

/**
 * Write one activity and one activity-relation per resolvable target.
 * Targets without a numeric id are skipped (and logged) rather than written
 * as `entity_id: 0`. Resolves once every relation write has settled.
 */
export const sendActivity = async (dataProvider: DataProvider, message: string, targets: ActivityTarget[]) => {
  const relations = targets.flatMap(({ entity, record }) => {
    const entityId = resolveActivityEntityId(record)
    if (entityId == null) {
      console.error('sendActivity: no numeric entity id for', entity, record)
      return []
    }
    return [{ entity, entity_id: entityId }]
  })

  if (relations.length === 0) {
    console.error('sendActivity: no resolvable targets, activity not written:', message)
    return
  }

  const activity = {
    description: message,
    timestamp: new Date(),
  }
  try {
    const response = await dataProvider.create('activities', { data: activity })

    await Promise.all(
      relations.map(async (relation) => {
        try {
          await dataProvider.create('activity-relations', {
            data: { activity: response.data.id, ...relation },
          })
        } catch (error) {
          console.error('Error sending activity:', error)
        }
      })
    )
  } catch (error) {
    console.error('Error sending activity:', error)
  }
}
