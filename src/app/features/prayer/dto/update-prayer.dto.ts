import { PartialType } from '@nestjs/mapped-types';
import { CreatePrayerDTO } from './create-prayer.dto';

export class UpdatePrayerDTO extends PartialType(CreatePrayerDTO) {}
