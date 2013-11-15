    if ($value->lt(new Carbon('<%= date %>'))) {
      self::error($data, 'key ' . <%= name %> . ' breaks the mindate validation');
    }
