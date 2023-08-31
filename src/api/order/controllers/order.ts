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
            const currentDate = DateTime.now().startOf('day');
            let unPiad = []
            let darft = []
            const entities = await strapi.entityService.findMany('api::order.order', {
                populate: { someRelation: true },
                filters: {
                    createdAt: { $between: [currentDate.toJSDate(),currentDate.plus({ days: 1 }).toJSDate()],},
                      
                    
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
                date: currentDate,
             curernty:  currentDate.toJSDate(),
              next: currentDate.plus({ days: 1 }).toJSDate()
            }



            ctx.send({ entities, sum, canceldLenght,paidLenght,unpaidLenght,draftLenght,body });
            return { sum };
        } catch (error) {
            console.error(error);
            return ctx.throw(500, 'Internal Server Error');
        }
    }

}));