import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../project.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';
import { Memo, memoColor } from '../entity/memo.entity';

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
            getProjectToMember: jest.fn(),
            createMemo: jest.fn(),
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
    const project = Project.of('title', 'subject');
    project.inviteLinkId = 'inviteUuid';

    it('should return void when given project and member', async () => {
      jest
        .spyOn(projectRepository, 'getProjectToMember')
        .mockResolvedValue(null);

      await projectService.addMember(project, member);

      expect(projectRepository.addProjectMember).toHaveBeenCalledWith(
        project,
        member,
      );
    });

    it('should throw when already joined member', async () => {
      jest
        .spyOn(projectRepository, 'getProjectToMember')
        .mockResolvedValue(ProjectToMember.of(project, member));

      await expect(
        async () => await projectService.addMember(project, member),
      ).rejects.toThrow('already joined member');
    });
  });

  describe('Create memo', () => {
    const color = memoColor.YELLOW;
    const [title, subject] = ['title', 'subject'];
    const project = Project.of(title, subject);
    it('should return created memo', async () => {
      jest
        .spyOn(projectRepository, 'createMemo')
        .mockResolvedValue(Memo.of(project, member, '', '', color));

      const memo: Memo = await projectService.createMemo(
        project,
        member,
        color,
      );
      expect(memo.title).toBe('');
      expect(memo.content).toBe('');
      expect(memo.color).toBe(color);
      expect(memo.member.id).toBe(member.id);
    });
  });
});
