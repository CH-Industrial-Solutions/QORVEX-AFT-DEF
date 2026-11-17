
(() => {
  const mkFile = (store, name) => ({
    kind: 'file', name,
    async getFile() { const c = store.get(name) ?? ''; return new File([c], name, { lastModified: Date.now() }); },
    async createWritable(opts) {
      let buf = opts && opts.keepExistingData ? (store.get(name) ?? '') : '';
      let pos = 0;
      return {
        async seek(p) { pos = p; },
        async write(d) { buf = buf.slice(0, pos) + d + buf.slice(pos + d.length); pos += d.length; },
        async close() { store.set(name, buf); }
      };
    }
  });
  const mkDir = (files, dirs = {}) => ({
    kind: 'directory', name: 'root',
    async getDirectoryHandle(n, o) { if (!dirs[n]) { if (n === 'TXT' || (o && o.create)) dirs[n] = mkDir(new Map()); else throw new DOMException('x', 'NotFoundError'); } return dirs[n]; },
    async getFileHandle(n, o) { if (!files.has(n)) { if (o && o.create) files.set(n, ''); else throw new DOMException('x', 'NotFoundError'); } return mkFile(files, n); },
    async *entries() { for (const [n] of files) yield [n, mkFile(files, n)]; for (const n of Object.keys(dirs)) yield [n, dirs[n]]; }
  });
  window.__files = new Map();
  window.__txt = new Map([['Planned_Trans_011.txt', '4065598C2@1@Z36@083521\n']]);
  const root = mkDir(window.__files, { TXT: mkDir(window.__txt) });
  window.showDirectoryPicker = async () => root;
})();