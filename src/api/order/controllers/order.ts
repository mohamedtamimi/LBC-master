'use strict';
/**
 * order controller
 */

import { factories } from '@strapi/strapi'

const { createCoreController } = require('@strapi/strapi').factories;



module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async count(ctx) {
        try {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1); // Set time to the beginning of the next day
            let unPiad = []
            let darft = []
            const entities = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    createdAt: { $between: [currentDate.toISOString(), nextDay.toISOString()],},
                      
                    
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

            let body={
             curernty:   currentDate.toISOString(),
              next:   nextDay.toISOString()
            }



            ctx.send({ entities, sum, canceldLenght,paidLenght,unpaidLenght,draftLenght,body });
            return { sum };
        } catch (error) {
            console.error(error);
            return ctx.throw(500, 'Internal Server Error');
        }
    }

}));