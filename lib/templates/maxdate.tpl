    if ($value->gt((new Carbon('<%= date %>'))->endOfDay())) {
      self::error($data, 'key ' . <%= name %> . ' breaks the maxdate validation');
    }
