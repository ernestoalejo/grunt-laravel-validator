    if ($value->lte(new Carbon('<%= date %>'))) {
      self::error($data, 'key ' . <%= name %> . ' breaks the mindate validation');
    }
