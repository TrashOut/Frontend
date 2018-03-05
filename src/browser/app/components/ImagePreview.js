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
import Colors from '../../../common/app/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import elementResizeEvent from 'element-resize-event';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Lightbox from 'react-images';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import NavigateNext from 'material-ui/svg-icons/image/navigate-next';
import Radium from 'radium';
import React, { PureComponent as Component } from 'react';
import ReactPlayer from 'react-player';
import Slick from 'react-slick';
import translate from '../../../messages/translate';
import { GridList, GridTile } from 'material-ui/GridList';

@translate
@Radium
export default class ImagePreview extends Component {
  static propTypes = {
    autoWidth: React.PropTypes.bool,
    carousel: React.PropTypes.bool,
    center: React.PropTypes.bool,
    cols: React.PropTypes.number,
    customIcon: React.PropTypes.any,
    data: React.PropTypes.array,
    gridStyle: React.PropTypes.object,
    hasMain: React.PropTypes.bool,
    Icon: React.PropTypes.any,
    imageStyle: React.PropTypes.object,
    isVideo: React.PropTypes.bool,
    msg: React.PropTypes.func.isRequired,
    onCheck: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onCustomIconClick: React.PropTypes.func,
    padding: React.PropTypes.any,
    rows: React.PropTypes.number,
    showCheck: React.PropTypes.bool,
    showDelete: React.PropTypes.bool,
    showNextPlaceholder: React.PropTypes.bool,
    style: React.PropTypes.object,
    showSetMain: React.PropTypes.bool,
    onSetMain: React.PropTypes.func,
    withoutControls: React.PropTypes.bool,
  };

  state = {
    carouselWidth: 100,
  }

  componentWillMount() {
    this.state = {
      isOpen: false,
      currentImage: 1,
      imageHasError: [],
    };
    this.closeLightBox = this.closeLightBox.bind(this);
    this.openLightBox = this.openLightBox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.goToSpecific = this.goToSpecific.bind(this);
  }

  componentDidMount() {
    const { carousel } = this.props;
    if (carousel) {
      const checkCarouselWidth = () => {
        const { offsetWidth: carouselWidth } = this.mainElement || {};
        this.setState({ carouselWidth });
      };

      elementResizeEvent(this.mainElement, checkCarouselWidth);
      checkCarouselWidth();
    }
  }

  getNormalizedImages() {
    const { data } = this.props;

    const generateSrc = (src, isMain) => {
      if (typeof src === 'string') return src;
      if (isMain) return src.fullDownloadUrl;
      return src && (src.thumbDownloadUrl || src.fullDownloadUrl);
    };

    return data.map(image => ({
      ...image,
      src: generateSrc(image.src, image.isMain),
    }));
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  goToSpecific(currentImage) {
    this.setState({
      currentImage,
    });
  }

  closeLightBox(event) {
    event.preventDefault();
    this.setState({
      isOpen: false,
    });
  }

  openLightBox(index, event) {
    event.stopPropagation();
    this.setState({
      currentImage: index,
      isOpen: true,
    });
  }

  renderTileImage(img, { key, showBig, showDelete, style = {}, isVideo, className }) {
    const { onCustomIconClick, customIcon, Icon, showCheck, onCheck, imageStyle, onClick, msg } = this.props;
    const { imageHasError } = this.state;
    const isError = imageHasError.indexOf(key) >= 0;

    return (
      <GridTile
        title={showDelete ? msg('global.remove') : img.title}
        actionIcon={
          <IconButton style={{ width: 'auto' }}>
            {showDelete && <Delete color="red" onClick={() => onClick(img.id, key)} />}
            {showCheck && <Delete color="blue" onClick={() => onCheck(img.id)} />}
            {customIcon && <span onClick={() => onCustomIconClick(img.id)}>{Icon}</span>}
          </IconButton>
        }
        cols={showBig ? 2 : 1}
        rows={showBig ? 2 : 1}
        className={className}
        style={style}
      >
        {isVideo ?
          <ReactPlayer
            url={img.url}
            width={style.width || 300}
            height={style.height || 168}
            controls
            key={key}
            style={{ ...styles.image, ...imageStyle, ...style }}
          />
          :
          <img
            alt={img.id}
            key={key}
            onClick={(e) => this.openLightBox(key, e)}
            src={isError ? '/img/logo_fb.png' : img.src}
            style={{ ...styles.image, ...imageStyle, ...style }}
            onError={() => {
              this.setState({ imageHasError: [...imageHasError, key] });
            }}
          />
        }
      </GridTile>
    );
  }

  renderCarouselImages() {
    const { msg, showDelete, showSetMain, onSetMain, isVideo, withoutControls } = this.props;

    const imageWidth = isVideo ? 410 : 210;
    const imageRatio = isVideo ? (16 / 9) : 1;

    const images = this.getNormalizedImages(true);
    const isSingleImage = withoutControls && images.length < 2;

    const carouselWidth = (this.state.carouselWidth - 30);
    const carouselMax = carouselWidth / imageWidth;

    const carouselOptimal = (imageWidth / Math.floor(carouselMax)) * carouselMax;
    const normalizedCarouselOptimal = isFinite(carouselOptimal) ? carouselOptimal : 1;
    const slidesToScroll = Math.floor(carouselWidth / normalizedCarouselOptimal) || 1;

    const settings = {
      dots: !isSingleImage,
      infinite: false,
      speed: 500,
      slidesToScroll,
      variableWidth: true,
      nextArrow: !isSingleImage && <NavigateNext />,
      prevArrow: !isSingleImage && <NavigateBefore />,
    };
    if (!images || images.length === 0) return null;

    return (
      <div style={{ marginLeft: '10px', marginRight: '30px', marginBottom: '40px' }}>
        <Slick {...settings}>
          {images.map((img, key) =>
            <div style={{ padding: '5px', minHeight: `${(carouselOptimal - 10) / imageRatio}px`, width: `${carouselOptimal - 10}px` }}>
              {this.renderTileImage(img, { isVideo, showDelete, key, style: { objectFit: 'cover', height: `${(carouselOptimal - 10) / imageRatio}px`, width: `${carouselOptimal - 10}px` } })}
              {showSetMain &&
                <FlatButton
                  backgroundColor={img.isMain ? Colors.primary : Colors.lightGray}
                  hoverColor={img.isMain ? Colors.secondary : Colors.lightFont}
                  fullWidth
                  style={{ width: '100%' }}
                  onClick={() => onSetMain({ img, key })}
                >
                  {msg(img.isMain ? 'global.image.mainImage' : 'global.image.setAsMain')}
                </FlatButton>
              }
            </div>
          )}
        </Slick>
      </div>
    );
  }

  renderImages() {
    const {
      hasMain,
      msg,
      showDelete,
      showNextPlaceholder,
      isVideo,
    } = this.props;

    const images = this.getNormalizedImages(true, true).reduce((prev, cur) => {
      const showBig = (prev.length === 0 && hasMain);

      return [...prev, this.renderTileImage(cur, { isVideo, showDelete, showBig, key: prev.length, className: 'mui-image-preview' })];
    }
    , []);

    return [
      images,
      showNextPlaceholder &&
        <GridTile
          cols={1}
          rows={1}
          style={styles.placeholder}
        >
          <div
            style={styles.placeholder.text}
            onClick={(e) => this.openLightBox(0, e)}
          >
            {msg('global.showWholeGallery')}
          </div>
        </GridTile>,
    ];
  }

  renderGridList() {
    const {
      center,
      autoWidth,
      style = {},
      gridStyle = {},
      cols,
      rows,
      padding,
    } = this.props;

    return (
      <div style={{ ...styles.root, ...style }}>
        <GridList
          style={{ ...styles.gridList, ...gridStyle }}
          cols={cols}
          rows={rows}
          padding={padding}
          cellHeight="auto"
          className={`${autoWidth ? 'grid-list-auto-width' : 'grid-list'} ${center ? 'center' : ''}`}
        >
          {this.renderImages()}
        </GridList>
      </div>
    );
  }

  render() {
    const {
      data,
      carousel,
    } = this.props;

    const images = data.map(image => ({
      ...image,
      src: typeof image.src === 'string'
        ? image.src
        : (image.src || {}).fullDownloadUrl,
    }));

    return (
      <div className="image-preview" ref={(mainElement) => { this.mainElement = mainElement; }}>
        <Lightbox
          images={images}
          isOpen={this.state.isOpen}
          onClose={this.closeLightBox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          showThumbnails={Boolean(true)}
          showImageCount={Boolean(false)}
          onClickThumbnail={this.goToSpecific}
        />
        {carousel
          ? this.renderCarouselImages()
          : this.renderGridList()
        }
      </div>
    );
  }
}


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  gridList: {
    width: '100%',
    height: 'auto',
    alignItems: 'center',
  },
  image: {
    ':hover': {
      cursor: 'pointer',
    },
    width: '100%',
    height: 'auto',
  },
  placeholder: {
    display: 'flex',
    cursor: 'pointer',
    text: {
      margin: 'auto',
      ':hover': {
        textDecoration: 'underline',
      },
    },
  },
};
