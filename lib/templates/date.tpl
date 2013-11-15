    $str = explode('-', $value);
    if (count($str) !== 3 || !checkdate($str[1], $str[2], $str[0])) {
      self::error($data, 'key ' . <%= name %> . ' breaks the date validation');
    }
    $value = Carbon::createFromFormat('!Y-m-d', $value);
