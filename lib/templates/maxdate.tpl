    if ($value->gt(new Carbon('<%= date %>'))) {
      self::error($data, 'key ' . <%= name %> . ' breaks the maxdate validation');
    }
