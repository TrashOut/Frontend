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
import AppBar from 'material-ui/AppBar';
import Box from '../app/components/Box';
import Chip from 'material-ui/Chip';
import Colors from '../../common/app/colors';
import Confirm from '../app/components/Confirm';
import ImagePreview from '../app/components/ImagePreview';
import Loading from '../app/components/Loading';
import Paper from 'material-ui/Paper';
import React, { PureComponent as Component } from 'react';
import ReactMarkdown from 'react-markdown';
import routesList from '../routesList';
import SecondAppBar from '../app/components/SecondAppBar';
import translate from '../../messages/translate';
import withRole from '../../common/app/withRole';
import { addConfirm } from '../../common/confirms/actions';
import { connect } from 'react-redux';
import { fetchArticle, removeArticle, removeArticleImage } from '../../common/articles/actions';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const { FacebookShareCount } = ShareCounts;

@translate
@withRole(state => ({
  article: state.articles.item.toJS(),
  isFetching: state.articles.isFetching,
}))
@connect(state => ({
  item: state.articles.item.toJS(),
  isFetching: state.articles.isFetching,
}), { addConfirm, fetchArticle, removeArticle, removeArticleImage })
export default class Detail extends Component {
  static propTypes = {
    addConfirm: React.PropTypes.func.isRequired,
    fetchArticle: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    item: React.PropTypes.object,
    match: React.PropTypes.object,
    msg: React.PropTypes.func.isRequired,
    removeArticle: React.PropTypes.func.isRequired,
    removeArticleImage: React.PropTypes.func.isRequired,
    roles: React.PropTypes.object,
  };

  state = {
    isManager: false,
    isUser: false,
  };

  componentWillMount() {
    const { fetchArticle, match } = this.props;
    fetchArticle(match.params.id);
  }

  renderPhotos() {
    const { item, msg, removeArticleImage } = this.props;
    const otherImages = item.images.filter(x => !x.isMain);
    if (otherImages.length === 0) return null;

    return (
      <Paper style={style.photos}>
        <div className="row">
          <div className="col s12">
            <h4>{msg('global.images')}</h4>
          </div>
          <div className="col s12">
            <ImagePreview
              data={otherImages.map((img) => ({ id: img.id, src: img }))}
              carousel
              showDelete
              onClick={(imageId) => removeArticleImage(item.id, imageId)}
            />
          </div>
        </div>
      </Paper>
    );
  }

  renderVideos() {
    const { item: { prContentVideo }, msg } = this.props;
    if (!prContentVideo || prContentVideo.length === 0) return null;

    return (
      <Paper style={style.photos}>
        <div className="row">
          <div className="col s12">
            <h4>{msg('news.detail.attachedVideo')}</h4>
          </div>
          <div className="col s12">
            <ImagePreview
              data={prContentVideo}
              carousel
              isVideo
            />
          </div>
        </div>
      </Paper>
    );
  }

  render() {
    const { addConfirm, item, isFetching, msg, removeArticle, removeArticleImage, roles } = this.props;

    const mainImage = item.images.filter(x => x.isMain)[0];
    const articleUrl = `https://admin.trashout.ngo${routesList.articleDetail.replace(':id', item.id)}`;

    const isAuthorized = roles.isAuthorizedWithArticle();

    return (
      <div>
        <div>
          <SecondAppBar
            title={msg('news.detail.header')}
            rightUpperButtons={[
              isAuthorized && { name: 'edit', label: msg('global.edit'), linkTo: routesList.articleUpdate.replace(':id', item.id) },
              isAuthorized && { name: 'delete', label: msg('global.remove'), onClick: () => addConfirm('news.delete', { onSubmit: () => removeArticle(item.id) }) },
            ].filter(isNotNull => isNotNull)}
          />
          <div className="main-content">
            <AppBar
              title={item.title || ''}
              style={{ background: Colors.secondary }}
              showMenuIconButton={Boolean(false)}
            />
            <Confirm
              cancelLabel={msg('global.cancel')}
              submitLabel={msg('global.confirm')}
              title={msg('global.confirmation.header')}
            />
            <Paper style={style.main}>
              <div className="row">
                <div className="col s12 m9">
                  {isFetching
                    ? <Loading type="circular" />
                    : <ReactMarkdown source={item.bodyMarkdown} />
                  }
                </div>
                <div className="col s12 m3">
                  {mainImage &&
                    <ImagePreview
                      data={[{ id: mainImage.id, src: (mainImage || {}).fullDownloadUrl }]}
                      hasMain
                      showDelete
                      onClick={() => removeArticleImage(item.id, mainImage.id)}
                    />
                  }
                  <FacebookShareButton
                    url={articleUrl}
                    style={style.shareButton}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <FacebookIcon size={32} />
                      <a href="#share" style={{ marginLeft: '10px' }}>{msg('global.share')}</a>
                      <span style={{ marginLeft: '10px' }}>
                        <FacebookShareCount url={articleUrl}>
                          {shareCount => (
                            <span>({shareCount} {msg('news.timesShared')})</span>
                          )}
                        </FacebookShareCount>
                      </span>
                    </div>
                  </FacebookShareButton>

                  <TwitterShareButton
                    url={articleUrl}
                    style={style.shareButton}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <TwitterIcon size={32} />
                      <a style={{ marginLeft: '10px' }}>{msg('global.share')}</a>
                    </div>
                  </TwitterShareButton>

                </div>
              </div>
              <div className="row">
                <Box
                  title={msg('news.tags')}
                  style={style.tags.wrapper}
                  className="col s12"
                >
                  {item.tagsArray.map(tag => <Chip style={style.tags}>{tag}</Chip>)}
                </Box>
                <Box
                  title={msg('news.author')}
                  className="col s4"
                  text={item.user.displayName}
                />
                <Box
                  title={msg('news.created')}
                  className="col s4"
                  type="date"
                  text={item.created}
                />
                <Box
                  title={msg('news.area')}
                  className="col s4"
                  text={item.area.name}
                />
              </div>
            </Paper>
            {this.renderPhotos()}
            {this.renderVideos()}
          </div>
        </div>
      </div>
    );
  }
}

const style = {
  main: {
    padding: '2%',
    gridList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  },
  shareButton: {
    marginTop: '10px',
  },
  photos: {
    marginTop: '20px',
    padding: '0 2%',
    paddingBottom: '1%',
  },
  topIndentation: {
    marginTop: '2%',
  },
  tags: {
    margin: '4px',
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  },
  history: {
    padding: '1%',
    float: 'left',
    width: '100%',
    marginBottom: '2%',
    record: {
      header: {
        width: '100%',
        float: 'left',
        left: {
          float: 'left',
          padding: '0',
          margin: '0',
        },
        right: {
          float: 'right',
        },
      },
      content: {
        width: '100%',
        gridList: {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          width: '100%',
        },
      },
    },
  },
};

