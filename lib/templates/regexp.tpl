    if (!preg_match('<%= regexp %>', $value)) {
      self::error($data, 'key ' . <%= name %> . ' breaks the regexp validation');
    }
