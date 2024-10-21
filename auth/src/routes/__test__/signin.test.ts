import request from "supertest";
import { app } from "../../app";

it('returns a 200 on successful login', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(200);
})

it('fails when a email that does not exist is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'aaa@test.com',
      password: 'password'
    })
    .expect(400)
})

it('fails when a incorrect password is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pwd'
    })
    .expect(400)
})

it('response with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    }).expect(200)

  expect(response.get('Set-Cookie')).toBeDefined();
});