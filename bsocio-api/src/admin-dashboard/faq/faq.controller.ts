import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateFaqDto } from './dto/create-faq.dto';
import { ListFaqQueryDto } from './dto/list-faq.query';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';

@ApiTags('admin-dashboard: faqs')
@Controller('admin-dashboard/faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create FAQ' })
  create(@Body() dto: CreateFaqDto, @Request() req: any) {
    return this.faqService.create(dto, req.user?.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List FAQs (filter/search/pagination)' })
  list(@Query() query: any) {
    return this.faqService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ by id' })
  @ApiParam({ name: 'id' })
  get(@Param('id') id: string) {
    return this.faqService.getById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update FAQ' })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFaqDto,
    @Request() req: any,
  ) {
    return this.faqService.update(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete FAQ' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.faqService.remove(id, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post('reorder')
  @ApiOperation({ summary: 'Reorder FAQs by ordered list of ids' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['ck...', 'ck...'],
        },
      },
      required: ['ids'],
    },
  })
  reorder(@Body() body: { ids: string[] }) {
    return this.faqService.reorder(body.ids);
  }

  // Optional endpoint (useful for public site):

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post(':id/views')
  @ApiOperation({ summary: 'Increment FAQ views (optional)' })
  @ApiParam({ name: 'id' })
  incrementViews(@Param('id') id: string) {
    return this.faqService.incrementViews(id);
  }
}
