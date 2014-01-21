    if ($value->gt(new Carbon('<%= datetime %>'))) {
      self::error($data, 'key ' . <%= name %> . ' breaks the maxdatetime validation');
    }
