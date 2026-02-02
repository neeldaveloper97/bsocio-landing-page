import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CampaignService } from './campaign.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';

@ApiTags('admin-dashboard: campaigns')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'COMMUNICATIONS_ADMIN')
@Controller('admin-dashboard/campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) { }

  @Post('draft')
  @ApiOperation({ summary: 'Save email campaign as draft' })
  saveDraft(@Body() dto: CreateEmailCampaignDto) {
    return this.service.saveDraft(dto);
  }

  @Post('send')
  @ApiOperation({ summary: 'Create and send / schedule email campaign' })
  create(@Body() dto: CreateEmailCampaignDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List email campaigns' })
  list() {
    return this.service.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get email campaign by ID' })
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
