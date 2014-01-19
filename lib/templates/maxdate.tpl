    if ($value->gt((new Carbon('<%= date %>', $timezone))->endOfDay())) {
      self::error($data, 'key ' . <%= name %> . ' breaks the maxdate validation');
    }
