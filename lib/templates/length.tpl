    if (Str::length($value) != <%= length %>) {
      self::error($data, 'key ' . <%= name %> . ' breaks the length validation');
    }
