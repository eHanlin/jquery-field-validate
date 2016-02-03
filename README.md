jquery-field-validate
========================================

## Dependencies

* jquery

## Usage

```
$("input[type=\"email\"]").fieldValidate({
                           
  validate:function( defer, value ){
                           
    if ( emailRule.test( value ) ) defer.resolve( "success" ); else defer.reject( "email error" );
  },                       
  success:function( value, $el ){
                           
    $message.html( value ).css( "color", "green" );
  },                       
                           
  error:function( value, $el ){
                           
    $message.html( value ).css( "color", "red" );
  }                        
});      
```

## Callbacks

### validate

validate field value, call `resolve` if value is valid.

### success

run a callback when `defer.resolve` is called.

### error

run a callback when `defer.reject` is called.

## Methods

### valid : boolean

```
$("input[type=\"email\"]").fieldValidate( "valid" )
```

### validate

trigger a `validate` callback

```
$("input[type=\"email\"]").fieldValidate( "validate" )
```

### getNoValid

