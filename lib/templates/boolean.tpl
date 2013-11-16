    $value = $<%= object %>[<%= name %>];
    if (is_string($value)) {
      if ($value === 'true' || $value === '1' || $value === 'on') {
        $value = true;
      }
      if ($value === 'false' || $value === '0' || $value === 'off') {
        $value = false;
      }
    }
    if (is_int($value)) {
      if ($value === 1) {
        $value = true;
      }
      if ($value === 0) {
        $value = false;
      }
    }
    if (!is_bool($value)) {
      self::error($data, 'key ' . <%= name %> . ' is not a boolean');
    }
