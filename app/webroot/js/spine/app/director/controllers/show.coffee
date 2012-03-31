class ShowView extends Spine.Controller

  elements:
    '#views .views'           : 'views'
    '.galleriesHeader'        : 'galleriesHeaderEl'
    '.albumsHeader'           : 'albumsHeaderEl'
    '.photosHeader'           : 'photosHeaderEl'
    '.photoHeader'            : 'photoHeaderEl'
    '.header'                 : 'albumHeader'
    '.optOverview'            : 'btnOverview'
    '.optEditGallery'         : 'btnEditGallery'
    '.optGallery .ui-icon'    : 'btnGallery'
    '.optAlbum .ui-icon'      : 'btnAlbum'
    '.optPhoto .ui-icon'      : 'btnPhoto'
    '.optUpload .ui-icon'     : 'btnUpload'
    '.optQuickUpload'         : 'btnQuickUpload'
    '.optFullScreen'          : 'btnFullScreen'
    '.optSlideshow'           : 'btnSlideshow'
    '.toolbarOne'             : 'toolbarOneEl'
    '.toolbarTwo'             : 'toolbarTwoEl'
    '.props'                  : 'propsEl'
    '.galleries'              : 'galleriesEl'
    '.albums'                 : 'albumsEl'
    '.photos'                 : 'photosEl'
    '.photo'                  : 'photoEl'
    '.slideshow'              : 'slideshowEl'
    '.slider'                 : 'slider'
    '.close'                  : 'btnClose'
    
  events:
    'click .optQuickUpload:not(.disabled)'           : 'toggleQuickUpload'
    'click .optOverview:not(.disabled)'              : 'showOverview'
    'click .optPrevious:not(.disabled)'              : 'showPrevious'
    'click .optShowSlideshow:not(.disabled)'         : 'showSlideshow'
    'click .optSlideshowPlay:not(.disabled)'         : 'slideshowPlay'
    'click .optFullScreen:not(.disabled)'            : 'toggleFullScreen'
    'click .optCreatePhoto:not(.disabled)'           : 'createPhoto'
    'click .optDestroyPhoto:not(.disabled)'          : 'destroyPhoto'
    'click .optShowPhotos:not(.disabled)'            : 'showPhotos'
    'click .optCreateAlbum:not(.disabled)'           : 'createAlbum'
    'click .optShowAllAlbums:not(.disabled)'         : 'showAllAlbums'
    'click .optDestroyAlbum:not(.disabled)'          : 'destroyAlbum'
    'click .optEditGallery:not(.disabled)'           : 'editGallery'
    'click .optCreateGallery:not(.disabled)'         : 'createGallery'
    'click .optDestroyGallery:not(.disabled)'        : 'destroyGallery'
    'click .optGallery:not(.disabled)'               : 'toggleGalleryShow'
    'click .optAlbum:not(.disabled)'                 : 'toggleAlbumShow'
    'click .optPhoto:not(.disabled)'                 : 'togglePhotoShow'
    'click .optUpload:not(.disabled)'                : 'toggleUploadShow'
    'click .optAllGalleries:not(.disabled)'          : 'allGalleries'
    'click .optAllAlbums:not(.disabled)'             : 'allAlbums'
    'click .optAllPhotos:not(.disabled)'             : 'allPhotos'
    'click .optSelectAll:not(.disabled)'             : 'selectAll'
    'click .optClose:not(.disabled)'                 : 'toggleDraghandle'
    'click .optShowModal:not(.disabled)'             : 'showModal'
#    'click .optSlideshow:not(.disabled)'             : 'slideshowPlay'
    'click .optSlideshowStop:not(.disabled)'         : 'slideshowStop'
    'dblclick .draghandle'            : 'toggleDraghandle'
    'click .items'                    : 'deselect'
    'slidestop .slider'               : 'sliderStop'
    'slidestart .slider'              : 'sliderStart'

  constructor: ->
    super
    @silent = true
    @toolbarOne = new ToolbarView
      el: @toolbarOneEl
    @toolbarTwo = new ToolbarView
      el: @toolbarTwoEl
    @photoHeader = new PhotoHeader
      el: @photoHeaderEl
    @photosHeader = new PhotosHeader
      el: @photosHeaderEl
    @albumsHeader = new AlbumsHeader
      el: @albumsHeaderEl
    @galleriesHeader = new GalleriesHeader
      el: @galleriesHeaderEl
    @galleriesView = new GalleriesView
      el: @galleriesEl
      className: 'items'
      header: @galleriesHeader
      parent: @
    @albumsView = new AlbumsView
      el: @albumsEl
      className: 'items'
      header: @albumsHeader
      parent: @
      parentModel: 'Gallery'
    @photosView = new PhotosView
      el: @photosEl
      className: 'items'
      header: @photosHeader
      parent: @
      parentModel: 'Album'
    @photoView = new PhotoView
      el: @photoEl
      className: 'items'
      header: @photoHeader
      parent: @
      parentModel: 'Photo'
    @slideshowView = new SlideshowView
      el: @slideshowEl
      className: 'items'
      header: false
      parent: @
      parentModel: 'Photo'
      subview: true
    
    @bind('canvas', @proxy @canvas)
    @bind('change:toolbarOne', @proxy @changeToolbarOne)
    @bind('change:toolbarTwo', @proxy @changeToolbarTwo)
    @bind('toggle:view', @proxy @toggleView)
    
    Gallery.bind('change', @proxy @changeToolbarOne)
    Album.bind('change', @proxy @changeToolbarOne)
    Photo.bind('change', @proxy @changeToolbarOne)
    Spine.bind('change:selectedAlbum', @proxy @refreshToolbars)
    @current = @albumsView
    @slideshowMode = App.SILENTMODE
    @sOutValue = 74 # size thumbs initially are shown (slider setting)
    @thumbSize = 240 # size thumbs are created serverside (should be as large as slider max for best quality)
    
    if @activeControl
      @initControl @activeControl
    else throw 'need initial control'
    @edit = @editGallery
    
    @canvasManager = new Spine.Manager(@galleriesView, @albumsView, @photosView, @photoView, @slideshowView)
    @canvasManager.change @current
    @headerManager = new Spine.Manager(@galleriesHeader, @albumsHeader, @photosHeader, @photoHeader)
    @headerManager.change @albumsHeader
#    @el.dropdown( '.dropdown-toggle' )
    
    
  canvas: (controller) ->
    console.log 'ShowView::changeCanvas'
    @previous = @current unless @current.subview
    @current = controller
    @el.data
      current: controller.el.data().current.record
      className: controller.el.data().current.className
#    controller.trigger 'active'
#    controller.header.trigger 'active' if controller.header
    @canvasManager.change controller
    @headerManager.change controller.header
    
  changeToolbarOne: (list) ->
    @toolbarOne.change list
    @toolbarTwo.refresh()
    @refreshElements()
    
  changeToolbarTwo: (list) ->
    @toolbarTwo.change list
    @refreshElements()
    
  refreshToolbars: ->
    console.log 'ShowView::refreshToolbars'
    @toolbarOne.refresh()
    @toolbarTwo.refresh()
    
  renderViewControl: (controller, controlEl) ->
    active = controller.isActive()

    $('.options .opt').each ->
      if(@ == controlEl)
        $(@).toggleClass('active', active)
      else
        $(@).removeClass('active')
  
  showGallery: ->
    App.contentManager.change(App.showView)
  
  showAlbums: (e) ->
    App.contentManager.change(App.showView)
    Spine.trigger('show:albums')
  
  showAllAlbums: ->
    Spine.trigger('show:allAlbums')
  
  showPhotos: (e) ->
    Spine.trigger('show:photos')

  showOverview: (e) ->
    Spine.trigger('show:overview')

  showSlideshow: (e) ->
    @slideshowMode = App.SILENTMODE
#    @changeToolbarOne ['Chromeless']
#    @changeToolbarTwo @slideshowView.toolbar #['Slider', 'Back', 'Play', App.showView.initSlider]
    App.sidebar.toggleDraghandle(close:true)
#    @toolbarOne.clear()
#    @toolbarOne.lock()
    
    Spine.trigger('show:slideshow')
    
  showPrevious: ->
    App.sidebar.toggleDraghandle()
    @previous.show()
  
  showModal: ->
    @modalView.render
      header: 'Neuer Header'
      body  : 'Neuer Body'
      footer: 'Neuer Footer'
    @modalView.show()
    
  createGallery: (e) ->
    Spine.trigger('create:gallery')
  
  createPhoto: (e) ->
    Spine.trigger('create:photo')
  
  createAlbum: (e) ->
    Spine.trigger('create:album')
  
  editGallery: (e) ->
    Spine.trigger('edit:gallery')

  editAlbum: (e) ->
    Spine.trigger('edit:album')

  destroyGallery: (e) ->
    Spine.trigger('destroy:gallery')
    @deselect()
  
  destroyAlbum: (e) ->
    Spine.trigger('destroy:album')
    @deselect()

  destroyPhoto: (e) ->
    Spine.trigger('destroy:photo')
    @deselect()

  animateView: ->
    hasActive = ->
      if App.hmanager.hasActive()
        return App.hmanager.enableDrag()
      false
    
    height = ->
      App.hmanager.currentDim
      if hasActive() then parseInt(App.hmanager.currentDim)+'px' else '18px'
    
    @views.animate
      height: height()
      400
    
  toggleGalleryShow: (e) ->
    @trigger('toggle:view', App.gallery, e.target)
#    e.stopPropagation()
    e.preventDefault()
    
  toggleGallery: (e) ->
    @changeToolbarOne ['Gallery']

  toggleAlbumShow: (e) ->
    @trigger('toggle:view', App.album, e.target)
    e.preventDefault()

  toggleAlbum: (e) ->
    @changeToolbarOne ['Album']
    
  togglePhotoShow: (e) ->
    @trigger('toggle:view', App.photo, e.target)
    e.preventDefault()
    
  togglePhoto: (e) ->
    @changeToolbarOne ['Photos', 'Slider']#, App.showView.initSlider

  toggleUploadShow: (e) ->
    @trigger('toggle:view', App.upload, e.target)
    e.preventDefault()
    
  toggleUpload: (e) ->
    @changeToolbarOne ['Upload']

  toggleFullScreen: () ->
    @slideshowView.toggleFullScreen()
    @toolbarTwo.change()
    
  toggleSlideshow: ->
    active = @btnSlideshow.toggleClass('active').hasClass('active')
    @slideshowView.slideshowMode(active)

  toggleView: (controller, control) ->
    isActive = controller.isActive()
    
    if(isActive)
      App.hmanager.trigger('change', false)
    else
      @activeControl = $(control)
      App.hmanager.trigger('change', controller)
    
    @propsEl.find('.ui-icon').removeClass('ui-icon-carat-1-s')
    $(control).toggleClass('ui-icon-carat-1-s', !isActive)
    @renderViewControl controller, control
    @animateView()
  
  toggleDraghandle: ->
    @activeControl.click()
  
  toggleQuickUpload: ->
    @refreshElements()
    active = @btnQuickUpload.find('i').toggleClass('icon-ok icon-').hasClass('icon-ok')
    @quickUpload active
    active
    
  quickUpload: (active) ->
    App.uploader.fileupload 'option'
      autoUpload: active
    
  isQuickUpload: ->
    @btnQuickUpload.find('i').hasClass('icon-ok')
    
  slideshowable: ->
    $('[rel="gallery"]', @current.el)
    
  play: ->
    return if @slideshowMode is App.SILENTMODE
    res = @slideshowable()
    if res.length
      $(res[0]).click()
      @slideshowMode = App.SILENTMODE
    else
      Spine.trigger('show:photos')
      Spine.trigger('change:selectedAlbum', Album.record, true)
        
  slideshowPlay: ->
    @slideshowMode = App.SLIDESHOWMODE
    @play()
        
  slideshowStop: ->
    slideshow = $('#modal-gallery').data('modal')
    slideshow.stopSlideShow() if slideshow
    
  initControl: (control) ->
    if Object::toString.call(control) is '[object String]'
      @activeControl = @[control]
    else
      @activeControl = control
      
  deselect: (e) =>
    item = @el.data().current
    className = @el.data().className
    switch className
      when 'Photo'
        -> # nothing to do here
      when 'Album'
        Spine.Model['Album'].emptySelection()
        Spine.trigger('photo:activate')
      when 'Gallery'
        Spine.Model['Gallery'].emptySelection()
        Spine.trigger('album:activate')
      when 'Slideshow'
        ->
      else
        ->
#        Spine.trigger('gallery:activate', false)
        
    @changeToolbarOne()
    @current.items.deselect()
    
  selectAll: ->
    @current.items.children().each (index, el) ->
      $(el).item().addRemoveSelection(true)
    @current.list?.activate()
    @changeToolbarOne()
    
  uploadProgress: (e, coll) ->
#    console.log coll
    
  uploadDone: (e, coll) ->
#    console.log coll
    
  sliderInValue: (val) ->
    val = val or @sOutValue
    @sInValue=(val/2)-20
    
  sliderOutValue: (value) ->
    val = value || @slider.slider('value')
    @sOutValue=(val+20)*2
    
  initSlider: =>
    inValue = @sliderInValue()
    @refreshElements()
    @slider.slider
      orientation: 'horizonatal'
      value: inValue
      slide: (e, ui) =>
        @sliderSlide ui.value
    
  showSlider: ->
    @initSlider()
    @sliderOutValue()
    @sliderInValue()
      
  sliderStart: =>
    Spine.trigger('slider:start')
#    @photosView.list.sliderStart()
    
  sliderSlide: (val) =>
    newVal = @sliderOutValue val  
    Spine.trigger('slider:change', newVal)
    newVal
    
  sliderStop: =>
    # rerender thumbnails on the server to its final size
#    @slider.toggle()

  allGalleries: ->
    Spine.trigger('show:galleries')
  
  allAlbums: ->
    Spine.trigger('show:allAlbums')
    
  allPhotos: ->
    Spine.trigger('show:allPhotos')