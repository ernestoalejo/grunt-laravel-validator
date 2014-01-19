    if ($value->lt((new Carbon('<%= date %>'))->startOfDay())) {
      self::error($data, 'key ' . <%= name %> . ' breaks the mindate validation');
    }
