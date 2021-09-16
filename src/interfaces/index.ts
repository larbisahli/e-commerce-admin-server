import { Request, Response, NextFunction } from 'express';
import type {READ_TYPE, CREATE_TYPE, UPDATE_TYPE, DELETE_TYPE, ADMIN_TYPE} from '../interfaces/constants'

export type PrivilegesType = (READ_TYPE | CREATE_TYPE | UPDATE_TYPE | DELETE_TYPE | ADMIN_TYPE)[]
export type ActionsType = [(READ_TYPE | CREATE_TYPE | UPDATE_TYPE | DELETE_TYPE), ADMIN_TYPE?]

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
export interface AuthType {
  account_uid: string;
  is_active: boolean;
  privileges: PrivilegesType;
}
export interface GraphQLContextType{
  cookies: unknown
  account_uid: string
  privileges: PrivilegesType
  redis: unknown
  ip: string
}

export interface QueryPermissionType {
  privileges: PrivilegesType 
  actions: ActionsType
}