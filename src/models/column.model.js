import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

// Define Column Collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
    boardId: Joi.string().required(), // need to convert to ObjectId when create (for lookup)
    title: Joi.string().required().min(3).max(20).trim(),
    cardOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await columnCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validatedData = await validateSchema(data)
        const insertData = {
            ...validatedData,
            boardId: ObjectId(validatedData.boardId)
        }
        const result = await getDB().collection(columnCollectionName).insertOne(insertData)
        return result
    } catch (err) {
        throw new Error(err)
    }
}

/**
 *
 * @param {string} columnId
 * @param {string} cardId
 */
const pushCardOrder = async (columnId, cardId) => {
    try {
        const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
            { _id: ObjectId(columnId) },
            { $push: { cardOrder: cardId } },
            { returnDocument: 'after' }
        )
        return result.value
    } catch (err) {
        throw new Error(err)
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            boardId: ObjectId(data.boardId)
        }
        const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        )
        return result.value
    } catch (err) {
        throw new Error(err)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(columnCollectionName).findOne({ _id: ObjectId(id) })
        return result
    } catch (err) {
        throw new Error(err)
    }
}

export const ColumnModel = {
    columnCollectionName,
    createNew,
    update,
    findOneById,
    pushCardOrder
}