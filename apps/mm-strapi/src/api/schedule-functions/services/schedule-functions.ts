'use strict';
import dayjs from 'dayjs'
/**
 * schedule-functions service
 */

export default ({ strapi }) => ({
    getTrainingSchedule: async (trainingSchedule, duplicateBlockIds) => {
        try {

            // Ensure that trainingSchedule is provided
            if (!trainingSchedule || trainingSchedule.length === 0) {
                if (duplicateBlockIds === undefined) {
                    return false
                }
            }

            const blockIds = duplicateBlockIds ? duplicateBlockIds : trainingSchedule.flatMap((item) =>
                item.training_schedule_blocks.map((block) => block !== null ? block : block.id)
            );

            // Fetch blocks using block IDs
            const blocks = await strapi.documents('api::training-schedule-block.training-schedule-block').findMany({
                filters: { id: blockIds },
                populate: "*",
            });
            // Extract session IDs from blocks
            const sessionIds = blocks?.flatMap((block) => block.training_sessions.map((session) => session.id));

            // Fetch sessions using session IDs

            const sessions = await strapi.documents('api::training-session.training-session').findMany({
                filters: { id: sessionIds as object },
                populate: "*",
            });



            // Fetch topics using topic IDs
            const instructors = await strapi.documents('api::training-instructor.training-instructor').findMany({
                populate: '*',
            })
            // Update the blocks with the correct sessions
            const updatedBlocks = blocks?.flatMap((block) => {

                const blockSessionIds = block.training_sessions.map((session) => session.id);
                const blockSessions = sessions
                    .filter((session) => blockSessionIds.includes(session.id))
                    .map((formattedSession) => {

                        const instructor = instructors?.find((t) => t.id === formattedSession.training_instructor.id)
                        return {
                            ...formattedSession,
                            start: formattedSession.start,
                            end: formattedSession.end,
                            topic: formattedSession.topic,
                            training_instructor: instructor,
                        };
                    });

                return {
                    ...block,
                    sessions: blockSessions,
                };
            });

            // Return the updated blocks or send them as a response
            // ctx.send({ data: updatedBlocks });
            console.log('updatedBlocks: ', updatedBlocks)
            return { data: updatedBlocks }
        } catch (error) {
            console.error('Error loading training schedule:', error);
            // ctx.throw(500, 'Internal Server Error');
            return false
        }
    },
    updateTrainingSchedule: async ( blocks , trainingEvent, trainingSchedule ) => {
    
        try {
            const updatedSessionIds: number[] = []
            const updatedBlockIds: number[] = []

            let totalHours = 0
            let totalMinutes = 0
            // Iterate over each updated trainingSchedule block
            for (const updatedBlock of blocks) {
                const blockSessions = updatedBlock.sessions || []
                // Iterate over each session in the block
                for (const updatedSession of blockSessions) {

                    // Check if the session has an ID (existing session)
                    if (updatedSession.id) {

                        // Update the existing session
                        try {
                            await strapi.documents('api::training-session.training-session').update({
                                documentId: "__TODO__",
                                previousData: { ...updatedSession },

                                // depends on dataProvider either topic or topic.id
                                data: {
                                    topic: updatedSession.topic != null ? updatedSession.topic : null,
                                    training_instructor: updatedSession.training_instructor?.id ? updatedSession.training_instructor.id : null,
                                    summary: updatedSession.summary,
                                    category: updatedSession.category,
                                    start: typeof updatedSession.start === 'string' ? dayjs('2005-08-04 ' + updatedSession.start).format('HH:mm:ss.SSS') : dayjs(updatedSession.start).format('HH:mm:ss.SSS'),
                                    end: typeof updatedSession.end === 'string' ? dayjs('2005-08-04 ' + updatedSession.end).format('HH:mm:ss.SSS') : dayjs(updatedSession.end).format('HH:mm:ss.SSS'),
                                }
                            })
                            updatedSessionIds.push(updatedSession.id as number)
                            //format the start and end times so day js handles and allows for updating times correctly and get total time

                            const formattedStart = dayjs('2005-08-04 ' + updatedSession.start, 'YYYY-MM-DD h:mm:ss')
                            const formattedEnd = dayjs('2005-08-04 ' + updatedSession.end, 'YYYY-MM-DD h:mm:ss')


                            const minutes = formattedEnd.diff(formattedStart, 'minutes',)
                            const hours = formattedStart.diff(formattedEnd, 'hours',)
                            totalMinutes += Math.ceil(minutes / 60)
                            totalHours += hours

                        } catch (updateSessionError) {
                            return false
                            // ctx.throw(500, 'Error updating existing session');
                        }
                    } else {

                        try {

                            const response = await strapi.documents('api::training-session.training-session').create({
                                data: {
                                    topic: updatedSession.topic?.id,
                                    training_instructor: updatedSession.training_instructor?.id,
                                    summary: updatedSession.summary,
                                    category: updatedSession.category,
                                    start: updatedSession.start,
                                    end: updatedSession.end,
                                },
                            })

                            updatedSessionIds.push(response.id as number)
                            const start = dayjs('2005-08-04 ' + updatedSession.start, 'YYYY-MM-DD h:mm:ss')
                            const end = dayjs('2005-08-04 ' + updatedSession.end, 'YYYY-MM-DD h:mm:ss')

                            const minutes = end.diff(start, 'minutes',)
                            const hours = end.diff(start, 'hours',)

                            totalMinutes += Math.ceil(minutes / 60)
                            totalHours += hours

                        } catch (createSessionError) {
                            console.log('Error updating existing session:', createSessionError)
                            return false
                        }
                    }
                }

                if (updatedBlock.id) {
                    // Update the existing block

                    try {
                        console.log('updating block')
                        const response = await strapi.documents('api::training-schedule-block.training-schedule-block').update({
                            documentId: "__TODO__",
                            previousData: { ...updatedBlock },

                            data: {
                                am_pm: updatedBlock.am_pm,
                                training_sessions: updatedSessionIds,
                            }
                        })
                        updatedBlockIds.push(response?.id as number)
                    } catch (updateBlockError) {
                        return false
                    }
                } else {
                    // Create a new block and capture the response
                    try {
                        console.log('creating block')
                        const response = await strapi.documents('api::training-schedule-block.training-schedule-block').create({
                            data: {
                                am_pm: updatedBlock.am_pm,
                                training_sessions: updatedSessionIds,
                            },
                        })
                        updatedBlockIds.push(response.id as number)
                    } catch (createBlockError) {
                        console.log('Error creating new block:', createBlockError)
                        return false
                    }
                }

                updatedSessionIds.length = 0
            }

            // Update the training trainingSchedule with the new block IDs
            if (trainingSchedule && trainingSchedule[0].id) {
                console.log('updating training schedule')
                try {
                    await strapi.documents('api::training-schedule.training-schedule').update({
                        documentId: "__TODO__",
                        previousData: { ...trainingSchedule },

                        data: {
                            training_schedule_blocks: updatedBlockIds,
                        }
                    })
                    // turnOnSuccessNotification('Training Schedule Was Successfully Updated')
                    // ctx.send({ message: 'Training Schedule Was Successfully Updated.....' });
                    return true
                } catch (updateTrainingScheduleError) {
                    console.log('Error updating training schedule:', updateTrainingScheduleError)
                    // return false
                }

                const totlaDuration = (totalHours + totalMinutes)

                await strapi.documents('api::training-event.training-event').update({
                    documentId: "__TODO__",
                    previousData: { ...trainingEvent.data },

                    data: {
                        hours: totlaDuration
                    }
                })
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    },
    submitTrainingSchedule: async (trainingScheduleBlocks, eventId, duplicateBlocks, duplicateHours) => {
        
        const createdSessionIds: number[] = []
        const createdBlockIds: number[] = []
        let createdScheduleId;
        let totalHours = 0;
        let totalMinutes = 0;
        console.log('CREATING TRAINING SCHEDULE')
        console.log('trainingScheduleBlocks: ', trainingScheduleBlocks)
        const scheduleBlocks = trainingScheduleBlocks ? trainingScheduleBlocks : duplicateBlocks
        console.log('scheduleBlocks: ', scheduleBlocks)
        console.log('scheduleBlocks: ', scheduleBlocks[0].sessions[0])

        try {
            // Iterate over each trainingSchedule block
            for (const trainingScheduleBlock of scheduleBlocks) {

                for (const session of trainingScheduleBlock.sessions) {
                    // Create the training session and capture the response
                    console.log('session: ', session)
                    console.log('session.start: ', session.start)
                    console.log('session.end: ', session.end)

                    const response = await strapi.documents('api::training-session.training-session').create({
                        data: {
                            topic: session.topic?.id,
                            training_instructor: session.training_instructor?.id,
                            summary: session.summary,
                            category: session.category,
                            start: duplicateBlocks ? typeof session.start === 'string' ? dayjs('2005-08-04 ' + session.start).format('HH:mm:ss.SSS') : dayjs(session.start).format('HH:mm:ss.SSS') : session.start,
                            end: duplicateBlocks ? typeof session.end === 'string' ? dayjs('2005-08-04 ' + session.end).format('HH:mm:ss.SSS') : dayjs(session.end).format('HH:mm:ss.SSS') : session.end,
                        },
                    });
                    // Extract and store the generated ID
                    const createdSessionId = response.id as number;
                    createdSessionIds.push(createdSessionId);

                    const start = dayjs('2005-08-04 ' + session.start, 'YYYY-MM-DD h:mm:ss')
                    const end = dayjs('2005-08-04 ' + session.end, 'YYYY-MM-DD h:mm:ss')

                    const minutes = end.diff(start, 'minutes');
                    const hours = end.diff(start, 'hours');
                    totalMinutes += Math.ceil(minutes / 60);
                    totalHours += hours;
                }

                // Create the training schedule block and capture the response
                const response2 = await strapi.documents('api::training-schedule-block.training-schedule-block').create({
                    data: {
                        am_pm: trainingScheduleBlock.am_pm,
                        training_sessions: createdSessionIds,
                    },
                });

                // Extract and store the generated ID
                const createdBlockId = response2.id as number;
                createdBlockIds.push(createdBlockId);
                createdSessionIds.length = 0;
            }

            // Create the training schedule and capture the response
            const response3 = await strapi.documents('api::training-schedule.training-schedule').create({
                data: {
                    event: eventId,
                    training_schedule_blocks: createdBlockIds,
                },
            });
            console.log('Training Schedule Was Successfully Created.....', response3)
            // Extract and store the generated ID
            createdScheduleId = response3.id;

            const totalDuration = totalHours + totalMinutes;

            // Update the training event with the new schedule ID and total duration
            await strapi.documents('api::training-event.training-event').update({
                documentId: "__TODO__",

                data: {
                    hours: duplicateHours ? duplicateHours : totalDuration,
                    schedule: createdScheduleId,
                }
            });

            // ctx.send({ message: 'Training Schedule Was Successfully Created.....' });
            return true
        } catch (error) {
            // Rollback transaction on error
            console.log('error: ', error)
            return false
        }
    }
});
