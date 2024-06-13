import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../project.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';
import { Memo, memoColor } from '../entity/memo.entity';
import { Link } from '../entity/link.entity.';

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
            deleteMemo: jest.fn(),
            getProjectMemoListWithMember: jest.fn(),
            updateMemoColor: jest.fn(),
            findMemoById: jest.fn(),
            getProjectMemberList: jest.fn(),
            createLink: jest.fn(),
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

      jest
        .spyOn(projectRepository, 'getProjectMemberList')
        .mockResolvedValue([]);

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

      jest
        .spyOn(projectRepository, 'getProjectMemberList')
        .mockResolvedValue([member]);

      await expect(
        async () => await projectService.addMember(project, member),
      ).rejects.toThrow('already joined member');
    });

    it('should throw when Project reached its maximum member capacity', async () => {
      jest
        .spyOn(projectRepository, 'getProjectMemberList')
        .mockResolvedValue(new Array(10).fill(member));

      await expect(
        async () => await projectService.addMember(project, member),
      ).rejects.toThrow('Project reached its maximum member capacity');
    });
  });

  describe('Get project member list', () => {
    it('should return project member', async () => {
      jest
        .spyOn(projectRepository, 'getProjectMemberList')
        .mockResolvedValue([member]);
      const [title, subject] = ['title', 'subject'];
      const project = Project.of(title, subject);
      const memberList = await projectService.getProjectMemberList(project);
      expect(memberList[0]).toEqual(member);
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

  describe('Delete memo', () => {
    it('should return 1 when deleted a memo', async () => {
      jest.spyOn(projectRepository, 'deleteMemo').mockResolvedValue(1);

      const deletedMemoId = 1;
      const result = await projectService.deleteMemo(deletedMemoId);

      expect(result).toBe(true);
    });

    it('should return 0 when memo is not found', async () => {
      jest.spyOn(projectRepository, 'deleteMemo').mockResolvedValue(0);

      const notFoundMemoId = 1;
      const result = await projectService.deleteMemo(notFoundMemoId);

      expect(result).toBe(false);
    });
  });

  describe('Get project memo list', () => {
    it('should return memoList', async () => {
      const [title, subject] = ['title', 'subject'];
      const project = Project.of(title, subject);
      const memo = Memo.of(
        project,
        member,
        'memoTitle',
        'memoContent',
        memoColor.YELLOW,
      );
      memo.member = member;
      const newMemoList = [memo];

      jest
        .spyOn(projectRepository, 'getProjectMemoListWithMember')
        .mockResolvedValue(newMemoList);
      const projectId = 1;

      const memoListWithMember =
        await projectService.getProjectMemoListWithMember(projectId);

      expect(memoListWithMember).toEqual(newMemoList);
    });
  });

  describe('Update memo', () => {
    const [title, subject] = ['title', 'subject'];
    const project = Project.of(title, subject);
    project.id = 1;
    const color = memoColor.BLUE;
    const memo = Memo.of(project, member, '', '', memoColor.YELLOW);
    memo.projectId = project.id;
    memo.id = 1;
    it('should return true when updated a memo', async () => {
      jest.spyOn(projectRepository, 'findMemoById').mockResolvedValue(memo);
      jest.spyOn(projectRepository, 'updateMemoColor').mockResolvedValue(1);

      const result = await projectService.updateMemoColor(
        project,
        memo.id,
        color,
      );

      expect(result).toBe(true);
    });

    it('should return false when memo is not found', async () => {
      jest.spyOn(projectRepository, 'findMemoById').mockResolvedValue(null);
      jest.spyOn(projectRepository, 'updateMemoColor').mockResolvedValue(0);
      const updatedMemoId = 1;

      const result = await projectService.updateMemoColor(
        project,
        updatedMemoId,
        color,
      );

      expect(result).toBe(false);
    });

    it('should throw error when project does not have this memo', async () => {
      jest.spyOn(projectRepository, 'findMemoById').mockResolvedValue(memo);
      jest.spyOn(projectRepository, 'updateMemoColor').mockResolvedValue(1);
      const myProject = Project.of('', '');
      myProject.id = project.id + 100;

      await expect(
        async () =>
          await projectService.updateMemoColor(myProject, memo.id, color),
      ).rejects.toThrow('project does not have this memo');
    });
  });

  describe('Create link', () => {
    const [title, subject] = ['title', 'subject'];
    const project = Project.of(title, subject);
    it('should return created link', async () => {
      const url = 'url';
      const description = 'description';
      jest
        .spyOn(projectRepository, 'createLink')
        .mockResolvedValue(Link.of(project, url, description));

      const link: Link = await projectService.createLink(
        project,
        url,
        description,
      );
      expect(link.url).toBe(url);
      expect(link.description).toBe(description);
    });
  });
});
