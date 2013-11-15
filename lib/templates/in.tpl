    if (!in_array($value, array('<%= values %>'), TRUE)) {
      self::error($data, 'key ' . <%= name %> . ' breaks the in validation');
    }
