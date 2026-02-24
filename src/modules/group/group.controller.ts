import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateGroupDto } from './create-group.dto';
import { IGroup } from './group.interface';
import { GroupService } from './services/group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Body() createGroupDto: CreateGroupDto): Promise<IGroup> {
    return this.groupService.createGroup(createGroupDto);
  }

  // gRPC Method
  @GrpcMethod('CommunityService', 'CreateGroup')
  async grpcCreateGroup(request: CreateGroupDto): Promise<IGroup> {
    return this.groupService.createGroup(request);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getGroup(@Param('id') id: string): Promise<IGroup> {
    return this.groupService.getGroupById(id);
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  async getGroupByName(@Param('name') name: string): Promise<IGroup | null> {
    return this.groupService.getGroupByName(name);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getGroupsForUser(@Param('userId') userId: string): Promise<IGroup[]> {
    return this.groupService.getGroupsForUser(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listGroups(): Promise<IGroup[]> {
    return this.groupService.listAllGroups();
  }
}
