

import sys; sys.stdout.write(('/*' + '\n' + '/*'.join(
  '*/'.join(sys.stdin.read().split('```typescript')).split('```')
) + '*/').replace("from 'maasglobal-template-ts'", "from './index'").replace("from 'maasglobal-template-ts/lib/", "from './") + '\n' + 'export {divide};')
