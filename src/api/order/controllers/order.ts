'use strict';
/**
 * order controller
 */

import { factories } from '@strapi/strapi'

const { createCoreController } = require('@strapi/strapi').factories;
const { DateTime } = require('luxon');


module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async count(ctx) {
        try {

            const { startDate, endDate } = ctx.request.query;

            const startDateTime = DateTime.fromISO(startDate).startOf('day').toJSDate();
            const endDateTime = DateTime.fromISO(endDate).endOf('day').toJSDate();

            const currentDate = DateTime.now().startOf('day').toJSDate();
            const currentEndDate = DateTime.now().endOf('day').toJSDate();
            const bodycurrentDate=[currentDate,currentEndDate]
            const selectedtDate=[startDateTime,endDateTime]
            const entities = await strapi.entityService.findMany('api::order.order', {
                populate: '*',
                filters: {
                    createdAt: { $between: startDate?selectedtDate:bodycurrentDate},
                      
                    
                    status: { $ne: 'Canceled' }
                }
            });
            let sum = 0;
            entities.forEach(entity => {
                sum += entity.cash;
            });



            const canceld = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    status: { $eq: 'Canceled' },
                    hide:{$eq:false}
                }
            });
            let canceldLenght = canceld.length


            const paid = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    status: { $eq: 'Paid', },
                    hide:{$eq:false}
                }
            });
            let paidLenght = paid.length

            const unpaid = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    status: { $eq: 'Unpaid' },
                    hide:{$eq:false}
                }
            });
            let unpaidLenght = unpaid.length

            const draft = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    status: { $eq: 'Draft' },
                    hide:{$eq:false}
                }
            });
            let draftLenght = draft.length



            ctx.send({ entities, sum, canceldLenght,paidLenght,unpaidLenght,draftLenght });
        } catch (error) {
            console.error(error);
            return ctx.throw(500, 'Internal Server Error');
        }
    }

}));