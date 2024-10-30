import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDTO } from './create-member.dto';

export class UpdateMemberDTO extends PartialType(CreateMemberDTO) {}
