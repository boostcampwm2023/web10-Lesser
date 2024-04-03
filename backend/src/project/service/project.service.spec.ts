import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../repository/project.repository';
import { ProjectToMemberRepository } from '../repository/project-member.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: ProjectRepository;
  let projectToMemberRepository: ProjectToMemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ProjectToMemberRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    projectToMemberRepository = module.get<ProjectToMemberRepository>(
      ProjectToMemberRepository,
    );
  });

  describe('Create project', () => {
    const member = Member.of(
      1,
      'githubUsername',
      'imageUrl',
      'username',
      'position',
      { stacks: ['js', 'ts'] },
    );
    const [title, subject] = ['title', 'subject'];
    const project = Project.of(title, subject);

    it('should return void when given member, title, subject', async () => {
      jest.spyOn(projectRepository, 'create').mockResolvedValue(project);

      await projectService.createProject(member, title, subject);

      expect(projectRepository.create).toHaveBeenCalledWith(project);
      expect(projectToMemberRepository.create).toHaveBeenCalledWith(
        ProjectToMember.of(project, member),
      );
    });
  });
});
