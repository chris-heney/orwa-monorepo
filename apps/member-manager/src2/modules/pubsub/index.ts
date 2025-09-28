import TopicList from './topics/TopicList'
import TopicCreate from './topics/TopicCreate'
import TopicEdit from './topics/TopicEdit'
import SubscriberList from './subscribers/SubscriberList'
import SubscriberCreate from './subscribers/SubscriberCreate'
import SubscriberEdit from './subscribers/SubscriberEdit'
import EventList from './events/EventList'
import EventCreate from './events/EventCreate'
import DeliveryList from './deliveries/DeliveryList'
import SubscriberShow from './subscribers/SubscriberShow'

export const pubSubTopics = {
  list: TopicList,
  create: TopicCreate,
  edit: TopicEdit,
  show: TopicEdit,
}

export const pubSubSubscribers = {
  list: SubscriberList,
  create: SubscriberCreate,
  edit: SubscriberEdit,
  show: SubscriberShow,
}

export const pubSubEvents = {
  list: EventList,
  create: EventCreate,
}

export const pubSubDeliveries = {
  list: DeliveryList,
}


