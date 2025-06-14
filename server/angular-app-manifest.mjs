
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/wichu-home/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-O5TNV6VH.js"
    ],
    "route": "/wichu-home"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HIB4JHCQ.js"
    ],
    "route": "/wichu-home/ceidg"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3355, hash: 'ef1925622d08b8d7073cebafa096be8e2fa629da2ca35a23455db813f4f24dce', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 3667, hash: '87aa6d4403b54d87b633b412a7ffd2ad9ab9b026714a625288001569756fe802', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'ceidg/index.html': {size: 4544, hash: 'b672fc0de2da9a2e0e937a3666ff36243d0f86187bf07e8d23a5a2a0618b433e', text: () => import('./assets-chunks/ceidg_index_html.mjs').then(m => m.default)},
    'index.html': {size: 19940, hash: '419043b9c70950a618e98687474e93d0c08956d4154460d7e645f24ee37d38ba', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-CQWA7ZFC.css': {size: 77, hash: 'N2XfbmSoyZs', text: () => import('./assets-chunks/styles-CQWA7ZFC_css.mjs').then(m => m.default)}
  },
};
