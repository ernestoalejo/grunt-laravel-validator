    if (!in_array($value, <%= values %>, TRUE)) {
      self::error($data, 'key ' . <%= name %> . ' breaks the inarray validation');
    }
