interface User {
  name: string
  id: number | string
  email?: string | null
  readonly createAt: Date
}

const user: User = {
  name: 'gxj',
  id: 123,
  createAt: new Date(),
}

interface OldUser extends User {
  lastLogin: Date
}

const oldUser: OldUser = {
  name: 'old_gxj',
  id: 'u_456',
  lastLogin: new Date('2023-01-01'),
  createAt: new Date('2022-01-01'),
}
console.log('User:', user)
console.log('OldUser:', oldUser)

function printUserInfo(u: User): void {
  console.log(`User Info - Name: ${u.name}, ID: ${u.id}, Created At: ${u.createAt}`)
}

printUserInfo(user)
printUserInfo(oldUser)

// 测试可选属性
const partialUser: User = {
  name: 'partial_gxj',
  id: 789,
  createAt: new Date(),
}

printUserInfo(partialUser)
