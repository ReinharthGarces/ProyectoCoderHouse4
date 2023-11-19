const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
require('dotenv').config();

const requester = supertest('http://localhost:8080');

describe('Testing sessionsRouter', () => {
  const userToken = process.env.TOKEN_JWT_TEST;

  beforeEach(function (done) {
    this.timeout(5000);
    setTimeout(done, 3000);
  });

  describe('Test 1', () => {
    it('El método GET deberá devolver la información de la sesión del usuario', async () => {
      const authenticatedUser = {
        _id: '655a8a889089155dafb1000e',
      };

      const response = await requester.get('/api/session')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-User', JSON.stringify(authenticatedUser));

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('cookie');
    });
  });

  describe('Test 2', () => {
    it('El método POST deberá registrar un nuevo usuario', async () => {
      const newUser = {
        name: 'Guido',
        lastname: 'Zamboni',
        email: 'guido@gmail.com',
        age: 30,
        password: 'qwerty',
      };

      const response = await requester.post('/api/session/register')
        .send(newUser);

      expect(response.status).to.be.equal(302);
      expect(response.headers).to.have.property('location');
      expect(response.headers.location).to.equal('/login');
    });
  });  

  describe('Test 3', () => {
    it('El método POST deberá iniciar sesión con un usuario existente', async () => {
      const existingUser = {
        email: 'bianz@gmail.com',
        password: 'qwerty',
      };

      const response = await requester.post('/api/session/login')
        .send(existingUser);

      expect(response.status).to.be.equal(302);
      expect(response.headers['set-cookie']).to.be.an('array').that.is.not.empty;
    });
  });

  describe('Test 4', () => {
    it('El método POST deberá enviar un correo de recuperación de contraseña', async () => {
      const userWithRecoveryEmail = {
        email: 'bianz@gmail.com',
      };

      const response = await requester.post('/api/session/recovery_password')
        .send(userWithRecoveryEmail);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Correo de restablecimiento enviado con éxito');
    });
  });

  describe('Test 5', () => {
    it('El método GET deberá restablecer la contraseña del usuario', async () => {
      const resetToken = userToken
      const newPassword = 'hola';

      const response = await requester.get(`/api/session/restore_password/${resetToken}`)
        .send({ password: newPassword });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Contraseña restablecida con éxito');
    });
  });

  describe('Test 6', () => {
    it('El método GET deberá devolver la información actual del usuario', async () => {
      const authenticatedUser = {
        _id: '651c1e62d8de707ff344ea05',
      };

      const response = await requester.get('/api/session/current')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-User', JSON.stringify(authenticatedUser));

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
    });
  });
});
