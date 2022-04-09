import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'
import { ColumnModel } from './column.model'
import { CardModel } from './card.model'

// Define Board Collection
const boardCollectionName = 'boards'
const boardCollectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(20),
    columnOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await boardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await getDB().collection(boardCollectionName).insertOne(value)
        return result
    } catch (err) {
        throw new Error(err)
    }
}

/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
const pushColumnOrder = async (boardId, columnId) => {
    try {
        const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
            { _id: ObjectId(boardId) },
            { $push: { columnOrder: columnId } },
            { returnDocument: 'after' }
        )
        return result.value
    } catch (err) {
        throw new Error(err)
    }
}

const getFullBoard = async (boardId) => {
    try {
        const result = await getDB().collection(boardCollectionName).aggregate([
            {
                $match: {
                    _id: ObjectId(boardId),
                    _destroy: false
                }
            },
            // Use $addFields to convert _id from ObjectId to String for lookup
            // {
            //     $addFields: {
            //         _id: { $toString: '$_id' }
            //     }
            // },
            {
                $lookup: {
                    from: ColumnModel.columnCollectionName, //Collection's name.
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'columns'
                }
            },
            {
                $lookup: {
                    from: CardModel.cardCollectionName, //Collection's name.
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards'
                }
            }
        ]).toArray()

        return result[0] || {}
    } catch (err) {
        throw new Error(err)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(boardCollectionName).findOne({ _id: ObjectId(id) })
        return result
    } catch (err) {
        throw new Error(err)
    }
}

export const BoardModel = {
    createNew,
    pushColumnOrder,
    getFullBoard,
    findOneById
}