Spine           = require("spine")
$               = Spine.$
KeyEnhancer     = require("plugins/key_enhancer")
Extender        = require('plugins/controller_extender')
GalleriesAlbum  = require('models/galleries_album')

class AlbumEditView extends Spine.Controller
  
#  @extend KeyEnhancer
  @extend Extender
  
  events:
    'keyup'         : 'saveOnKeyup'
  
  template: (item) ->
    $('#editAlbumTemplate').tmpl item

  constructor: ->
    super
    Album.bind('current', @proxy @change)

  activated: ->
    @render()
  
  change: (item) ->
    @current = item
    @render() 
  
  render: (item=@current) ->
    console.log 'AlbumEditView::render'
    if item and !item.destroyed 
      @html @template item
#      @focusFirstInput()
    else
      @html $("#noSelectionTemplate").tmpl({type: '<label class="invite"><span class="enlightened">Select or create an album</span></label>'})
    
    @el

  save: (el) ->
    console.log 'AlbumEditView::save'
    if @current
      atts = el.serializeForm?() or @el.serializeForm()
      @current.updateChangedAttributes(atts)

  saveOnKeyup: (e) =>
    code = e.charCode or e.keyCode
        
    switch code
      when 32 # SPACE
        e.stopPropagation() 
      when 9 # TAB
        e.stopPropagation()

    @save @el
    
  click: (e) ->

module?.exports = AlbumEditView