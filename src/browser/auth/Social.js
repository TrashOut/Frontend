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
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { connect } from 'react-redux';
import { signIn } from '../../common/lib/redux-firebase/actions';
import translate from '../../messages/translate';

const Social = ({ disabled, msg, signIn, redirect }) => {
  const onButtonClick = e => {
    if (disabled) return;
    const { provider } = e.currentTarget.dataset;
    signIn(provider, null, redirect);
  };

  return (
    <div>
      <RaisedButton
        label={msg('global.facebookLogin')}
        backgroundColor="#3b5998"
        labelColor="white"
        data-provider="facebook"
        onClick={onButtonClick}
        fullWidth="true"
        style={style}
      />
    </div>
  );
};

Social.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  msg: React.PropTypes.func.isRequired,
  signIn: React.PropTypes.func.isRequired,
  redirect: React.PropTypes.string,
};

const intlSocial = translate(Social);

export default connect(state => ({
  disabled: state.auth.formDisabled,
}), { signIn })(intlSocial);

const style = {
  marginTop: '10px',
};
