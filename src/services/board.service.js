import { BoardModel } from '*/models/board.model'

const createNew = async (data) => {
    try {
        const createdBoard = await BoardModel.createNew(data)
        const newBoard = await BoardModel.findOneById(createdBoard.insertedId)
        return newBoard
    } catch (error) {
        throw new Error(error)
    }
}

const getFullBoard = async (boardId) => {
    try {
        const board = await BoardModel.getFullBoard(boardId)
        if (!board || !board.columns) {
            throw new Error('Board not found')
        }
        // Move card to right column
        board.columns.forEach(column =>
            column.cards = board.cards.filter(card => card.columnId.toString() === column._id.toString())
        )
        // Remove cards data after move to column
        delete board.cards
        return board
    } catch (error) {
        throw new Error(error)
    }
}

export const BoardService = { createNew, getFullBoard }