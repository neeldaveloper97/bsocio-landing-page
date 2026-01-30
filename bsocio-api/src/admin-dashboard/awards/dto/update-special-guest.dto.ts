import { PartialType } from '@nestjs/swagger';
import { CreateSpecialGuestDto } from './create-special-guest.dto';

export class UpdateSpecialGuestDto extends PartialType(CreateSpecialGuestDto) {}
