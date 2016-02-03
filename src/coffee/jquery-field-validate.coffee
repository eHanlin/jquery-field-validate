
(( $ )->

  DATA_NAME = "field_validator#{+new Date}"

  # @class
  #
  class FieldValidator

    # @param {Object} opts
    constructor:( @opts = {} )->

      @$el = @opts.$el
      @setupEvent_()

    #hasSendedRequest:false
    hasRequested:false
    isValid:false
    prevValue:""

    setupEvent_:->

      @$el.on "keyup.#{DATA_NAME}", $.proxy @createValidateRequest_, @

    sendValidateRequest:->

      opts = @opts
      value = @$el.val()
      @prevValue = value
      @hasRequested = true
      opts.validate @validate(), value

    createValidateRequest_:->

      #@hasSendedRequest = true
      value = @$el.val()

      opts = @opts

      if value != @prevValue and @hasRequested is false and $.isFunction opts.validate

        @sendValidateRequest()
        #@prevValue = value
        #@hasRequested = true
        #@hasSendedRequest = false
        #opts.validate @validate(), value

      #else

      #  @hasSendedRequest = true


    success_:( message = null )->

      opts = @opts
      @isValid = true

      opts and opts.success and opts.success message, @$el

    error_:( message = null )->

      opts = @opts
      @isValid = false

      opts and opts.error and opts.error message, @$el

    always_:->

      @hasRequested = false

      #if @hasSendedRequest then
      @createValidateRequest_()

    valid:->

      @isValid

    validate:()->

      defer = $.Deferred()

      success = $.proxy @success_, @
      error = $.proxy @error_, @
      always = $.proxy @always_, @

      defer.done success
      defer.fail error
      defer.always always

      defer

  # @namespace utils
  utils =
    hasValidator:( $el )->

      validator = $el.data DATA_NAME

      if validator instanceof FieldValidator then true else false

    addValidator:( opts )->

      validator = new FieldValidator opts

      opts.$el.data DATA_NAME, validator

    getValidator:( $el )->

      $el.data DATA_NAME

  exportMethods =
    valid:( $el )->

      result = false

      $el.each ->

        $this = $ @

        if utils.hasValidator $this

          validator = utils.getValidator $this

          result = validator.valid()

      result

    validate:( $el )->

      $el.each ->

        $this = $ @

        if utils.hasValidator $this

          validator = utils.getValidator $this

          result = validator.sendValidateRequest()

      $el
    
    

  $.fn.extend
    fieldValidate:( opts )->

      if $.type( opts ) is "object"

        @each ->

          $el = $ @

          if !utils.hasValidator $el then utils.addValidator $.extend opts, $el:$el

      else if $.type( opts ) is "string"

        exportMethods[opts] @

)( jQuery )

