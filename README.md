# msw-mock-poc

Exploration into using [mock-service-worker](https://mswjs.io/) or `msw` as a means to mock api calls in cypress apps.

## How to run this app

Run `yarn dev` to start the application. Run `yarn cypress` to open up cypress. In `spec.cy.ts` there are two tests:

- `loads homepage, client navigates to other page with mock response` - mocks api calls in both client and server and asserts mock data
- `loads homepage, client navigates to other page with actual response` - does not mock api calls, asserts actual data from pokemon api service.

## Problem

We need transition to mocking our api calls in our cypress tests for a couple of reasons:

- improve flakiness of tests in builds due to stage data changing underneath us
- transition to a separate authentication provider will incur costs on each user that is created, something we do in our tests

We want to make this transition incrementally so as not to be disruptive to individual teams. Therefore, we want each cypress test to specify that it's api calls should be mocked.

## Approach in this POC

This POC takes the following approaches to mocking:

- client api calls - [`cy.intercept`](https://docs.cypress.io/api/commands/intercept) will match on url and return specified fixture data. If a url is not matched, it is not intercepted and the call goes to actual source
- server api calls - `msw` offers a [server-side solution](https://mswjs.io/docs/api/setup-server) that will intercept network calls on the server (for calls made in getServerProps). It works in the same way as the client approach, matching on url and return fixture data. If a url is not matched, `msw` will issue a warning in the console but will still pass through the request.

While the client api approach allows for specifying mocks at the test level, mocking server api calls is a little trickier:

- mocks in `handlers.ts` are defined statically, not dynamically per test (I attempted that...it did not go well)
- each handler is presumably shared across tests

To get around this, the `cy.mock` helper will add the `x-mock` header to every request. This header is passed through in `getServerSideProps` to `fetch`. In each handler, we check for this header. If it is not present, we allow the api call to passthrough to the actual source. If it is present, we return a stubbed response.

## Problems with msw/server-workers on the client

There were a couple problems when using `msw` for client requests:

- the service worker registered _after_ cypress tests started. This race condition prevents `msw` from intercepting network requests for client calls. This is the case whether we take an incremental approach to mocking or not. I.e. this seemed like a gamebreaker and prevents us from using this library on the client.
- the approach of adding `x-mock` header via `cy.intercept` doesn't work with a service worker as the request hits the service-worker before the network layer, which is when `cy.intercept` is invoked.

I admittedly only spent an hour or so troubleshooting the above issues before looking at alternative solutions.

## Alternatives to current approach

- [`nock`](https://github.com/nock/nock) - if we only use `msw` for server side mocking, this might lead to confusion giving that service workers are a web thing. We could instead just use nock which is a server side mocking tool that offers a ton of features (asserting mocks were hit, assert no pending mocks, etc)
