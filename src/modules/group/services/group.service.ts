import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { GroupRepository } from '../group.repository';
import { CreateGroupDto } from '../create-group.dto';
import { Group } from '../group.entity';
import { IGroup } from '../group.interface';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Crée un nouveau groupe
   */
  async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    // Vérifier l'unicité du nom du groupe
    const existingGroup = await this.groupRepository.findByName(createGroupDto.name);
    if (existingGroup) {
      throw new ConflictException(`Un groupe avec le nom ${createGroupDto.name} existe déjà`);
    }

    const group = await this.groupRepository.createGroup(createGroupDto);
    return this.mapGroupToInterface(group);
  }

  /**
   * Récupère un groupe par son ID
   */
  async getGroupById(groupId: string): Promise<IGroup> {
    if (!groupId) {
      throw new BadRequestException('groupId is required');
    }

    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Groupe avec l'ID ${groupId} non trouvé`);
    }

    return this.mapGroupToInterface(group);
  }

  /**
   * Récupère un groupe par son nom
   */
  async getGroupByName(name: string): Promise<IGroup | null> {
    if (!name) {
      throw new BadRequestException('name is required');
    }

    const group = await this.groupRepository.findByName(name);
    return group ? this.mapGroupToInterface(group) : null;
  }

  /**
   * Liste tous les groupes
   */
  async listAllGroups(): Promise<IGroup[]> {
    const groups = await this.groupRepository.findAll();
    return groups.map((group) => this.mapGroupToInterface(group));
  }

  /**
   * Liste les groupes auxquels un utilisateur appartient
   * Cette méthode est implémentée via le service Membership
   * mais peut être utile ici pour une vue d'ensemble
   */
  async getGroupsForUser(userId: string): Promise<IGroup[]> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const groups = await this.groupRepository.findAll();
    return groups
      .filter((group) => group.memberships?.some((m) => m.userId === userId))
      .map((group) => this.mapGroupToInterface(group));
  }

  /**
   * Vérifie si un groupe existe
   */
  async groupExists(groupId: string): Promise<boolean> {
    const group = await this.groupRepository.findById(groupId);
    return !!group;
  }

  /**
   * Mappe une entité Group vers l'interface IGroup
   */
  private mapGroupToInterface(group: Group): IGroup {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
    };
  }
}
