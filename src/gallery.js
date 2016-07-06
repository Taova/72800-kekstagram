/**
 * @fileoverview Показывать список фотографий в полноэкранном режиме.
 * @author Taova
 */
'use strict';

var utils = require('./utils');

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.preview = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.closeBlock = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.like = this.galleryContainer.querySelector('.likes-count');
  this.comments = this.galleryContainer.querySelector('.comments-count');
  this.data = [];
  this.indexOfPhoto = 0;
  this.picturesSrc = [];
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this.saveGalleryElement = this.saveGalleryElement.bind(this);
  window.addEventListener('hashchange', this.hashChange.bind(this));
};

Gallery.prototype.saveGalleryElement = function(data) {
  if (data !== this.data) {
    this.data = [];
    this.picturesSrc = [];
    this.data = data;
    data.forEach(function(pic) {
      this.picturesSrc.push(pic.url);
    }, this);
  }
};
Gallery.prototype.showPhoto = function(photo) {
  this.indexOfPhoto = this.picturesSrc.indexOf(photo);
  this.preview.src = this.data[this.indexOfPhoto].url;
  this.like.textContent = this.data[this.indexOfPhoto].likes;
  this.comments.textContent = this.data[this.indexOfPhoto].comments;
};

Gallery.prototype.showGallery = function(photo) {
  var galleryContainer = document.querySelector('.gallery-overlay');
  utils.removeClassElem(galleryContainer, 'invisible');
  this.showPhoto(photo);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.preview.addEventListener('click', this._onPhotoClick);
  this.closeBlock.addEventListener('click', this.hideGallery);
  this.galleryContainer.addEventListener('click', this.hideGallery);
  this.preview.addEventListener('click', this.prevClose);
};

Gallery.prototype._onPhotoClick = function() {
  this.indexOfPhoto++;
  if (this.indexOfPhoto === this.data.length) {
    this.indexOfPhoto = 0;
  }
  var nextpicturesSrc = this.picturesSrc[this.indexOfPhoto];
  window.location.hash = '#photo/' + nextpicturesSrc;
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27) {
    this.hideGallery();
  }
};

Gallery.prototype.prevClose = function(evt) {
  evt.stopPropagation();
};
Gallery.prototype.hideGallery = function() {
  utils.addClassElem(this.galleryContainer, 'invisible');
  location.hash = '';

  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.preview.removeEventListener('click', this._onPhotoClick);
  this.closeBlock.removeEventListener('click', this.hideGallery);
  this.galleryContainer.removeEventListener('click', this.hideGallery);
  this.preview.removeEventListener('click', this.prevClose);
};
Gallery.prototype.hashChange = function() {
  var hash = window.location.hash;
  var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
  if (getPhotoRegExp) {
    if (this.picturesSrc.indexOf(getPhotoRegExp[1]) > -1) {
      this.showGallery(getPhotoRegExp[1]);
    } else {
      this.hideGallery();
    }
  } else {
    location.hash = '';
  }

};
Gallery.prototype.getContentHash = function() {
  if (location.hash !== '') {
    this.hashChange();
  }
};


var picturesGallery = new Gallery();

module.exports = picturesGallery;
