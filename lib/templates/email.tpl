    if (Str::length($value) > 0 && !preg_match('/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/', $value)) {
      self::error($data, 'key ' . <%= name %> . ' breaks the email validation');
    }
