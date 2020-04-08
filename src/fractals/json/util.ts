
export function objToString(obj: {[k: string]: any}) {
  return Object.entries(obj).map(([x, y]) => {
    return x + ':' + JSON.stringify(y);
  }).join(';')
}

export function stringToObj(str: string) {
  return Object.fromEntries(str.split(';').map((entry: string) => {
    const s = entry.split(':');
    try {
      return [s[0], JSON.parse(s[1])] as [string, any]
    } catch {
      console.log('bad param', entry)
      return ['BAD_PARAM', 'BAD_PARAM'] as [string, any]
    }
  }).filter((ent: [string, any]) => ent[0] !== 'BAD_PARAM'))
}
