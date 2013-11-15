    $value = $<%= object %>['<%= name %>'];
    if (!is_array($value)) {
      self::error($data, 'key <%= name %> is not an object');
    }
    $<%= result %>['<%= name %>'] = array();
