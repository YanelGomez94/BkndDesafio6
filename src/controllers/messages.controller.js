import messageService from '../services/messages.service.js'

class MessageController{
    
    getMessages = async (req,res) =>{
        try{
            const result = await messageService.getMessages()
            res.send({ status:"success", payload: result})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to load messages. ${e.message}`})
        }
    }

    createMessage = async(req,res)=>{
        try{
            const {message }= req.body
            const result = await messageService.createMessage(message)
            res.send({ status:"success", payload: result})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to load messages. ${e.message}`})
        }
    }
}

export default new MessageController()