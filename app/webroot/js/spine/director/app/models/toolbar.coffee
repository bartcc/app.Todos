Spine     = require("spine")
$         = Spine.$
Model     = Spine.Model
Gallery   = require('models/gallery')
Album     = require('models/album')
Filter    = require("plugins/filter")

class Toolbar extends Spine.Model


  @configure 'Toolbar', 'id', 'name', 'content'
  
  @extend Filter
  
  @load: ->
    @refresh(@tools(), clear:true)
  
  @tools: ->
    val for key, val of @data
    
  @dropdownGroups:
    group0:
      name: 'View'
      content:
        [
          name: 'Overview'
          klass: 'opt-Overview '
        ,
          name: 'Preview'
          klass: 'opt-ShowSlideshow '
          disabled: -> !Gallery.activePhotos().length
        ,
          devider: true
        ,
          name: 'Invert Selection     ctrl+A'
          klass: 'opt-SelectAll'
        ,
          devider: true
        ,
          name: 'Toggle Fullscreen'
          klass: 'opt-FullScreen'
          icon: 'fullscreen'
          iconcolor: 'black'
        ,
          name: 'Toggle Sidebar       Tab'
          klass: 'opt-Sidebar'
        ,
          devider: true
        ,
          name: -> 'Albummasters'
          klass: 'opt-ShowAlbumMasters'
          icon: 'book'
          disabled: -> false
        ,
          name: -> 'Photomasters'
          klass: 'opt-ShowPhotoMasters'
          icon: 'book'
          disabled: -> false
        ]
    group1:
      name: 'Gallery'
      content:
        [
          name: 'New'
          icon: 'asterisk'
          klass: 'opt-CreateGallery'
        ,
          devider: true
        ,
          name: 'Edit'
          icon: 'pencil'
          klass: 'opt-Gallery'
          disabled: ->
        ,
          name: 'Destroy'
          icon: 'trash'
          klass: 'opt-DestroyGallery'
          disabled: -> !Gallery.record
        ]
    group2:
      name: 'Album'
      content:
        [
          name: 'New'
          icon: 'asterisk'
          klass: 'opt-CreateAlbum'
        ,
          devider: true
        ,
          name: 'Edit'
          icon: 'pencil'
          klass: 'opt-Album'
          disabled: ->
        ,
          name: ->
            len = '('+Gallery.selectionList().length+')'
            type = if Gallery.record then 'Remove' else 'Destroy'
            return type+' '+len
          icon: 'trash'
          klass: 'opt-DestroyAlbum'
          disabled: -> !Gallery.selectionList().length
        ,
          devider: true
        ,
          name: ->
            'Show Selection'
          icon: 'hand-right'
          klass: 'opt-ShowAlbumSelection '
          disabled: -> !Gallery.selectionList().length
        ,
          devider: true
        ,
          name: -> 'Albummasters'
          klass: 'opt-ShowAlbumMasters'
          icon: 'book'
          disabled: -> false
        ]
    group3:
      name: 'Photo'
      content:
        [
          name: 'Upload'
          icon: 'upload'
          klass: 'opt-Upload'
        ,
          devider: true
        ,
          name: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            s = if len>1 then 's' else ''
            'Copy ' + (len or '') + ' Photo' + s + ' to New Album'
          icon: ''
          klass: 'opt-CreatePhotoFromSel'
          disabled: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            return !len
        ,
          name: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            s = if len>1 then 's' else ''
            'Move ' + (len or '') + ' Photo' + s + ' to New Album'
          icon: ''
          klass: 'opt-CreatePhotoFromSelCut'
          disabled: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            return !len
        ,
          devider: true
        ,
          name: 'Edit'
          icon: 'pencil'
          klass: 'opt-Photo'
          disabled: ->
        ,
          name: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
              type = 'Remove'
            else unless Album.record
              len = Album.selectionList().length
              type = 'Destroy'
            else
              len = Album.selectionList().length
              type = 'Remove'
            return type+' ('+len+')'
          icon: 'trash'
          klass: 'opt-DestroyPhoto '
          disabled: ->
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            return !len
        ,
          devider: true
        ,
          name: ->
            'Show Selection'
          icon: 'hand-right'
          klass: 'opt-ShowPhotoSelection '
          disabled: ->
            len = 0
            if Gallery.record
              len = Album.gallerySelectionList().length
            else
              len = Album.selectionList().length
            return !len
        ,
          name: -> 'Photomasters'
          klass: 'opt-ShowPhotoMasters'
          icon: 'book'
          disabled: -> false
        ,
          devider: true
        ,
          name: 'Auto Upload'
          icon: -> if App.showView.isQuickUpload() then 'ok' else ''
          klass: 'opt-QuickUpload'
          disabled: -> false
        ]
    group4:
      name: -> 
        len=Gallery.activePhotos().length
        'Slideshow (' + len + ')'
      content:
        [
          name: ->
            'Preview'#(if len==1 then " Image" else " Images") 
          klass: 'opt-OpenSlideshow'
          icon: 'picture'
          disabled: -> !Gallery.activePhotos().length
        ,
          name: ->
            len=Gallery.activePhotos().length
            'Start'
          icon: 'play'
          klass: 'opt-SlideshowPlay'
          dataToggle: 'modal-gallery'
          disabled: -> !Gallery.activePhotos?().length
        ]
      
  @data:
    package_00:
      name: 'Empty'
      content: []
    package_01:
      name: 'Default'
      content:
        [
          dropdown: true
          itemGroup: @dropdownGroups.group0
        ,
          dropdown: true
          itemGroup: @dropdownGroups.group1
        ,
          dropdown: true
          itemGroup: @dropdownGroups.group2
        ,
          dropdown: true
          itemGroup: @dropdownGroups.group3
        ,
          dropdown: true
          itemGroup: @dropdownGroups.group4
        ]
    package_09:
      name: 'Slideshow'
      content:
        [
          name: -> 'Start'
          icon: 'play'
          klass: 'opt-SlideshowPlay'
          innerklass: 'symbol'
          dataToggle: 'modal-gallery'
          disabled: -> !Gallery.activePhotos().length
        ]
    package_10:
      name: 'Back'
      locked: true
      content:
        [
          name: ''
          klass: 'opt-Previous'
          type: 'span'
          icon: 'remove'
          outerstyle: 'float: right;'
        ]
    package_11:
      name: 'Chromeless'
      locked: true
      content:
        [
          name: 'Chromeless'
          klass: -> 'opt-FullScreen' + if App.showView.slideshowView.fullScreenEnabled() then ' active' else ''
          icon: ''
          dataToggle: 'button'
          outerstyle: ''
        ,
          name: -> ''
          klass: 'opt-SlideshowPlay'
          icon: 'play'
          iconcolor: 'white'
          disabled: -> !Gallery.activePhotos().length
        ]
    package_12:
      name: 'Slider'
      content:
        [
          name: '<span class="slider" style=""></span>'
          klass: 'opt-Thumbsize '
          type: 'div'
          innerstyle: 'width: 190px; position: relative;'
        ]
    package_13:
      name: 'SlideshowPackage'
      content:
        [
          name: '<span class="slider" style=""></span>'
          klass: 'opt-Thumbsize '
          type: 'div'
          innerstyle: 'width: 190px; position: relative;'
        ,
          name: 'Fullscreen'
          klass: -> 'opt-FullScreen' + if App.showView.slideshowView.fullScreenEnabled() then ' active' else ''
          icon: 'fullscreen'
          dataToggle: 'button'
          outerstyle: ''
        ,
          name: 'Start'
          klass: 'opt-SlideshowPlay'
          innerklass: 'symbol'
          icon: 'play'
          iconcolor: ''
          disabled: -> !Gallery.activePhotos().length
        ]
    package_14:
      name: 'FlickrRecent'
      content:
        [
          name: ->
            details = App.flickrView.details('recent')
            'Recent Photos (' + details.from + '-' + details.to + ')'
          klass: 'opt'
          innerklass: 'symbol'
          icon: 'picture'
          type: 'span'
        ,
          name: ''
          klass: 'opt-Prev'
          icon: 'chevron-left'
          disabled: -> 
        ,
          name: ''
          klass: 'opt-Next'
          icon: 'chevron-right'
          disabled: -> 
        ]
    package_15:
      name: 'FlickrInter'
      content:
        [
          name: ->
            details = App.flickrView.details('inter')
            'Interesting Stuff (' + details.from + '-' + details.to + ')'
          icon: 'picture'
          klass: 'opt'
          type: 'span'
        ,
          name: ''
          klass: 'opt-Prev'
          icon: 'chevron-left'
          disabled: -> 
        ,
          name: ''
          klass: 'opt-Next'
          icon: 'chevron-right'
          disabled: -> 
        ]
    package_16:
      name: 'Close'
      content:
        [
          icon: 'remove'
          klass: 'opt opt-Previous'
          type: 'span'
        ]
        
  init: (ins) ->
    
  # for the filter
  select: (list) ->
    @name in list
    
module?.exports = Toolbar