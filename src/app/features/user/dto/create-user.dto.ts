export class CreateUserDto {
  name: string;
  password: string;
  email: string;
  phone: string;
  genre: string;
  avatarUrl: string;
  roles?: string[];
  tokens?: string[];
}
