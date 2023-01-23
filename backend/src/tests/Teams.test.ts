import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import TeamsModel from '../database/models/teamsModel';
import { findAllMock, findOneMock } from './mocks/TeamsMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes "Teams"', () => {
  let chaiHttpResponse: Response;

   before(async () => {
      sinon
       .stub(TeamsModel, 'findAll')
       .resolves(findAllMock as unknown as TeamsModel[]);

      sinon
       .stub(TeamsModel, 'findOne')
       .resolves(findOneMock as unknown as TeamsModel);
   });

   after(()=>{
      (TeamsModel.findAll as sinon.SinonStub).restore();
      (TeamsModel.findOne as sinon.SinonStub).restore();
   });

  it('Teste GET em "/teams"', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/teams')
      .send();
      expect(chaiHttpResponse.body.length).to.be.equal(16);
  });

  it('Teste GET em "/teams/id" com id incorreto', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/teams/90')
      .send();
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: {} });
  });

  it('Teste GET em "/teams/id" com id correto', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/teams/1')
      .send();
      expect(chaiHttpResponse.body).to.be.deep.equal(findOneMock);
  });
});
