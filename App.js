const App = (function () {

  const namedThrottles = {};
  const Throttle = class {
    /**
     * Allocated a Global Throttle with a identifier
     * @id {string} arg A identifier for the Throttle
     */
    static withID(id) {
      if (!namedThrottles.hasOwnProperty(id)) {
        namedThrottles[id] = new Throttle().setID(id);
      }

      return namedThrottles[id];
    }

    constructor() {
      this.id = null;
      this.timeoutID_ = -1;
      this.promise_ = null;
      this.promise_last = null;
      this.mode = Throttle.MODE.FIRST;
      this.callback = () => { console.log('uninitialized throttle ;p'); };
    }

    get hasID() {
      return this.id !== null;
    }

    get isActive() {
      return this.timeoutID_ > -1;
    }

    setMode(mode) {
      if (Throttle.MODE.hasOwnProperty(mode)) {
        this.mode = Throttle.MODE[mode];
      }

      if (typeof mode === 'number') {
        this.mode = mode;
      }

      return this;
    }

    setCallback(callback) {
      if (typeof callback === 'function') {
        this.callback = callback;
      }

      return this;
    }

    call(time = 5000) {
      if (this.mode === Throttle.MODE.FIRST) {
        if (this.timeoutID_ > -1) {
          return this;
        }

        this.timeoutID_ = setTimeout(() => {
          this.callback();
          this.timeoutID_ = -1;
        }, time);
      }

      if (this.mode === Throttle.MODE.LAST) {
        if (this.timeoutID_ > -1) {
          clearTimeout(this.timeoutID_);
        }

        this.timeoutID_ = setTimeout(() => {
          this.callback();
          this.timeoutID_ = -1;
        }, time);
      }

      if (this.mode === Throttle.MODE.AWAIT_FIRST) {
        if (this.timeoutID_ > -1) {
          return this.promise_;
        }

        let next;
        this.promise_ = new Promise(resolve => next = resolve);


        this.timeoutID_ = setTimeout(async () => {
          await this.callback();
          next();
          this.timeoutID_ = -1;
        }, time);

        return this.promise_;
      }

      if (this.mode === Throttle.MODE.AWAIT_LAST) {
        if(this.timeoutID_ > -1) {
          clearTimeout(this.timeoutID_);
        }

        if(this.timeoutID_ === -1) {
          let next;
          this.promise_ = new Promise(resolve => next = resolve);

          this.promise_last = () => {
            this.callback();
            next();
            this.timeoutID_ = -1;
          };
        }

        this.timeoutID_ = setTimeout(this.promise_last, time);
        return this.promise_;
      }

      return this;
    }

    stop() {
      clearTimeout(this.timeoutID_);
      this.timeoutID_ = -1;

      return this;
    }
  };

  Throttle.MODE = {
    LAST: 0,
    FIRST: 1,
    AWAIT_FIRST: 2,
    AWAIT_LAST: 3
  };

  const CustomOperators = {
    /*
      Operator: `#;`
      Used to import classes during development.
      Usages: #InAppBase as InApp, Utils;
              #Utils, Listener;
              #ClassA as Name1, ClassB as Name2;
    */
    LazyLoader: new (class {
      constructor() {
        this.appImportRegex = /\/\/#([a-zA-Z0-9-_,{}\+ ]+);/g;
        this.appTempRegex = /\/\/#([a-zA-Z0-9-_{}]+)\?/g;
        this.appGetRegex = /([a-zA-Z0-9-_{}\+]+)/g;
      }

      async _apply(input) {
        let appImport;

        while ((appImport = this.appTempRegex.exec(input)) !== null) {
          input = input.replace(appImport[0], `(await App.get('${appImport[1]}'))`);
        }

        while ((appImport = this.appImportRegex.exec(input)) !== null) {
          let constNames = appImport[1],
            importNames = appImport[1];

          if (appImport[1].indexOf(',') > -1) {
            constNames = appImport[1].split(/ ?, ?/gm).map(name => name.indexOf(' as ') > -1 ? name.split(' as ')[1] : name).join(', ').replace(/\+/, ', ');
            importNames = appImport[1].split(/ ?, ?/gm).map(name => name.indexOf(' as ') > -1 ? name.split(' as ')[0] : name).join(', ');
            input = input.replace(appImport[0], `const [${constNames}] = await App.get(${importNames.replace(this.appGetRegex, `'$1'`)});`);
          } else {
            if (appImport[1].indexOf(' as ') > -1) {
              constNames = appImport[1].split(' as ')[1].replace(/\+/, ', ');
              importNames = appImport[1].split(' as ')[0];
            }
            input = input.replace(appImport[0], `const ${constNames} = await App.get('${importNames}');`);
          }
        }

        return input;
      }
    })(),
    svg: new (class {
      constructor() {
        this.toSVG = /▶\(([a-zA-Z0-9-_]+)\)/;
      }

      async _apply(input) {
        let svgLine;
        while ((svgLine = this.toSVG.exec(input)) !== null) {
          input = input.replace(svgLine[0], await App.svg(svgLine[1]));
        }

        return input;
      }
    })(),
    Log: new (class {
      constructor() {
        this.toLog = /Θ(.+);/g;
      }

      async _apply(input) {
        let logLine;
        while ((logLine = this.toLog.exec(input)) !== null) {
          input = input.replace(logLine[0], `console.log(${logLine[1]});`);
        }

        return input;
      }
    })(),
    lang: new (class {
      constructor() {
        this.toLang = /\/\*τ\(([a-zA-Z0-9-_]+),{(.+)}\)\*\//;
      }

      async _apply(input) {
        let line;
        while ((line = this.toLang.exec(input)) !== null) {
          input = input.replace(line[0], `await Channel.get('browser').dispatch('text', { key: '${line[1]}', keyVars: {${line[2]}}})`);
        }

        return input;
      }
    })()
  };

  const Chunker = (array, size = 100) => {
    if (array.length < 1) {
      return array;
    }

    if (array.length < size) {
      return [array];
    }

    const queryN = Math.ceil(array.length / size);
    const queryCount = Math.floor(array.length / queryN);
    const rest = array.length - (queryCount * queryN);

    const chunks = [];
    for (let i = 0; i < queryN; i++) {
      const chunk = [];
      array.slice(i * queryCount, (i + 1) * queryCount).forEach((e, i) => {
        chunk.push(e);
      });
      chunks.push(chunk);
    }

    const lastEntries = array.slice(queryN * queryCount, array.length - rest);
    for (let i = 0; i < rest; i++) {
      chunks[i].push(lastEntries[i]);
    }

    return chunks;
  };

  const ArrayWithID = class {
    constructor(minimum = 0) {
      this.minimum = minimum;
      this.array = {};
      this.currentID = this.minimum;
    }

    next() {
      while (this.array.hasOwnProperty(this.currentID)) {
        (++this.currentID > (Object.keys(this.array).length + this.minimum)) && (this.currentID = this.minimum);
      }

      return this.currentID;
    }

    assign(o) {
      this.array[this.next()] = o;
      return this.currentID;
    }

    unassign(ID) {
      delete this.array[ID];
    }

    get(ID) {
      return this.array[ID];
    }

    getID(object) {
      for(let id in this.array) {
        if(this.array[id] === object) {
          return id;
        }
      }
      return -1;
    }

    forEach(callback) {
      for(let id in this.array) {
        callback(this.array[id]);
      }
      return this;
    }

  }

  const Utils = new (class {
    constructor() {
      this.timeParser = /(([0-9]*)d)?(([0-9]*)h)?(([0-9]*)m)?(([0-9]*)s)?/i;
    }

    asArray(o, more) {
      if (!Array.isArray(o)) {
        o = [o];
      }

      o.push.apply(o, more);

      return o;
    }

    asString(o, prefix = '', suffix = '') {
      return typeof o !== 'undefined' ? prefix + o + suffix : '';
    }

    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    asNumber(o) {
      return isNaN(o = parseFloat((o))) ? 0 : o;
    }

    parseTime(s, multiplier = 1000) {
      s = s.match(this.timeParser);
      let m = 24 * this.asNumber(s[2]);
      m = (m + this.asNumber(s[4])) * 60;
      m = (m + this.asNumber(s[6])) * 60;

      return multiplier * (m + this.asNumber(s[8]));
    }

    path(dirPath, path, type) {
      return dirPath + Utils.asString(path, '/') + Utils.asString(type, '.');
    }

    between(number, min = 0, max = 1) {
      return Math.min(max, Math.max(min, Utils.asNumber(number)));
    }
  })();

  const WebApp = new (class {
    constructor() {
      this.classes = {};
      this.imports = {};

      this.importsResolve = {};
      this.importsPromise = {};

      this.svgs = {
        /* |Compiler:SVG| */
      };
    }

    async load(dirName, browser = 'json') {
      const r = await fetch(Utils.path(dirName, 'main.' + browser));

      if (!r.ok) {
        console.log('err loading:', dirName);
        return;
      }

      const config = await r.json();

      config.files.forEach(async file => {
        if (config.type === 'css') {
          let style = document.createElement('link');
          style.rel = 'stylesheet';
          style.type = 'text/css';
          style.href = Utils.path(dirName, file, config.type);
          document.getElementsByTagName('head')[0].appendChild(style);
        }

        if (config.type === 'js') {
          const r = await fetch(Utils.path(dirName, file, config.type));
          if (!r.ok) {
            console.log('err loading:', Utils.path(dirName, file, config.type));
            return;
          }

          let input = await r.text();
          for (let op in CustomOperators) {
            input = await CustomOperators[op]._apply(input);
          }

          try {
            (new Function('', `((async () => {${input}})());`))();
          } catch (e) {
            console.log(e, Utils.path(dirName, file, config.type));
            console.log(`((async () => {${input}})());`);
          }
        }
      });
    }

    async svg(...names) {
      for (let i = 0; i < names.length; i++) {
        let name = names[i];
        if (!this.svgs.hasOwnProperty(name)) {
          this.svgs[name] = await (await fetch(`/svgs/${name}.svg`)).text();
        }
      }

      if (names.length < 2) {
        return this.svgs[names[0]];
      }

      return names.map(name => this.svgs[name]);
    }

    svgbase64(svg, width = 32, height = 32) {
      return new Promise(resolve => {
        const image = new Image();
        image.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = Math.min(width, image.width);
          canvas.height = Math.min(height, image.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        };
      });
    }

    importArray(name) {
      return this.imports.hasOwnProperty(name) ? this.imports[name] : this.imports[name] = [];
    }

    importResolve(name) {
      return this.importsPromise.hasOwnProperty(name) ? this.importsPromise[name] : this.importsPromise[name] = new Promise(resolve => {
        const unfoundTimeout = setTimeout(() => {
          // resolve(null);
          throw new Error(`${name} could not load`);
        }, 1000);

        this.importsResolve[name] = (classe) => {
          resolve(classe);
          clearTimeout(unfoundTimeout);
        };
      });
    }

    /*
      returns all classes asked either as an array in the order asked or a single object.
      Note: You can also use the custom operator `#ClassName;` — ref: `#;` — to simplify the whole process.
    */
    async get(...names) {
      if (names.length > 1) {
        const list = [];
        for (let i = 0; i < names.length; i++) {
          list[i] = await this.get(names[i]);
        }
        return list;
      }

      return this.classes.hasOwnProperty(names[0]) ? this.classes[names[0]] : this.importResolve(names[0]);
    }

    isInstance(object, name) {
      (typeof object === 'string') && ([name, object] = [object, name]);
      return this.classes.hasOwnProperty(name) && (object instanceof this.classes[name]);
    }

    register(name, classe) {
      if (this.importsResolve.hasOwnProperty(name)) {
        this.importsResolve[name](classe);
        delete this.importsResolve[name];
      }

      this.classes[name] = classe;
      return this;
    }
  })();

  WebApp.register('Throttle', Throttle);
  WebApp.register('Utils', Utils);
  WebApp.register('Chunker', Chunker);
  WebApp.register('ArrayWithID', ArrayWithID);

  return WebApp;
}());
