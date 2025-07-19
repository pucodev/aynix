import MainModel from './main.model'

interface UserNode {
  id: number
  firstname: string
  lastname: string
}

export default class UserModel extends MainModel<UserNode> {}
