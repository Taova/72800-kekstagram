/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  var galleryContainer = document.querySelector('.gallery-overlay');
  var preview = galleryContainer.querySelector('.gallery-overlay-image');
  var closeBlock = galleryContainer.querySelector('.gallery-overlay-close');
  var like = galleryContainer.querySelector('.likes-count');
  var comments = galleryContainer.querySelector('.comments-count');
  /** @param {Array.<string>}*/
  var galleryPhoto = [];
  var indexOfPhoto;
  this.saveGalleryElement = function(data) {
    galleryPhoto = data;
  };
  this.findIndexPhoto = function(urlToFind) {
    for (var i = 0; i < galleryPhoto.length; i++) {
      if (urlToFind === window.location.href + galleryPhoto[i].url) {
        indexOfPhoto = i;
      }
    }
    return indexOfPhoto;
  };

  this.showGallery = function(index) {
    utils.removeClassElem(galleryContainer, 'invisible');
    showPhoto(index);

    document.addEventListener('keydown', _onDocumentKeyDown);
    preview.addEventListener('click', _onPhotoClick);
    closeBlock.addEventListener('click', hideGallery);
    galleryContainer.addEventListener('click', hideGallery);
    preview.addEventListener('click', prevClose);
  };
  var showPhoto = function(index) {
    preview.src = galleryPhoto[index].url;
    like.innerHTML = galleryPhoto[index].likes;
    comments.innerHTML = galleryPhoto[index].comments;
  };
  var hideGallery = function() {
    utils.addClassElem(galleryContainer, 'invisible');

    document.removeEventListener('keydown', _onDocumentKeyDown);
    preview.removeEventListener('click', _onPhotoClick);
    closeBlock.removeEventListener('click', hideGallery);
    galleryContainer.removeEventListener('click', hideGallery);
    preview.removeEventListener('click', prevClose);
  };

  var _onPhotoClick = function() {
    if (indexOfPhoto > galleryPhoto.length - 2) {
      indexOfPhoto = 0;
    } else {
      indexOfPhoto++;
    }
    showPhoto(indexOfPhoto);
  };

  var _onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      hideGallery();
    }
  };

  var prevClose = function(evt) {
    evt.stopPropagation();
  };
};

var picturesGallery = new Gallery();

module.exports = {
  saveGallery: picturesGallery.saveGalleryElement,
  showGallery: picturesGallery.showGallery,
  findIndexPhoto: picturesGallery.findIndexPhoto
};
