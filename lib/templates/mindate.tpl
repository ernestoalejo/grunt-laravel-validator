    if ($value->lt((new Carbon('<%= date %>', $timezone))->startOfDay())) {
      self::error($data, 'key ' . <%= name %> . ' breaks the mindate validation');
    }
