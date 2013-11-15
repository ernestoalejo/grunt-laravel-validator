    if ($value < <%= value %>) {
      self::error($data, 'key ' . <%= name %> . ' breaks the minvalue validation');
    }
