import { User as UserModel } from '@/models/user.model'
import { CreateUserInput } from '@/modules/users/user.schema'

export function createUser(user: CreateUserInput) {
  return UserModel.create(user)
}
