import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';
import { AdminUsersService } from './admin-users.service';

@ApiTags('admin-users')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({ summary: 'Get all users (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin role required' })
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminUsersService.getAllUsers(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Get('export')
  @ApiOperation({ summary: 'Export users to CSV (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'CSV file exported successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async exportUsers(@Query() query: GetUsersQueryDto, @Res() res: Response) {
    const csvData = await this.adminUsersService.exportUsers(query);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=users-${new Date().toISOString().split('T')[0]}.csv`,
    });

    res.send(csvData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.COMMUNICATIONS_ADMIN, Role.CONTENT_ADMIN)
  @ApiBearerAuth('access-token')
  @Get('system-logs/export')
  @ApiOperation({ summary: 'Export system logs to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file exported successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async exportSystemLogs(
    @Query('filter') filter: string,
    @Query('type') type: string,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const csvData = await this.adminUsersService.exportSystemLogs({
      filter,
      type,
      search,
      sortBy,
      sortOrder,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    const filename = page && limit
      ? `system-logs-page-${page}-${new Date().toISOString().split('T')[0]}.csv`
      : `system-logs-all-${new Date().toISOString().split('T')[0]}.csv`;

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    res.send(csvData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Put(':id/role')
  @ApiOperation({ summary: 'Update user role (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @Request() req: any,
  ) {
    return this.adminUsersService.updateUserRole(id, dto.role, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Put(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a user (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Cannot deactivate self or Super Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async toggleUserStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @Request() req: any,
  ) {
    return this.adminUsersService.toggleUserStatus(id, body.isActive, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Cannot delete self' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.adminUsersService.deleteUser(id, req.user.id);
  }
}
