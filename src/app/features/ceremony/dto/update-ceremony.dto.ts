import { PartialType } from '@nestjs/mapped-types';
import { CreateCeremonyDTO } from './create-ceremony.dto';

export class UpdateCeremonyDTO extends PartialType(CreateCeremonyDTO) {}
