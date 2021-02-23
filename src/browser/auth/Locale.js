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
import React from 'react';
import translate from '../../messages/translate';
import { connect } from 'react-redux';
import { setCurrentLocale } from "../../common/intl/actions";
import { getLanguageSimpleList } from "../../common/helpers";

@translate
@connect(state => ({
  currentLocale: state.intl.currentLocale,
}), { setCurrentLocale })
export default class Locale extends React.Component {
  static propTypes = {
    currentLocale: React.PropTypes.string,
    setCurrentLocale: React.PropTypes.func.isRequired,
  };

  render() {
    const { currentLocale, setCurrentLocale } = this.props;
    const languages = getLanguageSimpleList();

    return (
      <div style={styles.languages}>
        {languages.map((language, key) =>
          <span
            key={key}
            onClick={() => {
              setCurrentLocale(language, true);
            }}
            style={{
              ...styles.languages.flag,
              ...((key === languages.length - 1) ? styles.languages.flag.last : {}),
              ...(((currentLocale === language)) ? styles.languages.flag.active : {}),
            }}
          > {language} </span>
        )}
      </div>
    );
  }
}

const styles = {
  languages: {
    textAlign: 'center',
    marginBottom: '20px',
    flag: {
      color: '#737373',
      cursor: 'pointer',
      width: '10%',
      textAlign: 'center',
      marginTop: '20px',
      borderRight: '1px solid #b6b6b6',
      padding: '0 8px',
      last: {
        border: 'none',
      },
      active: {
        color: '#000000',
      },
    },
  },
};
