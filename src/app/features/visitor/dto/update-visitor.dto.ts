import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitorDTO } from './create-visitor.dto';

export class UpdateVisitorDTO extends PartialType(CreateVisitorDTO) {}
