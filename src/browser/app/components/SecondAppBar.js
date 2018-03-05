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
import AlertMessage from './AlertMessage';
import Colors from '../../../common/app/colors';
import elementResizeEvent from 'element-resize-event';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Link from '../components/Link';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';
import UiAppBar from 'material-ui/AppBar';
import { connect } from 'react-redux';

@connect(state => ({
  viewer: state.users.get('viewer'),
}), null)
@Radium
export default class SecondAppBar extends Component {
  static propTypes = {
    leftButtons: React.PropTypes.element,
    noContent: React.PropTypes.bool,
    rightButtons: React.PropTypes.element,
    rightUpperButtons: React.PropTypes.array,
    title: React.PropTypes.string,
    viewer: React.PropTypes.object,
  }

  state = {
    buttonsCount: 0,
    width: 0,
    buttons: [],
  }

  componentWillMount() {
    const { rightUpperButtons, viewer } = this.props;
    const roleId = viewer && viewer.userRoleId;

    const buttons = this.getButtons(rightUpperButtons, roleId);

    this.setState({
      buttons,
      buttonsCount: buttons.length,
    });
  }

  componentDidMount() {
    if (this.appBarElement) elementResizeEvent(this.appBarElement, this.checkMenuSize);
  }

  componentWillReceiveProps(nextProps) {
    const { rightUpperButtons, viewer } = nextProps;
    const roleId = viewer && viewer.userRoleId;

    const buttons = this.getButtons(rightUpperButtons, roleId);
    this.setState({
      buttons,
      buttonsCount: buttons.length,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { rightUpperButtons: buttons } = this.props;
    const { rightUpperButtons: nextButtons } = nextProps;
    const { buttonsCount } = this.state;
    const { buttonsCount: nextButtonsCount } = nextState;

    return buttons !== nextButtons || buttonsCount !== nextButtonsCount;
  }

  getResultWidth = (appBarElement = {}, titleElement = {}, iconMenuElement = {}, buttonElements) => {
    const { offsetWidth: appBarWidth } = appBarElement;
    const { offsetWidth: titleWidth } = titleElement;
    const { offsetWidth: iconMenuWidth } = iconMenuElement;
    const buttonsWidth = (buttonElements || []).reduce((acc, button) => acc + button, 0);
    return appBarWidth - (titleWidth + buttonsWidth + iconMenuWidth + 1);
  };

  getButtons = (buttons, roleId) =>
    (buttons || []).map((button) => {
      if (!button) return null;

      if (button.userRole === 'superAdmin' && roleId > 1) {
        return null;
      }

      if (button.userRole === 'admin' && roleId > 2) {
        return null;
      }

      if (button.userRole === 'manager' && roleId > 3) {
        return null;
      }

      return button;
    }).filter(validButton => validButton);

  checkMenuSize = () => {
    const correctButtons = [...this.buttonElements];
    let resultWidth = this.getResultWidth(this.appBarElement, this.titleElement, this.iconMenuElement, correctButtons);
    while (resultWidth <= 0) {
      correctButtons.pop();
      resultWidth = this.getResultWidth(this.appBarElement, this.titleElement, this.iconMenuElement, correctButtons);
    }

    this.setState({
      buttonsCount: correctButtons.length,
    });

    return correctButtons.length;
  };

  buttonElements = [];
  menuElements = [];
  buttonsInitialized = false;

  renderButtons(buttons) {
    const { buttonsCount } = this.state;
    const result = buttons.slice(0, buttonsCount).map((button, key) => {
      const buttonElement = (<span
        ref={(buttonElement) => {
          if (!buttonElement || !this.buttonsInitialized) return;
          this.buttonElements[key] = buttonElement.offsetWidth;
        }}
        key={key}
      >
        <RaisedButton
          key={key}
          label={button.label}
          onClick={button.onClick}
          icon={button.icon}
          style={styles.button}
        />
      </span>);
      if (button.linkTo) return <Link key={key} to={button.linkTo}>{buttonElement}</Link>;
      return buttonElement;
    });
    this.buttonsInitialized = true;
    return result;
  }

  renderMenu(buttons) {
    const { buttonsCount } = this.state;
    return buttons.slice(buttonsCount, buttons.length).map((button, key) => {
      const buttonElement = (
        <MenuItem
          key={key}
          value={button.name}
          primaryText={button.label}
          onClick={button.onClick}
        />);
      if (button.linkTo) return <Link key={key} to={button.linkTo}>{buttonElement}</Link>;
      return buttonElement;
    });
  }

  render() {
    const { noContent, title } = this.props;
    const { buttons, buttonsCount } = this.state;

    return (
      <div>
        {!noContent &&
          <UiAppBar
            showMenuIconButton={false}
            style={styles.appBar}
            className="second-appbar-container"
          >
            <div style={styles.container} ref={(appBarElement) => { this.appBarElement = appBarElement; }}>
              <h2
                style={styles.title}
                ref={(titleElement) => { this.titleElement = titleElement; }}
              >
                {title}
              </h2>
              <div
                style={styles.menuItems}
                ref={(menuElement) => { this.menuElement = menuElement; }}
              >
                {this.renderButtons(buttons)}
                <span
                  ref={(iconMenuElement) => { this.iconMenuElement = iconMenuElement; }}
                  style={{ bottom: '5px', marginTop: '-5px' }}
                >
                  {buttons.length - buttonsCount > 0 &&
                    <IconMenu
                      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      ref={(iconMenuElement) => { this.iconMenuElement = iconMenuElement; }}
                    >
                      {this.renderMenu(buttons)}
                    </IconMenu>
                  }
                </span>
              </div>
            </div>
          </UiAppBar>
        }
        <AlertMessage noContent={noContent} />
      </div>
    );
  }
}

const styles = {
  appBar: {
    backgroundColor: 'white',
    position: 'fixed',
    display: 'block',
    width: '100%',
    zIndex: '10000',
    marginBottom: '35px',
    color: Colors.darkFont,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0',
    padding: '0',
    zIndex: '10000',
    textAlign: 'right',
    marginTop: '10px',
    marginBottom: '10px',
  },
  top: {
    display: 'block',
  },
  title: {
    fontWeight: '400',
    fontSize: '20px',
    display: 'block',
    margin: '0',
    padding: '0',
  },
  menuItems: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '-4px',
  },
  button: {
    marginLeft: '12px',
    clear: 'both',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    overflow: 'hidden',
  },
  upperButtonsContainer: {
    float: 'right',
    textAlign: 'right',
  },
};
