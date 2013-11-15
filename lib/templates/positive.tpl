    if ($value < 0) {
      self::error($data, 'key ' . <%= name %> . ' breaks the positive validation');
    }
