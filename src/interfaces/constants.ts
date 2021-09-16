import type { PrivilegesType, ActionsType } from './';
// ******** <CONSTANTS> ********

export const READ = 'has_read_privilege';
export type READ_TYPE = typeof READ;
export const CREATE = 'has_create_privilege';
export type CREATE_TYPE = typeof CREATE;
export const UPDATE = 'has_update_privilege';
export type UPDATE_TYPE = typeof UPDATE;
export const DELETE = 'has_delete_privilege';
export type DELETE_TYPE = typeof DELETE;
export const ADMIN = 'has_admin_privilege';
export type ADMIN_TYPE = typeof ADMIN;
