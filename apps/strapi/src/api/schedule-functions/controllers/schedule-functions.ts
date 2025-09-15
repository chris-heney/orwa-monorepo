'use strict';
import dayjs from 'dayjs'
/**
 * schedule-functions controller
 */


// getUnearnedWatersystemDues: async (ctx, next) => {
//   try {
//     const { fromDate } = ctx.request.query;

//     ctx.body = await strapi.service('api::financial-audit.financial-audit').getUnearnedDues('watersystems', fromDate);
//   } catch (err) {
//     ctx.body = err;
//   }
// },
export default ({strapi}) => ({

  getTrainingSchedule: async (ctx) => {
    // strapi.service('api::apiName.serviceName').FunctionName();
    const { trainingSchedule, duplicateBlockIds } = ctx.request.body;
    ctx.body = await strapi.service('api::schedule-functions.schedule-functions').getTrainingSchedule(trainingSchedule, duplicateBlockIds)
    
  },
  updateTrainingSchedule: async (ctx) => {
    const { blocks, trainingEvent, trainingSchedule } = ctx.request.body;
    ctx.body = await strapi.service('api::schedule-functions.schedule-functions').updateTrainingSchedule(blocks, trainingEvent, trainingSchedule)
  },
  submitTrainingSchedule: async (ctx) => {
    const { trainingScheduleBlocks, eventId, duplicateBlocks, duplicateHours} = ctx.request.body;
    ctx.body = await strapi.service('api::schedule-functions.schedule-functions').submitTrainingSchedule(trainingScheduleBlocks, eventId, duplicateBlocks, duplicateHours)
  },
  duplicateTrainingSchedule: async (ctx) => {
    const { blockIds, eventId, duplicateHours } = ctx.request
    const result = await strapi.service('api::schedule-functions.schedule-functions').getTrainingSchedule(blockIds, eventId, duplicateHours)
    ctx.body = await strapi.service('api::schedule-functions.schedule-functions').submitTrainingSchedule(result.data, eventId, duplicateHours)

  }
});