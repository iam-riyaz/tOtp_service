export interface IOtp{
    
    email: string;
    phone: number;
    secret?:string;
    expireAt?:Date;
    createdAt?:Date

}