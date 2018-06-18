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
import './stylesheets/App.scss';
import './stylesheets/materialize.css';
import Dialog from 'material-ui/Dialog';
import favicon from '../../common/app/favicon';
import Helmet from 'react-helmet';
import Loading from './components/Loading';
import LoggedInApp from './LoggedInApp';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Radium from 'radium';
import React from 'react';
import SignInPage from '../auth/Index';
import start from '../../common/app/start';
import translate from '../../messages/translate';
import { confirmSignIn } from '../../common/users/actions';
import { connect } from 'react-redux';
import { muiTheme } from '../../common/app/colors';
import { checkCookies, acceptCookiesConsent, resetError } from '../../common/app/actions';
import { Route } from 'react-router-dom';
import { setDevice } from '../../common/device/actions';
import { toggleRedirect, clearMessages } from '../../common/messages/actions';
import { TrashoutLogoVertical } from '../app/components/Icons';

const getMetadata = (msg) => ([
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
  { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
  { name: 'description', content: msg('global.trashoutShareDescription') },
  { name: 'og:type', content: 'website' },
  { name: 'og:image', content: '/img/logo_fb.png' },
  { name: 'og:title', content: 'TrashOut.ngo' },
]);

@translate
@connect(state => ({
  lang: state.intl.currentLocale,
  error: state.app.error,
  location: state.app.location,
  redirect: state.messages.redirect,
  redirected: state.messages.redirected,
  user: state.users.viewer,
  userLoaded: state.users.userLoaded,
  signoutInProcess: state.config.signoutInProcess,
  consentGiven: state.app.consentGiven,
}), { checkCookies, setDevice, confirmSignIn, toggleRedirect, clearMessages, resetError, acceptCookiesConsent })
@Radium
class App extends React.Component {
  static propTypes = {
    acceptCookiesConsent: React.PropTypes.func,
    clearMessages: React.PropTypes.func,
    lang: React.PropTypes.string.isRequired,
    currentTheme: React.PropTypes.string,
    error: React.PropTypes.bool,
    msg: React.PropTypes.func.isRequired,
    redirect: React.PropTypes.string,
    redirected: React.PropTypes.bool,
    resetError: React.PropTypes.func,
    setDevice: React.PropTypes.func,
    signoutInProcess: React.PropTypes.bool,
    toggleRedirect: React.PropTypes.func,
    user: React.PropTypes.object,
    userLoaded: React.PropTypes.bool,
    checkCookies: React.PropTypes.func.isRequired,
    consentGiven: React.PropTypes.bool,
  };

  state = {
    mqls: [],
    redirecting: false,
  }

  componentWillMount() {
    if (!global.window) return;

    const mqls = [
      window.matchMedia('(max-width: 480px)'),
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(min-width: 992px)'),
      window.matchMedia('(max-width: 1050px)'),
    ];
    mqls.map(x => x.addListener(() => this.mediaQueryChanged()));
    this.setState({ mqls });
    setTimeout(() => this.mediaQueryChanged(), 5);
  }

  componentDidMount() {
    const { checkCookies } = this.props;

    if (process.env.IS_BROWSER) checkCookies();
  }

  mediaQueryChanged() {
    const { setDevice } = this.props;
    const { mqls } = this.state;
    let device = 'desktop';
    if (mqls[3] && mqls[3].matches) device = 'mobile';
    setDevice(device);
  }

  renderLandingPage = (text) =>
    (
      <div style={styles.landingPage}>
        <h1>
          <TrashoutLogoVertical
            style={{ width: '250px', height: '250px' }}
            viewBox="0 0 130 130"
          />
        </h1>
        <h2 style={styles.landingPage.header}>
          {text}
        </h2>
      </div>
    );

  renderContent() {
    const { userLoaded, msg, user, signoutInProcess } = this.props;
    if (!userLoaded) {
      return this.renderLandingPage(msg('global.loading'));
    }

    if (signoutInProcess) {
      return this.renderLandingPage(msg('global.signingOut'));
    }

    if (user && userLoaded) {
      return <Route path="/" component={LoggedInApp} />;
    }

    if (!user && userLoaded) {
      return <Route path="/" component={SignInPage} />;
    }

    return null;
  }

  render() {
    const { consentGiven, acceptCookiesConsent, msg, lang, error } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Helmet
            htmlAttributes={{ lang }}
            meta={[
              ...getMetadata(msg),
              ...favicon.meta,
            ]}
            link={[
              ...favicon.link,
            ]}
            title="Administration Web | TrashOut.ngo"
          />
          <div>
            {error &&
              <Dialog
                title={msg('global.error.api.title')}
                contentStyle={{
                  width: '70%',
                  maxWidth: 'none',
                }}
                open
                autoScrollBodyContent
              >
                {msg('global.error.api.description')}
              </Dialog>
              }
            {this.renderContent()}
            <Loading />
          </div>
          {!consentGiven &&
            <div style={styles.consent}>
              <span>{msg('global.cookiesPolicy')}</span>
              <button onClick={acceptCookiesConsent} style={styles.consent.button}>{msg('global.acceptCookiesPolicy')}</button>
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

const animation = Radium.keyframes(
  { to: { width: '25px' } },
  'ellipsis',
);

const styles = {
  landingPage: {
    position: 'relative',
    width: '250px',
    margin: 'auto',
    textAlign: 'center',
    header: {
      after: {
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'bottom',
        animation: 'x steps(4,end) 1500ms infinite',
        animationName: animation,
        width: '0px',
      },
    },
  },
  apiError: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '99999',
    background: 'white',
    h2: {
      padding: '10px 40px',
      color: 'white',
    },
    p: {
      padding: '10px 40px',
      color: 'white',
    },
  },

  consent: {
    position: 'fixed',
    background: 'black',
    opacity: '0.7',
    color: 'white',
    width: '80%',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'space-between',

    button: {
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '10px',
      paddingBottom: '10px',
      color: 'black',
      border: 0,
      borderRadius: '5px',
      opacity: '0.8',

      ':hover': {
        opacity: '1',
      },
    },
  },
};

export default start(App);
