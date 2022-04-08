import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Card Collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
    boardId: Joi.string().required(), // need to convert to ObjectId when create (for lookup)
    columnId: Joi.string().required(), // need to convert to ObjectId when create (for lookup)
    title: Joi.string().required().min(3).max(30),
    cover: Joi.string().default(null),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await cardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validatedData = await validateSchema(data)
        const insertData = {
            ...validatedData,
            boardId: ObjectId(validatedData.boardId),
            columnId: ObjectId(validatedData.columnId)
        }
        const result = await getDB().collection(cardCollectionName).insertOne(insertData)
        return result
    } catch (err) {
        throw new Error(err)
    }
}

const findOneById = async (id) => {
    try {
        const result = await getDB().collection(cardCollectionName).findOne({ _id: ObjectId(id) })
        return result
    } catch (err) {
        throw new Error(err)
    }
}

export const CardModel = {
    cardCollectionName,
    createNew,
    findOneById
}