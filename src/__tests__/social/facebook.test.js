/* eslint-env jest */

import sinon from 'sinon';
import { connect, disconnect } from '../../db/connection';
import { getPageList, receiveWebhookResponse } from '../../social/facebook';
import { graphRequest } from '../../social/facebookTracker';
import { Integrations } from '../../db/models';
import { integrationFactory } from '../../db/factories';

beforeAll(() => connect());
afterAll(() => disconnect());

describe('facebook integration common tests', () => {
  const pages = [{ id: '1', name: 'page1' }];

  afterEach(async () => {
    // clear
    await Integrations.remove({});
  });

  test('receive web hook response', async () => {
    const app = { id: 1 };

    await integrationFactory({ kind: 'facebook', facebookData: { appId: app.id } });

    await receiveWebhookResponse(app, {});
  });

  test('get page list', async () => {
    sinon.stub(graphRequest, 'get').callsFake(() => ({ data: pages }));

    expect(getPageList()).toEqual(pages);

    graphRequest.get.restore(); // unwraps the spy
  });

  test('graph request', async () => {
    sinon.stub(graphRequest, 'base').callsFake(() => {});

    graphRequest.get();
    graphRequest.post();

    graphRequest.base.restore(); // unwraps the spy
  });
});
