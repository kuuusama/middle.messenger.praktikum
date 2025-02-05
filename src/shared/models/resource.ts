export default interface IResource {
    id:	number, //Message id
    user_id: number, //User id
    path: string, //Server relative file path
    filename: string, //Initial file name
    content_type: string, //File content type (e.g "image/jpeg" for .jpg images)
    content_size: number, //File size in bytes
    upload_date: string, //Resource uploading time
}
