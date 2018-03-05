/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2017 TrashOut, n.f.
 *
 * This file is part of the TrashOut project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
 */
import App from '../../browser/app/App';
import config from '../config';
import configureStore from '../../common/configureStore';
import createInitialState from './createInitialState';
import Helmet from 'react-helmet';
import Html from './Html';
import Promise from 'bluebird';
import React from 'react';
import serialize from 'serialize-javascript';
import ServerFetchProvider from './ServerFetchProvider';
import { Provider as Redux } from 'react-redux';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { StyleRoot } from 'radium';
import { toJSON } from '../../common/transit';

const settleAllWithTimeout = promises => Promise
  .all(promises.map(p => p.reflect()))
  .each(inspection => {
    if (inspection.isFulfilled()) return;
    console.log('Server fetch failed:', inspection.reason());
  })
  .timeout(5000) // Do not block rendering if any fetch is still pending.
  .catch(error => {
    if (error instanceof Promise.TimeoutError) {
      console.log('Server fetch timeouted:', error);
      return;
    }
    throw error;
  });

const initialState = createInitialState();

const getHost = req =>
  `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`;

const getLocale = req => process.env.IS_SERVERLESS
  ? config.defaultLocale
  : req.acceptsLanguages(config.locales) || config.defaultLocale;

const createStore = (req, reset) =>
  configureStore({
    initialState: {
      ...initialState,
      device: initialState.device
        .set('host', getHost(req))
        .set('userAgent', req.headers['user-agent'])
        .set('widgetJsFilename', config.isProduction ? '/assets/widget.js' : 'http://localhost:8080/build/widget.js'),
      intl: initialState.intl
        .set('currentLocale', getLocale(req))
        .set('initialNow', Date.now()),
    },
  }, reset);

const renderBody = (store, context, location, userAgent, fetchPromises) => {
  const markup = renderToString(
    <StyleRoot radiumConfig={{ userAgent }} >
      <Redux store={store}>
        <ServerFetchProvider promises={fetchPromises}>
          <StaticRouter
            context={context}
            location={location}
          >
            <App />
          </StaticRouter>
        </ServerFetchProvider>
      </Redux>
    </StyleRoot>
  );
  return { markup, helmet: Helmet.rewind() };
};

const renderScripts = (state, appJsFilename, vendorsJsFilename) =>
  `<script  data-cfasync="false">
      window.dataLayer = [];
      window.__INITIAL_STATE__ = ${serialize(toJSON(state))};
    </script>
    <script src="${vendorsJsFilename}"></script>
    <script src="${appJsFilename}"></script>`;

const renderHtml = (state, bodyMarkupWithHelmet) => {
  const {
    styles: { app: appCssFilename },
    javascript: { app: appJsFilename, vendors: vendorsJsFilename },
  } = global.webpackIsomorphicTools.assets();
  if (!config.isProduction) {
    global.webpackIsomorphicTools.refresh();
  }
  const { markup: bodyMarkup, helmet } = bodyMarkupWithHelmet;
  const scriptsMarkup = renderScripts(state, appJsFilename, vendorsJsFilename);
  const markup = renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyHtml={`
<div id="app">${bodyMarkup}</div>${scriptsMarkup}<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/cs_CZ/sdk.js#xfbml=1&version=v2.10&appId=307190274575";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>`}
      googleAnalyticsId={config.googleAnalyticsId}
      googleTagManagerId={config.googleTagManagerId}
      helmet={helmet}
      isProduction={config.isProduction}
    />
  );
  return `<!DOCTYPE html>${markup}`;
};

// react-router.now.sh/ServerRouter
const render = async (req: Object, res: Object, next: Function) => {
  try {
    const logout = req.url.indexOf('/logout/') !== -1;
    const context = {};
    const store = createStore(req, logout);
    const fetchPromises = [];

    let bodyMarkupWithHelmet = renderBody(store, context, req.url, req.headers['user-agent'], fetchPromises);
    // const result = context.getResult();
    // if (logout) {
    //   res.redirect(301, '/signin');
    //   return;
    // }

    // if (context.url) {
    //   res.redirect(301, context.url);
    // }

    // if (result.redirect) {
    //   res.redirect(301, result.redirect.pathname + result.redirect.search);
    //   return;
    // }

    // if (result.missed) {
    //   bodyMarkupWithHelmet = renderBody(store, context, req.url);
    //   const htmlMarkup = renderHtml(store.getState(), bodyMarkupWithHelmet);
    //   res.status(404).send(htmlMarkup);
    //   return;
    // }

    if (!process.env.IS_SERVERLESS && fetchPromises.length > 0) {
      await settleAllWithTimeout(fetchPromises);
      bodyMarkupWithHelmet = renderBody(store, context, req.url, req.headers['user-agent']);
    }

    const htmlMarkup = renderHtml(store.getState(), bodyMarkupWithHelmet);
    res.status(200).send(htmlMarkup);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default render;
