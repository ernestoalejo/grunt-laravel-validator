    if ($value->lt(new Carbon('<%= datetime %>'))) {
      self::error($data, 'key ' . <%= name %> . ' breaks the mindatetime validation');
    }
