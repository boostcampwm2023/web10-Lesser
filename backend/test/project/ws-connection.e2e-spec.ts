import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  githubApiService,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';
import { io } from 'socket.io-client';

describe('WS landing', () => {
  const serverUrl = 'http://localhost:3000/project';
  let socket;

  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  afterEach(async () => {
    socket.close();
  });

  it('should connect', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    socket = connectServer(project.id, accessToken);

    return new Promise<void>((resolve, reject) => {
      socket.on('connect', () => {
        resolve();
      });
      socket.on('connect_error', () => {
        reject('connect_error fail');
      });
    });
  });

  it('should connect_error (Token is missing)', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    socket = io(`${serverUrl}-${project.id}`, {
      path: '/api/socket.io',
    });

    return new Promise<void>((resolve, reject) => {
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        expect(error.message).toContain('Token is missing');
        resolve();
      });
      registerConnectReject(socket, reject);
    });
  });

  it('should connect_error (Expired:tempIdToken)', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    socket = io(`${serverUrl}-${project.id}`, {
      path: '/api/socket.io',
      auth: {
        accessToken: 'invalidToken',
      },
    });

    return new Promise<void>((resolve, reject) => {
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        expect(error.message).toContain('Expired:accessToken');
        resolve();
      });
      registerConnectReject(socket, reject);
    });
  });

  it('should connect_error (Project not found)', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const notFoundProjectId = 0;
    socket = io(`${serverUrl}-${notFoundProjectId}`, {
      path: '/api/socket.io',
      auth: {
        accessToken,
      },
    });

    return new Promise<void>((resolve, reject) => {
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        expect(error.message).toContain('Project not found');
        resolve();
      });
      registerConnectReject(socket, reject);
    });
  });

  it('should connect_error (Invalid namespace)', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const invalidProjectId = 'invalidId';
    socket = io(`${serverUrl}-${invalidProjectId}`, {
      path: '/api/socket.io',
      auth: {
        accessToken,
      },
    });

    return new Promise<void>((resolve, reject) => {
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        expect(error.message).toContain('Invalid namespace');
        resolve();
      });
      registerConnectReject(socket, reject);
    });
  });

  it('should connect_error (Not Project Member)', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );
    const newProject = await createProject(newAccessToken, projectPayload, app);

    socket = io(`${serverUrl}-${newProject.id}`, {
      path: '/api/socket.io',
      auth: {
        accessToken,
      },
    });

    return new Promise<void>((resolve, reject) => {
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        expect(error.message).toContain('Not project member');
        resolve();
      });
      registerConnectReject(socket, reject);
    });
  });

  function registerConnectReject(socket, reject) {
    socket.on('connect', () => {
      reject('connect fail');
    });
  }
});
