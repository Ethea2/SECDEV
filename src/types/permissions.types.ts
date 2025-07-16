export interface IPermissions {
  name: string
  description: string
  resource: string
  actions: string[]
  role: string
}


export enum CRUDAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete"
}
