import messagesModel from '../models/messages.js'

export default class Messages{
   
    constructor(){
        //console.log('Trabajando con mensajes en mongoDB')
    }
    getAll = async() => {
        let messages = await messagesModel.find().lean()
        return messages;
    }

    getById = async(id) => {
        let message = await messagesModel.find({_id: id})
        return message;
    }

    addMessage = async (message) => {
        let result = await messagesModel.create(message)
        return result;
    }

    updateMessage = async (id, message) => {
        let result = await messagesModel.updateOne({_id: id}, message)
        return result
    }

    deleteMessage = async (id) => {
        let message = await messagesModel.deleteOne({_id: id})
        return message
    }
}