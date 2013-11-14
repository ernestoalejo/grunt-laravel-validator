    $value = $<%= object %>['<%= name %>'];
    if (is_null($value)) {
      $value = '';
    }
    if (is_int($value) || is_float($value)) {
      $value = strval($value);
    }
    if (!is_string($value)) {
      self::error($data, 'key <%= name %> is not a string');
    }
