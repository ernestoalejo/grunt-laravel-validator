    $value = $<%= object %>['<%= name %>'];
    if (is_null($value)) {
      $value = 0;
    }
    if (is_string($value)) {
      if (ctype_digit($value)) {
        $value = intval($value);
      }
    }
    if (!is_int($value)) {
      self::error($data, 'key <%= name %> is not an integer');
    }
