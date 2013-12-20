    if (Str::length($value) > 0 && Str::length($value) < <%= length %>) {
      self::error($data, 'key ' . <%= name %> . ' breaks the minlength validation');
    }
