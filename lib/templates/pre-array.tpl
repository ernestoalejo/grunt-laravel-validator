    $size<%= id %> = count($<%= object %>);
    for ($i<%= id %> = 0; $i<%= id %> < $size<%= id %>; $i<%= id %>++) {
      if (!isset($<%= object %>[$i<%= id %>])) {
        self::error($data, 'array has not key ' . $i<%= id %>);
      }
