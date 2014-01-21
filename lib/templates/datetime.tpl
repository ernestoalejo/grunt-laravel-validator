    try {
      $value = new Carbon($value);
    } catch (\Exception $e) {
      self::error($data, 'key ' . <%= name %> . ' breaks the datetime validation');
    }
    $value->setTimezone('UTC');
