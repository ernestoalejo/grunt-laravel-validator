    $value = $<%= object %>[<%= name %>];
    if (is_null($value)) {
      $value = 0.0;
    }
    if (is_string($value)) {
      if (preg_match('/^-?[0-9]+(\.[0-9]+)?$/', $value)) {
        $value = floatval($value);
      }
    }
    if (!is_float($value)) {
      self::error($data, 'key ' . <%= name %> . ' is not a float');
    }
