type Group = {
  _id: string;
}

export class CreateStudentDTO {
  name: string;
  email: string;
  phone: string;
  group: Group;
}
