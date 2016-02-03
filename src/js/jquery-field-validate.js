(function() {
  (function($) {
    var DATA_NAME, FieldValidator, exportMethods, utils;
    DATA_NAME = "field_validator" + (+(new Date));
    FieldValidator = (function() {
      function FieldValidator(opts) {
        this.opts = opts != null ? opts : {};
        this.$el = this.opts.$el;
        this.setupEvent_();
      }

      FieldValidator.prototype.hasRequested = false;

      FieldValidator.prototype.isValid = false;

      FieldValidator.prototype.prevValue = "";

      FieldValidator.prototype.setupEvent_ = function() {
        var proxyFn = $.proxy(this.createValidateRequest_, this),
        eventName = "keyup";

        if( this.$el.is("input[type='checkbox'],input[type='radio'],select") )  eventName = "change";

        this.$el.on( eventName + "." + DATA_NAME, proxyFn);
      };

      FieldValidator.prototype.sendValidateRequest = function() {
        var opts, value;
        opts = this.opts;
        value = this.$el.val();
        this.prevValue = value;
        this.hasRequested = true;
        return opts.validate(this.validate(), value);
      };

      FieldValidator.prototype.createValidateRequest_ = function() {
        var opts, value;
        value = this.$el.val();
        opts = this.opts;
        if (value !== this.prevValue && this.hasRequested === false && $.isFunction(opts.validate)) {
          return this.sendValidateRequest();
        }
      };

      FieldValidator.prototype.success_ = function(message) {
        var opts;
        if (message == null) {
          message = null;
        }
        opts = this.opts;
        this.isValid = true;
        return opts && opts.success && opts.success(message, this.$el);
      };

      FieldValidator.prototype.error_ = function(message) {
        var opts;
        if (message == null) {
          message = null;
        }
        opts = this.opts;
        this.isValid = false;
        return opts && opts.error && opts.error(message, this.$el);
      };

      FieldValidator.prototype.always_ = function() {
        this.hasRequested = false;
        return this.createValidateRequest_();
      };

      FieldValidator.prototype.valid = function() {
        return this.isValid;
      };

      FieldValidator.prototype.validate = function() {
        var always, defer, error, success;
        defer = $.Deferred();
        success = $.proxy(this.success_, this);
        error = $.proxy(this.error_, this);
        always = $.proxy(this.always_, this);
        defer.done(success);
        defer.fail(error);
        defer.always(always);
        return defer;
      };

      return FieldValidator;

    })();
    utils = {
      hasValidator: function($el) {
        var validator;
        validator = $el.data(DATA_NAME);
        if (validator instanceof FieldValidator) {
          return true;
        } else {
          return false;
        }
      },
      addValidator: function(opts) {
        var validator;
        validator = new FieldValidator(opts);
        return opts.$el.data(DATA_NAME, validator);
      },
      getValidator: function($el) {
        return $el.data(DATA_NAME);
      }
    };
    exportMethods = {
      valid: function($el) {
        var result;
        result = false;
        $el.each(function() {
          var $this, validator;
          $this = $(this);
          if (utils.hasValidator($this)) {
            validator = utils.getValidator($this);
            return result = validator.valid();
          }
        });
        return result;
      },
      validate: function($el) {
        $el.each(function() {
          var $this, result, validator;
          $this = $(this);
          if (utils.hasValidator($this)) {
            validator = utils.getValidator($this);
            return result = validator.sendValidateRequest();
          }
        });
        return $el;
      },
      getNoValid:function( $el ){
        var $fields = $();
        $el.each(function(){
          var $this, result, validator;
          $this = $(this);
          if (utils.hasValidator($this)) {
            validator = utils.getValidator($this);
            if ( !validator.valid() ) $fields.push( this );
          }
        });
        return $fields;
      }
    };
    return $.fn.extend({
      fieldValidate: function(opts) {
        if ($.type(opts) === "object") {
          return this.each(function() {
            var $el;
            $el = $(this);
            if (!utils.hasValidator($el)) {
              return utils.addValidator($.extend(opts, {
                $el: $el
              }));
            }
          });
        } else if ($.type(opts) === "string") {
          return exportMethods[opts](this);
        }
      }
    });
  })(jQuery);

}).call(this);
