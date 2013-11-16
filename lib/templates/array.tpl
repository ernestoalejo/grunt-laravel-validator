    $value = $<%= object %>[<%= name %>];
    if (is_null($value)) {
      $value = array();
    }
    if (!is_array($value)) {
      self::error($data, 'key ' . <%= name %> . ' is not an array');
    }
    if (count($value) < <%= mincount %>) {
      self::error($data, 'array ' . <%= name %> . ' has less than <%= mincount %> items');
    }
    $<%= result %>[<%= name %>] = array();
