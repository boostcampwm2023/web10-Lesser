import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../project.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useValue: {
            create: jest.fn(),
            addProjectMember: jest.fn(),
            getProjectList: jest.fn(),
            getProject: jest.fn(),
            getProjectByLinkId: jest.fn(),
            getProjectToMember: jest.fn(),
          },
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  const member = Member.of(
    1,
    'githubUsername',
    'imageUrl',
    'username',
    'position',
    { stacks: ['js', 'ts'] },
  );
  describe('Create project', () => {
    const [title, subject] = ['title', 'subject'];
    const project = Project.of(title, subject);

    it('should return void when given member, title, subject', async () => {
      jest.spyOn(projectRepository, 'create').mockResolvedValue(project);

      await projectService.createProject(member, title, subject);

      expect(projectRepository.create).toHaveBeenCalledWith(project);
      expect(projectRepository.addProjectMember).toHaveBeenCalledWith(
        project,
        member,
      );
    });
  });

  describe('Get project list', () => {
    const projectList = [
      Project.of('title1', 'subject1'),
      Project.of('title2', 'subject2'),
    ];
    it('should return project list', async () => {
      jest
        .spyOn(projectRepository, 'getProjectList')
        .mockResolvedValue(projectList);

      const result = await projectService.getProjectList(member);

      expect(projectRepository.getProjectList).toHaveBeenCalledWith(member);
      expect(result).toEqual(projectList);
    });
  });

  describe('Get project', () => {
    const project = Project.of('title', 'subject');
    const projectId = 1;
    it('should return project', async () => {
      jest.spyOn(projectRepository, 'getProject').mockResolvedValue(project);
      const result = await projectService.getProject(projectId);

      expect(projectRepository.getProject).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(project);
    });
  });

  describe('Add Member', () => {
    const projectLinkId = 'inviteUuid';
    const project = Project.of('title', 'subject');
    it('should return void when given member, title, subject', async () => {
      jest
        .spyOn(projectRepository, 'getProjectByLinkId')
        .mockResolvedValue(project);
      jest
        .spyOn(projectRepository, 'getProjectToMember')
        .mockResolvedValue(null);

      await projectService.addMember(projectLinkId, member);

      expect(projectRepository.getProjectByLinkId).toHaveBeenCalledWith(
        projectLinkId,
      );
      expect(projectRepository.addProjectMember).toHaveBeenCalledWith(
        project,
        member,
      );
    });

    it('should throw when already joined member', async () => {
      jest
        .spyOn(projectRepository, 'getProjectByLinkId')
        .mockResolvedValue(project);
      jest
        .spyOn(projectRepository, 'getProjectToMember')
        .mockResolvedValue(ProjectToMember.of(project, member));

      await expect(
        async () => await projectService.addMember(projectLinkId, member),
      ).rejects.toThrow('already joined member');
    });

    it('should throw when invalid project link id', async () => {
      jest
        .spyOn(projectRepository, 'getProjectByLinkId')
        .mockResolvedValue(null);

      await expect(
        async () => await projectService.addMember(projectLinkId, member),
      ).rejects.toThrow('project link id not found');
    });
  });
});
