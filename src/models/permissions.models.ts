import { CRUDAction, IPermissions } from "@/types/permissions.types"
import { Model, Schema, model, models } from "mongoose"

interface PermissionsModel extends Model<IPermissions> {
  checkPermission(role: string, action: CRUDAction, resource: string): Promise<boolean>
  createPermission(name: string, description: string, resource: string, role: string, actions: CRUDAction[]): Promise<IPermissions>
  addActionToRole(role: string, resource: string, action: CRUDAction): Promise<IPermissions | null>
  removeActionFromRole(role: string, resource: string, action: CRUDAction): Promise<IPermissions | null>
}

const permissionsSchema = new Schema<IPermissions, PermissionsModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  resource: {
    type: String,
    required: true,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    maxlength: 50
  },
  actions: {
    type: [String],
    required: true,
    enum: Object.values(CRUDAction),
    validate: {
      validator: function(actions: string[]) {
        return actions.length > 0;
      },
      message: 'At least one action must be specified'
    }
  }
}, { timestamps: true })

permissionsSchema.static(
  "checkPermission",
  async function checkPermission(role: string, action: CRUDAction, resource: string) {
    const permission = await this.findOne({
      role,
      resource,
      actions: { $in: [action] }
    })
    return permission !== null
  }
)

permissionsSchema.static(
  "createPermission",
  async function createPermission(name: string, description: string, resource: string, role: string, actions: CRUDAction[]) {
    const newPermission = await this.create({ name, description, resource, role, actions })
    return newPermission
  }
)

permissionsSchema.static(
  "addActionToRole",
  async function addActionToRole(role: string, resource: string, action: CRUDAction) {
    const permission = await this.findOneAndUpdate(
      { role, resource },
      { $addToSet: { actions: action } },
      { new: true }
    )
    return permission
  }
)

permissionsSchema.static(
  "removeActionFromRole",
  async function removeActionFromRole(role: string, resource: string, action: CRUDAction) {
    const permission = await this.findOneAndUpdate(
      { role, resource },
      { $pull: { actions: action } },
      { new: true }
    )
    return permission
  }
)

const Permissions = models.Permissions as unknown as PermissionsModel || model<IPermissions, PermissionsModel>("Permissions", permissionsSchema);

export default Permissions
