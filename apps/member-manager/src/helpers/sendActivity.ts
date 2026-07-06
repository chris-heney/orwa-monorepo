import { DataProvider, Identifier } from 'react-admin'

export const sendActivity = async (dataProvider: DataProvider, entity: string, message: string, entity_ids: Identifier[]) => {

  const activity = {
    description: message,
    timestamp : new Date(),
  } 
  try {
    const response = await dataProvider.create('activities', { data: activity })
   
    entity_ids.map(async (id) => {
      const relatedActivity = {
        activity: response.data.id,
        entity,
        entity_id: id        
      }
      try {
        await dataProvider.create('activity-relations', { data: relatedActivity })
      } catch (error) {
        console.error('Error sending activity:', error)
      }
    })
  } catch (error) {
    console.error('Error sending activity:', error)
  }
  //send a post to activity-relations with the activity id and the entity id
}