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
import Link from './Link';
import Radium from 'radium';
import React from 'react';

const LinkComponent = ({ to, children }) => {
  if (to.startsWith('tel:')) {
    return <a href={to}>{children}</a>;
  }
  return <Link to={to}>{children}</Link>;
};

const Social = ({ label, link, icon, fullWidth }) => {
  if (!link || !label) return null;

  if (!link.includes('://') && !link.includes('@') && !link.startsWith('tel:')) link = `https://${link}`;
  return (
    <div style={[style, fullWidth && style.fullWidth].filter(exists => exists)}>
      <div style={style.icon}>{icon}</div>
      <LinkComponent to={link}>
        <div>{label}</div>
      </LinkComponent>
    </div>
  );
};

LinkComponent.propTypes = {
  to: React.PropTypes.string,
  children: React.PropTypes.object,
};

Social.propTypes = {
  fullWidth: React.PropTypes.bool,
  icon: React.PropTypes.any,
  label: React.PropTypes.string,
  link: React.PropTypes.string,
};

const style = {
  float: 'left',
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  margin: '4px 0',
  icon: {
    marginRight: '10px',
    width: '32px',
    height: '32px',
  },
  fullWidth: {
    width: '100%',
  },
};

export default Radium(Social);
