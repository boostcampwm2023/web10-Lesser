import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../project.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';

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
          },
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
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
      expect(projectRepository.addProjectMember).toHaveBeenCalledWith(
        project,
        member,
      );
    });
  });
});
