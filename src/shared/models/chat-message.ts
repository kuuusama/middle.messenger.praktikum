import IResource from "./resource"

export default interface IChatMessage {
    id:	number, //Message id
    user_id: number, //User id
    chat_id: number, //Chat id
    time: string, //($date-time) Message sent time
    type: string, //Message type Enum: Array [ 2 ]
    content: string //Message content (message text for messages and resourceId for files)
    file: IResource
    }
    