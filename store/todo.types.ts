export interface IResponse{
    data:IData[]
}

export interface IData{
    name:string,
    email:string,
    phone:string,
    status:boolean,
    id:number,
}

export interface IPostPayload{
    name:string,
    email:string,
    phone:string,
    status:boolean,
}