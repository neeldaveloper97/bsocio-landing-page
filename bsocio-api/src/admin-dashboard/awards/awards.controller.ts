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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AwardsService } from './awards.service';
import { CreateAwardCategoryDto } from './dto/create-award-category.dto';
import { UpdateAwardCategoryDto } from './dto/update-award-category.dto';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { UpdateNomineeDto } from './dto/update-nominee.dto';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@ApiTags('admin-dashboard: awards')
@Controller('admin-dashboard/awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) { }

  // ==================== Award Categories ====================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post('categories')
  @ApiOperation({ summary: 'Create award category' })
  createCategory(@Body() dto: CreateAwardCategoryDto, @Request() req: any) {
    return this.awardsService.createCategory(dto, req.user?.userId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List award categories' })
  @ApiQuery({ name: 'status', required: false })
  listCategories(@Query('status') status?: string) {
    return this.awardsService.listCategories(status);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get award category by ID' })
  @ApiParam({ name: 'id' })
  getCategoryById(@Param('id') id: string) {
    return this.awardsService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update award category' })
  @ApiParam({ name: 'id' })
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateAwardCategoryDto,
    @Request() req: any,
  ) {
    return this.awardsService.updateCategory(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete award category' })
  @ApiParam({ name: 'id' })
  deleteCategory(@Param('id') id: string, @Request() req: any) {
    return this.awardsService.deleteCategory(id, req.user?.userId);
  }

  // ==================== Nominees ====================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post('nominees')
  @ApiOperation({ summary: 'Create nominee' })
  createNominee(@Body() dto: CreateNomineeDto, @Request() req: any) {
    return this.awardsService.createNominee(dto, req.user?.userId);
  }

  @Get('nominees')
  @ApiOperation({ summary: 'List nominees' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isWinner', required: false })
  listNominees(
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('isWinner') isWinner?: string,
  ) {
    const isWinnerBool =
      isWinner === 'true' ? true : isWinner === 'false' ? false : undefined;
    return this.awardsService.listNominees(categoryId, status, isWinnerBool);
  }

  @Get('nominees/:id')
  @ApiOperation({ summary: 'Get nominee by ID' })
  @ApiParam({ name: 'id' })
  getNomineeById(@Param('id') id: string) {
    return this.awardsService.getNomineeById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch('nominees/:id')
  @ApiOperation({ summary: 'Update nominee' })
  @ApiParam({ name: 'id' })
  updateNominee(
    @Param('id') id: string,
    @Body() dto: UpdateNomineeDto,
    @Request() req: any,
  ) {
    return this.awardsService.updateNominee(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete('nominees/:id')
  @ApiOperation({ summary: 'Delete nominee' })
  @ApiParam({ name: 'id' })
  deleteNominee(@Param('id') id: string, @Request() req: any) {
    return this.awardsService.deleteNominee(id, req.user?.userId);
  }

  // ==================== Ceremonies ====================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post('ceremonies')
  @ApiOperation({ summary: 'Create ceremony' })
  createCeremony(@Body() dto: CreateCeremonyDto, @Request() req: any) {
    return this.awardsService.createCeremony(dto, req.user?.userId);
  }

  @Get('ceremonies')
  @ApiOperation({ summary: 'List ceremonies' })
  @ApiQuery({ name: 'status', required: false })
  listCeremonies(@Query('status') status?: string) {
    return this.awardsService.listCeremonies(status);
  }

  @Get('ceremonies/:id')
  @ApiOperation({ summary: 'Get ceremony by ID' })
  @ApiParam({ name: 'id' })
  getCeremonyById(@Param('id') id: string) {
    return this.awardsService.getCeremonyById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch('ceremonies/:id')
  @ApiOperation({ summary: 'Update ceremony' })
  @ApiParam({ name: 'id' })
  updateCeremony(
    @Param('id') id: string,
    @Body() dto: UpdateCeremonyDto,
    @Request() req: any,
  ) {
    return this.awardsService.updateCeremony(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete('ceremonies/:id')
  @ApiOperation({ summary: 'Delete ceremony' })
  @ApiParam({ name: 'id' })
  deleteCeremony(@Param('id') id: string, @Request() req: any) {
    return this.awardsService.deleteCeremony(id, req.user?.userId);
  }

  // ==================== Special Guests ====================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post('guests')
  @ApiOperation({ summary: 'Create special guest' })
  createSpecialGuest(@Body() dto: any, @Request() req: any) {
    return this.awardsService.createSpecialGuest(dto, req.user?.userId);
  }

  @Get('guests')
  @ApiOperation({ summary: 'List special guests' })
  @ApiQuery({ name: 'status', required: false })
  listSpecialGuests(@Query('status') status?: string) {
    return this.awardsService.listSpecialGuests(status);
  }

  @Get('guests/:id')
  @ApiOperation({ summary: 'Get special guest by ID' })
  @ApiParam({ name: 'id' })
  getSpecialGuestById(@Param('id') id: string) {
    return this.awardsService.getSpecialGuestById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch('guests/:id')
  @ApiOperation({ summary: 'Update special guest' })
  @ApiParam({ name: 'id' })
  updateSpecialGuest(
    @Param('id') id: string,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return this.awardsService.updateSpecialGuest(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete('guests/:id')
  @ApiOperation({ summary: 'Delete special guest' })
  @ApiParam({ name: 'id' })
  deleteSpecialGuest(@Param('id') id: string, @Request() req: any) {
    return this.awardsService.deleteSpecialGuest(id, req.user?.userId);
  }

  // ==================== Statistics ====================

  @Get('statistics')
  @ApiOperation({ summary: 'Get awards statistics' })
  @ApiOkResponse({
    description: 'Awards statistics',
    schema: {
      type: 'object',
      properties: {
        totalCategories: { type: 'number', example: 3 },
        totalNominees: { type: 'number', example: 54 },
        activeAwards: { type: 'number', example: 19 },
        upcomingCeremonies: { type: 'number', example: 3 },
      },
    },
  })
  getStatistics() {
    return this.awardsService.getStatistics();
  }
}
