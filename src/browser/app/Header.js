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
import Business from 'material-ui/svg-icons/communication/business';
import Colors from '../../common/app/colors';
import Drawer from '../app/components/Drawer';
import Event from 'material-ui/svg-icons/action/event';
import Group from 'material-ui/svg-icons/social/group';
import Logo from '../app/components/Logo';
import Menu from '../app/components/Menu';
import MenuItem from '../app/components/MenuItem';
import Place from 'material-ui/svg-icons/maps/place';
import Public from 'material-ui/svg-icons/social/public';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import routesList from '../routesList';
import translate from '../../messages/translate';
import UserBox from '../app/components/UserBox';
import VerifiedUser from 'material-ui/svg-icons/action/verified-user';
import { ArticleIcon, RecycleIcon, TrashoutLogo } from './components/Icons';
import { connect } from 'react-redux';
import { setCurrentLocale } from '../../common/intl/actions';
import { toggleMenu } from '../../common/window/actions';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
// import { changeLanguage } from '../../common/users/actions';

const languages = ['en', 'de', 'cs', 'sk', 'ru', 'es', 'pt', 'it', 'hu', 'fr'];

@Radium
@translate
@connect(state => ({
  viewer: state.users.viewer,
  device: state.device.get('device'),
  showMenu: state.windows.showMenu,
  location: state.app.location.pathname,
  currentLocale: state.intl.currentLocale,
}), { toggleMenu, setCurrentLocale })
export default class Header extends Component {
  static styleRoot = 'Header';

  static propTypes = {
    currentLocale: React.PropTypes.string,
    device: React.PropTypes.string,
    location: React.PropTypes.string,
    msg: React.PropTypes.func.isRequired,
    setCurrentLocale: React.PropTypes.func.isRequired,
    showMenu: React.PropTypes.bool,
    toggleMenu: React.PropTypes.func,
    viewer: React.PropTypes.object,
  }
  render() {
    const { currentLocale, setCurrentLocale, viewer, device, showMenu, toggleMenu, location, msg } = this.props;
    return (
      <div>
        {device === 'mobile' && showMenu &&
          <div>
            <div
              style={styles.showMenuBackground}
            />
            <div
              style={styles.showMenuCloseArea}
              onClick={toggleMenu}
            />
          </div>
        }
        <Drawer open={(device === 'desktop' || (showMenu && device === 'mobile'))}>
          <Logo
            title={
              <TrashoutLogo
                viewBox="0 0 151.1 33.4"
                style={{ width: '151.1px', height: '33.4px', color: 'white' }}
              />
            }
            to={routesList.trashList}
          />
          <div>
            <UserBox
              name={viewer.displayName}
              email={viewer.email}
              imageUrl={viewer.image && viewer.image.fullDownloadUrl}
            />
            <Menu>
              <MenuItem
                title={msg('global.menu.dumps')}
                link={routesList.trashList}
                icon={<Place />}
                active={location.indexOf('trash-management') !== -1}
              />
              <MenuItem
                title={msg('global.menu.collectionPoints')}
                link={routesList.collectionPointList}
                icon={<RecycleIcon viewBox="0 0 600 600" />}
                active={location.indexOf('collection-points') !== -1}
              />
              <MenuItem
                userRole="admin"
                title={msg('global.menu.geoAreas')}
                link={routesList.areaBase}
                icon={<Public />}
                active={location.indexOf('geographical-areas') !== -1}
              />
              <MenuItem
                userRole="admin"
                title={msg('global.menu.users')}
                link={routesList.userList}
                icon={<Group />}
                active={location.indexOf('users') !== -1}
              />
              <MenuItem
                title={msg('global.menu.organizations')}
                link={routesList.organizationsList}
                icon={<Business />}
                active={location.indexOf('organizations') !== -1}
              />
              <MenuItem
                title={msg('global.menu.events')}
                link={routesList.eventList}
                icon={<Event />}
                active={location.indexOf('events') !== -1}
              />
              <MenuItem
                userRole="admin"
                title={msg('global.menu.notifications')}
                link={routesList.notificationList}
                icon={<VerifiedUser />}
                active={location.indexOf('notification') !== -1}
              />
              <MenuItem
                title={msg('global.menu.news')}
                link={routesList.articleList}
                icon={<ArticleIcon viewBox="0 0 32 32" />}
                active={location.indexOf('articles') !== -1}
              />
              <MenuItem
                title={msg('global.signOut')}
                link={routesList.signout}
                icon={<ExitToApp />}
              />
            </Menu>
          </div>
          <div style={styles.languages}>
            {languages.map((language, key) =>
              <span
                key={key}
                onClick={() => {
                  setCurrentLocale(language, true);
                  // changeLanguage(language);
                }}
                style={{
                  ...styles.languages.flag,
                  ...((key === languages.length - 1) ? styles.languages.flag.last : {}),
                  ...((key === 4) ? styles.languages.flag.last : {}),
                  ...(((currentLocale === language)) ? styles.languages.flag.active : {}),
                }}
              >
                {language}
              </span>
            )}
          </div>
        </Drawer>
      </div>
    );
  }
}

const styles = {
  showMenuCloseArea: {
    width: 'calc(100% - 256px)',
    height: '100%',
    left: '256px',
    top: '0',
    zIndex: '1001',
    position: 'fixed',
    background: 'rgba(0,0,0,0.0)',
  },
  showMenuBackground: {
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    zIndex: '1000',
    position: 'fixed',
    background: 'rgba(0,0,0,0.6)',
  },
  version: {
    width: '180px',
    height: '20px',
    fontSize: '10px',
    marginTop: '100px',
    textAlign: 'center',
  },
  logo: {
    width: '140px',
    marginTop: '5px',
  },
  languages: {
    marginTop: '50px',
    float: 'left',
    marginLeft: '30px',
    marginRight: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    flag: {
      cursor: 'pointer',
      width: '10%',
      color: 'white',
      textAlign: 'center',
      marginTop: '30px',
      borderRight: '1px solid white',
      padding: '0 8px',
      last: {
        paddingLeft: '8px',
        border: 'none',
      },
      active: {
        color: Colors.primary,
      },
    },
  },
};
