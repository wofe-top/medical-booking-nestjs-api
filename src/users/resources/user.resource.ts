export class UserResource {
  static toResponse(user: any) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
    };
  }

  static toCollection(users: any[]) {
    return users.map((user) => this.toResponse(user));
  }
}