import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeDTO } from './create-notice.dto';

export class UpdateNoticeDTO extends PartialType(CreateNoticeDTO) {}
