    if (Str::length($value) == 0) {
      self::error($data, 'key <%= name %> breaks the required validation');
    }
