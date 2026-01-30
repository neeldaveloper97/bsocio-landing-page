import { PartialType } from '@nestjs/swagger';
import { CreateNomineeDto } from './create-nominee.dto';

export class UpdateNomineeDto extends PartialType(CreateNomineeDto) {}
