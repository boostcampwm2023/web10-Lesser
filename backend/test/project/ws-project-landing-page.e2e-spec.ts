import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  memberFixture,
  projectPayload,
} from 'test/setup';

describe('WS landing', () => {
  let socket;

  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  afterEach(async () => {
    socket.close();
  });

  it('should return project data', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    socket = connectServer(project.id, accessToken);

    return new Promise<void>((resolve, reject) => {
      socket.on('connect', () => {
        socket.emit('joinLanding');
      });

      socket.on('landing', (data) => {
        const { action, content } = data;
        expect(action).toBe('init');
        expect(content.project.title).toBe(projectPayload.title);
        expect(content.project.subject).toBe(projectPayload.subject);
        expect(content.project.createdAt).toBeDefined();
        expect(content.myInfo).toBeDefined();
        expect(content.member).toBeDefined();
        expect(content.sprint).toBeDefined();
        expect(content.board).toBeDefined();
        expect(content.link).toBeDefined();
        expect(content.inviteLinkId).toBeDefined();
        resolve();
      });

      socket.on('connect_error', () => {
        reject('connect_error fail');
      });
    });
  });
});
