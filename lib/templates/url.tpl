    if (Str::length($value) > 0 && !preg_match('/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/', $value)) {
      self::error($data, 'key ' . <%= name %> . ' breaks the url validation');
    }
