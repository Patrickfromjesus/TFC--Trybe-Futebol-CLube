import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import UsersModel from '../database/models/usersModel';
import { adminMock } from './mocks/LoginMock';
import { tokenMock } from './mocks/tokenMock';

chai.use(chaiHttp);

const loginSuccessMock = adminMock;

const { expect } = chai;

describe('Testes "Login"', () => {
  let chaiHttpResponse: Response;

   before(async () => {
      sinon
       .stub(UsersModel, 'findOne')
       .resolves(loginSuccessMock as unknown as UsersModel);
   });

   after(()=>{
     (UsersModel.findOne as sinon.SinonStub).restore();
   });

  it('Teste POST sem o campo de email', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        password: '123456',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Teste POST sem o campo de password', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        email: 'test@trybe.com',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Teste POST sem os campos', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        email: '',
        password: '',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Teste POST com o campo email preenchido errado.', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        email: '122344443',
        password: 'trybetestcom',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: "Incorrect email or password" });
  });

  it('Teste POST com o campo password preenchido errado.', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        email: '122',
        password: 'trybe@test.com',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: "Incorrect email or password" });
  });

  it('Teste POST com os campos preenchidos corretamente, mas sem resultado no banco de dados.', async () => {

    chaiHttpResponse = await chai
      .request(app).post('/login')
      .send({
        email: 'admin@trybe.com',
        password: 'secradmin',
      });
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });
  });

  it('Teste GET com token inexistente', async () => {

    chaiHttpResponse = await chai
      .request(app).get('/login/validate')
      .send({});
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'não autorizado.' });
  });

  it('Teste GET com token errado', async () => {

    chaiHttpResponse = await chai
      .request(app).get('/login/validate')
      .send({ token: '126r3721t3g1edewd'});
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'não autorizado.' });
  });

  it('Teste GET com token correto', async () => {

    chaiHttpResponse = await chai
      .request(app).get('/login/validate')
      .set('Authorization', tokenMock.token);
      expect(chaiHttpResponse.body).to.deep.equal({ role: 'admin' });
  });

});
