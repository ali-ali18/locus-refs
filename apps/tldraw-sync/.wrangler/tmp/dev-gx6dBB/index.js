var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-zIfKRN/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-zIfKRN/strip-cf-connecting-ip-header.js"() {
    "use strict";
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// ../../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance2;
var init_performance = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry2 = new PerformanceMark(name, options);
        this._entries.push(entry2);
        return entry2;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry2 = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry2);
        return entry2;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance2;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// ../../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl2) {
        super();
        this.env = impl2.env;
        this.hrtime = impl2.hrtime;
        this.nextTick = impl2.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/lodash.isequal/index.js
var require_lodash = __commonJS({
  "../../node_modules/lodash.isequal/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function arrayFilter(array2, predicate) {
      var index = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array2[index];
        if (predicate(value, index, array2)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    __name(arrayFilter, "arrayFilter");
    function arrayPush(array2, values) {
      var index = -1, length = values.length, offset = array2.length;
      while (++index < length) {
        array2[offset + index] = values[index];
      }
      return array2;
    }
    __name(arrayPush, "arrayPush");
    function arraySome(array2, predicate) {
      var index = -1, length = array2 == null ? 0 : array2.length;
      while (++index < length) {
        if (predicate(array2[index], index, array2)) {
          return true;
        }
      }
      return false;
    }
    __name(arraySome, "arraySome");
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    __name(baseTimes, "baseTimes");
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    __name(baseUnary, "baseUnary");
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    __name(cacheHas, "cacheHas");
    function getValue(object2, key) {
      return object2 == null ? void 0 : object2[key];
    }
    __name(getValue, "getValue");
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    __name(mapToArray, "mapToArray");
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    __name(overArg, "overArg");
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    __name(setToArray, "setToArray");
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty2 = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView2 = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap2 = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap2);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(Hash, "Hash");
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    __name(hashClear, "hashClear");
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    __name(hashDelete, "hashDelete");
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty2.call(data, key) ? data[key] : void 0;
    }
    __name(hashGet, "hashGet");
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
    }
    __name(hashHas, "hashHas");
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    __name(hashSet, "hashSet");
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(ListCache, "ListCache");
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    __name(listCacheClear, "listCacheClear");
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    __name(listCacheDelete, "listCacheDelete");
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    __name(listCacheGet, "listCacheGet");
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    __name(listCacheHas, "listCacheHas");
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    __name(listCacheSet, "listCacheSet");
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(MapCache, "MapCache");
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    __name(mapCacheClear, "mapCacheClear");
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    __name(mapCacheDelete, "mapCacheDelete");
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    __name(mapCacheGet, "mapCacheGet");
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    __name(mapCacheHas, "mapCacheHas");
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    __name(mapCacheSet, "mapCacheSet");
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    __name(SetCache, "SetCache");
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    __name(setCacheAdd, "setCacheAdd");
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    __name(setCacheHas, "setCacheHas");
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    __name(Stack, "Stack");
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    __name(stackClear, "stackClear");
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    __name(stackDelete, "stackDelete");
    function stackGet(key) {
      return this.__data__.get(key);
    }
    __name(stackGet, "stackGet");
    function stackHas(key) {
      return this.__data__.has(key);
    }
    __name(stackHas, "stackHas");
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    __name(stackSet, "stackSet");
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty2.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    __name(arrayLikeKeys, "arrayLikeKeys");
    function assocIndexOf(array2, key) {
      var length = array2.length;
      while (length--) {
        if (eq(array2[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    __name(assocIndexOf, "assocIndexOf");
    function baseGetAllKeys(object2, keysFunc, symbolsFunc) {
      var result = keysFunc(object2);
      return isArray(object2) ? result : arrayPush(result, symbolsFunc(object2));
    }
    __name(baseGetAllKeys, "baseGetAllKeys");
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    __name(baseGetTag, "baseGetTag");
    function baseIsArguments(value) {
      return isObjectLike2(value) && baseGetTag(value) == argsTag;
    }
    __name(baseIsArguments, "baseIsArguments");
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    __name(baseIsEqual, "baseIsEqual");
    function baseIsEqualDeep(object2, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object2), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object2), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object2)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object2) ? equalArrays(object2, other, bitmask, customizer, equalFunc, stack) : equalByTag(object2, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty2.call(object2, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object2.value() : object2, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object2, other, bitmask, customizer, equalFunc, stack);
    }
    __name(baseIsEqualDeep, "baseIsEqualDeep");
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    __name(baseIsNative, "baseIsNative");
    function baseIsTypedArray(value) {
      return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    __name(baseIsTypedArray, "baseIsTypedArray");
    function baseKeys(object2) {
      if (!isPrototype(object2)) {
        return nativeKeys(object2);
      }
      var result = [];
      for (var key in Object(object2)) {
        if (hasOwnProperty2.call(object2, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    __name(baseKeys, "baseKeys");
    function equalArrays(array2, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array2.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array2);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array2, other);
      stack.set(other, array2);
      while (++index < arrLength) {
        var arrValue = array2[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array2, stack) : customizer(arrValue, othValue, index, array2, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array2);
      stack["delete"](other);
      return result;
    }
    __name(equalArrays, "equalArrays");
    function equalByTag(object2, other, tag2, bitmask, customizer, equalFunc, stack) {
      switch (tag2) {
        case dataViewTag:
          if (object2.byteLength != other.byteLength || object2.byteOffset != other.byteOffset) {
            return false;
          }
          object2 = object2.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object2.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object2), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object2, +other);
        case errorTag:
          return object2.name == other.name && object2.message == other.message;
        case regexpTag:
        case stringTag:
          return object2 == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object2.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object2);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object2, other);
          var result = equalArrays(convert(object2), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object2);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object2) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    __name(equalByTag, "equalByTag");
    function equalObjects(object2, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object2), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object2);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object2, other);
      stack.set(other, object2);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object2[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object2, stack) : customizer(objValue, othValue, key, object2, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object2.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object2 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object2);
      stack["delete"](other);
      return result;
    }
    __name(equalObjects, "equalObjects");
    function getAllKeys(object2) {
      return baseGetAllKeys(object2, keys, getSymbols);
    }
    __name(getAllKeys, "getAllKeys");
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    __name(getMapData, "getMapData");
    function getNative(object2, key) {
      var value = getValue(object2, key);
      return baseIsNative(value) ? value : void 0;
    }
    __name(getNative, "getNative");
    function getRawTag(value) {
      var isOwn = hasOwnProperty2.call(value, symToStringTag), tag2 = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag2;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    __name(getRawTag, "getRawTag");
    var getSymbols = !nativeGetSymbols ? stubArray : function(object2) {
      if (object2 == null) {
        return [];
      }
      object2 = Object(object2);
      return arrayFilter(nativeGetSymbols(object2), function(symbol) {
        return propertyIsEnumerable.call(object2, symbol);
      });
    };
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
      getTag = /* @__PURE__ */ __name(function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      }, "getTag");
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    __name(isIndex, "isIndex");
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    __name(isKeyable, "isKeyable");
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    __name(isMasked, "isMasked");
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    __name(isPrototype, "isPrototype");
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    __name(objectToString, "objectToString");
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    __name(toSource, "toSource");
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    __name(eq, "eq");
    var isArguments = baseIsArguments(function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike2(value) && hasOwnProperty2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    __name(isArrayLike, "isArrayLike");
    var isBuffer = nativeIsBuffer || stubFalse;
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }
    __name(isEqual, "isEqual");
    function isFunction(value) {
      if (!isObject2(value)) {
        return false;
      }
      var tag2 = baseGetTag(value);
      return tag2 == funcTag || tag2 == genTag || tag2 == asyncTag || tag2 == proxyTag;
    }
    __name(isFunction, "isFunction");
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    __name(isLength, "isLength");
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike2(value) {
      return value != null && typeof value == "object";
    }
    __name(isObjectLike2, "isObjectLike");
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function keys(object2) {
      return isArrayLike(object2) ? arrayLikeKeys(object2) : baseKeys(object2);
    }
    __name(keys, "keys");
    function stubArray() {
      return [];
    }
    __name(stubArray, "stubArray");
    function stubFalse() {
      return false;
    }
    __name(stubFalse, "stubFalse");
    module.exports = isEqual;
  }
});

// ../../node_modules/lodash.isequalwith/index.js
var require_lodash2 = __commonJS({
  "../../node_modules/lodash.isequalwith/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var UNORDERED_COMPARE_FLAG = 1;
    var PARTIAL_COMPARE_FLAG = 2;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function arraySome(array2, predicate) {
      var index = -1, length = array2 ? array2.length : 0;
      while (++index < length) {
        if (predicate(array2[index], index, array2)) {
          return true;
        }
      }
      return false;
    }
    __name(arraySome, "arraySome");
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    __name(baseTimes, "baseTimes");
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    __name(baseUnary, "baseUnary");
    function getValue(object2, key) {
      return object2 == null ? void 0 : object2[key];
    }
    __name(getValue, "getValue");
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    __name(isHostObject, "isHostObject");
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    __name(mapToArray, "mapToArray");
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    __name(overArg, "overArg");
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    __name(setToArray, "setToArray");
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty2 = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView2 = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap2 = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap2);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(Hash, "Hash");
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    __name(hashClear, "hashClear");
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    __name(hashDelete, "hashDelete");
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty2.call(data, key) ? data[key] : void 0;
    }
    __name(hashGet, "hashGet");
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
    }
    __name(hashHas, "hashHas");
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    __name(hashSet, "hashSet");
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(ListCache, "ListCache");
    function listCacheClear() {
      this.__data__ = [];
    }
    __name(listCacheClear, "listCacheClear");
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    __name(listCacheDelete, "listCacheDelete");
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    __name(listCacheGet, "listCacheGet");
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    __name(listCacheHas, "listCacheHas");
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    __name(listCacheSet, "listCacheSet");
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(MapCache, "MapCache");
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    __name(mapCacheClear, "mapCacheClear");
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    __name(mapCacheDelete, "mapCacheDelete");
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    __name(mapCacheGet, "mapCacheGet");
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    __name(mapCacheHas, "mapCacheHas");
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    __name(mapCacheSet, "mapCacheSet");
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    __name(SetCache, "SetCache");
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    __name(setCacheAdd, "setCacheAdd");
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    __name(setCacheHas, "setCacheHas");
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    __name(Stack, "Stack");
    function stackClear() {
      this.__data__ = new ListCache();
    }
    __name(stackClear, "stackClear");
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }
    __name(stackDelete, "stackDelete");
    function stackGet(key) {
      return this.__data__.get(key);
    }
    __name(stackGet, "stackGet");
    function stackHas(key) {
      return this.__data__.has(key);
    }
    __name(stackHas, "stackHas");
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }
    __name(stackSet, "stackSet");
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty2.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    __name(arrayLikeKeys, "arrayLikeKeys");
    function assocIndexOf(array2, key) {
      var length = array2.length;
      while (length--) {
        if (eq(array2[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    __name(assocIndexOf, "assocIndexOf");
    function baseGetTag(value) {
      return objectToString.call(value);
    }
    __name(baseGetTag, "baseGetTag");
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObject2(value) && !isObjectLike2(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }
    __name(baseIsEqual, "baseIsEqual");
    function baseIsEqualDeep(object2, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object2), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
      if (!objIsArr) {
        objTag = getTag(object2);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object2), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object2) ? equalArrays(object2, other, equalFunc, customizer, bitmask, stack) : equalByTag(object2, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty2.call(object2, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object2.value() : object2, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object2, other, equalFunc, customizer, bitmask, stack);
    }
    __name(baseIsEqualDeep, "baseIsEqualDeep");
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    __name(baseIsNative, "baseIsNative");
    function baseIsTypedArray(value) {
      return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }
    __name(baseIsTypedArray, "baseIsTypedArray");
    function baseKeys(object2) {
      if (!isPrototype(object2)) {
        return nativeKeys(object2);
      }
      var result = [];
      for (var key in Object(object2)) {
        if (hasOwnProperty2.call(object2, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    __name(baseKeys, "baseKeys");
    function equalArrays(array2, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array2.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array2);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
      stack.set(array2, other);
      stack.set(other, array2);
      while (++index < arrLength) {
        var arrValue = array2[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array2, stack) : customizer(arrValue, othValue, index, array2, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!seen.has(othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array2);
      stack["delete"](other);
      return result;
    }
    __name(equalArrays, "equalArrays");
    function equalByTag(object2, other, tag2, equalFunc, customizer, bitmask, stack) {
      switch (tag2) {
        case dataViewTag:
          if (object2.byteLength != other.byteLength || object2.byteOffset != other.byteOffset) {
            return false;
          }
          object2 = object2.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object2.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object2), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object2, +other);
        case errorTag:
          return object2.name == other.name && object2.message == other.message;
        case regexpTag:
        case stringTag:
          return object2 == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);
          if (object2.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object2);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= UNORDERED_COMPARE_FLAG;
          stack.set(object2, other);
          var result = equalArrays(convert(object2), convert(other), equalFunc, customizer, bitmask, stack);
          stack["delete"](object2);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object2) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    __name(equalByTag, "equalByTag");
    function equalObjects(object2, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object2), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object2);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object2, other);
      stack.set(other, object2);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object2[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object2, stack) : customizer(objValue, othValue, key, object2, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object2.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object2 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object2);
      stack["delete"](other);
      return result;
    }
    __name(equalObjects, "equalObjects");
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    __name(getMapData, "getMapData");
    function getNative(object2, key) {
      var value = getValue(object2, key);
      return baseIsNative(value) ? value : void 0;
    }
    __name(getNative, "getNative");
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
      getTag = /* @__PURE__ */ __name(function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      }, "getTag");
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    __name(isIndex, "isIndex");
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    __name(isKeyable, "isKeyable");
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    __name(isMasked, "isMasked");
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    __name(isPrototype, "isPrototype");
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    __name(toSource, "toSource");
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    __name(eq, "eq");
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty2.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    __name(isArguments, "isArguments");
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    __name(isArrayLike, "isArrayLike");
    function isArrayLikeObject(value) {
      return isObjectLike2(value) && isArrayLike(value);
    }
    __name(isArrayLikeObject, "isArrayLikeObject");
    function isEqualWith2(value, other, customizer) {
      customizer = typeof customizer == "function" ? customizer : void 0;
      var result = customizer ? customizer(value, other) : void 0;
      return result === void 0 ? baseIsEqual(value, other, customizer) : !!result;
    }
    __name(isEqualWith2, "isEqualWith");
    function isFunction(value) {
      var tag2 = isObject2(value) ? objectToString.call(value) : "";
      return tag2 == funcTag || tag2 == genTag;
    }
    __name(isFunction, "isFunction");
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    __name(isLength, "isLength");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike2(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike2, "isObjectLike");
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function keys(object2) {
      return isArrayLike(object2) ? arrayLikeKeys(object2) : baseKeys(object2);
    }
    __name(keys, "keys");
    module.exports = isEqualWith2;
  }
});

// ../../node_modules/lodash.throttle/index.js
var require_lodash3 = __commonJS({
  "../../node_modules/lodash.throttle/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var FUNC_ERROR_TEXT = "Expected a function";
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var nativeMax = Math.max;
    var nativeMin = Math.min;
    var now = /* @__PURE__ */ __name(function() {
      return root.Date.now();
    }, "now");
    function debounce2(func, wait, options) {
      var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject2(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
      }
      function invokeFunc(time3) {
        var args = lastArgs, thisArg = lastThis;
        lastArgs = lastThis = void 0;
        lastInvokeTime = time3;
        result = func.apply(thisArg, args);
        return result;
      }
      __name(invokeFunc, "invokeFunc");
      function leadingEdge(time3) {
        lastInvokeTime = time3;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time3) : result;
      }
      __name(leadingEdge, "leadingEdge");
      function remainingWait(time3) {
        var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime, result2 = wait - timeSinceLastCall;
        return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
      }
      __name(remainingWait, "remainingWait");
      function shouldInvoke(time3) {
        var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime;
        return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
      }
      __name(shouldInvoke, "shouldInvoke");
      function timerExpired() {
        var time3 = now();
        if (shouldInvoke(time3)) {
          return trailingEdge(time3);
        }
        timerId = setTimeout(timerExpired, remainingWait(time3));
      }
      __name(timerExpired, "timerExpired");
      function trailingEdge(time3) {
        timerId = void 0;
        if (trailing && lastArgs) {
          return invokeFunc(time3);
        }
        lastArgs = lastThis = void 0;
        return result;
      }
      __name(trailingEdge, "trailingEdge");
      function cancel() {
        if (timerId !== void 0) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = void 0;
      }
      __name(cancel, "cancel");
      function flush() {
        return timerId === void 0 ? result : trailingEdge(now());
      }
      __name(flush, "flush");
      function debounced() {
        var time3 = now(), isInvoking = shouldInvoke(time3);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time3;
        if (isInvoking) {
          if (timerId === void 0) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === void 0) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      __name(debounced, "debounced");
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }
    __name(debounce2, "debounce");
    function throttle(func, wait, options) {
      var leading = true, trailing = true;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject2(options)) {
        leading = "leading" in options ? !!options.leading : leading;
        trailing = "trailing" in options ? !!options.trailing : trailing;
      }
      return debounce2(func, wait, {
        "leading": leading,
        "maxWait": wait,
        "trailing": trailing
      });
    }
    __name(throttle, "throttle");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function isObjectLike2(value) {
      return !!value && typeof value == "object";
    }
    __name(isObjectLike2, "isObjectLike");
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike2(value) && objectToString.call(value) == symbolTag;
    }
    __name(isSymbol, "isSymbol");
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    __name(toNumber, "toNumber");
    module.exports = throttle;
  }
});

// ../../node_modules/lodash.uniq/index.js
var require_lodash4 = __commonJS({
  "../../node_modules/lodash.uniq/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayIncludes(array2, value) {
      var length = array2 ? array2.length : 0;
      return !!length && baseIndexOf(array2, value, 0) > -1;
    }
    __name(arrayIncludes, "arrayIncludes");
    function arrayIncludesWith(array2, value, comparator) {
      var index = -1, length = array2 ? array2.length : 0;
      while (++index < length) {
        if (comparator(value, array2[index])) {
          return true;
        }
      }
      return false;
    }
    __name(arrayIncludesWith, "arrayIncludesWith");
    function baseFindIndex(array2, predicate, fromIndex, fromRight) {
      var length = array2.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array2[index], index, array2)) {
          return index;
        }
      }
      return -1;
    }
    __name(baseFindIndex, "baseFindIndex");
    function baseIndexOf(array2, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array2, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array2.length;
      while (++index < length) {
        if (array2[index] === value) {
          return index;
        }
      }
      return -1;
    }
    __name(baseIndexOf, "baseIndexOf");
    function baseIsNaN(value) {
      return value !== value;
    }
    __name(baseIsNaN, "baseIsNaN");
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    __name(cacheHas, "cacheHas");
    function getValue(object2, key) {
      return object2 == null ? void 0 : object2[key];
    }
    __name(getValue, "getValue");
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    __name(isHostObject, "isHostObject");
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    __name(setToArray, "setToArray");
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty2 = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var Set2 = getNative(root, "Set");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(Hash, "Hash");
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    __name(hashClear, "hashClear");
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    __name(hashDelete, "hashDelete");
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty2.call(data, key) ? data[key] : void 0;
    }
    __name(hashGet, "hashGet");
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
    }
    __name(hashHas, "hashHas");
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    __name(hashSet, "hashSet");
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(ListCache, "ListCache");
    function listCacheClear() {
      this.__data__ = [];
    }
    __name(listCacheClear, "listCacheClear");
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    __name(listCacheDelete, "listCacheDelete");
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    __name(listCacheGet, "listCacheGet");
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    __name(listCacheHas, "listCacheHas");
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    __name(listCacheSet, "listCacheSet");
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry2 = entries[index];
        this.set(entry2[0], entry2[1]);
      }
    }
    __name(MapCache, "MapCache");
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    __name(mapCacheClear, "mapCacheClear");
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    __name(mapCacheDelete, "mapCacheDelete");
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    __name(mapCacheGet, "mapCacheGet");
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    __name(mapCacheHas, "mapCacheHas");
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    __name(mapCacheSet, "mapCacheSet");
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    __name(SetCache, "SetCache");
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    __name(setCacheAdd, "setCacheAdd");
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    __name(setCacheHas, "setCacheHas");
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array2, key) {
      var length = array2.length;
      while (length--) {
        if (eq(array2[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    __name(assocIndexOf, "assocIndexOf");
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    __name(baseIsNative, "baseIsNative");
    function baseUniq(array2, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array2.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array2);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array2[index], computed2 = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed2 === computed2) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed2) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed2);
            }
            result.push(value);
          } else if (!includes(seen, computed2, comparator)) {
            if (seen !== result) {
              seen.push(computed2);
            }
            result.push(value);
          }
        }
      return result;
    }
    __name(baseUniq, "baseUniq");
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop2 : function(values) {
      return new Set2(values);
    };
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    __name(getMapData, "getMapData");
    function getNative(object2, key) {
      var value = getValue(object2, key);
      return baseIsNative(value) ? value : void 0;
    }
    __name(getNative, "getNative");
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    __name(isKeyable, "isKeyable");
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    __name(isMasked, "isMasked");
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    __name(toSource, "toSource");
    function uniq(array2) {
      return array2 && array2.length ? baseUniq(array2) : [];
    }
    __name(uniq, "uniq");
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    __name(eq, "eq");
    function isFunction(value) {
      var tag2 = isObject2(value) ? objectToString.call(value) : "";
      return tag2 == funcTag || tag2 == genTag;
    }
    __name(isFunction, "isFunction");
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    __name(isObject2, "isObject");
    function noop2() {
    }
    __name(noop2, "noop");
    module.exports = uniq;
  }
});

// .wrangler/tmp/bundle-zIfKRN/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-zIfKRN/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/auth.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/runtime/base64url.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/lib/buffer_utils.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/runtime/webcrypto.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var webcrypto_default = crypto;
var isCryptoKey = /* @__PURE__ */ __name((key) => key instanceof CryptoKey, "isCryptoKey");

// node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
__name(concat, "concat");

// node_modules/jose/dist/browser/runtime/base64url.js
var decodeBase64 = /* @__PURE__ */ __name((encoded) => {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}, "decodeBase64");
var decode = /* @__PURE__ */ __name((input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}, "decode");

// node_modules/jose/dist/browser/util/errors.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var JOSEError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
__name(JOSEError, "JOSEError");
JOSEError.code = "ERR_JOSE_GENERIC";
var JWTClaimValidationFailed = class extends JOSEError {
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__name(JWTClaimValidationFailed, "JWTClaimValidationFailed");
JWTClaimValidationFailed.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
var JWTExpired = class extends JOSEError {
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_EXPIRED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__name(JWTExpired, "JWTExpired");
JWTExpired.code = "ERR_JWT_EXPIRED";
var JOSEAlgNotAllowed = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
__name(JOSEAlgNotAllowed, "JOSEAlgNotAllowed");
JOSEAlgNotAllowed.code = "ERR_JOSE_ALG_NOT_ALLOWED";
var JOSENotSupported = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
};
__name(JOSENotSupported, "JOSENotSupported");
JOSENotSupported.code = "ERR_JOSE_NOT_SUPPORTED";
var JWEDecryptionFailed = class extends JOSEError {
  constructor(message2 = "decryption operation failed", options) {
    super(message2, options);
    this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
};
__name(JWEDecryptionFailed, "JWEDecryptionFailed");
JWEDecryptionFailed.code = "ERR_JWE_DECRYPTION_FAILED";
var JWEInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWE_INVALID";
  }
};
__name(JWEInvalid, "JWEInvalid");
JWEInvalid.code = "ERR_JWE_INVALID";
var JWSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_INVALID";
  }
};
__name(JWSInvalid, "JWSInvalid");
JWSInvalid.code = "ERR_JWS_INVALID";
var JWTInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWT_INVALID";
  }
};
__name(JWTInvalid, "JWTInvalid");
JWTInvalid.code = "ERR_JWT_INVALID";
var JWKInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWK_INVALID";
  }
};
__name(JWKInvalid, "JWKInvalid");
JWKInvalid.code = "ERR_JWK_INVALID";
var JWKSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_INVALID";
  }
};
__name(JWKSInvalid, "JWKSInvalid");
JWKSInvalid.code = "ERR_JWKS_INVALID";
var JWKSNoMatchingKey = class extends JOSEError {
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
};
__name(JWKSNoMatchingKey, "JWKSNoMatchingKey");
JWKSNoMatchingKey.code = "ERR_JWKS_NO_MATCHING_KEY";
var JWKSMultipleMatchingKeys = class extends JOSEError {
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
__name(JWKSMultipleMatchingKeys, "JWKSMultipleMatchingKeys");
JWKSMultipleMatchingKeys.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
var JWKSTimeout = class extends JOSEError {
  constructor(message2 = "request timed out", options) {
    super(message2, options);
    this.code = "ERR_JWKS_TIMEOUT";
  }
};
__name(JWKSTimeout, "JWKSTimeout");
JWKSTimeout.code = "ERR_JWKS_TIMEOUT";
var JWSSignatureVerificationFailed = class extends JOSEError {
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
    this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};
__name(JWSSignatureVerificationFailed, "JWSSignatureVerificationFailed");
JWSSignatureVerificationFailed.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

// node_modules/jose/dist/browser/lib/crypto_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
__name(unusable, "unusable");
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
__name(isAlgorithm, "isAlgorithm");
function getHashLength(hash2) {
  return parseInt(hash2.name.slice(4), 10);
}
__name(getHashLength, "getHashLength");
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
__name(getNamedCurve, "getNamedCurve");
function checkUsage(key, usages) {
  if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
    let msg = "CryptoKey does not support this operation, its usages must include ";
    if (usages.length > 2) {
      const last2 = usages.pop();
      msg += `one of ${usages.join(", ")}, or ${last2}.`;
    } else if (usages.length === 2) {
      msg += `one of ${usages[0]} or ${usages[1]}.`;
    } else {
      msg += `${usages[0]}.`;
    }
    throw new TypeError(msg);
  }
}
__name(checkUsage, "checkUsage");
function checkSigCryptoKey(key, alg, ...usages) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
        throw unusable("Ed25519 or Ed448");
      }
      break;
    }
    case "Ed25519": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usages);
}
__name(checkSigCryptoKey, "checkSigCryptoKey");

// node_modules/jose/dist/browser/lib/invalid_key_input.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function message(msg, actual, ...types2) {
  types2 = types2.filter(Boolean);
  if (types2.length > 2) {
    const last2 = types2.pop();
    msg += `one of type ${types2.join(", ")}, or ${last2}.`;
  } else if (types2.length === 2) {
    msg += `one of type ${types2[0]} or ${types2[1]}.`;
  } else {
    msg += `of type ${types2[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
__name(message, "message");
var invalid_key_input_default = /* @__PURE__ */ __name((actual, ...types2) => {
  return message("Key must be ", actual, ...types2);
}, "default");
function withAlg(alg, actual, ...types2) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types2);
}
__name(withAlg, "withAlg");

// node_modules/jose/dist/browser/runtime/is_key_like.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var is_key_like_default = /* @__PURE__ */ __name((key) => {
  if (isCryptoKey(key)) {
    return true;
  }
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "default");
var types = ["CryptoKey"];

// node_modules/jose/dist/browser/lib/is_disjoint.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var isDisjoint = /* @__PURE__ */ __name((...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}, "isDisjoint");
var is_disjoint_default = isDisjoint;

// node_modules/jose/dist/browser/lib/is_object.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
__name(isObjectLike, "isObjectLike");
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}
__name(isObject, "isObject");

// node_modules/jose/dist/browser/runtime/check_key_length.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var check_key_length_default = /* @__PURE__ */ __name((alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}, "default");

// node_modules/jose/dist/browser/runtime/normalize_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/lib/is_jwk.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isJWK(key) {
  return isObject(key) && typeof key.kty === "string";
}
__name(isJWK, "isJWK");
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
__name(isPrivateJWK, "isPrivateJWK");
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
__name(isPublicJWK, "isPublicJWK");
function isSecretJWK(key) {
  return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
}
__name(isSecretJWK, "isSecretJWK");

// node_modules/jose/dist/browser/runtime/jwk_to_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "EdDSA":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
__name(subtleMapping, "subtleMapping");
var parse = /* @__PURE__ */ __name(async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const rest = [
    algorithm,
    jwk.ext ?? false,
    jwk.key_ops ?? keyUsages
  ];
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
}, "parse");
var jwk_to_key_default = parse;

// node_modules/jose/dist/browser/runtime/normalize_key.js
var exportKeyValue = /* @__PURE__ */ __name((k) => decode(k), "exportKeyValue");
var privCache;
var pubCache;
var isKeyObject = /* @__PURE__ */ __name((key) => {
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "isKeyObject");
var importAndCache = /* @__PURE__ */ __name(async (cache, key, jwk, alg, freeze = false) => {
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
  if (freeze)
    Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
}, "importAndCache");
var normalizePublicKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    delete jwk.d;
    delete jwk.dp;
    delete jwk.dq;
    delete jwk.p;
    delete jwk.q;
    delete jwk.qi;
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(pubCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(pubCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePublicKey");
var normalizePrivateKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(privCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(privCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePrivateKey");
var normalize_key_default = { normalizePublicKey, normalizePrivateKey };

// node_modules/jose/dist/browser/key/import.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function importJWK(jwk, alg) {
  if (!isObject(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  alg || (alg = jwk.alg);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if ("oth" in jwk && jwk.oth !== void 0) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg });
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}
__name(importJWK, "importJWK");

// node_modules/jose/dist/browser/lib/check_key_type.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var tag = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag], "tag");
var jwkMatchesOp = /* @__PURE__ */ __name((alg, key, usage) => {
  if (key.use !== void 0 && key.use !== "sig") {
    throw new TypeError("Invalid key for this operation, when present its use must be sig");
  }
  if (key.key_ops !== void 0 && key.key_ops.includes?.(usage) !== true) {
    throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
  }
  return true;
}, "jwkMatchesOp");
var symmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (key instanceof Uint8Array)
    return;
  if (allowJwk && isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
      return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
}, "symmetricTypeCheck");
var asymmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (allowJwk && isJWK(key)) {
    switch (usage) {
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, allowJwk ? "JSON Web Key" : null));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (usage === "sign" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
  }
  if (usage === "decrypt" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
  }
  if (key.algorithm && usage === "verify" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
  }
  if (key.algorithm && usage === "encrypt" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
  }
}, "asymmetricTypeCheck");
function checkKeyType(allowJwk, alg, key, usage) {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key, usage, allowJwk);
  } else {
    asymmetricTypeCheck(alg, key, usage, allowJwk);
  }
}
__name(checkKeyType, "checkKeyType");
var check_key_type_default = checkKeyType.bind(void 0, false);
var checkKeyTypeWithJwk = checkKeyType.bind(void 0, true);

// node_modules/jose/dist/browser/lib/validate_crit.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}
__name(validateCrit, "validateCrit");
var validate_crit_default = validateCrit;

// node_modules/jose/dist/browser/lib/validate_algorithms.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var validateAlgorithms = /* @__PURE__ */ __name((option, algorithms) => {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}, "validateAlgorithms");
var validate_algorithms_default = validateAlgorithms;

// node_modules/jose/dist/browser/jws/compact/verify.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/jws/flattened/verify.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/runtime/verify.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/runtime/subtle_dsa.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function subtleDsa(alg, algorithm) {
  const hash2 = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash: hash2, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash: hash2, name: "RSA-PSS", saltLength: alg.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash: hash2, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash: hash2, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
      return { name: "Ed25519" };
    case "EdDSA":
      return { name: algorithm.name };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}
__name(subtleDsa, "subtleDsa");

// node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function getCryptoKey(alg, key, usage) {
  if (usage === "sign") {
    key = await normalize_key_default.normalizePrivateKey(key, alg);
  }
  if (usage === "verify") {
    key = await normalize_key_default.normalizePublicKey(key, alg);
  }
  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage);
    return key;
  }
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, ...types));
    }
    return webcrypto_default.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array", "JSON Web Key"));
}
__name(getCryptoKey, "getCryptoKey");

// node_modules/jose/dist/browser/runtime/verify.js
var verify = /* @__PURE__ */ __name(async (alg, key, signature, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtleDsa(alg, cryptoKey.algorithm);
  try {
    return await webcrypto_default.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
}, "verify");
var verify_default = verify;

// node_modules/jose/dist/browser/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
    checkKeyTypeWithJwk(alg, key, "verify");
    if (isJWK(key)) {
      key = await importJWK(key, alg);
    }
  } else {
    checkKeyTypeWithJwk(alg, key, "verify");
  }
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const verified = await verify_default(alg, key, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key };
  }
  return result;
}
__name(flattenedVerify, "flattenedVerify");

// node_modules/jose/dist/browser/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(compactVerify, "compactVerify");

// node_modules/jose/dist/browser/jwt/verify.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/jose/dist/browser/lib/epoch.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var epoch_default = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "default");

// node_modules/jose/dist/browser/lib/secs.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = /* @__PURE__ */ __name((str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}, "default");

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
var normalizeTyp = /* @__PURE__ */ __name((value) => value.toLowerCase().replace(/^application\//, ""), "normalizeTyp");
var checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
}, "checkAudiencePresence");
var jwt_claims_set_default = /* @__PURE__ */ __name((protectedHeader, encodedPayload, options = {}) => {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}, "default");

// node_modules/jose/dist/browser/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = jwt_claims_set_default(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(jwtVerify, "jwtVerify");

// src/auth.ts
async function verifyBoardToken(token, secret) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}
__name(verifyBoardToken, "verifyBoardToken");

// src/TldrawDurableObject.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
import { DurableObject } from "cloudflare:workers";

// ../../node_modules/@tldraw/sync-core/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/version.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TLDRAW_LIBRARY_VERSION_KEY = "__TLDRAW_LIBRARY_VERSIONS__";
function getLibraryVersions() {
  if (globalThis[TLDRAW_LIBRARY_VERSION_KEY]) {
    return globalThis[TLDRAW_LIBRARY_VERSION_KEY];
  }
  const info3 = {
    versions: [],
    didWarn: false,
    scheduledNotice: null
  };
  Object.defineProperty(globalThis, TLDRAW_LIBRARY_VERSION_KEY, {
    value: info3,
    writable: false,
    configurable: false,
    enumerable: false
  });
  return info3;
}
__name(getLibraryVersions, "getLibraryVersions");
function registerTldrawLibraryVersion(name, version2, modules) {
  if (!name || !version2 || !modules) {
    if (true) {
      throw new Error("Missing name/version/module system in built version of tldraw library");
    }
    return;
  }
  const info3 = getLibraryVersions();
  if (isNextjsDev()) {
    const isDuplicate = info3.versions.some(
      (v) => v.name === name && v.version === version2 && v.modules === modules
    );
    if (isDuplicate)
      return;
  }
  info3.versions.push({ name, version: version2, modules });
  if (!info3.scheduledNotice) {
    try {
      info3.scheduledNotice = setTimeout(() => {
        info3.scheduledNotice = null;
        checkLibraryVersions(info3);
      }, 100);
    } catch {
      checkLibraryVersions(info3);
    }
  }
}
__name(registerTldrawLibraryVersion, "registerTldrawLibraryVersion");
function checkLibraryVersions(info3) {
  if (!info3.versions.length)
    return;
  if (info3.didWarn)
    return;
  const sorted = info3.versions.sort((a, b) => compareVersions(a.version, b.version));
  const latestVersion = sorted[sorted.length - 1].version;
  const matchingVersions = /* @__PURE__ */ new Set();
  const nonMatchingVersions = /* @__PURE__ */ new Map();
  for (const lib of sorted) {
    if (nonMatchingVersions.has(lib.name)) {
      matchingVersions.delete(lib.name);
      entry(nonMatchingVersions, lib.name, /* @__PURE__ */ new Set()).add(lib.version);
      continue;
    }
    if (lib.version === latestVersion) {
      matchingVersions.add(lib.name);
    } else {
      matchingVersions.delete(lib.name);
      entry(nonMatchingVersions, lib.name, /* @__PURE__ */ new Set()).add(lib.version);
    }
  }
  if (nonMatchingVersions.size > 0) {
    const message2 = [
      `${format("[tldraw]", ["bold", "bgRed", "textWhite"])} ${format("You have multiple versions of tldraw libraries installed. This can lead to bugs and unexpected behavior.", ["textRed", "bold"])}`,
      "",
      `The latest version you have installed is ${format(`v${latestVersion}`, ["bold", "textBlue"])}. The following libraries are on the latest version:`,
      ...Array.from(matchingVersions, (name) => `  \u2022 \u2705 ${format(name, ["bold"])}`),
      "",
      `The following libraries are not on the latest version, or have multiple versions installed:`,
      ...Array.from(nonMatchingVersions, ([name, versions2]) => {
        const sortedVersions = Array.from(versions2).sort(compareVersions).map((v) => format(`v${v}`, v === latestVersion ? ["textGreen"] : ["textRed"]));
        return `  \u2022 \u274C ${format(name, ["bold"])} (${sortedVersions.join(", ")})`;
      })
    ];
    console.log(message2.join("\n"));
    info3.didWarn = true;
    return;
  }
  const potentialDuplicates = /* @__PURE__ */ new Map();
  for (const lib of sorted) {
    entry(potentialDuplicates, lib.name, { version: lib.version, modules: [] }).modules.push(
      lib.modules
    );
  }
  const duplicates = /* @__PURE__ */ new Map();
  for (const [name, lib] of potentialDuplicates) {
    if (lib.modules.length > 1)
      duplicates.set(name, lib);
  }
  if (duplicates.size > 0) {
    const message2 = [
      `${format("[tldraw]", ["bold", "bgRed", "textWhite"])} ${format("You have multiple instances of some tldraw libraries active. This can lead to bugs and unexpected behavior. ", ["textRed", "bold"])}`,
      "",
      "This usually means that your bundler is misconfigured, and is importing the same library multiple times - usually once as an ES Module, and once as a CommonJS module.",
      "",
      "The following libraries have been imported multiple times:",
      ...Array.from(duplicates, ([name, lib]) => {
        const modules = lib.modules.map((m, i) => m === "esm" ? `      ${i + 1}. ES Modules` : `      ${i + 1}. CommonJS`).join("\n");
        return `  \u2022 \u274C ${format(name, ["bold"])} v${lib.version}: 
${modules}`;
      }),
      "",
      "You should configure your bundler to only import one version of each library."
    ];
    console.log(message2.join("\n"));
    info3.didWarn = true;
    return;
  }
}
__name(checkLibraryVersions, "checkLibraryVersions");
function compareVersions(a, b) {
  const aMatch = a.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\w+))?$/);
  const bMatch = b.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\w+))?$/);
  if (!aMatch || !bMatch)
    return a.localeCompare(b);
  if (aMatch[1] !== bMatch[1])
    return Number(aMatch[1]) - Number(bMatch[1]);
  if (aMatch[2] !== bMatch[2])
    return Number(aMatch[2]) - Number(bMatch[2]);
  if (aMatch[3] !== bMatch[3])
    return Number(aMatch[3]) - Number(bMatch[3]);
  if (aMatch[4] && bMatch[4])
    return aMatch[4].localeCompare(bMatch[4]);
  if (aMatch[4])
    return 1;
  if (bMatch[4])
    return -1;
  return 0;
}
__name(compareVersions, "compareVersions");
var formats = {
  bold: "1",
  textBlue: "94",
  textRed: "31",
  textGreen: "32",
  bgRed: "41",
  textWhite: "97"
};
function format(value, formatters = []) {
  return `\x1B[${formatters.map((f) => formats[f]).join(";")}m${value}\x1B[m`;
}
__name(format, "format");
function isNextjsDev() {
  try {
    return false;
  } catch {
    return false;
  }
}
__name(isNextjsDev, "isNextjsDev");
function entry(map, key, defaultValue) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
__name(entry, "entry");

// ../../node_modules/@tldraw/utils/dist-esm/index.mjs
var import_lodash2 = __toESM(require_lodash(), 1);
var import_lodash3 = __toESM(require_lodash2(), 1);
var import_lodash4 = __toESM(require_lodash3(), 1);
var import_lodash5 = __toESM(require_lodash4(), 1);

// ../../node_modules/@tldraw/utils/dist-esm/lib/array.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/bind.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/control.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/function.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function omitFromStackTrace(fn) {
  const wrappedFn = /* @__PURE__ */ __name((...args) => {
    try {
      return fn(...args);
    } catch (error3) {
      if (error3 instanceof Error && Error.captureStackTrace) {
        Error.captureStackTrace(error3, wrappedFn);
      }
      throw error3;
    }
  }, "wrappedFn");
  return wrappedFn;
}
__name(omitFromStackTrace, "omitFromStackTrace");

// ../../node_modules/@tldraw/utils/dist-esm/lib/control.mjs
var Result = {
  /**
   * Create a successful result containing a value.
   *
   * @param value - The success value to wrap
   * @returns An OkResult containing the value
   */
  ok(value) {
    return { ok: true, value };
  },
  /**
   * Create a failed result containing an error.
   *
   * @param error - The error value to wrap
   * @returns An ErrorResult containing the error
   */
  err(error3) {
    return { ok: false, error: error3 };
  },
  /**
   * Create a successful result containing an array of values.
   *
   * If any of the results are errors, the returned result will be an error containing the first error.
   *
   * @param results - The array of results to wrap
   * @returns An OkResult containing the array of values
   */
  all(results) {
    return results.every((result) => result.ok) ? Result.ok(results.map((result) => result.value)) : Result.err(results.find((result) => !result.ok)?.error);
  }
};
function exhaustiveSwitchError(value, property) {
  const debugValue = property && value && typeof value === "object" && property in value ? value[property] : value;
  throw new Error(`Unknown switch case ${debugValue}`);
}
__name(exhaustiveSwitchError, "exhaustiveSwitchError");
var assert3 = omitFromStackTrace(
  (value, message2) => {
    if (!value) {
      throw new Error(message2 || "Assertion Error");
    }
  }
);
var assertExists = omitFromStackTrace((value, message2) => {
  if (value == null) {
    throw new Error(message2 ?? "value must be defined");
  }
  return value;
});

// ../../node_modules/@tldraw/utils/dist-esm/lib/cache.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/debounce.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/error.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var annotationsByError = /* @__PURE__ */ new WeakMap();
function annotateError(error3, annotations) {
  if (typeof error3 !== "object" || error3 === null)
    return;
  let currentAnnotations = annotationsByError.get(error3);
  if (!currentAnnotations) {
    currentAnnotations = { tags: {}, extras: {} };
    annotationsByError.set(error3, currentAnnotations);
  }
  if (annotations.tags) {
    currentAnnotations.tags = {
      ...currentAnnotations.tags,
      ...annotations.tags
    };
  }
  if (annotations.extras) {
    currentAnnotations.extras = {
      ...currentAnnotations.extras,
      ...annotations.extras
    };
  }
}
__name(annotateError, "annotateError");

// ../../node_modules/@tldraw/utils/dist-esm/lib/ExecutionQueue.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/file.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/network.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/hash.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/id.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var crypto2 = globalThis.crypto;
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = new Uint8Array(bytes * POOL_SIZE_MULTIPLIER);
    crypto2.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto2.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}
__name(fillPool, "fillPool");
function nanoid(size = 21) {
  fillPool(size -= 0);
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}
__name(nanoid, "nanoid");
var impl = nanoid;
function uniqueId(size) {
  return impl(size);
}
__name(uniqueId, "uniqueId");

// ../../node_modules/@tldraw/utils/dist-esm/lib/iterable.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/media.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/apng.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/avif.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/gif.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/png.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TABLE = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
if (typeof Int32Array !== "undefined") {
  TABLE = new Int32Array(TABLE);
}

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/webp.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/media/media.mjs
var DEFAULT_SUPPORTED_VECTOR_IMAGE_TYPES = Object.freeze(["image/svg+xml"]);
var DEFAULT_SUPPORTED_STATIC_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp"
]);
var DEFAULT_SUPPORTED_ANIMATED_IMAGE_TYPES = Object.freeze([
  "image/gif",
  "image/apng",
  "image/avif"
]);
var DEFAULT_SUPPORTED_IMAGE_TYPES = Object.freeze([
  ...DEFAULT_SUPPORTED_STATIC_IMAGE_TYPES,
  ...DEFAULT_SUPPORTED_VECTOR_IMAGE_TYPES,
  ...DEFAULT_SUPPORTED_ANIMATED_IMAGE_TYPES
]);
var DEFAULT_SUPPORT_VIDEO_TYPES = Object.freeze([
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);
var DEFAULT_SUPPORTED_MEDIA_TYPES = Object.freeze([
  ...DEFAULT_SUPPORTED_IMAGE_TYPES,
  ...DEFAULT_SUPPORT_VIDEO_TYPES
]);
var DEFAULT_SUPPORTED_MEDIA_TYPE_LIST = DEFAULT_SUPPORTED_MEDIA_TYPES.join(",");

// ../../node_modules/@tldraw/utils/dist-esm/lib/number.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/object.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_lodash = __toESM(require_lodash2(), 1);
function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
__name(hasOwnProperty, "hasOwnProperty");
function getOwnProperty(obj, key) {
  if (!hasOwnProperty(obj, key)) {
    return void 0;
  }
  return obj[key];
}
__name(getOwnProperty, "getOwnProperty");
function objectMapValues(object2) {
  return Object.values(object2);
}
__name(objectMapValues, "objectMapValues");
function objectMapEntries(object2) {
  return Object.entries(object2);
}
__name(objectMapEntries, "objectMapEntries");
function* objectMapEntriesIterable(object2) {
  for (const key in object2) {
    if (!Object.prototype.hasOwnProperty.call(object2, key))
      continue;
    yield [key, object2[key]];
  }
}
__name(objectMapEntriesIterable, "objectMapEntriesIterable");
function objectMapFromEntries(entries) {
  return Object.fromEntries(entries);
}
__name(objectMapFromEntries, "objectMapFromEntries");
function mapObjectMapValues(object2, mapper) {
  const result = {};
  for (const key in object2) {
    if (!Object.prototype.hasOwnProperty.call(object2, key))
      continue;
    result[key] = mapper(key, object2[key]);
  }
  return result;
}
__name(mapObjectMapValues, "mapObjectMapValues");

// ../../node_modules/@tldraw/utils/dist-esm/lib/perf.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PERFORMANCE_COLORS = {
  Good: "#40C057",
  Mid: "#FFC078",
  Poor: "#E03131"
};
var PERFORMANCE_PREFIX_COLOR = PERFORMANCE_COLORS.Good;

// ../../node_modules/@tldraw/utils/dist-esm/lib/PerformanceTracker.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/reordering.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/jittered-fractional-indexing/dist/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/fractional-indexing/src/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function midpoint(a, b, digits) {
  const zero = digits[0];
  if (b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a.slice(-1) === zero || b && b.slice(-1) === zero) {
    throw new Error("trailing zero");
  }
  if (b) {
    let n = 0;
    while ((a[n] || zero) === b[n]) {
      n++;
    }
    if (n > 0) {
      return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
    }
  }
  const digitA = a ? digits.indexOf(a[0]) : 0;
  const digitB = b != null ? digits.indexOf(b[0]) : digits.length;
  if (digitB - digitA > 1) {
    const midDigit = Math.round(0.5 * (digitA + digitB));
    return digits[midDigit];
  } else {
    if (b && b.length > 1) {
      return b.slice(0, 1);
    } else {
      return digits[digitA] + midpoint(a.slice(1), null, digits);
    }
  }
}
__name(midpoint, "midpoint");
function validateInteger(int) {
  if (int.length !== getIntegerLength(int[0])) {
    throw new Error("invalid integer part of order key: " + int);
  }
}
__name(validateInteger, "validateInteger");
function getIntegerLength(head) {
  if (head >= "a" && head <= "z") {
    return head.charCodeAt(0) - "a".charCodeAt(0) + 2;
  } else if (head >= "A" && head <= "Z") {
    return "Z".charCodeAt(0) - head.charCodeAt(0) + 2;
  } else {
    throw new Error("invalid order key head: " + head);
  }
}
__name(getIntegerLength, "getIntegerLength");
function getIntegerPart(key) {
  const integerPartLength = getIntegerLength(key[0]);
  if (integerPartLength > key.length) {
    throw new Error("invalid order key: " + key);
  }
  return key.slice(0, integerPartLength);
}
__name(getIntegerPart, "getIntegerPart");
function validateOrderKey(key, digits) {
  if (key === "A" + digits[0].repeat(26)) {
    throw new Error("invalid order key: " + key);
  }
  const i = getIntegerPart(key);
  const f = key.slice(i.length);
  if (f.slice(-1) === digits[0]) {
    throw new Error("invalid order key: " + key);
  }
}
__name(validateOrderKey, "validateOrderKey");
function incrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let carry = true;
  for (let i = digs.length - 1; carry && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) + 1;
    if (d === digits.length) {
      digs[i] = digits[0];
    } else {
      digs[i] = digits[d];
      carry = false;
    }
  }
  if (carry) {
    if (head === "Z") {
      return "a" + digits[0];
    }
    if (head === "z") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) + 1);
    if (h > "a") {
      digs.push(digits[0]);
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
__name(incrementInteger, "incrementInteger");
function decrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let borrow = true;
  for (let i = digs.length - 1; borrow && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) - 1;
    if (d === -1) {
      digs[i] = digits.slice(-1);
    } else {
      digs[i] = digits[d];
      borrow = false;
    }
  }
  if (borrow) {
    if (head === "a") {
      return "Z" + digits.slice(-1);
    }
    if (head === "A") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) - 1);
    if (h < "Z") {
      digs.push(digits.slice(-1));
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
__name(decrementInteger, "decrementInteger");
function generateKeyBetween(a, b, digits = BASE_62_DIGITS) {
  if (a != null) {
    validateOrderKey(a, digits);
  }
  if (b != null) {
    validateOrderKey(b, digits);
  }
  if (a != null && b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a == null) {
    if (b == null) {
      return "a" + digits[0];
    }
    const ib2 = getIntegerPart(b);
    const fb2 = b.slice(ib2.length);
    if (ib2 === "A" + digits[0].repeat(26)) {
      return ib2 + midpoint("", fb2, digits);
    }
    if (ib2 < b) {
      return ib2;
    }
    const res = decrementInteger(ib2, digits);
    if (res == null) {
      throw new Error("cannot decrement any more");
    }
    return res;
  }
  if (b == null) {
    const ia2 = getIntegerPart(a);
    const fa2 = a.slice(ia2.length);
    const i2 = incrementInteger(ia2, digits);
    return i2 == null ? ia2 + midpoint(fa2, null, digits) : i2;
  }
  const ia = getIntegerPart(a);
  const fa = a.slice(ia.length);
  const ib = getIntegerPart(b);
  const fb = b.slice(ib.length);
  if (ia === ib) {
    return ia + midpoint(fa, fb, digits);
  }
  const i = incrementInteger(ia, digits);
  if (i == null) {
    throw new Error("cannot increment any more");
  }
  if (i < b) {
    return i;
  }
  return ia + midpoint(fa, null, digits);
}
__name(generateKeyBetween, "generateKeyBetween");
function generateNKeysBetween(a, b, n, digits = BASE_62_DIGITS) {
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [generateKeyBetween(a, b, digits)];
  }
  if (b == null) {
    let c2 = generateKeyBetween(a, b, digits);
    const result = [c2];
    for (let i = 0; i < n - 1; i++) {
      c2 = generateKeyBetween(c2, b, digits);
      result.push(c2);
    }
    return result;
  }
  if (a == null) {
    let c2 = generateKeyBetween(a, b, digits);
    const result = [c2];
    for (let i = 0; i < n - 1; i++) {
      c2 = generateKeyBetween(a, c2, digits);
      result.push(c2);
    }
    result.reverse();
    return result;
  }
  const mid = Math.floor(n / 2);
  const c = generateKeyBetween(a, b, digits);
  return [
    ...generateNKeysBetween(a, c, mid, digits),
    c,
    ...generateNKeysBetween(c, b, n - mid - 1, digits)
  ];
}
__name(generateNKeysBetween, "generateNKeysBetween");

// ../../node_modules/jittered-fractional-indexing/dist/index.js
var DEFAULT_JITTER_BITS = 30;
var DEFAULT_GET_RANDOM_BIT = /* @__PURE__ */ __name(() => Math.random() < 0.5, "DEFAULT_GET_RANDOM_BIT");
function assertIsNonnegativeInteger(paramName, n) {
  if (!Number.isInteger(n)) {
    throw new Error(`"${paramName}" must be an integer, got '${n}'`);
  }
  if (n < 0) {
    throw new Error(
      `"${paramName}" must be greater than or equal to 0, got '${n}'`
    );
  }
}
__name(assertIsNonnegativeInteger, "assertIsNonnegativeInteger");
function generateKeyBetween2(a, b, opts) {
  const {
    digits,
    jitterBits = DEFAULT_JITTER_BITS,
    getRandomBit = DEFAULT_GET_RANDOM_BIT
  } = opts ?? {};
  assertIsNonnegativeInteger("jitterBits", jitterBits);
  let remainingJitterBits = jitterBits;
  let low = a;
  let high = b;
  let midpoint2 = generateKeyBetween(a, b, digits);
  while (remainingJitterBits > 0) {
    const randomBit = getRandomBit() ? 1 : 0;
    if (randomBit === 1) {
      low = midpoint2;
    } else {
      high = midpoint2;
    }
    midpoint2 = generateKeyBetween(low, high, digits);
    remainingJitterBits--;
  }
  return midpoint2;
}
__name(generateKeyBetween2, "generateKeyBetween");
function generateNKeysBetween2(a, b, n, opts) {
  const { digits, jitterBits } = opts ?? {};
  assertIsNonnegativeInteger("n", n);
  if (n === 0) {
    return [];
  }
  if (jitterBits === 0) {
    return generateNKeysBetween(a, b, n, digits);
  }
  const keys = generateNKeysBetween(a, b, n + 1, digits);
  const jitteredKeys = [];
  for (let i = 0; i < n; i++) {
    const currentKey = keys[i];
    const nextKey = keys[i + 1];
    jitteredKeys.push(generateKeyBetween2(currentKey, nextKey, opts));
  }
  return jitteredKeys;
}
__name(generateNKeysBetween2, "generateNKeysBetween");

// ../../node_modules/@tldraw/utils/dist-esm/lib/reordering.mjs
var generateKeysFn = false ? generateNKeysBetweenWithNoJitter : generateNKeysBetween2;
function validateIndexKey(index) {
  try {
    generateKeyBetween2(index, null);
  } catch {
    throw new Error("invalid index: " + index);
  }
}
__name(validateIndexKey, "validateIndexKey");
function getIndices(n, start = "a1") {
  return [start, ...generateKeysFn(start, null, n)];
}
__name(getIndices, "getIndices");
function sortByIndex(a, b) {
  if (a.index < b.index) {
    return -1;
  } else if (a.index > b.index) {
    return 1;
  }
  return 0;
}
__name(sortByIndex, "sortByIndex");

// ../../node_modules/@tldraw/utils/dist-esm/lib/retry.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/sort.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/storage.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/stringEnum.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/throttle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var isTest = /* @__PURE__ */ __name(() => typeof process !== "undefined" && false, "isTest");
var timingVarianceFactor = 0.9;
var getTargetTimePerFrame = /* @__PURE__ */ __name((targetFps) => Math.floor(1e3 / targetFps) * timingVarianceFactor, "getTargetTimePerFrame");
var FpsScheduler = class {
  targetFps;
  targetTimePerFrame;
  fpsQueue = [];
  frameRaf;
  flushRaf;
  lastFlushTime;
  constructor(targetFps = 120) {
    this.targetFps = targetFps;
    this.targetTimePerFrame = getTargetTimePerFrame(targetFps);
    this.lastFlushTime = -this.targetTimePerFrame;
  }
  updateTargetFps(targetFps) {
    if (targetFps === this.targetFps)
      return;
    this.targetFps = targetFps;
    this.targetTimePerFrame = getTargetTimePerFrame(targetFps);
    this.lastFlushTime = -this.targetTimePerFrame;
  }
  flush() {
    const queue = this.fpsQueue.splice(0, this.fpsQueue.length);
    for (const fn of queue) {
      fn();
    }
  }
  tick(isOnNextFrame = false) {
    if (this.frameRaf)
      return;
    const now = Date.now();
    const elapsed = now - this.lastFlushTime;
    if (elapsed < this.targetTimePerFrame) {
      this.frameRaf = requestAnimationFrame(() => {
        this.frameRaf = void 0;
        this.tick(true);
      });
      return;
    }
    if (isOnNextFrame) {
      if (this.flushRaf)
        return;
      this.lastFlushTime = now;
      this.flush();
    } else {
      if (this.flushRaf)
        return;
      this.flushRaf = requestAnimationFrame(() => {
        this.flushRaf = void 0;
        this.lastFlushTime = Date.now();
        this.flush();
      });
    }
  }
  /**
   * Creates a throttled version of a function that executes at most once per frame.
   * The default target frame rate is set by the FpsScheduler instance.
   * Subsequent calls within the same frame are ignored, ensuring smooth performance
   * for high-frequency events like mouse movements or scroll events.
   *
   * @param fn - The function to throttle, optionally with a cancel method
   * @returns A throttled function with an optional cancel method to remove pending calls
   *
   * @public
   */
  fpsThrottle(fn) {
    if (isTest()) {
      fn.cancel = () => {
        if (this.frameRaf) {
          cancelAnimationFrame(this.frameRaf);
          this.frameRaf = void 0;
        }
        if (this.flushRaf) {
          cancelAnimationFrame(this.flushRaf);
          this.flushRaf = void 0;
        }
      };
      return fn;
    }
    const throttledFn = /* @__PURE__ */ __name(() => {
      if (this.fpsQueue.includes(fn)) {
        return;
      }
      this.fpsQueue.push(fn);
      this.tick();
    }, "throttledFn");
    throttledFn.cancel = () => {
      const index = this.fpsQueue.indexOf(fn);
      if (index > -1) {
        this.fpsQueue.splice(index, 1);
      }
    };
    return throttledFn;
  }
  /**
   * Schedules a function to execute on the next animation frame.
   * If the same function is passed multiple times before the frame executes,
   * it will only be called once, effectively batching multiple calls.
   *
   * @param fn - The function to execute on the next frame
   * @returns A cancel function that can prevent execution if called before the next frame
   *
   * @public
   */
  throttleToNextFrame(fn) {
    if (isTest()) {
      fn();
      return () => void 0;
    }
    if (!this.fpsQueue.includes(fn)) {
      this.fpsQueue.push(fn);
      this.tick();
    }
    return () => {
      const index = this.fpsQueue.indexOf(fn);
      if (index > -1) {
        this.fpsQueue.splice(index, 1);
      }
    };
  }
};
__name(FpsScheduler, "FpsScheduler");
var defaultScheduler = new FpsScheduler(120);

// ../../node_modules/@tldraw/utils/dist-esm/lib/timers.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/lib/url.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var safeParseUrl = /* @__PURE__ */ __name((url, baseUrl) => {
  try {
    return new URL(url, baseUrl);
  } catch {
    return;
  }
}, "safeParseUrl");

// ../../node_modules/@tldraw/utils/dist-esm/lib/value.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getStructuredClone() {
  if (typeof globalThis !== "undefined" && globalThis.structuredClone) {
    return [globalThis.structuredClone, true];
  }
  if (typeof global !== "undefined" && global.structuredClone) {
    return [global.structuredClone, true];
  }
  if (typeof window !== "undefined" && window.structuredClone) {
    return [window.structuredClone, true];
  }
  return [(i) => i ? JSON.parse(JSON.stringify(i)) : i, false];
}
__name(getStructuredClone, "getStructuredClone");
var _structuredClone = getStructuredClone();
var structuredClone = _structuredClone[0];
var isNativeStructuredClone = _structuredClone[1];
var STRUCTURED_CLONE_OBJECT_PROTOTYPE = Object.getPrototypeOf(structuredClone({}));

// ../../node_modules/@tldraw/utils/dist-esm/lib/warn.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/utils/dist-esm/index.mjs
registerTldrawLibraryVersion(
  "@tldraw/utils",
  "4.5.12",
  "esm"
);

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/chunk.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var MAX_CLIENT_SENT_MESSAGE_SIZE_BYTES = 1024 * 1024;
var MAX_BYTES_PER_CHAR = 4;
var MAX_SAFE_MESSAGE_SIZE = MAX_CLIENT_SENT_MESSAGE_SIZE_BYTES / MAX_BYTES_PER_CHAR;
var chunkRe = /^(\d+)_(.*)$/s;
var JsonChunkAssembler = class {
  /**
   * Current assembly state - either 'idle' or tracking chunks being received
   */
  state = "idle";
  /**
   * Processes a single message, which can be either a complete JSON object or a chunk.
   * For complete JSON objects (starting with '\{'), parses immediately.
   * For chunks (prefixed with "\{number\}_"), accumulates until all chunks received.
   *
   * @param msg - The message to process, either JSON or chunk format
   * @returns Result object with data/stringified on success, error object on failure, or null for incomplete chunks
   * 	- `\{ data: object, stringified: string \}` - Successfully parsed complete message
   * 	- `\{ error: Error \}` - Parse error or invalid chunk sequence
   * 	- `null` - Chunk received but more chunks expected
   *
   * @example
   * ```ts
   * const assembler = new JsonChunkAssembler()
   *
   * // Complete JSON message
   * const result = assembler.handleMessage('{"key": "value"}')
   * if (result && 'data' in result) {
   *   console.log(result.data) // { key: "value" }
   * }
   *
   * // Chunked message sequence
   * assembler.handleMessage('2_hel') // null - more chunks expected
   * assembler.handleMessage('1_lo ') // null - more chunks expected
   * assembler.handleMessage('0_wor') // { data: "hello wor", stringified: "hello wor" }
   * ```
   */
  handleMessage(msg) {
    if (msg.startsWith("{")) {
      const error3 = this.state === "idle" ? void 0 : new Error("Unexpected non-chunk message");
      this.state = "idle";
      return error3 ? { error: error3 } : { data: JSON.parse(msg), stringified: msg };
    } else {
      const match = chunkRe.exec(msg);
      if (!match) {
        this.state = "idle";
        return { error: new Error("Invalid chunk: " + JSON.stringify(msg.slice(0, 20) + "...")) };
      }
      const numChunksRemaining = Number(match[1]);
      const data = match[2];
      if (this.state === "idle") {
        this.state = {
          chunksReceived: [data],
          totalChunks: numChunksRemaining + 1
        };
      } else {
        this.state.chunksReceived.push(data);
        if (numChunksRemaining !== this.state.totalChunks - this.state.chunksReceived.length) {
          this.state = "idle";
          return { error: new Error(`Chunks received in wrong order`) };
        }
      }
      if (this.state.chunksReceived.length === this.state.totalChunks) {
        try {
          const stringified = this.state.chunksReceived.join("");
          const data2 = JSON.parse(stringified);
          return { data: data2, stringified };
        } catch (e) {
          return { error: e };
        } finally {
          this.state = "idle";
        }
      }
      return null;
    }
  }
};
__name(JsonChunkAssembler, "JsonChunkAssembler");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/ClientWebSocketAdapter.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/helpers.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isChild(x) {
  return x && typeof x === "object" && "parents" in x;
}
__name(isChild, "isChild");
function haveParentsChanged(child) {
  for (let i = 0, n = child.parents.length; i < n; i++) {
    child.parents[i].__unsafe__getWithoutCapture(true);
    if (child.parents[i].lastChangedEpoch !== child.parentEpochs[i]) {
      return true;
    }
  }
  return false;
}
__name(haveParentsChanged, "haveParentsChanged");
function detach(parent, child) {
  if (!parent.children.remove(child)) {
    return;
  }
  if (parent.children.isEmpty && isChild(parent)) {
    for (let i = 0, n = parent.parents.length; i < n; i++) {
      detach(parent.parents[i], parent);
    }
  }
}
__name(detach, "detach");
function attach(parent, child) {
  if (!parent.children.add(child)) {
    return;
  }
  if (isChild(parent)) {
    for (let i = 0, n = parent.parents.length; i < n; i++) {
      attach(parent.parents[i], parent);
    }
  }
}
__name(attach, "attach");
function equals(a, b) {
  const shallowEquals = a === b || Object.is(a, b) || Boolean(a && b && typeof a.equals === "function" && a.equals(b));
  return shallowEquals;
}
__name(equals, "equals");
function singleton(key, init) {
  const symbol = Symbol.for(`com.tldraw.state/${key}`);
  const global2 = globalThis;
  global2[symbol] ??= init();
  return global2[symbol];
}
__name(singleton, "singleton");
var EMPTY_ARRAY = singleton("empty_array", () => Object.freeze([]));

// ../../node_modules/@tldraw/state/dist-esm/lib/ArraySet.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ARRAY_SIZE_THRESHOLD = 8;
var ArraySet = class {
  arraySize = 0;
  array = Array(ARRAY_SIZE_THRESHOLD);
  set = null;
  /**
   * Get whether this ArraySet has any elements.
   *
   * @returns True if this ArraySet has any elements, false otherwise.
   */
  // eslint-disable-next-line no-restricted-syntax
  get isEmpty() {
    if (this.array) {
      return this.arraySize === 0;
    }
    if (this.set) {
      return this.set.size === 0;
    }
    throw new Error("no set or array");
  }
  /**
   * Add an element to the ArraySet if it is not already present.
   *
   * @param elem - The element to add to the set
   * @returns `true` if the element was added, `false` if it was already present
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   *
   * console.log(arraySet.add('hello')) // true
   * console.log(arraySet.add('hello')) // false (already exists)
   * ```
   */
  add(elem) {
    if (this.array) {
      const idx = this.array.indexOf(elem);
      if (idx !== -1) {
        return false;
      }
      if (this.arraySize < ARRAY_SIZE_THRESHOLD) {
        this.array[this.arraySize] = elem;
        this.arraySize++;
        return true;
      } else {
        this.set = new Set(this.array);
        this.array = null;
        this.set.add(elem);
        return true;
      }
    }
    if (this.set) {
      if (this.set.has(elem)) {
        return false;
      }
      this.set.add(elem);
      return true;
    }
    throw new Error("no set or array");
  }
  /**
   * Remove an element from the ArraySet if it is present.
   *
   * @param elem - The element to remove from the set
   * @returns `true` if the element was removed, `false` if it was not present
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   * arraySet.add('hello')
   *
   * console.log(arraySet.remove('hello')) // true
   * console.log(arraySet.remove('hello')) // false (not present)
   * ```
   */
  remove(elem) {
    if (this.array) {
      const idx = this.array.indexOf(elem);
      if (idx === -1) {
        return false;
      }
      this.array[idx] = void 0;
      this.arraySize--;
      if (idx !== this.arraySize) {
        this.array[idx] = this.array[this.arraySize];
        this.array[this.arraySize] = void 0;
      }
      return true;
    }
    if (this.set) {
      if (!this.set.has(elem)) {
        return false;
      }
      this.set.delete(elem);
      return true;
    }
    throw new Error("no set or array");
  }
  /**
   * Execute a callback function for each element in the ArraySet.
   *
   * @param visitor - A function to call for each element in the set
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   * arraySet.add('hello')
   * arraySet.add('world')
   *
   * arraySet.visit((item) => {
   *   console.log(item) // 'hello', 'world'
   * })
   * ```
   */
  visit(visitor) {
    if (this.array) {
      for (let i = 0; i < this.arraySize; i++) {
        const elem = this.array[i];
        if (typeof elem !== "undefined") {
          visitor(elem);
        }
      }
      return;
    }
    if (this.set) {
      this.set.forEach(visitor);
      return;
    }
    throw new Error("no set or array");
  }
  /**
   * Make the ArraySet iterable, allowing it to be used in for...of loops and with spread syntax.
   *
   * @returns An iterator that yields each element in the set
   * @example
   * ```ts
   * const arraySet = new ArraySet<number>()
   * arraySet.add(1)
   * arraySet.add(2)
   *
   * for (const item of arraySet) {
   *   console.log(item) // 1, 2
   * }
   *
   * const items = [...arraySet] // [1, 2]
   * ```
   */
  *[Symbol.iterator]() {
    if (this.array) {
      for (let i = 0; i < this.arraySize; i++) {
        const elem = this.array[i];
        if (typeof elem !== "undefined") {
          yield elem;
        }
      }
    } else if (this.set) {
      yield* this.set;
    } else {
      throw new Error("no set or array");
    }
  }
  /**
   * Check whether an element is present in the ArraySet.
   *
   * @param elem - The element to check for
   * @returns `true` if the element is present, `false` otherwise
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   * arraySet.add('hello')
   *
   * console.log(arraySet.has('hello')) // true
   * console.log(arraySet.has('world')) // false
   * ```
   */
  has(elem) {
    if (this.array) {
      return this.array.indexOf(elem) !== -1;
    } else {
      return this.set.has(elem);
    }
  }
  /**
   * Remove all elements from the ArraySet.
   *
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   * arraySet.add('hello')
   * arraySet.add('world')
   *
   * arraySet.clear()
   * console.log(arraySet.size()) // 0
   * ```
   */
  clear() {
    if (this.set) {
      this.set.clear();
    } else {
      this.arraySize = 0;
      this.array = [];
    }
  }
  /**
   * Get the number of elements in the ArraySet.
   *
   * @returns The number of elements in the set
   * @example
   * ```ts
   * const arraySet = new ArraySet<string>()
   * console.log(arraySet.size()) // 0
   *
   * arraySet.add('hello')
   * console.log(arraySet.size()) // 1
   * ```
   */
  size() {
    if (this.set) {
      return this.set.size;
    } else {
      return this.arraySize;
    }
  }
};
__name(ArraySet, "ArraySet");

// ../../node_modules/@tldraw/state/dist-esm/lib/Atom.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/HistoryBuffer.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/types.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RESET_VALUE = Symbol.for("com.tldraw.state/RESET_VALUE");

// ../../node_modules/@tldraw/state/dist-esm/lib/HistoryBuffer.mjs
var HistoryBuffer = class {
  /**
   * Creates a new HistoryBuffer with the specified capacity.
   *
   * capacity - Maximum number of diffs to store in the buffer
   * @example
   * ```ts
   * const buffer = new HistoryBuffer<number>(10) // Store up to 10 diffs
   * ```
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }
  /**
   * Current write position in the circular buffer.
   * @internal
   */
  index = 0;
  /**
   * Circular buffer storing range tuples. Uses undefined to represent empty slots.
   * @internal
   */
  buffer;
  /**
   * Adds a diff entry to the history buffer, representing a change between two epochs.
   *
   * If the diff is undefined, the operation is ignored. If the diff is RESET_VALUE,
   * the entire buffer is cleared to indicate that historical tracking should restart.
   *
   * @param lastComputedEpoch - The epoch when the previous value was computed
   * @param currentEpoch - The epoch when the current value was computed
   * @param diff - The diff representing the change, or RESET_VALUE to clear history
   * @example
   * ```ts
   * const buffer = new HistoryBuffer<string>(5)
   * buffer.pushEntry(0, 1, 'added text')
   * buffer.pushEntry(1, 2, RESET_VALUE) // Clears the buffer
   * ```
   */
  pushEntry(lastComputedEpoch, currentEpoch, diff) {
    if (diff === void 0) {
      return;
    }
    if (diff === RESET_VALUE) {
      this.clear();
      return;
    }
    this.buffer[this.index] = [lastComputedEpoch, currentEpoch, diff];
    this.index = (this.index + 1) % this.capacity;
  }
  /**
   * Clears all entries from the history buffer and resets the write position.
   * This is called when a RESET_VALUE diff is encountered.
   *
   * @example
   * ```ts
   * const buffer = new HistoryBuffer<string>(5)
   * buffer.pushEntry(0, 1, 'change')
   * buffer.clear()
   * console.log(buffer.getChangesSince(0)) // RESET_VALUE
   * ```
   */
  clear() {
    this.index = 0;
    this.buffer.fill(void 0);
  }
  /**
   * Retrieves all diffs that occurred since the specified epoch.
   *
   * The method searches backwards through the circular buffer to find changes
   * that occurred after the given epoch. If insufficient history is available
   * or the requested epoch is too old, returns RESET_VALUE indicating that
   * a complete state rebuild is required.
   *
   * @param sinceEpoch - The epoch from which to retrieve changes
   * @returns Array of diffs since the epoch, or RESET_VALUE if history is insufficient
   * @example
   * ```ts
   * const buffer = new HistoryBuffer<string>(5)
   * buffer.pushEntry(0, 1, 'first')
   * buffer.pushEntry(1, 2, 'second')
   * const changes = buffer.getChangesSince(0) // ['first', 'second']
   * const recentChanges = buffer.getChangesSince(1) // ['second']
   * const tooOld = buffer.getChangesSince(-100) // RESET_VALUE
   * ```
   */
  getChangesSince(sinceEpoch) {
    const { index, capacity, buffer } = this;
    for (let i = 0; i < capacity; i++) {
      const offset = (index - 1 + capacity - i) % capacity;
      const elem = buffer[offset];
      if (!elem) {
        return RESET_VALUE;
      }
      const [fromEpoch, toEpoch] = elem;
      if (i === 0 && sinceEpoch >= toEpoch) {
        return [];
      }
      if (fromEpoch <= sinceEpoch && sinceEpoch < toEpoch) {
        const len = i + 1;
        const result = new Array(len);
        for (let j = 0; j < len; j++) {
          result[j] = buffer[(offset + j) % capacity][2];
        }
        return result;
      }
    }
    return RESET_VALUE;
  }
};
__name(HistoryBuffer, "HistoryBuffer");

// ../../node_modules/@tldraw/state/dist-esm/lib/capture.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/isComputed.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isComputed(value) {
  return !!(value && value.__isComputed === true);
}
__name(isComputed, "isComputed");

// ../../node_modules/@tldraw/state/dist-esm/lib/capture.mjs
var CaptureStackFrame = class {
  constructor(below, child) {
    this.below = below;
    this.child = child;
  }
  offset = 0;
  maybeRemoved;
};
__name(CaptureStackFrame, "CaptureStackFrame");
var inst = singleton("capture", () => ({ stack: null }));
function startCapturingParents(child) {
  inst.stack = new CaptureStackFrame(inst.stack, child);
  if (child.__debug_ancestor_epochs__) {
    const previousAncestorEpochs = child.__debug_ancestor_epochs__;
    child.__debug_ancestor_epochs__ = null;
    for (const p of child.parents) {
      p.__unsafe__getWithoutCapture(true);
    }
    logChangedAncestors(child, previousAncestorEpochs);
  }
  child.parentSet.clear();
}
__name(startCapturingParents, "startCapturingParents");
function stopCapturingParents() {
  const frame = inst.stack;
  inst.stack = frame.below;
  if (frame.offset < frame.child.parents.length) {
    for (let i = frame.offset; i < frame.child.parents.length; i++) {
      const maybeRemovedParent = frame.child.parents[i];
      if (!frame.child.parentSet.has(maybeRemovedParent)) {
        detach(maybeRemovedParent, frame.child);
      }
    }
    frame.child.parents.length = frame.offset;
    frame.child.parentEpochs.length = frame.offset;
  }
  if (frame.maybeRemoved) {
    for (let i = 0; i < frame.maybeRemoved.length; i++) {
      const maybeRemovedParent = frame.maybeRemoved[i];
      if (!frame.child.parentSet.has(maybeRemovedParent)) {
        detach(maybeRemovedParent, frame.child);
      }
    }
  }
  if (frame.child.__debug_ancestor_epochs__) {
    captureAncestorEpochs(frame.child, frame.child.__debug_ancestor_epochs__);
  }
}
__name(stopCapturingParents, "stopCapturingParents");
function maybeCaptureParent(p) {
  if (inst.stack) {
    const wasCapturedAlready = inst.stack.child.parentSet.has(p);
    if (wasCapturedAlready) {
      return;
    }
    inst.stack.child.parentSet.add(p);
    if (inst.stack.child.isActivelyListening) {
      attach(p, inst.stack.child);
    }
    if (inst.stack.offset < inst.stack.child.parents.length) {
      const maybeRemovedParent = inst.stack.child.parents[inst.stack.offset];
      if (maybeRemovedParent !== p) {
        if (!inst.stack.maybeRemoved) {
          inst.stack.maybeRemoved = [maybeRemovedParent];
        } else {
          inst.stack.maybeRemoved.push(maybeRemovedParent);
        }
      }
    }
    inst.stack.child.parents[inst.stack.offset] = p;
    inst.stack.child.parentEpochs[inst.stack.offset] = p.lastChangedEpoch;
    inst.stack.offset++;
  }
}
__name(maybeCaptureParent, "maybeCaptureParent");
function captureAncestorEpochs(child, ancestorEpochs) {
  for (let i = 0; i < child.parents.length; i++) {
    const parent = child.parents[i];
    const epoch = child.parentEpochs[i];
    ancestorEpochs.set(parent, epoch);
    if (isComputed(parent)) {
      captureAncestorEpochs(parent, ancestorEpochs);
    }
  }
  return ancestorEpochs;
}
__name(captureAncestorEpochs, "captureAncestorEpochs");
function collectChangedAncestors(child, ancestorEpochs) {
  const changeTree = {};
  for (let i = 0; i < child.parents.length; i++) {
    const parent = child.parents[i];
    if (!ancestorEpochs.has(parent)) {
      continue;
    }
    const prevEpoch = ancestorEpochs.get(parent);
    const currentEpoch = parent.lastChangedEpoch;
    if (currentEpoch !== prevEpoch) {
      if (isComputed(parent)) {
        changeTree[parent.name] = collectChangedAncestors(parent, ancestorEpochs);
      } else {
        changeTree[parent.name] = null;
      }
    }
  }
  return changeTree;
}
__name(collectChangedAncestors, "collectChangedAncestors");
function logChangedAncestors(child, ancestorEpochs) {
  const changeTree = collectChangedAncestors(child, ancestorEpochs);
  if (Object.keys(changeTree).length === 0) {
    console.log(`Effect(${child.name}) was executed manually.`);
    return;
  }
  let str = isComputed(child) ? `Computed(${child.name}) is recomputing because:` : `Effect(${child.name}) is executing because:`;
  function logParent(tree, indent) {
    const indentStr = "\n" + " ".repeat(indent) + "\u21B3 ";
    for (const [name, val] of Object.entries(tree)) {
      if (val) {
        str += `${indentStr}Computed(${name}) changed`;
        logParent(val, indent + 2);
      } else {
        str += `${indentStr}Atom(${name}) changed`;
      }
    }
  }
  __name(logParent, "logParent");
  logParent(changeTree, 1);
  console.log(str);
}
__name(logChangedAncestors, "logChangedAncestors");

// ../../node_modules/@tldraw/state/dist-esm/lib/transactions.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/constants.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GLOBAL_START_EPOCH = -1;

// ../../node_modules/@tldraw/state/dist-esm/lib/transactions.mjs
var Transaction = class {
  constructor(parent, isSync) {
    this.parent = parent;
    this.isSync = isSync;
  }
  asyncProcessCount = 0;
  initialAtomValues = /* @__PURE__ */ new Map();
  /**
   * Get whether this transaction is a root (no parents).
   *
   * @public
   */
  // eslint-disable-next-line no-restricted-syntax
  get isRoot() {
    return this.parent === null;
  }
  /**
   * Commit the transaction's changes.
   *
   * @public
   */
  commit() {
    if (inst2.globalIsReacting) {
      for (const atom2 of this.initialAtomValues.keys()) {
        traverseAtomForCleanup(atom2);
      }
    } else if (this.isRoot) {
      flushChanges(this.initialAtomValues.keys());
    } else {
      this.initialAtomValues.forEach((value, atom2) => {
        if (!this.parent.initialAtomValues.has(atom2)) {
          this.parent.initialAtomValues.set(atom2, value);
        }
      });
    }
  }
  /**
   * Abort the transaction.
   *
   * @public
   */
  abort() {
    inst2.globalEpoch++;
    this.initialAtomValues.forEach((value, atom2) => {
      atom2.set(value);
      atom2.historyBuffer?.clear();
    });
    this.commit();
  }
};
__name(Transaction, "Transaction");
var inst2 = singleton("transactions", () => ({
  // The current epoch (global to all atoms).
  globalEpoch: GLOBAL_START_EPOCH + 1,
  // Whether any transaction is reacting.
  globalIsReacting: false,
  currentTransaction: null,
  cleanupReactors: null,
  reactionEpoch: GLOBAL_START_EPOCH + 1
}));
function getReactionEpoch() {
  return inst2.reactionEpoch;
}
__name(getReactionEpoch, "getReactionEpoch");
function getGlobalEpoch() {
  return inst2.globalEpoch;
}
__name(getGlobalEpoch, "getGlobalEpoch");
function getIsReacting() {
  return inst2.globalIsReacting;
}
__name(getIsReacting, "getIsReacting");
var traverseReactors;
function traverseChild(child) {
  if (child.lastTraversedEpoch === inst2.globalEpoch) {
    return;
  }
  child.lastTraversedEpoch = inst2.globalEpoch;
  if ("__isEffectScheduler" in child) {
    traverseReactors.add(child);
  } else {
    ;
    child.children.visit(traverseChild);
  }
}
__name(traverseChild, "traverseChild");
function traverse(reactors, child) {
  traverseReactors = reactors;
  traverseChild(child);
}
__name(traverse, "traverse");
function flushChanges(atoms) {
  if (inst2.globalIsReacting) {
    throw new Error("flushChanges cannot be called during a reaction");
  }
  const outerTxn = inst2.currentTransaction;
  try {
    inst2.currentTransaction = null;
    inst2.globalIsReacting = true;
    inst2.reactionEpoch = inst2.globalEpoch;
    const reactors = /* @__PURE__ */ new Set();
    for (const atom2 of atoms) {
      atom2.children.visit((child) => traverse(reactors, child));
    }
    for (const r of reactors) {
      r.maybeScheduleEffect();
    }
    let updateDepth = 0;
    while (inst2.cleanupReactors?.size) {
      if (updateDepth++ > 1e3) {
        throw new Error("Reaction update depth limit exceeded");
      }
      const reactors2 = inst2.cleanupReactors;
      inst2.cleanupReactors = null;
      for (const r of reactors2) {
        r.maybeScheduleEffect();
      }
    }
  } finally {
    inst2.cleanupReactors = null;
    inst2.globalIsReacting = false;
    inst2.currentTransaction = outerTxn;
    traverseReactors = void 0;
  }
}
__name(flushChanges, "flushChanges");
function atomDidChange(atom2, previousValue) {
  if (inst2.currentTransaction) {
    if (!inst2.currentTransaction.initialAtomValues.has(atom2)) {
      inst2.currentTransaction.initialAtomValues.set(atom2, previousValue);
    }
  } else if (inst2.globalIsReacting) {
    traverseAtomForCleanup(atom2);
  } else {
    flushChanges([atom2]);
  }
}
__name(atomDidChange, "atomDidChange");
function traverseAtomForCleanup(atom2) {
  const rs = inst2.cleanupReactors ??= /* @__PURE__ */ new Set();
  atom2.children.visit((child) => traverse(rs, child));
}
__name(traverseAtomForCleanup, "traverseAtomForCleanup");
function advanceGlobalEpoch() {
  inst2.globalEpoch++;
}
__name(advanceGlobalEpoch, "advanceGlobalEpoch");
function transaction(fn) {
  const txn = new Transaction(inst2.currentTransaction, true);
  inst2.currentTransaction = txn;
  try {
    let result = void 0;
    let rollback = false;
    try {
      result = fn(() => rollback = true);
    } catch (e) {
      txn.abort();
      throw e;
    }
    if (inst2.currentTransaction !== txn) {
      throw new Error("Transaction boundaries overlap");
    }
    if (rollback) {
      txn.abort();
    } else {
      txn.commit();
    }
    return result;
  } finally {
    inst2.currentTransaction = txn.parent;
  }
}
__name(transaction, "transaction");
function transact(fn) {
  if (inst2.currentTransaction) {
    return fn();
  }
  return transaction(fn);
}
__name(transact, "transact");

// ../../node_modules/@tldraw/state/dist-esm/lib/Atom.mjs
var __Atom__ = class {
  constructor(name, current, options) {
    this.name = name;
    this.current = current;
    this.isEqual = options?.isEqual ?? null;
    if (!options)
      return;
    if (options.historyLength) {
      this.historyBuffer = new HistoryBuffer(options.historyLength);
    }
    this.computeDiff = options.computeDiff;
  }
  /**
   * Custom equality function for comparing values, or null to use default equality.
   * @internal
   */
  isEqual;
  /**
   * Optional function to compute diffs between old and new values.
   * @internal
   */
  computeDiff;
  /**
   * The global epoch when this atom was last changed.
   * @internal
   */
  lastChangedEpoch = getGlobalEpoch();
  /**
   * Set of child signals that depend on this atom.
   * @internal
   */
  children = new ArraySet();
  /**
   * Optional history buffer for tracking changes over time.
   * @internal
   */
  historyBuffer;
  /**
   * Gets the current value without capturing it as a dependency in the current reactive context.
   * This is unsafe because it breaks the reactivity chain - use with caution.
   *
   * @param _ignoreErrors - Unused parameter for API compatibility
   * @returns The current value
   * @internal
   */
  __unsafe__getWithoutCapture(_ignoreErrors2) {
    return this.current;
  }
  /**
   * Gets the current value of this atom. When called within a computed signal or reaction,
   * this atom will be automatically captured as a dependency.
   *
   * @returns The current value
   * @example
   * ```ts
   * const count = atom('count', 5)
   * console.log(count.get()) // 5
   * ```
   */
  get() {
    maybeCaptureParent(this);
    return this.current;
  }
  /**
   * Sets the value of this atom to the given value. If the value is the same as the current value, this is a no-op.
   *
   * @param value - The new value to set
   * @param diff - The diff to use for the update. If not provided, the diff will be computed using {@link AtomOptions.computeDiff}
   * @returns The new value
   * @example
   * ```ts
   * const count = atom('count', 0)
   * count.set(5) // count.get() is now 5
   * ```
   */
  set(value, diff) {
    if (this.isEqual?.(this.current, value) ?? equals(this.current, value)) {
      return this.current;
    }
    advanceGlobalEpoch();
    if (this.historyBuffer) {
      this.historyBuffer.pushEntry(
        this.lastChangedEpoch,
        getGlobalEpoch(),
        diff ?? this.computeDiff?.(this.current, value, this.lastChangedEpoch, getGlobalEpoch()) ?? RESET_VALUE
      );
    }
    this.lastChangedEpoch = getGlobalEpoch();
    const oldValue = this.current;
    this.current = value;
    atomDidChange(this, oldValue);
    return value;
  }
  /**
   * Updates the value of this atom using the given updater function. If the returned value is the same as the current value, this is a no-op.
   *
   * @param updater - A function that takes the current value and returns the new value
   * @returns The new value
   * @example
   * ```ts
   * const count = atom('count', 5)
   * count.update(n => n + 1) // count.get() is now 6
   * ```
   */
  update(updater) {
    return this.set(updater(this.current));
  }
  /**
   * Gets all the diffs that have occurred since the given epoch. When called within a computed
   * signal or reaction, this atom will be automatically captured as a dependency.
   *
   * @param epoch - The epoch to get changes since
   * @returns An array of diffs, or RESET_VALUE if history is insufficient
   * @internal
   */
  getDiffSince(epoch) {
    maybeCaptureParent(this);
    if (epoch >= this.lastChangedEpoch) {
      return EMPTY_ARRAY;
    }
    return this.historyBuffer?.getChangesSince(epoch) ?? RESET_VALUE;
  }
};
__name(__Atom__, "__Atom__");
var _Atom = singleton("Atom", () => __Atom__);
function atom(name, initialValue, options) {
  return new _Atom(name, initialValue, options);
}
__name(atom, "atom");

// ../../node_modules/@tldraw/state/dist-esm/lib/Computed.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/warnings.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/Computed.mjs
var UNINITIALIZED = Symbol.for("com.tldraw.state/UNINITIALIZED");
var WithDiff = singleton(
  "WithDiff",
  () => /* @__PURE__ */ __name(class WithDiff {
    constructor(value, diff) {
      this.value = value;
      this.diff = diff;
    }
  }, "WithDiff")
);
var __UNSAFE__Computed = class {
  constructor(name, derive, options) {
    this.name = name;
    this.derive = derive;
    if (options?.historyLength) {
      this.historyBuffer = new HistoryBuffer(options.historyLength);
    }
    this.computeDiff = options?.computeDiff;
    this.isEqual = options?.isEqual ?? equals;
  }
  __isComputed = true;
  lastChangedEpoch = GLOBAL_START_EPOCH;
  lastTraversedEpoch = GLOBAL_START_EPOCH;
  __debug_ancestor_epochs__ = null;
  /**
   * The epoch when the reactor was last checked.
   */
  lastCheckedEpoch = GLOBAL_START_EPOCH;
  parentSet = new ArraySet();
  parents = [];
  parentEpochs = [];
  children = new ArraySet();
  // eslint-disable-next-line no-restricted-syntax
  get isActivelyListening() {
    return !this.children.isEmpty;
  }
  historyBuffer;
  // The last-computed value of this signal.
  state = UNINITIALIZED;
  // If the signal throws an error we stash it so we can rethrow it on the next get()
  error = null;
  computeDiff;
  isEqual;
  __unsafe__getWithoutCapture(ignoreErrors) {
    const isNew = this.lastChangedEpoch === GLOBAL_START_EPOCH;
    const globalEpoch = getGlobalEpoch();
    if (!isNew && (this.lastCheckedEpoch === globalEpoch || this.isActivelyListening && getIsReacting() && this.lastTraversedEpoch < getReactionEpoch() || !haveParentsChanged(this))) {
      this.lastCheckedEpoch = globalEpoch;
      if (this.error) {
        if (!ignoreErrors) {
          throw this.error.thrownValue;
        } else {
          return this.state;
        }
      } else {
        return this.state;
      }
    }
    try {
      startCapturingParents(this);
      const result = this.derive(this.state, this.lastCheckedEpoch);
      const newState = result instanceof WithDiff ? result.value : result;
      const isUninitialized2 = this.state === UNINITIALIZED;
      if (isUninitialized2 || !this.isEqual(newState, this.state)) {
        if (this.historyBuffer && !isUninitialized2) {
          const diff = result instanceof WithDiff ? result.diff : void 0;
          this.historyBuffer.pushEntry(
            this.lastChangedEpoch,
            getGlobalEpoch(),
            diff ?? this.computeDiff?.(this.state, newState, this.lastCheckedEpoch, getGlobalEpoch()) ?? RESET_VALUE
          );
        }
        this.lastChangedEpoch = getGlobalEpoch();
        this.state = newState;
      }
      this.error = null;
      this.lastCheckedEpoch = getGlobalEpoch();
      return this.state;
    } catch (e) {
      if (this.state !== UNINITIALIZED) {
        this.state = UNINITIALIZED;
        this.lastChangedEpoch = getGlobalEpoch();
      }
      this.lastCheckedEpoch = getGlobalEpoch();
      if (this.historyBuffer) {
        this.historyBuffer.clear();
      }
      this.error = { thrownValue: e };
      if (!ignoreErrors)
        throw e;
      return this.state;
    } finally {
      stopCapturingParents();
    }
  }
  get() {
    try {
      return this.__unsafe__getWithoutCapture();
    } finally {
      maybeCaptureParent(this);
    }
  }
  getDiffSince(epoch) {
    this.__unsafe__getWithoutCapture(true);
    maybeCaptureParent(this);
    if (epoch >= this.lastChangedEpoch) {
      return EMPTY_ARRAY;
    }
    return this.historyBuffer?.getChangesSince(epoch) ?? RESET_VALUE;
  }
};
__name(__UNSAFE__Computed, "__UNSAFE__Computed");
var _Computed = singleton("Computed", () => __UNSAFE__Computed);

// ../../node_modules/@tldraw/state/dist-esm/lib/EffectScheduler.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __EffectScheduler__ = class {
  constructor(name, runEffect, options) {
    this.name = name;
    this.runEffect = runEffect;
    this._scheduleEffect = options?.scheduleEffect;
  }
  __isEffectScheduler = true;
  /** @internal */
  _isActivelyListening = false;
  /**
   * Whether this scheduler is attached and actively listening to its parents.
   * @public
   */
  // eslint-disable-next-line no-restricted-syntax
  get isActivelyListening() {
    return this._isActivelyListening;
  }
  /** @internal */
  lastTraversedEpoch = GLOBAL_START_EPOCH;
  /** @internal */
  lastReactedEpoch = GLOBAL_START_EPOCH;
  /** @internal */
  _scheduleCount = 0;
  /** @internal */
  __debug_ancestor_epochs__ = null;
  /**
   * The number of times this effect has been scheduled.
   * @public
   */
  // eslint-disable-next-line no-restricted-syntax
  get scheduleCount() {
    return this._scheduleCount;
  }
  /** @internal */
  parentSet = new ArraySet();
  /** @internal */
  parentEpochs = [];
  /** @internal */
  parents = [];
  /** @internal */
  _scheduleEffect;
  /** @internal */
  maybeScheduleEffect() {
    if (!this._isActivelyListening)
      return;
    if (this.lastReactedEpoch === getGlobalEpoch())
      return;
    if (this.parents.length && !haveParentsChanged(this)) {
      this.lastReactedEpoch = getGlobalEpoch();
      return;
    }
    this.scheduleEffect();
  }
  /** @internal */
  scheduleEffect() {
    this._scheduleCount++;
    if (this._scheduleEffect) {
      this._scheduleEffect(this.maybeExecute);
    } else {
      this.execute();
    }
  }
  /** @internal */
  // eslint-disable-next-line local/prefer-class-methods
  maybeExecute = () => {
    if (!this._isActivelyListening)
      return;
    this.execute();
  };
  /**
   * Makes this scheduler become 'actively listening' to its parents.
   * If it has been executed before it will immediately become eligible to receive 'maybeScheduleEffect' calls.
   * If it has not executed before it will need to be manually executed once to become eligible for scheduling, i.e. by calling `EffectScheduler.execute`.
   * @public
   */
  attach() {
    this._isActivelyListening = true;
    for (let i = 0, n = this.parents.length; i < n; i++) {
      attach(this.parents[i], this);
    }
  }
  /**
   * Makes this scheduler stop 'actively listening' to its parents.
   * It will no longer be eligible to receive 'maybeScheduleEffect' calls until `EffectScheduler.attach` is called again.
   * @public
   */
  detach() {
    this._isActivelyListening = false;
    for (let i = 0, n = this.parents.length; i < n; i++) {
      detach(this.parents[i], this);
    }
  }
  /**
   * Executes the effect immediately and returns the result.
   * @returns The result of the effect.
   * @public
   */
  execute() {
    try {
      startCapturingParents(this);
      const currentEpoch = getGlobalEpoch();
      const result = this.runEffect(this.lastReactedEpoch);
      this.lastReactedEpoch = currentEpoch;
      return result;
    } finally {
      stopCapturingParents();
    }
  }
};
__name(__EffectScheduler__, "__EffectScheduler__");
var EffectScheduler = singleton(
  "EffectScheduler",
  () => __EffectScheduler__
);

// ../../node_modules/@tldraw/state/dist-esm/lib/isSignal.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/lib/localStorageAtom.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/state/dist-esm/index.mjs
var currentApiVersion = 1;
var actualApiVersion = singleton("apiVersion", () => currentApiVersion);
if (actualApiVersion !== currentApiVersion) {
  throw new Error(
    `You have multiple incompatible versions of @tldraw/state in your app. Please deduplicate the package.`
  );
}
registerTldrawLibraryVersion(
  "@tldraw/state",
  "4.5.12",
  "esm"
);

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSyncClient.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/AtomMap.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/ImmutableMap.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function smi(i32) {
  return i32 >>> 1 & 1073741824 | i32 & 3221225471;
}
__name(smi, "smi");
var defaultValueOf = Object.prototype.valueOf;
function hash(o) {
  if (o == null) {
    return hashNullish(o);
  }
  if (typeof o.hashCode === "function") {
    return smi(o.hashCode(o));
  }
  const v = valueOf(o);
  if (v == null) {
    return hashNullish(v);
  }
  switch (typeof v) {
    case "boolean":
      return v ? 1108378657 : 1108378656;
    case "number":
      return hashNumber(v);
    case "string":
      return cachedHashString(v);
    case "object":
    case "function":
      return hashJSObj(v);
    case "symbol":
      return hashSymbol(v);
    default:
      if (typeof v.toString === "function") {
        return hashString(v.toString());
      }
      throw new Error("Value type " + typeof v + " cannot be hashed.");
  }
}
__name(hash, "hash");
function hashNullish(nullish) {
  return nullish === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
__name(hashNullish, "hashNullish");
function hashNumber(n) {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let hash2 = n | 0;
  if (hash2 !== n) {
    hash2 ^= n * 4294967295;
  }
  while (n > 4294967295) {
    n /= 4294967295;
    hash2 ^= n;
  }
  return smi(hash2);
}
__name(hashNumber, "hashNumber");
function cachedHashString(string2) {
  let hashed = stringHashCache[string2];
  if (hashed === void 0) {
    hashed = hashString(string2);
    if (stringHashCacheCount === STRING_HASH_CACHE_SIZE) {
      stringHashCacheCount = 0;
      stringHashCache = {};
    }
    stringHashCache[string2] = hashed;
    stringHashCacheCount++;
  }
  return hashed;
}
__name(cachedHashString, "cachedHashString");
function hashString(string2) {
  let hashed = 0;
  for (let ii = 0; ii < string2.length; ii++) {
    hashed = 31 * hashed + string2.charCodeAt(ii) | 0;
  }
  return smi(hashed);
}
__name(hashString, "hashString");
function hashSymbol(sym) {
  let hashed = symbolMap[sym];
  if (hashed !== void 0) {
    return hashed;
  }
  hashed = nextHash();
  symbolMap[sym] = hashed;
  return hashed;
}
__name(hashSymbol, "hashSymbol");
function hashJSObj(obj) {
  let hashed = weakMap.get(obj);
  if (hashed !== void 0) {
    return hashed;
  }
  hashed = nextHash();
  weakMap.set(obj, hashed);
  return hashed;
}
__name(hashJSObj, "hashJSObj");
function valueOf(obj) {
  return obj.valueOf !== defaultValueOf && typeof obj.valueOf === "function" ? obj.valueOf(obj) : obj;
}
__name(valueOf, "valueOf");
function nextHash() {
  const nextHash2 = ++_objHashUID;
  if (_objHashUID & 1073741824) {
    _objHashUID = 0;
  }
  return nextHash2;
}
__name(nextHash, "nextHash");
var weakMap = /* @__PURE__ */ new WeakMap();
var symbolMap = /* @__PURE__ */ Object.create(null);
var _objHashUID = 0;
var stringHashCache = {};
var stringHashCacheCount = 0;
var STRING_HASH_CACHE_SIZE = 24e3;
var SHIFT = 5;
var SIZE = 1 << SHIFT;
var MASK = SIZE - 1;
var NOT_SET = {};
function MakeRef() {
  return { value: false };
}
__name(MakeRef, "MakeRef");
function SetRef(ref) {
  if (ref) {
    ref.value = true;
  }
}
__name(SetRef, "SetRef");
function arrCopy(arr, offset = 0) {
  return arr.slice(offset);
}
__name(arrCopy, "arrCopy");
var OwnerID = class {
};
__name(OwnerID, "OwnerID");
var ImmutableMap = class {
  // @pragma Construction
  // @ts-ignore
  _root;
  // @ts-ignore
  size;
  // @ts-ignore
  __ownerID;
  // @ts-ignore
  __hash;
  // @ts-ignore
  __altered;
  /**
   * Creates a new ImmutableMap instance.
   *
   * @param value - An iterable of key-value pairs to populate the map, or null/undefined for an empty map
   * @example
   * ```ts
   * // Create from array of pairs
   * const map1 = new ImmutableMap([['a', 1], ['b', 2]])
   *
   * // Create empty map
   * const map2 = new ImmutableMap()
   *
   * // Create from another map
   * const map3 = new ImmutableMap(map1)
   * ```
   */
  constructor(value) {
    return value === void 0 || value === null ? emptyMap() : value instanceof ImmutableMap ? value : emptyMap().withMutations((map) => {
      for (const [k, v] of value) {
        map.set(k, v);
      }
    });
  }
  /**
   * Gets the value associated with the specified key, with a fallback value.
   *
   * @param k - The key to look up
   * @param notSetValue - The value to return if the key is not found
   * @returns The value associated with the key, or the fallback value if not found
   * @example
   * ```ts
   * const map = new ImmutableMap([['key1', 'value1']])
   * console.log(map.get('key1', 'default')) // 'value1'
   * console.log(map.get('missing', 'default')) // 'default'
   * ```
   */
  get(k, notSetValue) {
    return this._root ? this._root.get(0, void 0, k, notSetValue) : notSetValue;
  }
  /**
   * Returns a new ImmutableMap with the specified key-value pair added or updated.
   * If the key already exists, its value is replaced. Otherwise, a new entry is created.
   *
   * @param k - The key to set
   * @param v - The value to associate with the key
   * @returns A new ImmutableMap with the key-value pair set
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1]])
   * const updated = map.set('b', 2) // New map with both 'a' and 'b'
   * const replaced = map.set('a', 10) // New map with 'a' updated to 10
   * ```
   */
  set(k, v) {
    return updateMap(this, k, v);
  }
  /**
   * Returns a new ImmutableMap with the specified key removed.
   * If the key doesn't exist, returns the same map instance.
   *
   * @param k - The key to remove
   * @returns A new ImmutableMap with the key removed, or the same instance if key not found
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2]])
   * const smaller = map.delete('a') // New map with only 'b'
   * const same = map.delete('missing') // Returns original map
   * ```
   */
  delete(k) {
    return updateMap(this, k, NOT_SET);
  }
  /**
   * Returns a new ImmutableMap with all specified keys removed.
   * This is more efficient than calling delete() multiple times.
   *
   * @param keys - An iterable of keys to remove
   * @returns A new ImmutableMap with all specified keys removed
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2], ['c', 3]])
   * const smaller = map.deleteAll(['a', 'c']) // New map with only 'b'
   * ```
   */
  deleteAll(keys) {
    return this.withMutations((map) => {
      for (const key of keys) {
        map.delete(key);
      }
    });
  }
  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyMap();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeMap(this.size, this._root, ownerID, this.__hash);
  }
  /**
   * Applies multiple mutations efficiently by creating a mutable copy,
   * applying all changes, then returning an immutable result.
   * This is more efficient than chaining multiple set/delete operations.
   *
   * @param fn - Function that receives a mutable copy and applies changes
   * @returns A new ImmutableMap with all mutations applied, or the same instance if no changes
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1]])
   * const updated = map.withMutations(mutable => {
   *   mutable.set('b', 2)
   *   mutable.set('c', 3)
   *   mutable.delete('a')
   * }) // Efficiently applies all changes at once
   * ```
   */
  withMutations(fn) {
    const mutable = this.asMutable();
    fn(mutable);
    return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
  }
  /**
   * Checks if this map instance has been altered during a mutation operation.
   * This is used internally to optimize mutations.
   *
   * @returns True if the map was altered, false otherwise
   * @internal
   */
  wasAltered() {
    return this.__altered;
  }
  /**
   * Returns a mutable copy of this map that can be efficiently modified.
   * Multiple changes to the mutable copy are batched together.
   *
   * @returns A mutable copy of this map
   * @internal
   */
  asMutable() {
    return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
  }
  /**
   * Makes the map iterable, yielding key-value pairs.
   *
   * @returns An iterator over [key, value] pairs
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2]])
   * for (const [key, value] of map) {
   *   console.log(key, value) // 'a' 1, then 'b' 2
   * }
   * ```
   */
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
  /**
   * Returns an iterable of key-value pairs.
   *
   * @returns An iterable over [key, value] pairs
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2]])
   * const entries = Array.from(map.entries()) // [['a', 1], ['b', 2]]
   * ```
   */
  entries() {
    return new MapIterator(this, ITERATE_ENTRIES, false);
  }
  /**
   * Returns an iterable of keys.
   *
   * @returns An iterable over keys
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2]])
   * const keys = Array.from(map.keys()) // ['a', 'b']
   * ```
   */
  keys() {
    return new MapIterator(this, ITERATE_KEYS, false);
  }
  /**
   * Returns an iterable of values.
   *
   * @returns An iterable over values
   * @example
   * ```ts
   * const map = new ImmutableMap([['a', 1], ['b', 2]])
   * const values = Array.from(map.values()) // [1, 2]
   * ```
   */
  values() {
    return new MapIterator(this, ITERATE_VALUES, false);
  }
};
__name(ImmutableMap, "ImmutableMap");
var ArrayMapNode = class {
  constructor(ownerID, entries) {
    this.ownerID = ownerID;
    this.entries = entries;
  }
  get(_shift, _keyHash, key, notSetValue) {
    const entries = this.entries;
    for (let ii = 0, len = entries.length; ii < len; ii++) {
      if (Object.is(key, entries[ii][0])) {
        return entries[ii][1];
      }
    }
    return notSetValue;
  }
  update(ownerID, _shift, _keyHash, key, value, didChangeSize, didAlter) {
    const removed = value === NOT_SET;
    const entries = this.entries;
    let idx = 0;
    const len = entries.length;
    for (; idx < len; idx++) {
      if (Object.is(key, entries[idx][0])) {
        break;
      }
    }
    const exists = idx < len;
    if (exists ? entries[idx][1] === value : removed) {
      return this;
    }
    SetRef(didAlter);
    if (removed || !exists)
      SetRef(didChangeSize);
    if (removed && entries.length === 1) {
      return;
    }
    if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
      return createNodes(ownerID, entries, key, value);
    }
    const isEditable = ownerID && ownerID === this.ownerID;
    const newEntries = isEditable ? entries : arrCopy(entries);
    if (exists) {
      if (removed) {
        if (idx === len - 1) {
          newEntries.pop();
        } else {
          newEntries[idx] = newEntries.pop();
        }
      } else {
        newEntries[idx] = [key, value];
      }
    } else {
      newEntries.push([key, value]);
    }
    if (isEditable) {
      this.entries = newEntries;
      return this;
    }
    return new ArrayMapNode(ownerID, newEntries);
  }
};
__name(ArrayMapNode, "ArrayMapNode");
var BitmapIndexedNode = class {
  constructor(ownerID, bitmap, nodes) {
    this.ownerID = ownerID;
    this.bitmap = bitmap;
    this.nodes = nodes;
  }
  get(shift, keyHash, key, notSetValue) {
    if (keyHash === void 0) {
      keyHash = hash(key);
    }
    const bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
    const bitmap = this.bitmap;
    return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);
  }
  update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === void 0) {
      keyHash = hash(key);
    }
    const keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    const bit = 1 << keyHashFrag;
    const bitmap = this.bitmap;
    const exists = (bitmap & bit) !== 0;
    if (!exists && value === NOT_SET) {
      return this;
    }
    const idx = popCount(bitmap & bit - 1);
    const nodes = this.nodes;
    const node = exists ? nodes[idx] : void 0;
    const newNode = updateNode(
      node,
      ownerID,
      shift + SHIFT,
      keyHash,
      key,
      value,
      didChangeSize,
      didAlter
    );
    if (newNode === node) {
      return this;
    }
    if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
      return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
    }
    if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
      return nodes[idx ^ 1];
    }
    if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
      return newNode;
    }
    const isEditable = ownerID && ownerID === this.ownerID;
    const newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
    const newNodes = exists ? newNode ? setAt(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);
    if (isEditable) {
      this.bitmap = newBitmap;
      this.nodes = newNodes;
      return this;
    }
    return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
  }
};
__name(BitmapIndexedNode, "BitmapIndexedNode");
var HashArrayMapNode = class {
  constructor(ownerID, count3, nodes) {
    this.ownerID = ownerID;
    this.count = count3;
    this.nodes = nodes;
  }
  get(shift, keyHash, key, notSetValue) {
    if (keyHash === void 0) {
      keyHash = hash(key);
    }
    const idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    const node = this.nodes[idx];
    return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
  }
  update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === void 0) {
      keyHash = hash(key);
    }
    const idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    const removed = value === NOT_SET;
    const nodes = this.nodes;
    const node = nodes[idx];
    if (removed && !node) {
      return this;
    }
    const newNode = updateNode(
      node,
      ownerID,
      shift + SHIFT,
      keyHash,
      key,
      value,
      didChangeSize,
      didAlter
    );
    if (newNode === node) {
      return this;
    }
    let newCount = this.count;
    if (!node) {
      newCount++;
    } else if (!newNode) {
      newCount--;
      if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
        return packNodes(ownerID, nodes, newCount, idx);
      }
    }
    const isEditable = ownerID && ownerID === this.ownerID;
    const newNodes = setAt(nodes, idx, newNode, isEditable);
    if (isEditable) {
      this.count = newCount;
      this.nodes = newNodes;
      return this;
    }
    return new HashArrayMapNode(ownerID, newCount, newNodes);
  }
};
__name(HashArrayMapNode, "HashArrayMapNode");
var HashCollisionNode = class {
  constructor(ownerID, keyHash, entries) {
    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entries = entries;
  }
  get(shift, keyHash, key, notSetValue) {
    const entries = this.entries;
    for (let ii = 0, len = entries.length; ii < len; ii++) {
      if (Object.is(key, entries[ii][0])) {
        return entries[ii][1];
      }
    }
    return notSetValue;
  }
  update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === void 0) {
      keyHash = hash(key);
    }
    const removed = value === NOT_SET;
    if (keyHash !== this.keyHash) {
      if (removed) {
        return this;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
    }
    const entries = this.entries;
    let idx = 0;
    const len = entries.length;
    for (; idx < len; idx++) {
      if (Object.is(key, entries[idx][0])) {
        break;
      }
    }
    const exists = idx < len;
    if (exists ? entries[idx][1] === value : removed) {
      return this;
    }
    SetRef(didAlter);
    if (removed || !exists)
      SetRef(didChangeSize);
    if (removed && len === 2) {
      return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
    }
    const isEditable = ownerID && ownerID === this.ownerID;
    const newEntries = isEditable ? entries : arrCopy(entries);
    if (exists) {
      if (removed) {
        if (idx === len - 1) {
          newEntries.pop();
        } else {
          newEntries[idx] = newEntries.pop();
        }
      } else {
        newEntries[idx] = [key, value];
      }
    } else {
      newEntries.push([key, value]);
    }
    if (isEditable) {
      this.entries = newEntries;
      return this;
    }
    return new HashCollisionNode(ownerID, this.keyHash, newEntries);
  }
};
__name(HashCollisionNode, "HashCollisionNode");
var ValueNode = class {
  constructor(ownerID, keyHash, entry2) {
    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entry = entry2;
  }
  get(shift, keyHash, key, notSetValue) {
    return Object.is(key, this.entry[0]) ? this.entry[1] : notSetValue;
  }
  update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    const removed = value === NOT_SET;
    const keyMatch = Object.is(key, this.entry[0]);
    if (keyMatch ? value === this.entry[1] : removed) {
      return this;
    }
    SetRef(didAlter);
    if (removed) {
      SetRef(didChangeSize);
      return;
    }
    if (keyMatch) {
      if (ownerID && ownerID === this.ownerID) {
        this.entry[1] = value;
        return this;
      }
      return new ValueNode(ownerID, this.keyHash, [key, value]);
    }
    SetRef(didChangeSize);
    return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
  }
};
__name(ValueNode, "ValueNode");
var MapIterator = class {
  constructor(map, _type, _reverse) {
    this._type = _type;
    this._reverse = _reverse;
    this._stack = map._root && mapIteratorFrame(map._root);
  }
  _stack;
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const type = this._type;
    let stack = this._stack;
    while (stack) {
      const node = stack.node;
      const index = stack.index++;
      let maxIndex;
      if (node.entry) {
        if (index === 0) {
          return mapIteratorValue(type, node.entry);
        }
      } else if ("entries" in node && node.entries) {
        maxIndex = node.entries.length - 1;
        if (index <= maxIndex) {
          return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
        }
      } else {
        maxIndex = node.nodes.length - 1;
        if (index <= maxIndex) {
          const subNode = node.nodes[this._reverse ? maxIndex - index : index];
          if (subNode) {
            if (subNode.entry) {
              return mapIteratorValue(type, subNode.entry);
            }
            stack = this._stack = mapIteratorFrame(subNode, stack);
          }
          continue;
        }
      }
      stack = this._stack = this._stack.__prev;
    }
    return iteratorDone();
  }
};
__name(MapIterator, "MapIterator");
function mapIteratorValue(type, entry2) {
  return iteratorValue(type, entry2[0], entry2[1]);
}
__name(mapIteratorValue, "mapIteratorValue");
function mapIteratorFrame(node, prev) {
  return {
    node,
    index: 0,
    __prev: prev
  };
}
__name(mapIteratorFrame, "mapIteratorFrame");
var ITERATE_KEYS = 0;
var ITERATE_VALUES = 1;
var ITERATE_ENTRIES = 2;
function iteratorValue(type, k, v, iteratorResult) {
  const value = type === ITERATE_KEYS ? k : type === ITERATE_VALUES ? v : [k, v];
  if (iteratorResult) {
    iteratorResult.value = value;
  } else {
    iteratorResult = { value, done: false };
  }
  return iteratorResult;
}
__name(iteratorValue, "iteratorValue");
function iteratorDone() {
  return { value: void 0, done: true };
}
__name(iteratorDone, "iteratorDone");
function makeMap(size, root, ownerID, hash2) {
  const map = Object.create(ImmutableMap.prototype);
  map.size = size;
  map._root = root;
  map.__ownerID = ownerID;
  map.__hash = hash2;
  map.__altered = false;
  return map;
}
__name(makeMap, "makeMap");
var EMPTY_MAP;
function emptyMap() {
  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
}
__name(emptyMap, "emptyMap");
function updateMap(map, k, v) {
  let newRoot;
  let newSize;
  if (!map._root) {
    if (v === NOT_SET) {
      return map;
    }
    newSize = 1;
    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
  } else {
    const didChangeSize = MakeRef();
    const didAlter = MakeRef();
    newRoot = updateNode(map._root, map.__ownerID, 0, void 0, k, v, didChangeSize, didAlter);
    if (!didAlter.value) {
      return map;
    }
    newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
  }
  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__hash = void 0;
    map.__altered = true;
    return map;
  }
  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
}
__name(updateMap, "updateMap");
function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (!node) {
    if (value === NOT_SET) {
      return node;
    }
    SetRef(didAlter);
    SetRef(didChangeSize);
    return new ValueNode(ownerID, keyHash, [key, value]);
  }
  return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
}
__name(updateNode, "updateNode");
function isLeafNode(node) {
  return node.constructor === ValueNode || node.constructor === HashCollisionNode;
}
__name(isLeafNode, "isLeafNode");
function mergeIntoNode(node, ownerID, shift, keyHash, entry2) {
  if (node.keyHash === keyHash) {
    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry2]);
  }
  const idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
  const idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  let newNode;
  const nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry2)] : (newNode = new ValueNode(ownerID, keyHash, entry2), idx1 < idx2 ? [node, newNode] : [newNode, node]);
  return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
}
__name(mergeIntoNode, "mergeIntoNode");
function createNodes(ownerID, entries, key, value) {
  if (!ownerID) {
    ownerID = new OwnerID();
  }
  let node = new ValueNode(ownerID, hash(key), [key, value]);
  for (let ii = 0; ii < entries.length; ii++) {
    const entry2 = entries[ii];
    node = node.update(ownerID, 0, void 0, entry2[0], entry2[1]);
  }
  return node;
}
__name(createNodes, "createNodes");
function packNodes(ownerID, nodes, count3, excluding) {
  let bitmap = 0;
  let packedII = 0;
  const packedNodes = new Array(count3);
  for (let ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
    const node = nodes[ii];
    if (node !== void 0 && ii !== excluding) {
      bitmap |= bit;
      packedNodes[packedII++] = node;
    }
  }
  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
}
__name(packNodes, "packNodes");
function expandNodes(ownerID, nodes, bitmap, including, node) {
  let count3 = 0;
  const expandedNodes = new Array(SIZE);
  for (let ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
    expandedNodes[ii] = bitmap & 1 ? nodes[count3++] : void 0;
  }
  expandedNodes[including] = node;
  return new HashArrayMapNode(ownerID, count3 + 1, expandedNodes);
}
__name(expandNodes, "expandNodes");
function popCount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
__name(popCount, "popCount");
function setAt(array2, idx, val, canEdit) {
  const newArray = canEdit ? array2 : arrCopy(array2);
  newArray[idx] = val;
  return newArray;
}
__name(setAt, "setAt");
function spliceIn(array2, idx, val, canEdit) {
  const newLen = array2.length + 1;
  if (canEdit && idx + 1 === newLen) {
    array2[idx] = val;
    return array2;
  }
  const newArray = new Array(newLen);
  let after = 0;
  for (let ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      newArray[ii] = val;
      after = -1;
    } else {
      newArray[ii] = array2[ii + after];
    }
  }
  return newArray;
}
__name(spliceIn, "spliceIn");
function spliceOut(array2, idx, canEdit) {
  const newLen = array2.length - 1;
  if (canEdit && idx === newLen) {
    array2.pop();
    return array2;
  }
  const newArray = new Array(newLen);
  let after = 0;
  for (let ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      after = 1;
    }
    newArray[ii] = array2[ii + after];
  }
  return newArray;
}
__name(spliceOut, "spliceOut");
var MAX_ARRAY_MAP_SIZE = SIZE / 4;
var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

// ../../node_modules/@tldraw/store/dist-esm/lib/AtomMap.mjs
var AtomMap = class {
  /**
   * Creates a new AtomMap instance.
   *
   * name - A unique name for this map, used for atom identification
   * entries - Optional initial entries to populate the map with
   * @example
   * ```ts
   * // Create an empty map
   * const map = new AtomMap('userMap')
   *
   * // Create a map with initial data
   * const initialData: [string, number][] = [['a', 1], ['b', 2]]
   * const mapWithData = new AtomMap('numbersMap', initialData)
   * ```
   */
  constructor(name, entries) {
    this.name = name;
    let atoms = emptyMap();
    if (entries) {
      atoms = atoms.withMutations((atoms2) => {
        for (const [k, v] of entries) {
          atoms2.set(k, atom(`${name}:${String(k)}`, v));
        }
      });
    }
    this.atoms = atom(`${name}:atoms`, atoms);
  }
  atoms;
  /**
   * Retrieves the underlying atom for a given key.
   *
   * @param key - The key to retrieve the atom for
   * @returns The atom containing the value, or undefined if the key doesn't exist
   * @internal
   */
  getAtom(key) {
    const valueAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (!valueAtom) {
      this.atoms.get();
      return void 0;
    }
    return valueAtom;
  }
  /**
   * Gets the value associated with a key. Returns undefined if the key doesn't exist.
   * This method is reactive and will cause reactive contexts to update when the value changes.
   *
   * @param key - The key to retrieve the value for
   * @returns The value associated with the key, or undefined if not found
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('name', 'Alice')
   * console.log(map.get('name')) // 'Alice'
   * console.log(map.get('missing')) // undefined
   * ```
   */
  get(key) {
    const value = this.getAtom(key)?.get();
    assert3(value !== UNINITIALIZED);
    return value;
  }
  /**
   * Gets the value associated with a key without creating reactive dependencies.
   * This method will not cause reactive contexts to update when the value changes.
   *
   * @param key - The key to retrieve the value for
   * @returns The value associated with the key, or undefined if not found
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('count', 42)
   * const value = map.__unsafe__getWithoutCapture('count') // No reactive subscription
   * ```
   */
  __unsafe__getWithoutCapture(key) {
    const valueAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (!valueAtom)
      return void 0;
    const value = valueAtom.__unsafe__getWithoutCapture();
    assert3(value !== UNINITIALIZED);
    return value;
  }
  /**
   * Checks whether a key exists in the map.
   * This method is reactive and will cause reactive contexts to update when keys are added or removed.
   *
   * @param key - The key to check for
   * @returns True if the key exists in the map, false otherwise
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * console.log(map.has('name')) // false
   * map.set('name', 'Alice')
   * console.log(map.has('name')) // true
   * ```
   */
  has(key) {
    const valueAtom = this.getAtom(key);
    if (!valueAtom) {
      return false;
    }
    return valueAtom.get() !== UNINITIALIZED;
  }
  /**
   * Checks whether a key exists in the map without creating reactive dependencies.
   * This method will not cause reactive contexts to update when keys are added or removed.
   *
   * @param key - The key to check for
   * @returns True if the key exists in the map, false otherwise
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('active', true)
   * const exists = map.__unsafe__hasWithoutCapture('active') // No reactive subscription
   * ```
   */
  __unsafe__hasWithoutCapture(key) {
    const valueAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (!valueAtom)
      return false;
    assert3(valueAtom.__unsafe__getWithoutCapture() !== UNINITIALIZED);
    return true;
  }
  /**
   * Sets a value for the given key. If the key already exists, its value is updated.
   * If the key doesn't exist, a new entry is created.
   *
   * @param key - The key to set the value for
   * @param value - The value to associate with the key
   * @returns This AtomMap instance for method chaining
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('name', 'Alice').set('age', 30)
   * ```
   */
  set(key, value) {
    const existingAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (existingAtom) {
      existingAtom.set(value);
    } else {
      this.atoms.update((atoms) => {
        return atoms.set(key, atom(`${this.name}:${String(key)}`, value));
      });
    }
    return this;
  }
  /**
   * Updates an existing value using an updater function.
   *
   * @param key - The key of the value to update
   * @param updater - A function that receives the current value and returns the new value
   * @throws Error if the key doesn't exist in the map
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('count', 5)
   * map.update('count', count => count + 1) // count is now 6
   * ```
   */
  update(key, updater) {
    const valueAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (!valueAtom) {
      throw new Error(`AtomMap: key ${key} not found`);
    }
    const value = valueAtom.__unsafe__getWithoutCapture();
    assert3(value !== UNINITIALIZED);
    valueAtom.set(updater(value));
  }
  /**
   * Removes a key-value pair from the map.
   *
   * @param key - The key to remove
   * @returns True if the key existed and was removed, false if it didn't exist
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('temp', 'value')
   * console.log(map.delete('temp')) // true
   * console.log(map.delete('missing')) // false
   * ```
   */
  delete(key) {
    const valueAtom = this.atoms.__unsafe__getWithoutCapture().get(key);
    if (!valueAtom) {
      return false;
    }
    transact(() => {
      valueAtom.set(UNINITIALIZED);
      this.atoms.update((atoms) => {
        return atoms.delete(key);
      });
    });
    return true;
  }
  /**
   * Removes multiple key-value pairs from the map in a single transaction.
   *
   * @param keys - An iterable of keys to remove
   * @returns An array of [key, value] pairs that were actually deleted
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('a', 1).set('b', 2).set('c', 3)
   * const deleted = map.deleteMany(['a', 'c', 'missing'])
   * console.log(deleted) // [['a', 1], ['c', 3]]
   * ```
   */
  deleteMany(keys) {
    return transact(() => {
      const deleted = [];
      const newAtoms = this.atoms.get().withMutations((atoms) => {
        for (const key of keys) {
          const valueAtom = atoms.get(key);
          if (!valueAtom)
            continue;
          const oldValue = valueAtom.get();
          assert3(oldValue !== UNINITIALIZED);
          deleted.push([key, oldValue]);
          atoms.delete(key);
          valueAtom.set(UNINITIALIZED);
        }
      });
      if (deleted.length) {
        this.atoms.set(newAtoms);
      }
      return deleted;
    });
  }
  /**
   * Removes all key-value pairs from the map.
   *
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('a', 1).set('b', 2)
   * map.clear()
   * console.log(map.size) // 0
   * ```
   */
  clear() {
    return transact(() => {
      for (const valueAtom of this.atoms.__unsafe__getWithoutCapture().values()) {
        valueAtom.set(UNINITIALIZED);
      }
      this.atoms.set(emptyMap());
    });
  }
  /**
   * Returns an iterator that yields [key, value] pairs for each entry in the map.
   * This method is reactive and will cause reactive contexts to update when entries change.
   *
   * @returns A generator that yields [key, value] tuples
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('a', 1).set('b', 2)
   * for (const [key, value] of map.entries()) {
   *   console.log(`${key}: ${value}`)
   * }
   * ```
   */
  *entries() {
    for (const [key, valueAtom] of this.atoms.get()) {
      const value = valueAtom.get();
      assert3(value !== UNINITIALIZED);
      yield [key, value];
    }
  }
  /**
   * Returns an iterator that yields all keys in the map.
   * This method is reactive and will cause reactive contexts to update when keys change.
   *
   * @returns A generator that yields keys
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('name', 'Alice').set('age', 30)
   * for (const key of map.keys()) {
   *   console.log(key) // 'name', 'age'
   * }
   * ```
   */
  *keys() {
    for (const key of this.atoms.get().keys()) {
      yield key;
    }
  }
  /**
   * Returns an iterator that yields all values in the map.
   * This method is reactive and will cause reactive contexts to update when values change.
   *
   * @returns A generator that yields values
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('name', 'Alice').set('age', 30)
   * for (const value of map.values()) {
   *   console.log(value) // 'Alice', 30
   * }
   * ```
   */
  *values() {
    for (const valueAtom of this.atoms.get().values()) {
      const value = valueAtom.get();
      assert3(value !== UNINITIALIZED);
      yield value;
    }
  }
  /**
   * The number of key-value pairs in the map.
   * This property is reactive and will cause reactive contexts to update when the size changes.
   *
   * @returns The number of entries in the map
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * console.log(map.size) // 0
   * map.set('a', 1)
   * console.log(map.size) // 1
   * ```
   */
  // eslint-disable-next-line no-restricted-syntax
  get size() {
    return this.atoms.get().size;
  }
  /**
   * Executes a provided function once for each key-value pair in the map.
   * This method is reactive and will cause reactive contexts to update when entries change.
   *
   * @param callbackfn - Function to execute for each entry
   *   - value - The value of the current entry
   *   - key - The key of the current entry
   *   - map - The AtomMap being traversed
   * @param thisArg - Value to use as `this` when executing the callback
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('a', 1).set('b', 2)
   * map.forEach((value, key) => {
   *   console.log(`${key} = ${value}`)
   * })
   * ```
   */
  forEach(callbackfn, thisArg) {
    for (const [key, value] of this.entries()) {
      callbackfn.call(thisArg, value, key, this);
    }
  }
  /**
   * Returns the default iterator for the map, which is the same as entries().
   * This allows the map to be used in for...of loops and other iterable contexts.
   *
   * @returns The same iterator as entries()
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * map.set('a', 1).set('b', 2)
   *
   * // These are equivalent:
   * for (const [key, value] of map) {
   *   console.log(`${key}: ${value}`)
   * }
   *
   * for (const [key, value] of map.entries()) {
   *   console.log(`${key}: ${value}`)
   * }
   * ```
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * The string tag used by Object.prototype.toString for this class.
   *
   * @example
   * ```ts
   * const map = new AtomMap('myMap')
   * console.log(Object.prototype.toString.call(map)) // '[object AtomMap]'
   * ```
   */
  [Symbol.toStringTag] = "AtomMap";
};
__name(AtomMap, "AtomMap");

// ../../node_modules/@tldraw/store/dist-esm/lib/AtomSet.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AtomSet = class {
  constructor(name, keys) {
    this.name = name;
    const entries = keys ? Array.from(keys, (k) => [k, k]) : void 0;
    this.map = new AtomMap(name, entries);
  }
  map;
  add(value) {
    this.map.set(value, value);
    return this;
  }
  clear() {
    this.map.clear();
  }
  delete(value) {
    return this.map.delete(value);
  }
  forEach(callbackfn, thisArg) {
    for (const value of this) {
      callbackfn.call(thisArg, value, value, this);
    }
  }
  has(value) {
    return this.map.has(value);
  }
  // eslint-disable-next-line no-restricted-syntax
  get size() {
    return this.map.size;
  }
  entries() {
    return this.map.entries();
  }
  keys() {
    return this.map.keys();
  }
  values() {
    return this.map.keys();
  }
  [Symbol.iterator]() {
    return this.map.keys();
  }
  [Symbol.toStringTag] = "AtomSet";
};
__name(AtomSet, "AtomSet");

// ../../node_modules/@tldraw/store/dist-esm/lib/devFreeze.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/isDev.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _isDev = false;
try {
  _isDev = false;
} catch (_e) {
}
try {
  _isDev = _isDev || import.meta.env.DEV || import.meta.env.TEST || import.meta.env.MODE === "development" || import.meta.env.MODE === "test";
} catch (_e) {
}
function isDev() {
  return _isDev;
}
__name(isDev, "isDev");

// ../../node_modules/@tldraw/store/dist-esm/lib/devFreeze.mjs
function devFreeze(object2) {
  if (!isDev())
    return object2;
  const proto = Object.getPrototypeOf(object2);
  if (proto && !(Array.isArray(object2) || proto === Object.prototype || proto === null || proto === STRUCTURED_CLONE_OBJECT_PROTOTYPE)) {
    console.error("cannot include non-js data in a record", object2);
    throw new Error("cannot include non-js data in a record");
  }
  if (Object.isFrozen(object2)) {
    return object2;
  }
  const propNames = Object.getOwnPropertyNames(object2);
  for (const name of propNames) {
    const value = object2[name];
    if (value && typeof value === "object") {
      devFreeze(value);
    }
  }
  return Object.freeze(object2);
}
__name(devFreeze, "devFreeze");

// ../../node_modules/@tldraw/store/dist-esm/lib/IncrementalSetConstructor.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/migrate.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function squashDependsOn(sequence) {
  const result = [];
  for (let i = sequence.length - 1; i >= 0; i--) {
    const elem = sequence[i];
    if (!("id" in elem)) {
      const dependsOn = elem.dependsOn;
      const prev = result[0];
      if (prev) {
        result[0] = {
          ...prev,
          dependsOn: dependsOn.concat(prev.dependsOn ?? [])
        };
      }
    } else {
      result.unshift(elem);
    }
  }
  return result;
}
__name(squashDependsOn, "squashDependsOn");
function createMigrationSequence({
  sequence,
  sequenceId,
  retroactive = true
}) {
  const migrations = {
    sequenceId,
    retroactive,
    sequence: squashDependsOn(sequence)
  };
  validateMigrations(migrations);
  return migrations;
}
__name(createMigrationSequence, "createMigrationSequence");
function createMigrationIds(sequenceId, versions2) {
  return Object.fromEntries(
    objectMapEntries(versions2).map(([key, version2]) => [key, `${sequenceId}/${version2}`])
  );
}
__name(createMigrationIds, "createMigrationIds");
function createRecordMigrationSequence(opts) {
  const sequenceId = opts.sequenceId;
  return createMigrationSequence({
    sequenceId,
    retroactive: opts.retroactive ?? true,
    sequence: opts.sequence.map(
      (m) => "id" in m ? {
        ...m,
        scope: "record",
        filter: (r) => r.typeName === opts.recordType && (m.filter?.(r) ?? true) && (opts.filter?.(r) ?? true)
      } : m
    )
  });
}
__name(createRecordMigrationSequence, "createRecordMigrationSequence");
function sortMigrations(migrations) {
  if (migrations.length === 0)
    return [];
  const byId = new Map(migrations.map((m) => [m.id, m]));
  const dependents = /* @__PURE__ */ new Map();
  const inDegree = /* @__PURE__ */ new Map();
  const explicitDeps = /* @__PURE__ */ new Map();
  for (const m of migrations) {
    inDegree.set(m.id, 0);
    dependents.set(m.id, /* @__PURE__ */ new Set());
    explicitDeps.set(m.id, /* @__PURE__ */ new Set());
  }
  for (const m of migrations) {
    const { version: version2, sequenceId } = parseMigrationId(m.id);
    const prevId = `${sequenceId}/${version2 - 1}`;
    if (byId.has(prevId)) {
      dependents.get(prevId).add(m.id);
      inDegree.set(m.id, inDegree.get(m.id) + 1);
    }
    if (m.dependsOn) {
      for (const depId of m.dependsOn) {
        if (byId.has(depId)) {
          dependents.get(depId).add(m.id);
          explicitDeps.get(m.id).add(depId);
          inDegree.set(m.id, inDegree.get(m.id) + 1);
        }
      }
    }
  }
  const ready = migrations.filter((m) => inDegree.get(m.id) === 0);
  const result = [];
  const processed = /* @__PURE__ */ new Set();
  while (ready.length > 0) {
    let bestCandidate;
    let bestCandidateScore = -Infinity;
    for (const m of ready) {
      let urgencyScore = 0;
      for (const depId of dependents.get(m.id) || []) {
        if (!processed.has(depId)) {
          urgencyScore += 1;
          if (explicitDeps.get(depId).has(m.id)) {
            urgencyScore += 100;
          }
        }
      }
      if (urgencyScore > bestCandidateScore || // Tiebreaker: prefer lower sequence/version
      urgencyScore === bestCandidateScore && m.id.localeCompare(bestCandidate?.id ?? "") < 0) {
        bestCandidate = m;
        bestCandidateScore = urgencyScore;
      }
    }
    const nextMigration = bestCandidate;
    ready.splice(ready.indexOf(nextMigration), 1);
    result.push(nextMigration);
    processed.add(nextMigration.id);
    for (const depId of dependents.get(nextMigration.id) || []) {
      if (!processed.has(depId)) {
        inDegree.set(depId, inDegree.get(depId) - 1);
        if (inDegree.get(depId) === 0) {
          ready.push(byId.get(depId));
        }
      }
    }
  }
  if (result.length !== migrations.length) {
    const unprocessed = migrations.filter((m) => !processed.has(m.id));
    assert3(false, `Circular dependency in migrations: ${unprocessed[0].id}`);
  }
  return result;
}
__name(sortMigrations, "sortMigrations");
function parseMigrationId(id) {
  const [sequenceId, version2] = id.split("/");
  return { sequenceId, version: parseInt(version2) };
}
__name(parseMigrationId, "parseMigrationId");
function validateMigrationId(id, expectedSequenceId) {
  if (expectedSequenceId) {
    assert3(
      id.startsWith(expectedSequenceId + "/"),
      `Every migration in sequence '${expectedSequenceId}' must have an id starting with '${expectedSequenceId}/'. Got invalid id: '${id}'`
    );
  }
  assert3(id.match(/^(.*?)\/(0|[1-9]\d*)$/), `Invalid migration id: '${id}'`);
}
__name(validateMigrationId, "validateMigrationId");
function validateMigrations(migrations) {
  assert3(
    !migrations.sequenceId.includes("/"),
    `sequenceId cannot contain a '/', got ${migrations.sequenceId}`
  );
  assert3(migrations.sequenceId.length, "sequenceId must be a non-empty string");
  if (migrations.sequence.length === 0) {
    return;
  }
  validateMigrationId(migrations.sequence[0].id, migrations.sequenceId);
  let n = parseMigrationId(migrations.sequence[0].id).version;
  assert3(
    n === 1,
    `Expected the first migrationId to be '${migrations.sequenceId}/1' but got '${migrations.sequence[0].id}'`
  );
  for (let i = 1; i < migrations.sequence.length; i++) {
    const id = migrations.sequence[i].id;
    validateMigrationId(id, migrations.sequenceId);
    const m = parseMigrationId(id).version;
    assert3(
      m === n + 1,
      `Migration id numbers must increase in increments of 1, expected ${migrations.sequenceId}/${n + 1} but got '${migrations.sequence[i].id}'`
    );
    n = m;
  }
}
__name(validateMigrations, "validateMigrations");
var MigrationFailureReason = {
  IncompatibleSubtype: "incompatible-subtype",
  UnknownType: "unknown-type",
  TargetVersionTooNew: "target-version-too-new",
  TargetVersionTooOld: "target-version-too-old",
  MigrationError: "migration-error",
  UnrecognizedSubtype: "unrecognized-subtype"
};

// ../../node_modules/@tldraw/store/dist-esm/lib/RecordsDiff.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/RecordType.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RecordType = class {
  /**
   * Creates a new RecordType instance.
   *
   * typeName - The unique type name for records created by this RecordType
   * config - Configuration object for the RecordType
   *   - createDefaultProperties - Function that returns default properties for new records
   *   - validator - Optional validator function for record validation
   *   - scope - Optional scope determining persistence behavior (defaults to 'document')
   *   - ephemeralKeys - Optional mapping of property names to ephemeral status
   * @public
   */
  constructor(typeName, config2) {
    this.typeName = typeName;
    this.createDefaultProperties = config2.createDefaultProperties;
    this.validator = config2.validator ?? { validate: (r) => r };
    this.scope = config2.scope ?? "document";
    this.ephemeralKeys = config2.ephemeralKeys;
    const ephemeralKeySet = /* @__PURE__ */ new Set();
    if (config2.ephemeralKeys) {
      for (const [key, isEphemeral] of objectMapEntries(config2.ephemeralKeys)) {
        if (isEphemeral)
          ephemeralKeySet.add(key);
      }
    }
    this.ephemeralKeySet = ephemeralKeySet;
  }
  /**
   * Factory function that creates default properties for new records.
   * @public
   */
  createDefaultProperties;
  /**
   * Validator function used to validate records of this type.
   * @public
   */
  validator;
  /**
   * Optional configuration specifying which record properties are ephemeral.
   * Ephemeral properties are not included in snapshots or synchronization.
   * @public
   */
  ephemeralKeys;
  /**
   * Set of property names that are marked as ephemeral for efficient lookup.
   * @public
   */
  ephemeralKeySet;
  /**
   * The scope that determines how records of this type are persisted and synchronized.
   * @public
   */
  scope;
  /**
   * Creates a new record of this type with the given properties.
   *
   * Properties are merged with default properties from the RecordType configuration.
   * If no id is provided, a unique id will be generated automatically.
   *
   * @example
   * ```ts
   * const book = Book.create({
   *   title: 'The Great Gatsby',
   *   author: 'F. Scott Fitzgerald'
   * })
   * // Result: { id: 'book:abc123', typeName: 'book', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', inStock: true }
   * ```
   *
   * @param properties - The properties for the new record, including both required and optional fields
   * @returns The newly created record with generated id and typeName
   * @public
   */
  create(properties) {
    const result = {
      ...this.createDefaultProperties(),
      id: "id" in properties ? properties.id : this.createId()
    };
    for (const [k, v] of Object.entries(properties)) {
      if (v !== void 0) {
        result[k] = v;
      }
    }
    result.typeName = this.typeName;
    return result;
  }
  /**
   * Creates a deep copy of an existing record with a new unique id.
   *
   * This method performs a deep clone of all properties while generating a fresh id,
   * making it useful for duplicating records without id conflicts.
   *
   * @example
   * ```ts
   * const originalBook = Book.create({ title: '1984', author: 'George Orwell' })
   * const duplicatedBook = Book.clone(originalBook)
   * // duplicatedBook has same properties but different id
   * ```
   *
   * @param record - The record to clone
   * @returns A new record with the same properties but a different id
   * @public
   */
  clone(record) {
    return { ...structuredClone(record), id: this.createId() };
  }
  /**
   * Create a new ID for this record type.
   *
   * @example
   *
   * ```ts
   * const id = recordType.createId()
   * ```
   *
   * @returns The new ID.
   * @public
   */
  createId(customUniquePart) {
    return this.typeName + ":" + (customUniquePart ?? uniqueId());
  }
  /**
   * Extracts the unique identifier part from a full record id.
   *
   * Record ids have the format `typeName:uniquePart`. This method returns just the unique part.
   *
   * @example
   * ```ts
   * const bookId = Book.createId() // 'book:abc123'
   * const uniquePart = Book.parseId(bookId) // 'abc123'
   * ```
   *
   * @param id - The full record id to parse
   * @returns The unique identifier portion after the colon
   * @throws Error if the id is not valid for this record type
   * @public
   */
  parseId(id) {
    if (!this.isId(id)) {
      throw new Error(`ID "${id}" is not a valid ID for type "${this.typeName}"`);
    }
    return id.slice(this.typeName.length + 1);
  }
  /**
   * Type guard that checks whether a record belongs to this RecordType.
   *
   * This method performs a runtime check by comparing the record's typeName
   * against this RecordType's typeName.
   *
   * @example
   * ```ts
   * if (Book.isInstance(someRecord)) {
   *   // someRecord is now typed as a book record
   *   console.log(someRecord.title)
   * }
   * ```
   *
   * @param record - The record to check, may be undefined
   * @returns True if the record is an instance of this record type
   * @public
   */
  isInstance(record) {
    return record?.typeName === this.typeName;
  }
  /**
   * Type guard that checks whether an id string belongs to this RecordType.
   *
   * Validates that the id starts with this RecordType's typeName followed by a colon.
   * This is more efficient than parsing the full id when you only need to verify the type.
   *
   * @example
   * ```ts
   * if (Book.isId(someId)) {
   *   // someId is now typed as IdOf<BookRecord>
   *   const book = store.get(someId)
   * }
   * ```
   *
   * @param id - The id string to check, may be undefined
   * @returns True if the id belongs to this record type
   * @public
   */
  isId(id) {
    if (!id)
      return false;
    for (let i = 0; i < this.typeName.length; i++) {
      if (id[i] !== this.typeName[i])
        return false;
    }
    return id[this.typeName.length] === ":";
  }
  /**
   * Create a new RecordType that has the same type name as this RecordType and includes the given
   * default properties.
   *
   * @example
   *
   * ```ts
   * const authorType = createRecordType('author', () => ({ living: true }))
   * const deadAuthorType = authorType.withDefaultProperties({ living: false })
   * ```
   *
   * @param createDefaultProperties - A function that returns the default properties of the new RecordType.
   * @returns The new RecordType.
   */
  withDefaultProperties(createDefaultProperties) {
    return new RecordType(this.typeName, {
      createDefaultProperties,
      validator: this.validator,
      scope: this.scope,
      ephemeralKeys: this.ephemeralKeys
    });
  }
  /**
   * Validates a record against this RecordType's validator and returns it with proper typing.
   *
   * This method runs the configured validator function and throws an error if validation fails.
   * If a previous version of the record is provided, it may use optimized validation.
   *
   * @example
   * ```ts
   * try {
   *   const validBook = Book.validate(untrustedData)
   *   // validBook is now properly typed and validated
   * } catch (error) {
   *   console.log('Validation failed:', error.message)
   * }
   * ```
   *
   * @param record - The unknown record data to validate
   * @param recordBefore - Optional previous version for optimized validation
   * @returns The validated and properly typed record
   * @throws Error if validation fails
   * @public
   */
  validate(record, recordBefore) {
    if (recordBefore && this.validator.validateUsingKnownGoodVersion) {
      return this.validator.validateUsingKnownGoodVersion(recordBefore, record);
    }
    return this.validator.validate(record);
  }
};
__name(RecordType, "RecordType");
function createRecordType(typeName, config2) {
  return new RecordType(typeName, {
    createDefaultProperties: () => ({}),
    validator: config2.validator,
    scope: config2.scope,
    ephemeralKeys: config2.ephemeralKeys
  });
}
__name(createRecordType, "createRecordType");

// ../../node_modules/@tldraw/store/dist-esm/lib/Store.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/StoreQueries.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/executeQuery.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/setUtils.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/StoreSideEffects.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/store/dist-esm/lib/StoreSchema.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function upgradeSchema(schema2) {
  if (schema2.schemaVersion > 2 || schema2.schemaVersion < 1)
    return Result.err("Bad schema version");
  if (schema2.schemaVersion === 2)
    return Result.ok(schema2);
  const result = {
    schemaVersion: 2,
    sequences: {
      "com.tldraw.store": schema2.storeVersion
    }
  };
  for (const [typeName, recordVersion] of Object.entries(schema2.recordVersions)) {
    result.sequences[`com.tldraw.${typeName}`] = recordVersion.version;
    if ("subTypeKey" in recordVersion) {
      for (const [subType, version2] of Object.entries(recordVersion.subTypeVersions)) {
        result.sequences[`com.tldraw.${typeName}.${subType}`] = version2;
      }
    }
  }
  return Result.ok(result);
}
__name(upgradeSchema, "upgradeSchema");
var StoreSchema = class {
  constructor(types2, options) {
    this.types = types2;
    this.options = options;
    for (const m of options.migrations ?? []) {
      assert3(!this.migrations[m.sequenceId], `Duplicate migration sequenceId ${m.sequenceId}`);
      validateMigrations(m);
      this.migrations[m.sequenceId] = m;
    }
    const allMigrations = Object.values(this.migrations).flatMap((m) => m.sequence);
    this.sortedMigrations = sortMigrations(allMigrations);
    for (const migration of this.sortedMigrations) {
      if (!migration.dependsOn?.length)
        continue;
      for (const dep of migration.dependsOn) {
        const depMigration = allMigrations.find((m) => m.id === dep);
        assert3(depMigration, `Migration '${migration.id}' depends on missing migration '${dep}'`);
      }
    }
  }
  /**
   * Creates a new StoreSchema with the given record types and options.
   *
   * This static factory method is the recommended way to create a StoreSchema.
   * It ensures type safety while providing a clean API for schema definition.
   *
   * @param types - Object mapping type names to their RecordType definitions
   * @param options - Optional configuration for migrations, validation, and integrity checking
   * @returns A new StoreSchema instance
   *
   * @example
   * ```ts
   * const Book = createRecordType<Book>('book', { scope: 'document' })
   * const Author = createRecordType<Author>('author', { scope: 'document' })
   *
   * const schema = StoreSchema.create(
   *   {
   *     book: Book,
   *     author: Author
   *   },
   *   {
   *     migrations: [bookMigrations],
   *     onValidationFailure: (failure) => failure.record
   *   }
   * )
   * ```
   *
   * @public
   */
  static create(types2, options) {
    return new StoreSchema(types2, options ?? {});
  }
  migrations = {};
  sortedMigrations;
  migrationCache = /* @__PURE__ */ new WeakMap();
  /**
   * Validates a record using its corresponding RecordType validator.
   *
   * This method ensures that records conform to their type definitions before
   * being stored. If validation fails and an onValidationFailure handler is
   * provided, it will be called to potentially recover from the error.
   *
   * @param store - The store instance where validation is occurring
   * @param record - The record to validate
   * @param phase - The lifecycle phase where validation is happening
   * @param recordBefore - The previous version of the record (for updates)
   * @returns The validated record, potentially modified by validation failure handler
   *
   * @example
   * ```ts
   * try {
   *   const validatedBook = schema.validateRecord(
   *     store,
   *     { id: 'book:1', typeName: 'book', title: '', author: 'Jane Doe' },
   *     'createRecord',
   *     null
   *   )
   * } catch (error) {
   *   console.error('Record validation failed:', error)
   * }
   * ```
   *
   * @public
   */
  validateRecord(store, record, phase, recordBefore) {
    try {
      const recordType = getOwnProperty(this.types, record.typeName);
      if (!recordType) {
        throw new Error(`Missing definition for record type ${record.typeName}`);
      }
      return recordType.validate(record, recordBefore ?? void 0);
    } catch (error3) {
      if (this.options.onValidationFailure) {
        return this.options.onValidationFailure({
          store,
          record,
          phase,
          recordBefore,
          error: error3
        });
      } else {
        throw error3;
      }
    }
  }
  /**
   * Gets all migrations that need to be applied to upgrade from a persisted schema
   * to the current schema version.
   *
   * This method compares the persisted schema with the current schema and determines
   * which migrations need to be applied to bring the data up to date. It handles
   * both regular migrations and retroactive migrations, and caches results for
   * performance.
   *
   * @param persistedSchema - The schema version that was previously persisted
   * @returns A Result containing the list of migrations to apply, or an error message
   *
   * @example
   * ```ts
   * const persistedSchema = {
   *   schemaVersion: 2,
   *   sequences: { 'com.tldraw.book': 1, 'com.tldraw.author': 0 }
   * }
   *
   * const migrationsResult = schema.getMigrationsSince(persistedSchema)
   * if (migrationsResult.ok) {
   *   console.log('Migrations to apply:', migrationsResult.value.length)
   *   // Apply each migration to bring data up to date
   * }
   * ```
   *
   * @public
   */
  getMigrationsSince(persistedSchema) {
    const cached = this.migrationCache.get(persistedSchema);
    if (cached) {
      return cached;
    }
    const upgradeResult = upgradeSchema(persistedSchema);
    if (!upgradeResult.ok) {
      this.migrationCache.set(persistedSchema, upgradeResult);
      return upgradeResult;
    }
    const schema2 = upgradeResult.value;
    const sequenceIdsToInclude = new Set(
      // start with any shared sequences
      Object.keys(schema2.sequences).filter((sequenceId) => this.migrations[sequenceId])
    );
    for (const sequenceId in this.migrations) {
      if (schema2.sequences[sequenceId] === void 0 && this.migrations[sequenceId].retroactive) {
        sequenceIdsToInclude.add(sequenceId);
      }
    }
    if (sequenceIdsToInclude.size === 0) {
      const result2 = Result.ok([]);
      this.migrationCache.set(persistedSchema, result2);
      return result2;
    }
    const allMigrationsToInclude = /* @__PURE__ */ new Set();
    for (const sequenceId of sequenceIdsToInclude) {
      const theirVersion = schema2.sequences[sequenceId];
      if (typeof theirVersion !== "number" && this.migrations[sequenceId].retroactive || theirVersion === 0) {
        for (const migration of this.migrations[sequenceId].sequence) {
          allMigrationsToInclude.add(migration.id);
        }
        continue;
      }
      const theirVersionId = `${sequenceId}/${theirVersion}`;
      const idx = this.migrations[sequenceId].sequence.findIndex((m) => m.id === theirVersionId);
      if (idx === -1) {
        const result2 = Result.err("Incompatible schema?");
        this.migrationCache.set(persistedSchema, result2);
        return result2;
      }
      for (const migration of this.migrations[sequenceId].sequence.slice(idx + 1)) {
        allMigrationsToInclude.add(migration.id);
      }
    }
    const result = Result.ok(
      this.sortedMigrations.filter(({ id }) => allMigrationsToInclude.has(id))
    );
    this.migrationCache.set(persistedSchema, result);
    return result;
  }
  /**
   * Migrates a single persisted record to match the current schema version.
   *
   * This method applies the necessary migrations to transform a record from an
   * older (or newer) schema version to the current version. It supports both
   * forward ('up') and backward ('down') migrations.
   *
   * @param record - The record to migrate
   * @param persistedSchema - The schema version the record was persisted with
   * @param direction - Direction to migrate ('up' for newer, 'down' for older)
   * @returns A MigrationResult containing the migrated record or an error
   *
   * @example
   * ```ts
   * const oldRecord = { id: 'book:1', typeName: 'book', title: 'Old Title', publishDate: '2020-01-01' }
   * const oldSchema = { schemaVersion: 2, sequences: { 'com.tldraw.book': 1 } }
   *
   * const result = schema.migratePersistedRecord(oldRecord, oldSchema, 'up')
   * if (result.type === 'success') {
   *   console.log('Migrated record:', result.value)
   *   // Record now has publishedYear instead of publishDate
   * } else {
   *   console.error('Migration failed:', result.reason)
   * }
   * ```
   *
   * @public
   */
  migratePersistedRecord(record, persistedSchema, direction = "up") {
    const migrations = this.getMigrationsSince(persistedSchema);
    if (!migrations.ok) {
      console.error("Error migrating record", migrations.error);
      return { type: "error", reason: MigrationFailureReason.MigrationError };
    }
    let migrationsToApply = migrations.value;
    if (migrationsToApply.length === 0) {
      return { type: "success", value: record };
    }
    if (!migrationsToApply.every((m) => m.scope === "record")) {
      return {
        type: "error",
        reason: direction === "down" ? MigrationFailureReason.TargetVersionTooOld : MigrationFailureReason.TargetVersionTooNew
      };
    }
    if (direction === "down") {
      if (!migrationsToApply.every((m) => m.scope === "record" && m.down)) {
        return {
          type: "error",
          reason: MigrationFailureReason.TargetVersionTooOld
        };
      }
      migrationsToApply = migrationsToApply.slice().reverse();
    }
    record = structuredClone(record);
    try {
      for (const migration of migrationsToApply) {
        if (migration.scope === "store")
          throw new Error(
            /* won't happen, just for TS */
          );
        if (migration.scope === "storage")
          throw new Error(
            /* won't happen, just for TS */
          );
        const shouldApply = migration.filter ? migration.filter(record) : true;
        if (!shouldApply)
          continue;
        const result = migration[direction](record);
        if (result) {
          record = structuredClone(result);
        }
      }
    } catch (e) {
      console.error("Error migrating record", e);
      return { type: "error", reason: MigrationFailureReason.MigrationError };
    }
    return { type: "success", value: record };
  }
  migrateStorage(storage) {
    const schema2 = storage.getSchema();
    assert3(schema2, "Schema is missing.");
    const migrations = this.getMigrationsSince(schema2);
    if (!migrations.ok) {
      console.error("Error migrating store", migrations.error);
      throw new Error(migrations.error);
    }
    const migrationsToApply = migrations.value;
    if (migrationsToApply.length === 0) {
      return;
    }
    storage.setSchema(this.serialize());
    for (const migration of migrationsToApply) {
      if (migration.scope === "record") {
        const updates = [];
        for (const [id, state] of storage.entries()) {
          const shouldApply = migration.filter ? migration.filter(state) : true;
          if (!shouldApply)
            continue;
          const record = structuredClone(state);
          const result = migration.up(record) ?? record;
          if (!(0, import_lodash2.default)(result, state)) {
            updates.push([id, result]);
          }
        }
        for (const [id, record] of updates) {
          storage.set(id, record);
        }
      } else if (migration.scope === "store") {
        const prevStore = Object.fromEntries(storage.entries());
        let nextStore = structuredClone(prevStore);
        nextStore = migration.up(nextStore) ?? nextStore;
        for (const [id, state] of Object.entries(nextStore)) {
          if (!state)
            continue;
          if (!(0, import_lodash2.default)(state, prevStore[id])) {
            storage.set(id, state);
          }
        }
        for (const id of Object.keys(prevStore)) {
          if (!nextStore[id]) {
            storage.delete(id);
          }
        }
      } else if (migration.scope === "storage") {
        migration.up(storage);
      } else {
        exhaustiveSwitchError(migration);
      }
    }
    for (const [id, state] of storage.entries()) {
      if (this.getType(state.typeName).scope !== "document") {
        storage.delete(id);
      }
    }
  }
  /**
   * Migrates an entire store snapshot to match the current schema version.
   *
   * This method applies all necessary migrations to bring a persisted store
   * snapshot up to the current schema version. It handles both record-level
   * and store-level migrations, and can optionally mutate the input store
   * for performance.
   *
   * @param snapshot - The store snapshot containing data and schema information
   * @param opts - Options controlling migration behavior
   *   - mutateInputStore - Whether to modify the input store directly (default: false)
   * @returns A MigrationResult containing the migrated store or an error
   *
   * @example
   * ```ts
   * const snapshot = {
   *   schema: { schemaVersion: 2, sequences: { 'com.tldraw.book': 1 } },
   *   store: {
   *     'book:1': { id: 'book:1', typeName: 'book', title: 'Old Book', publishDate: '2020-01-01' }
   *   }
   * }
   *
   * const result = schema.migrateStoreSnapshot(snapshot)
   * if (result.type === 'success') {
   *   console.log('Migrated store:', result.value)
   *   // All records are now at current schema version
   * }
   * ```
   *
   * @public
   */
  migrateStoreSnapshot(snapshot, opts) {
    const migrations = this.getMigrationsSince(snapshot.schema);
    if (!migrations.ok) {
      console.error("Error migrating store", migrations.error);
      return { type: "error", reason: MigrationFailureReason.MigrationError };
    }
    const migrationsToApply = migrations.value;
    if (migrationsToApply.length === 0) {
      return { type: "success", value: snapshot.store };
    }
    const store = Object.assign(
      new Map(objectMapEntries(snapshot.store).map(devFreeze)),
      {
        getSchema: () => snapshot.schema,
        setSchema: (_) => {
        }
      }
    );
    try {
      this.migrateStorage(store);
      if (opts?.mutateInputStore) {
        for (const [id, record] of store.entries()) {
          snapshot.store[id] = record;
        }
        for (const id of Object.keys(snapshot.store)) {
          if (!store.has(id)) {
            delete snapshot.store[id];
          }
        }
        return { type: "success", value: snapshot.store };
      } else {
        return {
          type: "success",
          value: Object.fromEntries(store.entries())
        };
      }
    } catch (e) {
      console.error("Error migrating store", e);
      return { type: "error", reason: MigrationFailureReason.MigrationError };
    }
  }
  /**
   * Creates an integrity checker function for the given store.
   *
   * This method calls the createIntegrityChecker option if provided, allowing
   * custom integrity checking logic to be set up for the store. The integrity
   * checker is used to validate store consistency and catch data corruption.
   *
   * @param store - The store instance to create an integrity checker for
   * @returns An integrity checker function, or undefined if none is configured
   *
   * @internal
   */
  createIntegrityChecker(store) {
    return this.options.createIntegrityChecker?.(store) ?? void 0;
  }
  /**
   * Serializes the current schema to a SerializedSchemaV2 format.
   *
   * This method creates a serialized representation of the current schema,
   * capturing the latest version number for each migration sequence.
   * The result can be persisted and later used to determine what migrations
   * need to be applied when loading data.
   *
   * @returns A SerializedSchemaV2 object representing the current schema state
   *
   * @example
   * ```ts
   * const serialized = schema.serialize()
   * console.log(serialized)
   * // {
   * //   schemaVersion: 2,
   * //   sequences: {
   * //     'com.tldraw.book': 3,
   * //     'com.tldraw.author': 2
   * //   }
   * // }
   *
   * // Store this with your data for future migrations
   * localStorage.setItem('schema', JSON.stringify(serialized))
   * ```
   *
   * @public
   */
  serialize() {
    return {
      schemaVersion: 2,
      sequences: Object.fromEntries(
        Object.values(this.migrations).map(({ sequenceId, sequence }) => [
          sequenceId,
          sequence.length ? parseMigrationId(sequence.at(-1).id).version : 0
        ])
      )
    };
  }
  /**
   * Serializes a schema representing the earliest possible version.
   *
   * This method creates a serialized schema where all migration sequences
   * are set to version 0, representing the state before any migrations
   * have been applied. This is used in specific legacy scenarios.
   *
   * @returns A SerializedSchema with all sequences set to version 0
   *
   * @deprecated This is only here for legacy reasons, don't use it unless you have david's blessing!
   * @internal
   */
  serializeEarliestVersion() {
    return {
      schemaVersion: 2,
      sequences: Object.fromEntries(
        Object.values(this.migrations).map(({ sequenceId }) => [sequenceId, 0])
      )
    };
  }
  /**
   * Gets the RecordType definition for a given type name.
   *
   * This method retrieves the RecordType associated with the specified
   * type name, which contains the record's validation, creation, and
   * other behavioral logic.
   *
   * @param typeName - The name of the record type to retrieve
   * @returns The RecordType definition for the specified type
   *
   * @throws Will throw an error if the record type does not exist
   *
   * @internal
   */
  getType(typeName) {
    const type = getOwnProperty(this.types, typeName);
    assert3(type, "record type does not exists");
    return type;
  }
};
__name(StoreSchema, "StoreSchema");

// ../../node_modules/@tldraw/store/dist-esm/index.mjs
registerTldrawLibraryVersion(
  "@tldraw/store",
  "4.5.12",
  "esm"
);

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/diff.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RecordOpType = {
  Put: "put",
  Patch: "patch",
  Remove: "remove"
};
var ValueOpType = {
  Put: "put",
  Delete: "delete",
  Append: "append",
  Patch: "patch"
};
function diffRecord(prev, next, legacyAppendMode = false) {
  return diffObject(prev, next, /* @__PURE__ */ new Set(["props", "meta"]), legacyAppendMode);
}
__name(diffRecord, "diffRecord");
function diffObject(prev, next, nestedKeys, legacyAppendMode) {
  if (prev === next) {
    return null;
  }
  let result = null;
  for (const key of Object.keys(prev)) {
    if (!(key in next)) {
      if (!result)
        result = {};
      result[key] = [ValueOpType.Delete];
      continue;
    }
    const prevValue = prev[key];
    const nextValue = next[key];
    if (nestedKeys?.has(key) || Array.isArray(prevValue) && Array.isArray(nextValue) || typeof prevValue === "string" && typeof nextValue === "string") {
      const diff = diffValue(prevValue, nextValue, legacyAppendMode);
      if (diff) {
        if (!result)
          result = {};
        result[key] = diff;
      }
    } else if (!(0, import_lodash2.default)(prevValue, nextValue)) {
      if (!result)
        result = {};
      result[key] = [ValueOpType.Put, nextValue];
    }
  }
  for (const key of Object.keys(next)) {
    if (!(key in prev)) {
      if (!result)
        result = {};
      result[key] = [ValueOpType.Put, next[key]];
    }
  }
  return result;
}
__name(diffObject, "diffObject");
function diffValue(valueA, valueB, legacyAppendMode) {
  if (Object.is(valueA, valueB))
    return null;
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    return diffArray(valueA, valueB, legacyAppendMode);
  } else if (typeof valueA === "string" && typeof valueB === "string") {
    if (!legacyAppendMode && valueB.startsWith(valueA)) {
      const appendedText = valueB.slice(valueA.length);
      return [ValueOpType.Append, appendedText, valueA.length];
    }
    return [ValueOpType.Put, valueB];
  } else if (!valueA || !valueB || typeof valueA !== "object" || typeof valueB !== "object") {
    return (0, import_lodash2.default)(valueA, valueB) ? null : [ValueOpType.Put, valueB];
  } else {
    const diff = diffObject(valueA, valueB, void 0, legacyAppendMode);
    return diff ? [ValueOpType.Patch, diff] : null;
  }
}
__name(diffValue, "diffValue");
function diffArray(prevArray, nextArray, legacyAppendMode) {
  if (Object.is(prevArray, nextArray))
    return null;
  if (prevArray.length === nextArray.length) {
    const maxPatchIndexes = Math.max(prevArray.length / 5, 1);
    const toPatchIndexes = [];
    for (let i = 0; i < prevArray.length; i++) {
      if (!(0, import_lodash2.default)(prevArray[i], nextArray[i])) {
        toPatchIndexes.push(i);
        if (toPatchIndexes.length > maxPatchIndexes) {
          return [ValueOpType.Put, nextArray];
        }
      }
    }
    if (toPatchIndexes.length === 0) {
      return null;
    }
    const diff = {};
    for (const i of toPatchIndexes) {
      const prevItem = prevArray[i];
      const nextItem = nextArray[i];
      if (!prevItem || !nextItem) {
        diff[i] = [ValueOpType.Put, nextItem];
      } else if (typeof prevItem === "object" && typeof nextItem === "object") {
        const op = diffValue(prevItem, nextItem, legacyAppendMode);
        if (op) {
          diff[i] = op;
        }
      } else {
        diff[i] = [ValueOpType.Put, nextItem];
      }
    }
    return [ValueOpType.Patch, diff];
  }
  for (let i = 0; i < prevArray.length; i++) {
    if (!(0, import_lodash2.default)(prevArray[i], nextArray[i])) {
      return [ValueOpType.Put, nextArray];
    }
  }
  return [ValueOpType.Append, nextArray.slice(prevArray.length), prevArray.length];
}
__name(diffArray, "diffArray");
function applyObjectDiff(object2, objectDiff) {
  if (!object2 || typeof object2 !== "object")
    return object2;
  const isArray = Array.isArray(object2);
  let newObject = void 0;
  const set = /* @__PURE__ */ __name((k, v) => {
    if (!newObject) {
      if (isArray) {
        newObject = [...object2];
      } else {
        newObject = { ...object2 };
      }
    }
    if (isArray) {
      newObject[Number(k)] = v;
    } else {
      newObject[k] = v;
    }
  }, "set");
  for (const [key, op] of Object.entries(objectDiff)) {
    switch (op[0]) {
      case ValueOpType.Put: {
        const value = op[1];
        if (!(0, import_lodash2.default)(object2[key], value)) {
          set(key, value);
        }
        break;
      }
      case ValueOpType.Append: {
        const value = op[1];
        const offset = op[2];
        const currentValue = object2[key];
        if (Array.isArray(currentValue) && Array.isArray(value) && currentValue.length === offset) {
          set(key, [...currentValue, ...value]);
        } else if (typeof currentValue === "string" && typeof value === "string" && currentValue.length === offset) {
          set(key, currentValue + value);
        }
        break;
      }
      case ValueOpType.Patch: {
        if (object2[key] && typeof object2[key] === "object") {
          const diff = op[1];
          const patched = applyObjectDiff(object2[key], diff);
          if (patched !== object2[key]) {
            set(key, patched);
          }
        }
        break;
      }
      case ValueOpType.Delete: {
        if (key in object2) {
          if (!newObject) {
            if (isArray) {
              console.error("Can't delete array item yet (this should never happen)");
              newObject = [...object2];
            } else {
              newObject = { ...object2 };
            }
          }
          delete newObject[key];
        }
      }
    }
  }
  return newObject ?? object2;
}
__name(applyObjectDiff, "applyObjectDiff");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/interval.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function interval(cb, timeout) {
  const i = setInterval(cb, timeout);
  return () => clearInterval(i);
}
__name(interval, "interval");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/protocol.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TLSYNC_PROTOCOL_VERSION = 8;
function getTlsyncProtocolVersion() {
  return TLSYNC_PROTOCOL_VERSION;
}
__name(getTlsyncProtocolVersion, "getTlsyncProtocolVersion");
var TLIncompatibilityReason = {
  ClientTooOld: "clientTooOld",
  ServerTooOld: "serverTooOld",
  InvalidRecord: "invalidRecord",
  InvalidOperation: "invalidOperation"
};

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSyncClient.mjs
var TLSyncErrorCloseEventCode = 4099;
var TLSyncErrorCloseEventReason = {
  /** Room or resource not found */
  NOT_FOUND: "NOT_FOUND",
  /** User lacks permission to access the room */
  FORBIDDEN: "FORBIDDEN",
  /** User authentication required or invalid */
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  /** Unexpected server error occurred */
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  /** Client protocol version too old */
  CLIENT_TOO_OLD: "CLIENT_TOO_OLD",
  /** Server protocol version too old */
  SERVER_TOO_OLD: "SERVER_TOO_OLD",
  /** Client sent invalid or corrupted record data */
  INVALID_RECORD: "INVALID_RECORD",
  /** Client exceeded rate limits */
  RATE_LIMITED: "RATE_LIMITED",
  /** Room has reached maximum capacity */
  ROOM_FULL: "ROOM_FULL"
};
var TLSyncError = class extends Error {
  constructor(message2, reason) {
    super(message2);
    this.reason = reason;
  }
};
__name(TLSyncError, "TLSyncError");
var PING_INTERVAL = 5e3;
var MAX_TIME_TO_WAIT_FOR_SERVER_INTERACTION_BEFORE_RESETTING_CONNECTION = PING_INTERVAL * 2;

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/ClientWebSocketAdapter.mjs
var INACTIVE_MAX_DELAY = 1e3 * 60 * 5;

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/DurableObjectSqliteSyncWrapper.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DurableObjectStatement = class {
  constructor(sql, query) {
    this.sql = sql;
    this.query = query;
  }
  iterate(...bindings) {
    const result = this.sql.exec(this.query, ...bindings);
    return result[Symbol.iterator]();
  }
  all(...bindings) {
    return this.sql.exec(this.query, ...bindings).toArray();
  }
  run(...bindings) {
    this.sql.exec(this.query, ...bindings);
  }
};
__name(DurableObjectStatement, "DurableObjectStatement");
var DurableObjectSqliteSyncWrapper = class {
  constructor(storage, config2) {
    this.storage = storage;
    this.config = config2;
  }
  exec(sql) {
    this.storage.sql.exec(sql);
  }
  prepare(sql) {
    return new DurableObjectStatement(this.storage.sql, sql);
  }
  transaction(callback) {
    return this.storage.transactionSync(callback);
  }
};
__name(DurableObjectSqliteSyncWrapper, "DurableObjectSqliteSyncWrapper");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/InMemorySyncStorage.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/assets/TLBaseAsset.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/validate/dist-esm/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/validate/dist-esm/lib/validation.mjs
var validation_exports = {};
__export(validation_exports, {
  ArrayOfValidator: () => ArrayOfValidator,
  DictValidator: () => DictValidator,
  ObjectValidator: () => ObjectValidator,
  UnionValidator: () => UnionValidator,
  ValidationError: () => ValidationError,
  Validator: () => Validator,
  any: () => any,
  array: () => array,
  arrayOf: () => arrayOf,
  bigint: () => bigint2,
  boolean: () => boolean,
  dict: () => dict,
  httpUrl: () => httpUrl,
  indexKey: () => indexKey,
  integer: () => integer,
  jsonDict: () => jsonDict,
  jsonValue: () => jsonValue,
  linkUrl: () => linkUrl,
  literal: () => literal,
  literalEnum: () => literalEnum,
  model: () => model,
  nonZeroFiniteNumber: () => nonZeroFiniteNumber,
  nonZeroInteger: () => nonZeroInteger,
  nonZeroNumber: () => nonZeroNumber,
  nullable: () => nullable,
  number: () => number,
  numberUnion: () => numberUnion,
  object: () => object,
  optional: () => optional,
  or: () => or,
  positiveInteger: () => positiveInteger,
  positiveNumber: () => positiveNumber,
  setEnum: () => setEnum,
  srcUrl: () => srcUrl,
  string: () => string,
  union: () => union,
  unitInterval: () => unitInterval,
  unknown: () => unknown,
  unknownObject: () => unknownObject
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IS_DEV = true;
function formatPath(path) {
  if (!path.length) {
    return null;
  }
  let formattedPath = "";
  for (const item of path) {
    if (typeof item === "number") {
      formattedPath += `.${item}`;
    } else if (item.startsWith("(")) {
      if (formattedPath.endsWith(")")) {
        formattedPath = `${formattedPath.slice(0, -1)}, ${item.slice(1)}`;
      } else {
        formattedPath += item;
      }
    } else {
      formattedPath += `.${item}`;
    }
  }
  formattedPath = formattedPath.replace(/id = [^,]+, /, "").replace(/id = [^)]+/, "");
  if (formattedPath.startsWith(".")) {
    return formattedPath.slice(1);
  }
  return formattedPath;
}
__name(formatPath, "formatPath");
var ValidationError = class extends Error {
  /**
   * Creates a new ValidationError with contextual information about where the error occurred.
   *
   * rawMessage - The raw error message without path information
   * path - Array indicating the location in the data structure where validation failed
   */
  constructor(rawMessage, path = []) {
    const formattedPath = formatPath(path);
    const indentedMessage = rawMessage.split("\n").map((line, i) => i === 0 ? line : `  ${line}`).join("\n");
    super(path ? `At ${formattedPath}: ${indentedMessage}` : indentedMessage);
    this.rawMessage = rawMessage;
    this.path = path;
  }
  name = "ValidationError";
};
__name(ValidationError, "ValidationError");
function prefixError(path, fn) {
  try {
    return fn();
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ValidationError(err.rawMessage, [path, ...err.path]);
    }
    throw new ValidationError(err.toString(), [path]);
  }
}
__name(prefixError, "prefixError");
function typeToString(value) {
  if (value === null)
    return "null";
  if (Array.isArray(value))
    return "an array";
  const type = typeof value;
  switch (type) {
    case "bigint":
    case "boolean":
    case "function":
    case "number":
    case "string":
    case "symbol":
      return `a ${type}`;
    case "object":
      return `an ${type}`;
    case "undefined":
      return "undefined";
    default:
      exhaustiveSwitchError(type);
  }
}
__name(typeToString, "typeToString");
var Validator = class {
  /**
   * Creates a new Validator instance.
   *
   * validationFn - Function that validates and returns a value of type T
   * validateUsingKnownGoodVersionFn - Optional performance-optimized validation function
   * skipSameValueCheck - Internal flag to skip dev check for validators that transform values
   */
  constructor(validationFn, validateUsingKnownGoodVersionFn, skipSameValueCheck = false) {
    this.validationFn = validationFn;
    this.validateUsingKnownGoodVersionFn = validateUsingKnownGoodVersionFn;
    this.skipSameValueCheck = skipSameValueCheck;
  }
  /**
   * Validates an unknown value and returns it with the correct type. The returned value is
   * guaranteed to be referentially equal to the passed value.
   *
   * @param value - The unknown value to validate
   * @returns The validated value with type T
   * @throws ValidationError When validation fails
   * @example
   * ```ts
   * import { T } from '@tldraw/validate'
   *
   * const name = T.string.validate("Alice") // Returns "Alice" as string
   * const title = T.string.validate("") // Returns "" (empty strings are valid)
   *
   * // These will throw ValidationError:
   * T.string.validate(123) // Expected string, got a number
   * T.string.validate(null) // Expected string, got null
   * T.string.validate(undefined) // Expected string, got undefined
   * ```
   */
  validate(value) {
    const validated = this.validationFn(value);
    if (IS_DEV && !this.skipSameValueCheck && !Object.is(value, validated)) {
      throw new ValidationError("Validator functions must return the same value they were passed");
    }
    return validated;
  }
  /**
   * Performance-optimized validation using a previously validated value. If the new value
   * is referentially equal to the known good value, returns the known good value immediately.
   *
   * @param knownGoodValue - A previously validated value
   * @param newValue - The new value to validate
   * @returns The validated value, potentially reusing the known good value
   * @throws ValidationError When validation fails
   * @example
   * ```ts
   * import { T } from '@tldraw/validate'
   *
   * const userValidator = T.object({
   *   name: T.string,
   *   settings: T.object({ theme: T.literalEnum('light', 'dark') })
   * })
   *
   * const user = userValidator.validate({ name: "Alice", settings: { theme: "light" } })
   *
   * // Later, with partially changed data:
   * const newData = { name: "Alice", settings: { theme: "dark" } }
   * const updated = userValidator.validateUsingKnownGoodVersion(user, newData)
   * // Only validates the changed 'theme' field for better performance
   * ```
   */
  validateUsingKnownGoodVersion(knownGoodValue, newValue) {
    if (Object.is(knownGoodValue, newValue)) {
      return knownGoodValue;
    }
    if (this.validateUsingKnownGoodVersionFn) {
      return this.validateUsingKnownGoodVersionFn(knownGoodValue, newValue);
    }
    return this.validate(newValue);
  }
  /**
   * Type guard that checks if a value is valid without throwing an error.
   *
   * @param value - The value to check
   * @returns True if the value is valid, false otherwise
   * @example
   * ```ts
   * import { T } from '@tldraw/validate'
   *
   * function processUserInput(input: unknown) {
   *   if (T.string.isValid(input)) {
   *     // input is now typed as string within this block
   *     return input.toUpperCase()
   *   }
   *   if (T.number.isValid(input)) {
   *     // input is now typed as number within this block
   *     return input.toFixed(2)
   *   }
   *   throw new Error('Expected string or number')
   * }
   * ```
   */
  isValid(value) {
    try {
      this.validate(value);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Returns a new validator that also accepts null values.
   *
   * @returns A new validator that accepts T or null
   * @example
   * ```ts
   * import { T } from '@tldraw/validate'
   *
   * const assetValidator = T.object({
   *   id: T.string,
   *   name: T.string,
   *   src: T.srcUrl.nullable(), // Can be null if not loaded yet
   *   mimeType: T.string.nullable()
   * })
   *
   * const asset = assetValidator.validate({
   *   id: "image-123",
   *   name: "photo.jpg",
   *   src: null, // Valid - asset not loaded yet
   *   mimeType: "image/jpeg"
   * })
   * ```
   */
  nullable() {
    return nullable(this);
  }
  /**
   * Returns a new validator that also accepts undefined values.
   *
   * @returns A new validator that accepts T or undefined
   * @example
   * ```ts
   * import { T } from '@tldraw/validate'
   *
   * const shapeConfigValidator = T.object({
   *   type: T.literal('rectangle'),
   *   x: T.number,
   *   y: T.number,
   *   label: T.string.optional(), // Optional property
   *   metadata: T.object({ created: T.string }).optional()
   * })
   *
   * // Both of these are valid:
   * const shape1 = shapeConfigValidator.validate({ type: 'rectangle', x: 0, y: 0 })
   * const shape2 = shapeConfigValidator.validate({
   *   type: 'rectangle', x: 0, y: 0, label: "My Shape"
   * })
   * ```
   */
  optional() {
    return optional(this);
  }
  /**
   * Creates a new validator by refining this validator with additional logic that can transform
   * the validated value to a new type.
   *
   * @param otherValidationFn - Function that transforms/validates the value to type U
   * @returns A new validator that validates to type U
   * @throws ValidationError When validation or refinement fails
   * @example
   * ```ts
   * import { T, ValidationError } from '@tldraw/validate'
   *
   * // Transform string to ensure it starts with a prefix
   * const prefixedIdValidator = T.string.refine((id) => {
   *   return id.startsWith('shape:') ? id : `shape:${id}`
   * })
   *
   * const id1 = prefixedIdValidator.validate("rectangle-123") // Returns "shape:rectangle-123"
   * const id2 = prefixedIdValidator.validate("shape:circle-456") // Returns "shape:circle-456"
   *
   * // Parse and validate JSON strings
   * const jsonValidator = T.string.refine((str) => {
   *   try {
   *     return JSON.parse(str)
   *   } catch {
   *     throw new ValidationError('Invalid JSON string')
   *   }
   * })
   * ```
   */
  refine(otherValidationFn) {
    return new Validator(
      (value) => {
        return otherValidationFn(this.validate(value));
      },
      (knownGoodValue, newValue) => {
        const validated = this.validateUsingKnownGoodVersion(knownGoodValue, newValue);
        if (Object.is(knownGoodValue, validated)) {
          return knownGoodValue;
        }
        return otherValidationFn(validated);
      },
      true
      // skipSameValueCheck: refine is designed to transform values
    );
  }
  check(nameOrCheckFn, checkFn) {
    if (typeof nameOrCheckFn === "string") {
      return this.refine((value) => {
        prefixError(`(check ${nameOrCheckFn})`, () => checkFn(value));
        return value;
      });
    } else {
      return this.refine((value) => {
        nameOrCheckFn(value);
        return value;
      });
    }
  }
};
__name(Validator, "Validator");
var ArrayOfValidator = class extends Validator {
  /**
   * Creates a new ArrayOfValidator.
   *
   * itemValidator - Validator used to validate each array element
   */
  constructor(itemValidator) {
    super(
      (value) => {
        const arr = array.validate(value);
        for (let i = 0; i < arr.length; i++) {
          if (IS_DEV) {
            prefixError(i, () => itemValidator.validate(arr[i]));
          } else {
            try {
              itemValidator.validate(arr[i]);
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [i, ...err.path]);
              }
              throw new ValidationError(err.toString(), [i]);
            }
          }
        }
        return arr;
      },
      (knownGoodValue, newValue) => {
        if (Object.is(knownGoodValue, newValue)) {
          return knownGoodValue;
        }
        if (!itemValidator.validateUsingKnownGoodVersion)
          return this.validate(newValue);
        const arr = array.validate(newValue);
        let isDifferent = knownGoodValue.length !== arr.length;
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (i >= knownGoodValue.length) {
            isDifferent = true;
            if (IS_DEV) {
              prefixError(i, () => itemValidator.validate(item));
            } else {
              try {
                itemValidator.validate(item);
              } catch (err) {
                if (err instanceof ValidationError) {
                  throw new ValidationError(err.rawMessage, [i, ...err.path]);
                }
                throw new ValidationError(err.toString(), [i]);
              }
            }
            continue;
          }
          if (Object.is(knownGoodValue[i], item)) {
            continue;
          }
          if (IS_DEV) {
            const checkedItem = prefixError(
              i,
              () => itemValidator.validateUsingKnownGoodVersion(knownGoodValue[i], item)
            );
            if (!Object.is(checkedItem, knownGoodValue[i])) {
              isDifferent = true;
            }
          } else {
            try {
              const checkedItem = itemValidator.validateUsingKnownGoodVersion(
                knownGoodValue[i],
                item
              );
              if (!Object.is(checkedItem, knownGoodValue[i])) {
                isDifferent = true;
              }
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [i, ...err.path]);
              }
              throw new ValidationError(err.toString(), [i]);
            }
          }
        }
        return isDifferent ? newValue : knownGoodValue;
      }
    );
    this.itemValidator = itemValidator;
  }
  /**
   * Returns a new validator that ensures the array is not empty.
   *
   * @returns A new validator that rejects empty arrays
   * @throws ValidationError When the array is empty
   * @example
   * ```ts
   * const nonEmptyStrings = T.arrayOf(T.string).nonEmpty()
   * nonEmptyStrings.validate(["hello"]) // Valid
   * nonEmptyStrings.validate([]) // Throws ValidationError
   * ```
   */
  nonEmpty() {
    return this.check((value) => {
      if (value.length === 0) {
        throw new ValidationError("Expected a non-empty array");
      }
    });
  }
  /**
   * Returns a new validator that ensures the array has more than one element.
   *
   * @returns A new validator that requires at least 2 elements
   * @throws ValidationError When the array has 1 or fewer elements
   * @example
   * ```ts
   * const multipleItems = T.arrayOf(T.string).lengthGreaterThan1()
   * multipleItems.validate(["a", "b"]) // Valid
   * multipleItems.validate(["a"]) // Throws ValidationError
   * ```
   */
  lengthGreaterThan1() {
    return this.check((value) => {
      if (value.length <= 1) {
        throw new ValidationError("Expected an array with length greater than 1");
      }
    });
  }
};
__name(ArrayOfValidator, "ArrayOfValidator");
var ObjectValidator = class extends Validator {
  /**
   * Creates a new ObjectValidator.
   *
   * config - Object mapping property names to their validators
   * shouldAllowUnknownProperties - Whether to allow properties not defined in config
   */
  constructor(config2, shouldAllowUnknownProperties = false) {
    super(
      (object2) => {
        if (typeof object2 !== "object" || object2 === null) {
          throw new ValidationError(`Expected object, got ${typeToString(object2)}`);
        }
        for (const key in config2) {
          if (!hasOwnProperty(config2, key))
            continue;
          const validator = config2[key];
          if (IS_DEV) {
            prefixError(key, () => {
              ;
              validator.validate(getOwnProperty(object2, key));
            });
          } else {
            try {
              ;
              validator.validate(getOwnProperty(object2, key));
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [key, ...err.path]);
              }
              throw new ValidationError(err.toString(), [key]);
            }
          }
        }
        if (!shouldAllowUnknownProperties) {
          for (const key of Object.keys(object2)) {
            if (!hasOwnProperty(config2, key)) {
              throw new ValidationError(`Unexpected property`, [key]);
            }
          }
        }
        return object2;
      },
      (knownGoodValue, newValue) => {
        if (Object.is(knownGoodValue, newValue)) {
          return knownGoodValue;
        }
        if (typeof newValue !== "object" || newValue === null) {
          throw new ValidationError(`Expected object, got ${typeToString(newValue)}`);
        }
        let isDifferent = false;
        for (const key in config2) {
          if (!hasOwnProperty(config2, key))
            continue;
          const validator = config2[key];
          const prev = getOwnProperty(knownGoodValue, key);
          const next = getOwnProperty(newValue, key);
          if (Object.is(prev, next)) {
            continue;
          }
          if (IS_DEV) {
            const checked = prefixError(key, () => {
              const validatable = validator;
              if (validatable.validateUsingKnownGoodVersion) {
                return validatable.validateUsingKnownGoodVersion(prev, next);
              } else {
                return validatable.validate(next);
              }
            });
            if (!Object.is(checked, prev)) {
              isDifferent = true;
            }
          } else {
            try {
              const validatable = validator;
              const checked = validatable.validateUsingKnownGoodVersion ? validatable.validateUsingKnownGoodVersion(prev, next) : validatable.validate(next);
              if (!Object.is(checked, prev)) {
                isDifferent = true;
              }
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [key, ...err.path]);
              }
              throw new ValidationError(err.toString(), [key]);
            }
          }
        }
        if (!shouldAllowUnknownProperties) {
          for (const key of Object.keys(newValue)) {
            if (!hasOwnProperty(config2, key)) {
              throw new ValidationError(`Unexpected property`, [key]);
            }
          }
        }
        for (const key of Object.keys(knownGoodValue)) {
          if (!hasOwnProperty(newValue, key)) {
            isDifferent = true;
            break;
          }
        }
        return isDifferent ? newValue : knownGoodValue;
      }
    );
    this.config = config2;
    this.shouldAllowUnknownProperties = shouldAllowUnknownProperties;
  }
  /**
   * Returns a new validator that allows unknown properties in the validated object.
   *
   * @returns A new ObjectValidator that accepts extra properties
   * @example
   * ```ts
   * const flexibleUser = T.object({ name: T.string }).allowUnknownProperties()
   * flexibleUser.validate({ name: "Alice", extra: "allowed" }) // Valid
   * ```
   */
  allowUnknownProperties() {
    return new ObjectValidator(this.config, true);
  }
  /**
   * Creates a new ObjectValidator by extending this validator with additional properties.
   *
   * @param extension - Object mapping new property names to their validators
   * @returns A new ObjectValidator that validates both original and extended properties
   * @example
   * ```ts
   * const baseUser = T.object({ name: T.string, age: T.number })
   * const adminUser = baseUser.extend({
   *   permissions: T.arrayOf(T.string),
   *   isAdmin: T.boolean
   * })
   * // adminUser validates: { name: string; age: number; permissions: string[]; isAdmin: boolean }
   * ```
   */
  extend(extension) {
    return new ObjectValidator({ ...this.config, ...extension });
  }
};
__name(ObjectValidator, "ObjectValidator");
var UnionValidator = class extends Validator {
  /**
   * Creates a new UnionValidator.
   *
   * key - The discriminator property name used to determine the variant
   * config - Object mapping variant names to their validators
   * unknownValueValidation - Function to handle unknown variants
   * useNumberKeys - Whether the discriminator uses number keys instead of strings
   */
  constructor(key, config2, unknownValueValidation, useNumberKeys) {
    super(
      (input) => {
        this.expectObject(input);
        const { matchingSchema, variant } = this.getMatchingSchemaAndVariant(input);
        if (matchingSchema === void 0) {
          return this.unknownValueValidation(input, variant);
        }
        return prefixError(`(${key} = ${variant})`, () => matchingSchema.validate(input));
      },
      (prevValue, newValue) => {
        this.expectObject(newValue);
        this.expectObject(prevValue);
        const { matchingSchema, variant } = this.getMatchingSchemaAndVariant(newValue);
        if (matchingSchema === void 0) {
          return this.unknownValueValidation(newValue, variant);
        }
        if (getOwnProperty(prevValue, key) !== getOwnProperty(newValue, key)) {
          return prefixError(`(${key} = ${variant})`, () => matchingSchema.validate(newValue));
        }
        return prefixError(`(${key} = ${variant})`, () => {
          if (matchingSchema.validateUsingKnownGoodVersion) {
            return matchingSchema.validateUsingKnownGoodVersion(prevValue, newValue);
          } else {
            return matchingSchema.validate(newValue);
          }
        });
      }
    );
    this.key = key;
    this.config = config2;
    this.unknownValueValidation = unknownValueValidation;
    this.useNumberKeys = useNumberKeys;
  }
  expectObject(value) {
    if (typeof value !== "object" || value === null) {
      throw new ValidationError(`Expected an object, got ${typeToString(value)}`, []);
    }
  }
  getMatchingSchemaAndVariant(object2) {
    const variant = getOwnProperty(object2, this.key);
    if (!this.useNumberKeys && typeof variant !== "string") {
      throw new ValidationError(
        `Expected a string for key "${this.key}", got ${typeToString(variant)}`
      );
    } else if (this.useNumberKeys) {
      const numVariant = Number(variant);
      if (numVariant - numVariant !== 0) {
        throw new ValidationError(
          `Expected a number for key "${this.key}", got "${variant}"`
        );
      }
    }
    const matchingSchema = hasOwnProperty(this.config, variant) ? this.config[variant] : void 0;
    return { matchingSchema, variant };
  }
  /**
   * Returns a new UnionValidator that can handle unknown variants using the provided function.
   *
   * @param unknownValueValidation - Function to validate/transform unknown variants
   * @returns A new UnionValidator that accepts unknown variants
   * @example
   * ```ts
   * const shapeValidator = T.union('type', { circle: circleValidator })
   *   .validateUnknownVariants((obj, variant) => {
   *     console.warn(`Unknown shape type: ${variant}`)
   *     return obj as UnknownShape
   *   })
   * ```
   */
  validateUnknownVariants(unknownValueValidation) {
    return new UnionValidator(this.key, this.config, unknownValueValidation, this.useNumberKeys);
  }
};
__name(UnionValidator, "UnionValidator");
var DictValidator = class extends Validator {
  /**
   * Creates a new DictValidator.
   *
   * keyValidator - Validator for object keys
   * valueValidator - Validator for object values
   */
  constructor(keyValidator, valueValidator) {
    super(
      (object2) => {
        if (typeof object2 !== "object" || object2 === null) {
          throw new ValidationError(`Expected object, got ${typeToString(object2)}`);
        }
        for (const key in object2) {
          if (!hasOwnProperty(object2, key))
            continue;
          if (IS_DEV) {
            prefixError(key, () => {
              keyValidator.validate(key);
              valueValidator.validate(object2[key]);
            });
          } else {
            try {
              keyValidator.validate(key);
              valueValidator.validate(object2[key]);
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [key, ...err.path]);
              }
              throw new ValidationError(err.toString(), [key]);
            }
          }
        }
        return object2;
      },
      (knownGoodValue, newValue) => {
        if (typeof newValue !== "object" || newValue === null) {
          throw new ValidationError(`Expected object, got ${typeToString(newValue)}`);
        }
        const newObj = newValue;
        let isDifferent = false;
        let newKeyCount = 0;
        for (const key in newObj) {
          if (!hasOwnProperty(newObj, key))
            continue;
          newKeyCount++;
          const next = newObj[key];
          if (!hasOwnProperty(knownGoodValue, key)) {
            isDifferent = true;
            if (IS_DEV) {
              prefixError(key, () => {
                keyValidator.validate(key);
                valueValidator.validate(next);
              });
            } else {
              try {
                keyValidator.validate(key);
                valueValidator.validate(next);
              } catch (err) {
                if (err instanceof ValidationError) {
                  throw new ValidationError(err.rawMessage, [key, ...err.path]);
                }
                throw new ValidationError(err.toString(), [key]);
              }
            }
            continue;
          }
          const prev = knownGoodValue[key];
          if (Object.is(prev, next)) {
            continue;
          }
          if (IS_DEV) {
            const checked = prefixError(key, () => {
              if (valueValidator.validateUsingKnownGoodVersion) {
                return valueValidator.validateUsingKnownGoodVersion(prev, next);
              } else {
                return valueValidator.validate(next);
              }
            });
            if (!Object.is(checked, prev)) {
              isDifferent = true;
            }
          } else {
            try {
              const checked = valueValidator.validateUsingKnownGoodVersion ? valueValidator.validateUsingKnownGoodVersion(prev, next) : valueValidator.validate(next);
              if (!Object.is(checked, prev)) {
                isDifferent = true;
              }
            } catch (err) {
              if (err instanceof ValidationError) {
                throw new ValidationError(err.rawMessage, [key, ...err.path]);
              }
              throw new ValidationError(err.toString(), [key]);
            }
          }
        }
        if (!isDifferent) {
          let oldKeyCount = 0;
          for (const key in knownGoodValue) {
            if (hasOwnProperty(knownGoodValue, key)) {
              oldKeyCount++;
            }
          }
          if (oldKeyCount !== newKeyCount) {
            isDifferent = true;
          }
        }
        return isDifferent ? newValue : knownGoodValue;
      }
    );
    this.keyValidator = keyValidator;
    this.valueValidator = valueValidator;
  }
};
__name(DictValidator, "DictValidator");
function typeofValidator(type) {
  return new Validator((value) => {
    if (typeof value !== type) {
      throw new ValidationError(`Expected ${type}, got ${typeToString(value)}`);
    }
    return value;
  });
}
__name(typeofValidator, "typeofValidator");
var unknown = new Validator((value) => value);
var any = new Validator((value) => value);
var string = typeofValidator("string");
var number = new Validator((value) => {
  if (Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  throw new ValidationError(`Expected a finite number, got ${value}`);
});
var positiveNumber = new Validator((value) => {
  if (Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value < 0) {
    throw new ValidationError(`Expected a positive number, got ${value}`);
  }
  throw new ValidationError(`Expected a finite number, got ${value}`);
});
var nonZeroNumber = new Validator((value) => {
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value <= 0) {
    throw new ValidationError(`Expected a non-zero positive number, got ${value}`);
  }
  throw new ValidationError(`Expected a finite number, got ${value}`);
});
var nonZeroFiniteNumber = new Validator((value) => {
  if (Number.isFinite(value) && value !== 0) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value === 0) {
    throw new ValidationError(`Expected a non-zero number, got 0`);
  }
  throw new ValidationError(`Expected a finite number, got ${value}`);
});
var unitInterval = new Validator((value) => {
  if (Number.isFinite(value) && value >= 0 && value <= 1) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  throw new ValidationError(`Expected a number between 0 and 1, got ${value}`);
});
var integer = new Validator((value) => {
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value - value !== 0) {
    throw new ValidationError(`Expected a finite number, got ${value}`);
  }
  throw new ValidationError(`Expected an integer, got ${value}`);
});
var positiveInteger = new Validator((value) => {
  if (Number.isInteger(value) && value >= 0) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value - value !== 0) {
    throw new ValidationError(`Expected a finite number, got ${value}`);
  }
  if (value < 0) {
    throw new ValidationError(`Expected a positive integer, got ${value}`);
  }
  throw new ValidationError(`Expected an integer, got ${value}`);
});
var nonZeroInteger = new Validator((value) => {
  if (Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value !== "number") {
    throw new ValidationError(`Expected number, got ${typeToString(value)}`);
  }
  if (value !== value) {
    throw new ValidationError("Expected a number, got NaN");
  }
  if (value - value !== 0) {
    throw new ValidationError(`Expected a finite number, got ${value}`);
  }
  if (value <= 0) {
    throw new ValidationError(`Expected a non-zero positive integer, got ${value}`);
  }
  throw new ValidationError(`Expected an integer, got ${value}`);
});
var boolean = typeofValidator("boolean");
var bigint2 = typeofValidator("bigint");
function literal(expectedValue) {
  return new Validator((actualValue) => {
    if (actualValue !== expectedValue) {
      throw new ValidationError(`Expected ${expectedValue}, got ${JSON.stringify(actualValue)}`);
    }
    return expectedValue;
  });
}
__name(literal, "literal");
var array = new Validator((value) => {
  if (!Array.isArray(value)) {
    throw new ValidationError(`Expected an array, got ${typeToString(value)}`);
  }
  return value;
});
function arrayOf(itemValidator) {
  return new ArrayOfValidator(itemValidator);
}
__name(arrayOf, "arrayOf");
var unknownObject = new Validator((value) => {
  if (typeof value !== "object" || value === null) {
    throw new ValidationError(`Expected object, got ${typeToString(value)}`);
  }
  return value;
});
function object(config2) {
  return new ObjectValidator(config2);
}
__name(object, "object");
function isPlainObject(value) {
  return typeof value === "object" && value !== null && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === STRUCTURED_CLONE_OBJECT_PROTOTYPE);
}
__name(isPlainObject, "isPlainObject");
function isValidJson(value) {
  if (value === null || typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isValidJson);
  }
  if (isPlainObject(value)) {
    return Object.values(value).every(isValidJson);
  }
  return false;
}
__name(isValidJson, "isValidJson");
var jsonValue = new Validator(
  (value) => {
    if (isValidJson(value)) {
      return value;
    }
    throw new ValidationError(`Expected json serializable value, got ${typeof value}`);
  },
  (knownGoodValue, newValue) => {
    if (Array.isArray(knownGoodValue) && Array.isArray(newValue)) {
      let isDifferent = knownGoodValue.length !== newValue.length;
      for (let i = 0; i < newValue.length; i++) {
        if (i >= knownGoodValue.length) {
          isDifferent = true;
          jsonValue.validate(newValue[i]);
          continue;
        }
        const prev = knownGoodValue[i];
        const next = newValue[i];
        if (Object.is(prev, next)) {
          continue;
        }
        const checked = jsonValue.validateUsingKnownGoodVersion(prev, next);
        if (!Object.is(checked, prev)) {
          isDifferent = true;
        }
      }
      return isDifferent ? newValue : knownGoodValue;
    } else if (isPlainObject(knownGoodValue) && isPlainObject(newValue)) {
      let isDifferent = false;
      for (const key of Object.keys(newValue)) {
        if (!hasOwnProperty(knownGoodValue, key)) {
          isDifferent = true;
          jsonValue.validate(newValue[key]);
          continue;
        }
        const prev = knownGoodValue[key];
        const next = newValue[key];
        if (Object.is(prev, next)) {
          continue;
        }
        const checked = jsonValue.validateUsingKnownGoodVersion(prev, next);
        if (!Object.is(checked, prev)) {
          isDifferent = true;
        }
      }
      for (const key of Object.keys(knownGoodValue)) {
        if (!hasOwnProperty(newValue, key)) {
          isDifferent = true;
          break;
        }
      }
      return isDifferent ? newValue : knownGoodValue;
    } else {
      return jsonValue.validate(newValue);
    }
  }
);
function jsonDict() {
  return dict(string, jsonValue);
}
__name(jsonDict, "jsonDict");
function dict(keyValidator, valueValidator) {
  return new DictValidator(keyValidator, valueValidator);
}
__name(dict, "dict");
function union(key, config2) {
  return new UnionValidator(
    key,
    config2,
    (_unknownValue, unknownVariant) => {
      throw new ValidationError(
        `Expected one of ${Object.keys(config2).map((key2) => JSON.stringify(key2)).join(" or ")}, got ${JSON.stringify(unknownVariant)}`,
        [key]
      );
    },
    false
  );
}
__name(union, "union");
function numberUnion(key, config2) {
  return new UnionValidator(
    key,
    config2,
    (unknownValue, unknownVariant) => {
      throw new ValidationError(
        `Expected one of ${Object.keys(config2).map((key2) => JSON.stringify(key2)).join(" or ")}, got ${JSON.stringify(unknownVariant)}`,
        [key]
      );
    },
    true
  );
}
__name(numberUnion, "numberUnion");
function model(name, validator) {
  return new Validator(
    (value) => {
      return prefixError(name, () => validator.validate(value));
    },
    (prevValue, newValue) => {
      return prefixError(name, () => {
        if (validator.validateUsingKnownGoodVersion) {
          return validator.validateUsingKnownGoodVersion(prevValue, newValue);
        } else {
          return validator.validate(newValue);
        }
      });
    }
  );
}
__name(model, "model");
function setEnum(values) {
  return new Validator((value) => {
    if (!values.has(value)) {
      const valuesString = Array.from(values, (value2) => JSON.stringify(value2)).join(" or ");
      throw new ValidationError(`Expected ${valuesString}, got ${value}`);
    }
    return value;
  });
}
__name(setEnum, "setEnum");
function optional(validator) {
  return new Validator(
    (value) => {
      if (value === void 0)
        return void 0;
      return validator.validate(value);
    },
    (knownGoodValue, newValue) => {
      if (newValue === void 0)
        return void 0;
      if (validator.validateUsingKnownGoodVersion && knownGoodValue !== void 0) {
        return validator.validateUsingKnownGoodVersion(knownGoodValue, newValue);
      }
      return validator.validate(newValue);
    },
    // Propagate skipSameValueCheck from inner validator to allow refine wrappers
    validator instanceof Validator && validator.skipSameValueCheck
  );
}
__name(optional, "optional");
function nullable(validator) {
  return new Validator(
    (value) => {
      if (value === null)
        return null;
      return validator.validate(value);
    },
    (knownGoodValue, newValue) => {
      if (newValue === null)
        return null;
      if (validator.validateUsingKnownGoodVersion && knownGoodValue !== null) {
        return validator.validateUsingKnownGoodVersion(knownGoodValue, newValue);
      }
      return validator.validate(newValue);
    },
    // Propagate skipSameValueCheck from inner validator to allow refine wrappers
    validator instanceof Validator && validator.skipSameValueCheck
  );
}
__name(nullable, "nullable");
function literalEnum(...values) {
  return setEnum(new Set(values));
}
__name(literalEnum, "literalEnum");
function parseUrl(str) {
  try {
    return new URL(str);
  } catch {
    if (str.startsWith("/") || str.startsWith("./")) {
      try {
        return new URL(str, "http://example.com");
      } catch {
        throw new ValidationError(`Expected a valid url, got ${JSON.stringify(str)}`);
      }
    }
    throw new ValidationError(`Expected a valid url, got ${JSON.stringify(str)}`);
  }
}
__name(parseUrl, "parseUrl");
var validLinkProtocols = /* @__PURE__ */ new Set(["http:", "https:", "mailto:"]);
var linkUrl = string.check((value) => {
  if (value === "")
    return;
  const url = parseUrl(value);
  if (!validLinkProtocols.has(url.protocol.toLowerCase())) {
    throw new ValidationError(
      `Expected a valid url, got ${JSON.stringify(value)} (invalid protocol)`
    );
  }
});
var validSrcProtocols = /* @__PURE__ */ new Set(["http:", "https:", "data:", "asset:"]);
var srcUrl = string.check((value) => {
  if (value === "")
    return;
  const url = parseUrl(value);
  if (!validSrcProtocols.has(url.protocol.toLowerCase())) {
    throw new ValidationError(
      `Expected a valid url, got ${JSON.stringify(value)} (invalid protocol)`
    );
  }
});
var httpUrl = string.check((value) => {
  if (value === "")
    return;
  const url = parseUrl(value);
  if (!url.protocol.toLowerCase().match(/^https?:$/)) {
    throw new ValidationError(
      `Expected a valid url, got ${JSON.stringify(value)} (invalid protocol)`
    );
  }
});
var indexKey = string.refine((key) => {
  try {
    validateIndexKey(key);
    return key;
  } catch {
    throw new ValidationError(`Expected an index key, got ${JSON.stringify(key)}`);
  }
});
function or(v1, v2) {
  return new Validator((value) => {
    try {
      return v1.validate(value);
    } catch {
      return v2.validate(value);
    }
  });
}
__name(or, "or");

// ../../node_modules/@tldraw/validate/dist-esm/index.mjs
registerTldrawLibraryVersion(
  "@tldraw/validate",
  "4.5.12",
  "esm"
);

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/id-validator.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function idValidator(prefix) {
  return validation_exports.string.refine((id) => {
    if (!id.startsWith(`${prefix}:`)) {
      throw new Error(`${prefix} ID must start with "${prefix}:"`);
    }
    return id;
  });
}
__name(idValidator, "idValidator");

// ../../node_modules/@tldraw/tlschema/dist-esm/assets/TLBaseAsset.mjs
var assetIdValidator = idValidator("asset");
function createAssetValidator(type, props) {
  return validation_exports.object({
    id: assetIdValidator,
    typeName: validation_exports.literal("asset"),
    type: validation_exports.literal(type),
    props,
    meta: validation_exports.jsonValue
  });
}
__name(createAssetValidator, "createAssetValidator");

// ../../node_modules/@tldraw/tlschema/dist-esm/bindings/TLArrowBinding.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/geometry-types.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var vecModelValidator = validation_exports.object({
  x: validation_exports.number,
  y: validation_exports.number,
  z: validation_exports.number.optional()
});
var boxModelValidator = validation_exports.object({
  x: validation_exports.number,
  y: validation_exports.number,
  w: validation_exports.number,
  h: validation_exports.number
});

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLBinding.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/bindings/TLBaseBinding.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLBaseShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLOpacity.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var opacityValidator = validation_exports.unitInterval;

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLBaseShape.mjs
var parentIdValidator = validation_exports.string.refine((id) => {
  if (!id.startsWith("page:") && !id.startsWith("shape:")) {
    throw new Error('Parent ID must start with "page:" or "shape:"');
  }
  return id;
});
var shapeIdValidator = idValidator("shape");
function createShapeValidator(type, props, meta) {
  return validation_exports.object({
    id: shapeIdValidator,
    typeName: validation_exports.literal("shape"),
    x: validation_exports.number,
    y: validation_exports.number,
    rotation: validation_exports.number,
    index: validation_exports.indexKey,
    parentId: parentIdValidator,
    type: validation_exports.literal(type),
    isLocked: validation_exports.boolean,
    opacity: opacityValidator,
    props: props ? validation_exports.object(props) : validation_exports.jsonValue,
    meta: meta ? validation_exports.object(meta) : validation_exports.jsonValue
  });
}
__name(createShapeValidator, "createShapeValidator");

// ../../node_modules/@tldraw/tlschema/dist-esm/bindings/TLBaseBinding.mjs
var bindingIdValidator = idValidator("binding");
function createBindingValidator(type, props, meta) {
  return validation_exports.object({
    id: bindingIdValidator,
    typeName: validation_exports.literal("binding"),
    type: validation_exports.literal(type),
    fromId: shapeIdValidator,
    toId: shapeIdValidator,
    props: props ? validation_exports.object(props) : validation_exports.jsonValue,
    meta: meta ? validation_exports.object(meta) : validation_exports.jsonValue
  });
}
__name(createBindingValidator, "createBindingValidator");

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLBinding.mjs
var rootBindingVersions = createMigrationIds("com.tldraw.binding", {});
var rootBindingMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.binding",
  recordType: "binding",
  sequence: []
});
function createBindingId(id) {
  return `binding:${id ?? uniqueId()}`;
}
__name(createBindingId, "createBindingId");
function createBindingPropsMigrationSequence(migrations) {
  return migrations;
}
__name(createBindingPropsMigrationSequence, "createBindingPropsMigrationSequence");
function createBindingPropsMigrationIds(bindingType, ids) {
  return mapObjectMapValues(ids, (_k, v) => `com.tldraw.binding.${bindingType}/${v}`);
}
__name(createBindingPropsMigrationIds, "createBindingPropsMigrationIds");
function createBindingRecordType(bindings) {
  return createRecordType("binding", {
    scope: "document",
    validator: validation_exports.model(
      "binding",
      validation_exports.union(
        "type",
        mapObjectMapValues(
          bindings,
          (type, { props, meta }) => createBindingValidator(type, props, meta)
        )
      )
    )
  }).withDefaultProperties(() => ({
    meta: {}
  }));
}
__name(createBindingRecordType, "createBindingRecordType");

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLArrowShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLRichText.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var richTextValidator = validation_exports.object({
  type: validation_exports.string,
  content: validation_exports.arrayOf(validation_exports.unknown),
  attrs: validation_exports.any.optional()
});
function toRichText(text) {
  const lines = text.split("\n");
  const content = lines.map((text2) => {
    if (!text2) {
      return {
        type: "paragraph"
      };
    }
    return {
      type: "paragraph",
      content: [{ type: "text", text: text2 }]
    };
  });
  return {
    type: "doc",
    content
  };
}
__name(toRichText, "toRichText");

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/StyleProp.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var StyleProp = class {
  /** @internal */
  constructor(id, defaultValue, type) {
    this.id = id;
    this.defaultValue = defaultValue;
    this.type = type;
  }
  /**
   * Define a new {@link StyleProp}.
   *
   * @param uniqueId - Each StyleProp must have a unique ID. We recommend you prefix this with
   * your app/library name.
   * @param options -
   * - `defaultValue`: The default value for this style prop.
   *
   * - `type`: Optionally, describe what type of data you expect for this style prop.
   *
   * @example
   * ```ts
   * import {T} from '@tldraw/validate'
   * import {StyleProp} from '@tldraw/tlschema'
   *
   * const MyLineWidthProp = StyleProp.define('myApp:lineWidth', {
   *   defaultValue: 1,
   *   type: T.number,
   * })
   * ```
   * @public
   */
  static define(uniqueId2, options) {
    const { defaultValue, type = validation_exports.any } = options;
    return new StyleProp(uniqueId2, defaultValue, type);
  }
  /**
   * Define a new {@link StyleProp} as a list of possible values.
   *
   * @param uniqueId - Each StyleProp must have a unique ID. We recommend you prefix this with
   * your app/library name.
   * @param options -
   * - `defaultValue`: The default value for this style prop.
   *
   * - `values`: An array of possible values of this style prop.
   *
   * @example
   * ```ts
   * import {StyleProp} from '@tldraw/tlschema'
   *
   * const MySizeProp = StyleProp.defineEnum('myApp:size', {
   *   defaultValue: 'medium',
   *   values: ['small', 'medium', 'large'],
   * })
   * ```
   */
  static defineEnum(uniqueId2, options) {
    const { defaultValue, values } = options;
    return new EnumStyleProp(uniqueId2, defaultValue, values);
  }
  setDefaultValue(value) {
    this.defaultValue = value;
  }
  validate(value) {
    return this.type.validate(value);
  }
  validateUsingKnownGoodVersion(prevValue, newValue) {
    if (this.type.validateUsingKnownGoodVersion) {
      return this.type.validateUsingKnownGoodVersion(prevValue, newValue);
    } else {
      return this.validate(newValue);
    }
  }
};
__name(StyleProp, "StyleProp");
var EnumStyleProp = class extends StyleProp {
  /** @internal */
  constructor(id, defaultValue, values) {
    super(id, defaultValue, validation_exports.literalEnum(...values));
    this.values = values;
  }
};
__name(EnumStyleProp, "EnumStyleProp");

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLShape.mjs
var rootShapeVersions = createMigrationIds("com.tldraw.shape", {
  AddIsLocked: 1,
  HoistOpacity: 2,
  AddMeta: 3,
  AddWhite: 4
});
var rootShapeMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.shape",
  recordType: "shape",
  sequence: [
    {
      id: rootShapeVersions.AddIsLocked,
      up: (record) => {
        record.isLocked = false;
      },
      down: (record) => {
        delete record.isLocked;
      }
    },
    {
      id: rootShapeVersions.HoistOpacity,
      up: (record) => {
        record.opacity = Number(record.props.opacity ?? "1");
        delete record.props.opacity;
      },
      down: (record) => {
        const opacity = record.opacity;
        delete record.opacity;
        record.props.opacity = opacity < 0.175 ? "0.1" : opacity < 0.375 ? "0.25" : opacity < 0.625 ? "0.5" : opacity < 0.875 ? "0.75" : "1";
      }
    },
    {
      id: rootShapeVersions.AddMeta,
      up: (record) => {
        record.meta = {};
      }
    },
    {
      id: rootShapeVersions.AddWhite,
      up: (_record) => {
      },
      down: (record) => {
        if (record.props.color === "white") {
          record.props.color = "black";
        }
      }
    }
  ]
});
function getShapePropKeysByStyle(props) {
  const propKeysByStyle = /* @__PURE__ */ new Map();
  for (const [key, prop] of Object.entries(props)) {
    if (prop instanceof StyleProp) {
      if (propKeysByStyle.has(prop)) {
        throw new Error(
          `Duplicate style prop ${prop.id}. Each style prop can only be used once within a shape.`
        );
      }
      propKeysByStyle.set(prop, key);
    }
  }
  return propKeysByStyle;
}
__name(getShapePropKeysByStyle, "getShapePropKeysByStyle");
function createShapePropsMigrationSequence(migrations) {
  return migrations;
}
__name(createShapePropsMigrationSequence, "createShapePropsMigrationSequence");
function createShapePropsMigrationIds(shapeType, ids) {
  return mapObjectMapValues(ids, (_k, v) => `com.tldraw.shape.${shapeType}/${v}`);
}
__name(createShapePropsMigrationIds, "createShapePropsMigrationIds");
function createShapeRecordType(shapes) {
  return createRecordType("shape", {
    scope: "document",
    validator: validation_exports.model(
      "shape",
      validation_exports.union(
        "type",
        mapObjectMapValues(
          shapes,
          (type, { props, meta }) => createShapeValidator(type, props, meta)
        )
      )
    )
  }).withDefaultProperties(() => ({
    x: 0,
    y: 0,
    rotation: 0,
    isLocked: false,
    opacity: 1,
    meta: {}
  }));
}
__name(createShapeRecordType, "createShapeRecordType");

// ../../node_modules/@tldraw/tlschema/dist-esm/recordsWithProps.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function processPropsMigrations(typeName, records) {
  const result = [];
  for (const [subType, { migrations }] of Object.entries(records)) {
    const sequenceId = `com.tldraw.${typeName}.${subType}`;
    if (!migrations) {
      result.push(
        createMigrationSequence({
          sequenceId,
          retroactive: true,
          sequence: []
        })
      );
    } else if ("sequenceId" in migrations) {
      assert3(
        sequenceId === migrations.sequenceId,
        `sequenceId mismatch for ${subType} ${RecordType} migrations. Expected '${sequenceId}', got '${migrations.sequenceId}'`
      );
      result.push(migrations);
    } else if ("sequence" in migrations) {
      result.push(
        createMigrationSequence({
          sequenceId,
          retroactive: true,
          sequence: migrations.sequence.map(
            (m) => "id" in m ? createPropsMigration(typeName, subType, m) : m
          )
        })
      );
    } else {
      result.push(
        createMigrationSequence({
          sequenceId,
          retroactive: true,
          sequence: Object.keys(migrations.migrators).map((k) => Number(k)).sort((a, b) => a - b).map(
            (version2) => ({
              id: `${sequenceId}/${version2}`,
              scope: "record",
              filter: (r) => r.typeName === typeName && r.type === subType,
              up: (record) => {
                const result2 = migrations.migrators[version2].up(record);
                if (result2) {
                  return result2;
                }
              },
              down: (record) => {
                const result2 = migrations.migrators[version2].down(record);
                if (result2) {
                  return result2;
                }
              }
            })
          )
        })
      );
    }
  }
  return result;
}
__name(processPropsMigrations, "processPropsMigrations");
function createPropsMigration(typeName, subType, m) {
  return {
    id: m.id,
    dependsOn: m.dependsOn,
    scope: "record",
    filter: (r) => r.typeName === typeName && r.type === subType,
    up: (record) => {
      const result = m.up(record.props);
      if (result) {
        record.props = result;
      }
    },
    down: typeof m.down === "function" ? (record) => {
      const result = m.down(record.props);
      if (result) {
        record.props = result;
      }
    } : void 0
  };
}
__name(createPropsMigration, "createPropsMigration");

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLColorStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var defaultColorNames = [
  "black",
  "grey",
  "light-violet",
  "violet",
  "blue",
  "light-blue",
  "yellow",
  "orange",
  "green",
  "light-green",
  "light-red",
  "red",
  "white"
];
var DefaultColorStyle = StyleProp.defineEnum("tldraw:color", {
  defaultValue: "black",
  values: defaultColorNames
});
var DefaultLabelColorStyle = StyleProp.defineEnum("tldraw:labelColor", {
  defaultValue: "black",
  values: defaultColorNames
});
var defaultColorNamesSet = new Set(defaultColorNames);

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLDashStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultDashStyle = StyleProp.defineEnum("tldraw:dash", {
  defaultValue: "draw",
  values: ["draw", "solid", "dashed", "dotted"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLFillStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultFillStyle = StyleProp.defineEnum("tldraw:fill", {
  defaultValue: "none",
  values: ["none", "semi", "solid", "pattern", "fill", "lined-fill"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLFontStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultFontStyle = StyleProp.defineEnum("tldraw:font", {
  defaultValue: "draw",
  values: ["draw", "sans", "serif", "mono"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLSizeStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultSizeStyle = StyleProp.defineEnum("tldraw:size", {
  defaultValue: "m",
  values: ["s", "m", "l", "xl"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLArrowShape.mjs
var arrowKinds = ["arc", "elbow"];
var ArrowShapeKindStyle = StyleProp.defineEnum("tldraw:arrowKind", {
  defaultValue: "arc",
  values: arrowKinds
});
var arrowheadTypes = [
  "arrow",
  "triangle",
  "square",
  "dot",
  "pipe",
  "diamond",
  "inverted",
  "bar",
  "none"
];
var ArrowShapeArrowheadStartStyle = StyleProp.defineEnum("tldraw:arrowheadStart", {
  defaultValue: "none",
  values: arrowheadTypes
});
var ArrowShapeArrowheadEndStyle = StyleProp.defineEnum("tldraw:arrowheadEnd", {
  defaultValue: "arrow",
  values: arrowheadTypes
});
var arrowShapeProps = {
  kind: ArrowShapeKindStyle,
  labelColor: DefaultLabelColorStyle,
  color: DefaultColorStyle,
  fill: DefaultFillStyle,
  dash: DefaultDashStyle,
  size: DefaultSizeStyle,
  arrowheadStart: ArrowShapeArrowheadStartStyle,
  arrowheadEnd: ArrowShapeArrowheadEndStyle,
  font: DefaultFontStyle,
  start: vecModelValidator,
  end: vecModelValidator,
  bend: validation_exports.number,
  richText: richTextValidator,
  labelPosition: validation_exports.number,
  scale: validation_exports.nonZeroNumber,
  elbowMidPoint: validation_exports.number
};
var arrowShapeVersions = createShapePropsMigrationIds("arrow", {
  AddLabelColor: 1,
  AddIsPrecise: 2,
  AddLabelPosition: 3,
  ExtractBindings: 4,
  AddScale: 5,
  AddElbow: 6,
  AddRichText: 7,
  AddRichTextAttrs: 8
});
function propsMigration(migration) {
  return createPropsMigration("shape", "arrow", migration);
}
__name(propsMigration, "propsMigration");
var arrowShapeMigrations = createMigrationSequence({
  sequenceId: "com.tldraw.shape.arrow",
  retroactive: false,
  sequence: [
    propsMigration({
      id: arrowShapeVersions.AddLabelColor,
      up: (props) => {
        props.labelColor = "black";
      },
      down: "retired"
    }),
    propsMigration({
      id: arrowShapeVersions.AddIsPrecise,
      up: ({ start, end }) => {
        if (start.type === "binding") {
          start.isPrecise = !(start.normalizedAnchor.x === 0.5 && start.normalizedAnchor.y === 0.5);
        }
        if (end.type === "binding") {
          end.isPrecise = !(end.normalizedAnchor.x === 0.5 && end.normalizedAnchor.y === 0.5);
        }
      },
      down: ({ start, end }) => {
        if (start.type === "binding") {
          if (!start.isPrecise) {
            start.normalizedAnchor = { x: 0.5, y: 0.5 };
          }
          delete start.isPrecise;
        }
        if (end.type === "binding") {
          if (!end.isPrecise) {
            end.normalizedAnchor = { x: 0.5, y: 0.5 };
          }
          delete end.isPrecise;
        }
      }
    }),
    propsMigration({
      id: arrowShapeVersions.AddLabelPosition,
      up: (props) => {
        props.labelPosition = 0.5;
      },
      down: (props) => {
        delete props.labelPosition;
      }
    }),
    {
      id: arrowShapeVersions.ExtractBindings,
      scope: "storage",
      up: (storage) => {
        const updates = [];
        for (const record of storage.values()) {
          if (record.typeName !== "shape" || record.type !== "arrow")
            continue;
          const arrow = record;
          const newArrow = structuredClone(arrow);
          const { start, end } = arrow.props;
          if (start.type === "binding") {
            const id = createBindingId();
            const binding2 = {
              typeName: "binding",
              id,
              type: "arrow",
              fromId: arrow.id,
              toId: start.boundShapeId,
              meta: {},
              props: {
                terminal: "start",
                normalizedAnchor: start.normalizedAnchor,
                isExact: start.isExact,
                isPrecise: start.isPrecise
              }
            };
            updates.push([id, binding2]);
            newArrow.props.start = { x: 0, y: 0 };
          } else {
            delete newArrow.props.start.type;
          }
          if (end.type === "binding") {
            const id = createBindingId();
            const binding2 = {
              typeName: "binding",
              id,
              type: "arrow",
              fromId: arrow.id,
              toId: end.boundShapeId,
              meta: {},
              props: {
                terminal: "end",
                normalizedAnchor: end.normalizedAnchor,
                isExact: end.isExact,
                isPrecise: end.isPrecise
              }
            };
            updates.push([id, binding2]);
            newArrow.props.end = { x: 0, y: 0 };
          } else {
            delete newArrow.props.end.type;
          }
          updates.push([arrow.id, newArrow]);
        }
        for (const [id, record] of updates) {
          storage.set(id, record);
        }
      }
    },
    propsMigration({
      id: arrowShapeVersions.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    }),
    propsMigration({
      id: arrowShapeVersions.AddElbow,
      up: (props) => {
        props.kind = "arc";
        props.elbowMidPoint = 0.5;
      },
      down: (props) => {
        delete props.kind;
        delete props.elbowMidPoint;
      }
    }),
    propsMigration({
      id: arrowShapeVersions.AddRichText,
      up: (props) => {
        props.richText = toRichText(props.text);
        delete props.text;
      }
      // N.B. Explicitly no down state so that we force clients to update.
      // down: (props) => {
      // 	delete props.richText
      // },
    }),
    propsMigration({
      id: arrowShapeVersions.AddRichTextAttrs,
      up: (_props) => {
      },
      down: (props) => {
        if (props.richText && "attrs" in props.richText) {
          delete props.richText.attrs;
        }
      }
    })
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/bindings/TLArrowBinding.mjs
var ElbowArrowSnap = validation_exports.literalEnum("center", "edge-point", "edge", "none");
var arrowBindingProps = {
  terminal: validation_exports.literalEnum("start", "end"),
  normalizedAnchor: vecModelValidator,
  isExact: validation_exports.boolean,
  isPrecise: validation_exports.boolean,
  snap: ElbowArrowSnap
};
var arrowBindingVersions = createBindingPropsMigrationIds("arrow", {
  AddSnap: 1
});
var arrowBindingMigrations = createBindingPropsMigrationSequence({
  sequence: [
    { dependsOn: [arrowShapeVersions.ExtractBindings] },
    {
      id: arrowBindingVersions.AddSnap,
      up: (props) => {
        props.snap = "none";
      },
      down: (props) => {
        delete props.snap;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/createPresenceStateDerivation.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLCamera.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var cameraValidator = validation_exports.model(
  "camera",
  validation_exports.object({
    typeName: validation_exports.literal("camera"),
    id: idValidator("camera"),
    x: validation_exports.number,
    y: validation_exports.number,
    z: validation_exports.number,
    meta: validation_exports.jsonValue
  })
);
var cameraVersions = createMigrationIds("com.tldraw.camera", {
  AddMeta: 1
});
var cameraMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.camera",
  recordType: "camera",
  sequence: [
    {
      id: cameraVersions.AddMeta,
      up: (record) => {
        ;
        record.meta = {};
      }
    }
  ]
});
var CameraRecordType = createRecordType("camera", {
  validator: cameraValidator,
  scope: "session"
}).withDefaultProperties(
  () => ({
    x: 0,
    y: 0,
    z: 1,
    meta: {}
  })
);

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLInstance.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLCursor.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TL_CURSOR_TYPES = /* @__PURE__ */ new Set([
  "none",
  "default",
  "pointer",
  "cross",
  "grab",
  "rotate",
  "grabbing",
  "resize-edge",
  "resize-corner",
  "text",
  "move",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "nesw-rotate",
  "nwse-rotate",
  "swne-rotate",
  "senw-rotate",
  "zoom-in",
  "zoom-out"
]);
var cursorTypeValidator = validation_exports.setEnum(TL_CURSOR_TYPES);
var cursorValidator = validation_exports.object({
  type: cursorTypeValidator,
  rotation: validation_exports.number
});

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLScribble.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLColor.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TL_CANVAS_UI_COLOR_TYPES = /* @__PURE__ */ new Set([
  "accent",
  "white",
  "black",
  "selection-stroke",
  "selection-fill",
  "laser",
  "muted-1"
]);
var canvasUiColorTypeValidator = validation_exports.setEnum(TL_CANVAS_UI_COLOR_TYPES);

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLScribble.mjs
var TL_SCRIBBLE_STATES = /* @__PURE__ */ new Set([
  "starting",
  "paused",
  "active",
  "complete",
  "stopping"
]);
var scribbleValidator = validation_exports.object({
  id: validation_exports.string,
  points: validation_exports.arrayOf(vecModelValidator),
  size: validation_exports.positiveNumber,
  color: canvasUiColorTypeValidator,
  opacity: validation_exports.number,
  state: validation_exports.setEnum(TL_SCRIBBLE_STATES),
  delay: validation_exports.number,
  shrink: validation_exports.number,
  taper: validation_exports.boolean
});

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLPage.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var pageIdValidator = idValidator("page");
var pageValidator = validation_exports.model(
  "page",
  validation_exports.object({
    typeName: validation_exports.literal("page"),
    id: pageIdValidator,
    name: validation_exports.string,
    index: validation_exports.indexKey,
    meta: validation_exports.jsonValue
  })
);
var pageVersions = createMigrationIds("com.tldraw.page", {
  AddMeta: 1
});
var pageMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.page",
  recordType: "page",
  sequence: [
    {
      id: pageVersions.AddMeta,
      up: (record) => {
        record.meta = {};
      }
    }
  ]
});
var PageRecordType = createRecordType("page", {
  validator: pageValidator,
  scope: "document"
}).withDefaultProperties(() => ({
  meta: {}
}));

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLInstance.mjs
var instanceIdValidator = idValidator("instance");
function createInstanceRecordType(stylesById) {
  const stylesForNextShapeValidators = {};
  for (const [id, style] of stylesById) {
    stylesForNextShapeValidators[id] = validation_exports.optional(style);
  }
  const instanceTypeValidator = validation_exports.model(
    "instance",
    validation_exports.object({
      typeName: validation_exports.literal("instance"),
      id: idValidator("instance"),
      currentPageId: pageIdValidator,
      followingUserId: validation_exports.string.nullable(),
      brush: boxModelValidator.nullable(),
      opacityForNextShape: opacityValidator,
      stylesForNextShape: validation_exports.object(stylesForNextShapeValidators),
      cursor: cursorValidator,
      scribbles: validation_exports.arrayOf(scribbleValidator),
      isFocusMode: validation_exports.boolean,
      isDebugMode: validation_exports.boolean,
      isToolLocked: validation_exports.boolean,
      exportBackground: validation_exports.boolean,
      screenBounds: boxModelValidator,
      insets: validation_exports.arrayOf(validation_exports.boolean),
      zoomBrush: boxModelValidator.nullable(),
      isPenMode: validation_exports.boolean,
      isGridMode: validation_exports.boolean,
      chatMessage: validation_exports.string,
      isChatting: validation_exports.boolean,
      highlightedUserIds: validation_exports.arrayOf(validation_exports.string),
      isFocused: validation_exports.boolean,
      devicePixelRatio: validation_exports.number,
      isCoarsePointer: validation_exports.boolean,
      isHoveringCanvas: validation_exports.boolean.nullable(),
      openMenus: validation_exports.arrayOf(validation_exports.string),
      isChangingStyle: validation_exports.boolean,
      isReadonly: validation_exports.boolean,
      meta: validation_exports.jsonValue,
      duplicateProps: validation_exports.object({
        shapeIds: validation_exports.arrayOf(idValidator("shape")),
        offset: validation_exports.object({
          x: validation_exports.number,
          y: validation_exports.number
        })
      }).nullable(),
      cameraState: validation_exports.literalEnum("idle", "moving")
    })
  );
  return createRecordType("instance", {
    validator: instanceTypeValidator,
    scope: "session",
    ephemeralKeys: {
      currentPageId: false,
      meta: false,
      followingUserId: true,
      opacityForNextShape: true,
      stylesForNextShape: true,
      brush: true,
      cursor: true,
      scribbles: true,
      isFocusMode: true,
      isDebugMode: true,
      isToolLocked: true,
      exportBackground: true,
      screenBounds: true,
      insets: true,
      zoomBrush: true,
      isPenMode: true,
      isGridMode: true,
      chatMessage: true,
      isChatting: true,
      highlightedUserIds: true,
      isFocused: true,
      devicePixelRatio: true,
      isCoarsePointer: true,
      isHoveringCanvas: true,
      openMenus: true,
      isChangingStyle: true,
      isReadonly: true,
      duplicateProps: true,
      cameraState: true
    }
  }).withDefaultProperties(
    () => ({
      followingUserId: null,
      opacityForNextShape: 1,
      stylesForNextShape: {},
      brush: null,
      scribbles: [],
      cursor: {
        type: "default",
        rotation: 0
      },
      isFocusMode: false,
      exportBackground: false,
      isDebugMode: false,
      isToolLocked: false,
      screenBounds: { x: 0, y: 0, w: 1080, h: 720 },
      insets: [false, false, false, false],
      zoomBrush: null,
      isGridMode: false,
      isPenMode: false,
      chatMessage: "",
      isChatting: false,
      highlightedUserIds: [],
      isFocused: false,
      devicePixelRatio: typeof window === "undefined" ? 1 : window.devicePixelRatio,
      isCoarsePointer: false,
      isHoveringCanvas: null,
      openMenus: [],
      isChangingStyle: false,
      isReadonly: false,
      meta: {},
      duplicateProps: null,
      cameraState: "idle"
    })
  );
}
__name(createInstanceRecordType, "createInstanceRecordType");
var instanceVersions = createMigrationIds("com.tldraw.instance", {
  AddTransparentExportBgs: 1,
  RemoveDialog: 2,
  AddToolLockMode: 3,
  RemoveExtraPropsForNextShape: 4,
  AddLabelColor: 5,
  AddFollowingUserId: 6,
  RemoveAlignJustify: 7,
  AddZoom: 8,
  AddVerticalAlign: 9,
  AddScribbleDelay: 10,
  RemoveUserId: 11,
  AddIsPenModeAndIsGridMode: 12,
  HoistOpacity: 13,
  AddChat: 14,
  AddHighlightedUserIds: 15,
  ReplacePropsForNextShapeWithStylesForNextShape: 16,
  AddMeta: 17,
  RemoveCursorColor: 18,
  AddLonelyProperties: 19,
  ReadOnlyReadonly: 20,
  AddHoveringCanvas: 21,
  AddScribbles: 22,
  AddInset: 23,
  AddDuplicateProps: 24,
  RemoveCanMoveCamera: 25,
  AddCameraState: 26
});
var instanceMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.instance",
  recordType: "instance",
  sequence: [
    {
      id: instanceVersions.AddTransparentExportBgs,
      up: (instance) => {
        return { ...instance, exportBackground: true };
      }
    },
    {
      id: instanceVersions.RemoveDialog,
      up: ({ dialog: _, ...instance }) => {
        return instance;
      }
    },
    {
      id: instanceVersions.AddToolLockMode,
      up: (instance) => {
        return { ...instance, isToolLocked: false };
      }
    },
    {
      id: instanceVersions.RemoveExtraPropsForNextShape,
      up: ({ propsForNextShape, ...instance }) => {
        return {
          ...instance,
          propsForNextShape: Object.fromEntries(
            Object.entries(propsForNextShape).filter(
              ([key]) => [
                "color",
                "labelColor",
                "dash",
                "fill",
                "size",
                "font",
                "align",
                "verticalAlign",
                "icon",
                "geo",
                "arrowheadStart",
                "arrowheadEnd",
                "spline"
              ].includes(key)
            )
          )
        };
      }
    },
    {
      id: instanceVersions.AddLabelColor,
      up: ({ propsForNextShape, ...instance }) => {
        return {
          ...instance,
          propsForNextShape: {
            ...propsForNextShape,
            labelColor: "black"
          }
        };
      }
    },
    {
      id: instanceVersions.AddFollowingUserId,
      up: (instance) => {
        return { ...instance, followingUserId: null };
      }
    },
    {
      id: instanceVersions.RemoveAlignJustify,
      up: (instance) => {
        let newAlign = instance.propsForNextShape.align;
        if (newAlign === "justify") {
          newAlign = "start";
        }
        return {
          ...instance,
          propsForNextShape: {
            ...instance.propsForNextShape,
            align: newAlign
          }
        };
      }
    },
    {
      id: instanceVersions.AddZoom,
      up: (instance) => {
        return { ...instance, zoomBrush: null };
      }
    },
    {
      id: instanceVersions.AddVerticalAlign,
      up: (instance) => {
        return {
          ...instance,
          propsForNextShape: {
            ...instance.propsForNextShape,
            verticalAlign: "middle"
          }
        };
      }
    },
    {
      id: instanceVersions.AddScribbleDelay,
      up: (instance) => {
        if (instance.scribble !== null) {
          return { ...instance, scribble: { ...instance.scribble, delay: 0 } };
        }
        return { ...instance };
      }
    },
    {
      id: instanceVersions.RemoveUserId,
      up: ({ userId: _, ...instance }) => {
        return instance;
      }
    },
    {
      id: instanceVersions.AddIsPenModeAndIsGridMode,
      up: (instance) => {
        return { ...instance, isPenMode: false, isGridMode: false };
      }
    },
    {
      id: instanceVersions.HoistOpacity,
      up: ({ propsForNextShape: { opacity, ...propsForNextShape }, ...instance }) => {
        return { ...instance, opacityForNextShape: Number(opacity ?? "1"), propsForNextShape };
      }
    },
    {
      id: instanceVersions.AddChat,
      up: (instance) => {
        return { ...instance, chatMessage: "", isChatting: false };
      }
    },
    {
      id: instanceVersions.AddHighlightedUserIds,
      up: (instance) => {
        return { ...instance, highlightedUserIds: [] };
      }
    },
    {
      id: instanceVersions.ReplacePropsForNextShapeWithStylesForNextShape,
      up: ({ propsForNextShape: _, ...instance }) => {
        return { ...instance, stylesForNextShape: {} };
      }
    },
    {
      id: instanceVersions.AddMeta,
      up: (record) => {
        return {
          ...record,
          meta: {}
        };
      }
    },
    {
      id: instanceVersions.RemoveCursorColor,
      up: (record) => {
        const { color: _, ...cursor } = record.cursor;
        return {
          ...record,
          cursor
        };
      }
    },
    {
      id: instanceVersions.AddLonelyProperties,
      up: (record) => {
        return {
          ...record,
          canMoveCamera: true,
          isFocused: false,
          devicePixelRatio: 1,
          isCoarsePointer: false,
          openMenus: [],
          isChangingStyle: false,
          isReadOnly: false
        };
      }
    },
    {
      id: instanceVersions.ReadOnlyReadonly,
      up: ({ isReadOnly: _isReadOnly, ...record }) => {
        return {
          ...record,
          isReadonly: _isReadOnly
        };
      }
    },
    {
      id: instanceVersions.AddHoveringCanvas,
      up: (record) => {
        return {
          ...record,
          isHoveringCanvas: null
        };
      }
    },
    {
      id: instanceVersions.AddScribbles,
      up: ({ scribble: _, ...record }) => {
        return {
          ...record,
          scribbles: []
        };
      }
    },
    {
      id: instanceVersions.AddInset,
      up: (record) => {
        return {
          ...record,
          insets: [false, false, false, false]
        };
      },
      down: ({ insets: _, ...record }) => {
        return {
          ...record
        };
      }
    },
    {
      id: instanceVersions.AddDuplicateProps,
      up: (record) => {
        return {
          ...record,
          duplicateProps: null
        };
      },
      down: ({ duplicateProps: _, ...record }) => {
        return {
          ...record
        };
      }
    },
    {
      id: instanceVersions.RemoveCanMoveCamera,
      up: ({ canMoveCamera: _, ...record }) => {
        return {
          ...record
        };
      },
      down: (instance) => {
        return { ...instance, canMoveCamera: true };
      }
    },
    {
      id: instanceVersions.AddCameraState,
      up: (record) => {
        return { ...record, cameraState: "idle" };
      },
      down: ({ cameraState: _, ...record }) => {
        return record;
      }
    }
  ]
});
var TLINSTANCE_ID = "instance:instance";

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLPageState.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var instancePageStateValidator = validation_exports.model(
  "instance_page_state",
  validation_exports.object({
    typeName: validation_exports.literal("instance_page_state"),
    id: idValidator("instance_page_state"),
    pageId: pageIdValidator,
    selectedShapeIds: validation_exports.arrayOf(shapeIdValidator),
    hintingShapeIds: validation_exports.arrayOf(shapeIdValidator),
    erasingShapeIds: validation_exports.arrayOf(shapeIdValidator),
    hoveredShapeId: shapeIdValidator.nullable(),
    editingShapeId: shapeIdValidator.nullable(),
    croppingShapeId: shapeIdValidator.nullable(),
    focusedGroupId: shapeIdValidator.nullable(),
    meta: validation_exports.jsonValue
  })
);
var instancePageStateVersions = createMigrationIds("com.tldraw.instance_page_state", {
  AddCroppingId: 1,
  RemoveInstanceIdAndCameraId: 2,
  AddMeta: 3,
  RenameProperties: 4,
  RenamePropertiesAgain: 5
});
var instancePageStateMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.instance_page_state",
  recordType: "instance_page_state",
  sequence: [
    {
      id: instancePageStateVersions.AddCroppingId,
      up(instance) {
        instance.croppingShapeId = null;
      }
    },
    {
      id: instancePageStateVersions.RemoveInstanceIdAndCameraId,
      up(instance) {
        delete instance.instanceId;
        delete instance.cameraId;
      }
    },
    {
      id: instancePageStateVersions.AddMeta,
      up: (record) => {
        record.meta = {};
      }
    },
    {
      id: instancePageStateVersions.RenameProperties,
      // this migration is cursed: it was written wrong and doesn't do anything.
      // rather than replace it, I've added another migration below that fixes it.
      up: (_record) => {
      },
      down: (_record) => {
      }
    },
    {
      id: instancePageStateVersions.RenamePropertiesAgain,
      up: (record) => {
        record.selectedShapeIds = record.selectedIds;
        delete record.selectedIds;
        record.hintingShapeIds = record.hintingIds;
        delete record.hintingIds;
        record.erasingShapeIds = record.erasingIds;
        delete record.erasingIds;
        record.hoveredShapeId = record.hoveredId;
        delete record.hoveredId;
        record.editingShapeId = record.editingId;
        delete record.editingId;
        record.croppingShapeId = record.croppingShapeId ?? record.croppingId ?? null;
        delete record.croppingId;
        record.focusedGroupId = record.focusLayerId;
        delete record.focusLayerId;
      },
      down: (record) => {
        record.selectedIds = record.selectedShapeIds;
        delete record.selectedShapeIds;
        record.hintingIds = record.hintingShapeIds;
        delete record.hintingShapeIds;
        record.erasingIds = record.erasingShapeIds;
        delete record.erasingShapeIds;
        record.hoveredId = record.hoveredShapeId;
        delete record.hoveredShapeId;
        record.editingId = record.editingShapeId;
        delete record.editingShapeId;
        record.croppingId = record.croppingShapeId;
        delete record.croppingShapeId;
        record.focusLayerId = record.focusedGroupId;
        delete record.focusedGroupId;
      }
    }
  ]
});
var InstancePageStateRecordType = createRecordType(
  "instance_page_state",
  {
    validator: instancePageStateValidator,
    scope: "session",
    ephemeralKeys: {
      pageId: false,
      selectedShapeIds: false,
      editingShapeId: false,
      croppingShapeId: false,
      meta: false,
      hintingShapeIds: true,
      erasingShapeIds: true,
      hoveredShapeId: true,
      focusedGroupId: true
    }
  }
).withDefaultProperties(
  () => ({
    editingShapeId: null,
    croppingShapeId: null,
    selectedShapeIds: [],
    hoveredShapeId: null,
    erasingShapeIds: [],
    hintingShapeIds: [],
    focusedGroupId: null,
    meta: {}
  })
);

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLPointer.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var pointerValidator = validation_exports.model(
  "pointer",
  validation_exports.object({
    typeName: validation_exports.literal("pointer"),
    id: idValidator("pointer"),
    x: validation_exports.number,
    y: validation_exports.number,
    lastActivityTimestamp: validation_exports.number,
    meta: validation_exports.jsonValue
  })
);
var pointerVersions = createMigrationIds("com.tldraw.pointer", {
  AddMeta: 1
});
var pointerMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.pointer",
  recordType: "pointer",
  sequence: [
    {
      id: pointerVersions.AddMeta,
      up: (record) => {
        record.meta = {};
      }
    }
  ]
});
var PointerRecordType = createRecordType("pointer", {
  validator: pointerValidator,
  scope: "session"
}).withDefaultProperties(
  () => ({
    x: 0,
    y: 0,
    lastActivityTimestamp: 0,
    meta: {}
  })
);
var TLPOINTER_ID = PointerRecordType.createId("pointer");

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLPresence.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var instancePresenceValidator = validation_exports.model(
  "instance_presence",
  validation_exports.object({
    typeName: validation_exports.literal("instance_presence"),
    id: idValidator("instance_presence"),
    userId: validation_exports.string,
    userName: validation_exports.string,
    lastActivityTimestamp: validation_exports.number.nullable(),
    followingUserId: validation_exports.string.nullable(),
    cursor: validation_exports.object({
      x: validation_exports.number,
      y: validation_exports.number,
      type: cursorTypeValidator,
      rotation: validation_exports.number
    }).nullable(),
    color: validation_exports.string,
    camera: validation_exports.object({
      x: validation_exports.number,
      y: validation_exports.number,
      z: validation_exports.number
    }).nullable(),
    screenBounds: boxModelValidator.nullable(),
    selectedShapeIds: validation_exports.arrayOf(idValidator("shape")),
    currentPageId: idValidator("page"),
    brush: boxModelValidator.nullable(),
    scribbles: validation_exports.arrayOf(scribbleValidator),
    chatMessage: validation_exports.string,
    meta: validation_exports.jsonValue
  })
);
var instancePresenceVersions = createMigrationIds("com.tldraw.instance_presence", {
  AddScribbleDelay: 1,
  RemoveInstanceId: 2,
  AddChatMessage: 3,
  AddMeta: 4,
  RenameSelectedShapeIds: 5,
  NullableCameraCursor: 6
});
var instancePresenceMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.instance_presence",
  recordType: "instance_presence",
  sequence: [
    {
      id: instancePresenceVersions.AddScribbleDelay,
      up: (instance) => {
        if (instance.scribble !== null) {
          instance.scribble.delay = 0;
        }
      }
    },
    {
      id: instancePresenceVersions.RemoveInstanceId,
      up: (instance) => {
        delete instance.instanceId;
      }
    },
    {
      id: instancePresenceVersions.AddChatMessage,
      up: (instance) => {
        instance.chatMessage = "";
      }
    },
    {
      id: instancePresenceVersions.AddMeta,
      up: (record) => {
        record.meta = {};
      }
    },
    {
      id: instancePresenceVersions.RenameSelectedShapeIds,
      up: (_record) => {
      }
    },
    {
      id: instancePresenceVersions.NullableCameraCursor,
      up: (_record) => {
      },
      down: (record) => {
        if (record.camera === null) {
          record.camera = { x: 0, y: 0, z: 1 };
        }
        if (record.lastActivityTimestamp === null) {
          record.lastActivityTimestamp = 0;
        }
        if (record.cursor === null) {
          record.cursor = { type: "default", x: 0, y: 0, rotation: 0 };
        }
        if (record.screenBounds === null) {
          record.screenBounds = { x: 0, y: 0, w: 1, h: 1 };
        }
      }
    }
  ]
});
var InstancePresenceRecordType = createRecordType(
  "instance_presence",
  {
    validator: instancePresenceValidator,
    scope: "presence"
  }
).withDefaultProperties(() => ({
  lastActivityTimestamp: null,
  followingUserId: null,
  color: "#FF0000",
  camera: null,
  cursor: null,
  screenBounds: null,
  selectedShapeIds: [],
  brush: null,
  scribbles: [],
  chatMessage: "",
  meta: {}
}));

// ../../node_modules/@tldraw/tlschema/dist-esm/createTLSchema.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/TLStore.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLDocument.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var documentValidator = validation_exports.model(
  "document",
  validation_exports.object({
    typeName: validation_exports.literal("document"),
    id: validation_exports.literal("document:document"),
    gridSize: validation_exports.number,
    name: validation_exports.string,
    meta: validation_exports.jsonValue
  })
);
var documentVersions = createMigrationIds("com.tldraw.document", {
  AddName: 1,
  AddMeta: 2
});
var documentMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.document",
  recordType: "document",
  sequence: [
    {
      id: documentVersions.AddName,
      up: (document2) => {
        ;
        document2.name = "";
      },
      down: (document2) => {
        delete document2.name;
      }
    },
    {
      id: documentVersions.AddMeta,
      up: (record) => {
        ;
        record.meta = {};
      }
    }
  ]
});
var DocumentRecordType = createRecordType("document", {
  validator: documentValidator,
  scope: "document"
}).withDefaultProperties(
  () => ({
    gridSize: 10,
    name: "",
    meta: {}
  })
);
var TLDOCUMENT_ID = DocumentRecordType.createId("document");

// ../../node_modules/@tldraw/tlschema/dist-esm/TLStore.mjs
function redactRecordForErrorReporting(record) {
  if (record.typeName === "asset") {
    if ("src" in record) {
      record.src = "<redacted>";
    }
    if ("src" in record.props) {
      record.props.src = "<redacted>";
    }
  }
}
__name(redactRecordForErrorReporting, "redactRecordForErrorReporting");
function onValidationFailure({
  error: error3,
  phase,
  record,
  recordBefore
}) {
  const isExistingValidationIssue = (
    // if we're initializing the store for the first time, we should
    // allow invalid records so people can load old buggy data:
    phase === "initialize"
  );
  annotateError(error3, {
    tags: {
      origin: "store.validateRecord",
      storePhase: phase,
      isExistingValidationIssue
    },
    extras: {
      recordBefore: recordBefore ? redactRecordForErrorReporting(structuredClone(recordBefore)) : void 0,
      recordAfter: redactRecordForErrorReporting(structuredClone(record))
    }
  });
  throw error3;
}
__name(onValidationFailure, "onValidationFailure");
function getDefaultPages() {
  return [
    PageRecordType.create({
      id: "page:page",
      name: "Page 1",
      index: "a1",
      meta: {}
    })
  ];
}
__name(getDefaultPages, "getDefaultPages");
function createIntegrityChecker(store) {
  const $pageIds = store.query.ids("page");
  const $pageStates = store.query.records("instance_page_state");
  const ensureStoreIsUsable = /* @__PURE__ */ __name(() => {
    if (!store.has(TLDOCUMENT_ID)) {
      store.put([DocumentRecordType.create({ id: TLDOCUMENT_ID, name: store.props.defaultName })]);
      return ensureStoreIsUsable();
    }
    if (!store.has(TLPOINTER_ID)) {
      store.put([PointerRecordType.create({ id: TLPOINTER_ID })]);
      return ensureStoreIsUsable();
    }
    const pageIds = $pageIds.get();
    if (pageIds.size === 0) {
      store.put(getDefaultPages());
      return ensureStoreIsUsable();
    }
    const getFirstPageId = /* @__PURE__ */ __name(() => [...pageIds].map((id) => store.get(id)).sort(sortByIndex)[0].id, "getFirstPageId");
    const instanceState = store.get(TLINSTANCE_ID);
    if (!instanceState) {
      store.put([
        store.schema.types.instance.create({
          id: TLINSTANCE_ID,
          currentPageId: getFirstPageId(),
          exportBackground: true
        })
      ]);
      return ensureStoreIsUsable();
    } else if (!pageIds.has(instanceState.currentPageId)) {
      store.put([{ ...instanceState, currentPageId: getFirstPageId() }]);
      return ensureStoreIsUsable();
    }
    const missingPageStateIds = /* @__PURE__ */ new Set();
    const missingCameraIds = /* @__PURE__ */ new Set();
    for (const id of pageIds) {
      const pageStateId = InstancePageStateRecordType.createId(id);
      const pageState = store.get(pageStateId);
      if (!pageState) {
        missingPageStateIds.add(pageStateId);
      }
      const cameraId = CameraRecordType.createId(id);
      if (!store.has(cameraId)) {
        missingCameraIds.add(cameraId);
      }
    }
    if (missingPageStateIds.size > 0) {
      store.put(
        [...missingPageStateIds].map(
          (id) => InstancePageStateRecordType.create({
            id,
            pageId: InstancePageStateRecordType.parseId(id)
          })
        )
      );
    }
    if (missingCameraIds.size > 0) {
      store.put([...missingCameraIds].map((id) => CameraRecordType.create({ id })));
    }
    const pageStates = $pageStates.get();
    for (const pageState of pageStates) {
      if (!pageIds.has(pageState.pageId)) {
        store.remove([pageState.id]);
        continue;
      }
      if (pageState.croppingShapeId && !store.has(pageState.croppingShapeId)) {
        store.put([{ ...pageState, croppingShapeId: null }]);
        return ensureStoreIsUsable();
      }
      if (pageState.focusedGroupId && !store.has(pageState.focusedGroupId)) {
        store.put([{ ...pageState, focusedGroupId: null }]);
        return ensureStoreIsUsable();
      }
      if (pageState.hoveredShapeId && !store.has(pageState.hoveredShapeId)) {
        store.put([{ ...pageState, hoveredShapeId: null }]);
        return ensureStoreIsUsable();
      }
      const filteredSelectedIds = pageState.selectedShapeIds.filter((id) => store.has(id));
      if (filteredSelectedIds.length !== pageState.selectedShapeIds.length) {
        store.put([{ ...pageState, selectedShapeIds: filteredSelectedIds }]);
        return ensureStoreIsUsable();
      }
      const filteredHintingIds = pageState.hintingShapeIds.filter((id) => store.has(id));
      if (filteredHintingIds.length !== pageState.hintingShapeIds.length) {
        store.put([{ ...pageState, hintingShapeIds: filteredHintingIds }]);
        return ensureStoreIsUsable();
      }
      const filteredErasingIds = pageState.erasingShapeIds.filter((id) => store.has(id));
      if (filteredErasingIds.length !== pageState.erasingShapeIds.length) {
        store.put([{ ...pageState, erasingShapeIds: filteredErasingIds }]);
        return ensureStoreIsUsable();
      }
    }
  }, "ensureStoreIsUsable");
  return ensureStoreIsUsable;
}
__name(createIntegrityChecker, "createIntegrityChecker");

// ../../node_modules/@tldraw/tlschema/dist-esm/assets/TLBookmarkAsset.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var bookmarkAssetValidator = createAssetValidator(
  "bookmark",
  validation_exports.object({
    title: validation_exports.string,
    description: validation_exports.string,
    image: validation_exports.string,
    favicon: validation_exports.string,
    src: validation_exports.srcUrl.nullable()
  })
);
var Versions = createMigrationIds("com.tldraw.asset.bookmark", {
  MakeUrlsValid: 1,
  AddFavicon: 2
});
var bookmarkAssetMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.asset.bookmark",
  recordType: "asset",
  filter: (asset) => asset.type === "bookmark",
  sequence: [
    {
      id: Versions.MakeUrlsValid,
      up: (asset) => {
        if (!validation_exports.srcUrl.isValid(asset.props.src)) {
          asset.props.src = "";
        }
      },
      down: (_asset) => {
      }
    },
    {
      id: Versions.AddFavicon,
      up: (asset) => {
        if (!validation_exports.srcUrl.isValid(asset.props.favicon)) {
          asset.props.favicon = "";
        }
      },
      down: (asset) => {
        delete asset.props.favicon;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/assets/TLImageAsset.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var imageAssetValidator = createAssetValidator(
  "image",
  validation_exports.object({
    w: validation_exports.number,
    h: validation_exports.number,
    name: validation_exports.string,
    isAnimated: validation_exports.boolean,
    mimeType: validation_exports.string.nullable(),
    src: validation_exports.srcUrl.nullable(),
    fileSize: validation_exports.nonZeroNumber.optional(),
    pixelRatio: validation_exports.positiveNumber.optional()
  })
);
var Versions2 = createMigrationIds("com.tldraw.asset.image", {
  AddIsAnimated: 1,
  RenameWidthHeight: 2,
  MakeUrlsValid: 3,
  AddFileSize: 4,
  MakeFileSizeOptional: 5,
  AddPixelRatio: 6
});
var imageAssetMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.asset.image",
  recordType: "asset",
  filter: (asset) => asset.type === "image",
  sequence: [
    {
      id: Versions2.AddIsAnimated,
      up: (asset) => {
        asset.props.isAnimated = false;
      },
      down: (asset) => {
        delete asset.props.isAnimated;
      }
    },
    {
      id: Versions2.RenameWidthHeight,
      up: (asset) => {
        asset.props.w = asset.props.width;
        asset.props.h = asset.props.height;
        delete asset.props.width;
        delete asset.props.height;
      },
      down: (asset) => {
        asset.props.width = asset.props.w;
        asset.props.height = asset.props.h;
        delete asset.props.w;
        delete asset.props.h;
      }
    },
    {
      id: Versions2.MakeUrlsValid,
      up: (asset) => {
        if (!validation_exports.srcUrl.isValid(asset.props.src)) {
          asset.props.src = "";
        }
      },
      down: (_asset) => {
      }
    },
    {
      id: Versions2.AddFileSize,
      up: (asset) => {
        asset.props.fileSize = -1;
      },
      down: (asset) => {
        delete asset.props.fileSize;
      }
    },
    {
      id: Versions2.MakeFileSizeOptional,
      up: (asset) => {
        if (asset.props.fileSize === -1) {
          asset.props.fileSize = void 0;
        }
      },
      down: (asset) => {
        if (asset.props.fileSize === void 0) {
          asset.props.fileSize = -1;
        }
      }
    },
    {
      id: Versions2.AddPixelRatio,
      up: (_asset) => {
      },
      down: (asset) => {
        delete asset.props.pixelRatio;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/assets/TLVideoAsset.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var videoAssetValidator = createAssetValidator(
  "video",
  validation_exports.object({
    w: validation_exports.number,
    h: validation_exports.number,
    name: validation_exports.string,
    isAnimated: validation_exports.boolean,
    mimeType: validation_exports.string.nullable(),
    src: validation_exports.srcUrl.nullable(),
    fileSize: validation_exports.number.optional()
  })
);
var Versions3 = createMigrationIds("com.tldraw.asset.video", {
  AddIsAnimated: 1,
  RenameWidthHeight: 2,
  MakeUrlsValid: 3,
  AddFileSize: 4,
  MakeFileSizeOptional: 5
});
var videoAssetMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.asset.video",
  recordType: "asset",
  filter: (asset) => asset.type === "video",
  sequence: [
    {
      id: Versions3.AddIsAnimated,
      up: (asset) => {
        asset.props.isAnimated = false;
      },
      down: (asset) => {
        delete asset.props.isAnimated;
      }
    },
    {
      id: Versions3.RenameWidthHeight,
      up: (asset) => {
        asset.props.w = asset.props.width;
        asset.props.h = asset.props.height;
        delete asset.props.width;
        delete asset.props.height;
      },
      down: (asset) => {
        asset.props.width = asset.props.w;
        asset.props.height = asset.props.h;
        delete asset.props.w;
        delete asset.props.h;
      }
    },
    {
      id: Versions3.MakeUrlsValid,
      up: (asset) => {
        if (!validation_exports.srcUrl.isValid(asset.props.src)) {
          asset.props.src = "";
        }
      },
      down: (_asset) => {
      }
    },
    {
      id: Versions3.AddFileSize,
      up: (asset) => {
        asset.props.fileSize = -1;
      },
      down: (asset) => {
        delete asset.props.fileSize;
      }
    },
    {
      id: Versions3.MakeFileSizeOptional,
      up: (asset) => {
        if (asset.props.fileSize === -1) {
          asset.props.fileSize = void 0;
        }
      },
      down: (asset) => {
        if (asset.props.fileSize === void 0) {
          asset.props.fileSize = -1;
        }
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/records/TLAsset.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var assetValidator = validation_exports.model(
  "asset",
  validation_exports.union("type", {
    image: imageAssetValidator,
    video: videoAssetValidator,
    bookmark: bookmarkAssetValidator
  })
);
var assetVersions = createMigrationIds("com.tldraw.asset", {
  AddMeta: 1
});
var assetMigrations = createRecordMigrationSequence({
  sequenceId: "com.tldraw.asset",
  recordType: "asset",
  sequence: [
    {
      id: assetVersions.AddMeta,
      up: (record) => {
        ;
        record.meta = {};
      }
    }
  ]
});
var AssetRecordType = createRecordType("asset", {
  validator: assetValidator,
  scope: "document"
}).withDefaultProperties(() => ({
  meta: {}
}));

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLBookmarkShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var bookmarkShapeProps = {
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  assetId: assetIdValidator.nullable(),
  url: validation_exports.linkUrl
};
var Versions4 = createShapePropsMigrationIds("bookmark", {
  NullAssetId: 1,
  MakeUrlsValid: 2
});
var bookmarkShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions4.NullAssetId,
      up: (props) => {
        if (props.assetId === void 0) {
          props.assetId = null;
        }
      },
      down: "retired"
    },
    {
      id: Versions4.MakeUrlsValid,
      up: (props) => {
        if (!validation_exports.linkUrl.isValid(props.url)) {
          props.url = "";
        }
      },
      down: (_props) => {
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLDrawShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/b64Vecs.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var FIRST_POINT_B64_LENGTH = 16;
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64_LOOKUP = new Uint8Array(128);
for (let i = 0; i < 64; i++) {
  B64_LOOKUP[BASE64_CHARS.charCodeAt(i)] = i;
}
var POW2 = new Float64Array(31);
for (let i = 0; i < 31; i++) {
  POW2[i] = Math.pow(2, i - 15);
}
var POW2_SUBNORMAL = Math.pow(2, -14) / 1024;
var MANTISSA = new Float64Array(1024);
for (let i = 0; i < 1024; i++) {
  MANTISSA[i] = 1 + i / 1024;
}
function nativeGetFloat16(dataView, offset) {
  return dataView.getFloat16(offset, true);
}
__name(nativeGetFloat16, "nativeGetFloat16");
function fallbackGetFloat16(dataView, offset) {
  return float16BitsToNumber(dataView.getUint16(offset, true));
}
__name(fallbackGetFloat16, "fallbackGetFloat16");
var getFloat16 = typeof DataView.prototype.getFloat16 === "function" ? nativeGetFloat16 : fallbackGetFloat16;
function nativeSetFloat16(dataView, offset, value) {
  ;
  dataView.setFloat16(offset, value, true);
}
__name(nativeSetFloat16, "nativeSetFloat16");
function fallbackSetFloat16(dataView, offset, value) {
  dataView.setUint16(offset, numberToFloat16Bits(value), true);
}
__name(fallbackSetFloat16, "fallbackSetFloat16");
var setFloat16 = typeof DataView.prototype.setFloat16 === "function" ? nativeSetFloat16 : fallbackSetFloat16;
function nativeBase64ToUint8Array(base64) {
  return Uint8Array.fromBase64(base64);
}
__name(nativeBase64ToUint8Array, "nativeBase64ToUint8Array");
function fallbackBase64ToUint8Array(base64) {
  const numBytes = Math.floor(base64.length * 3 / 4);
  const bytes = new Uint8Array(numBytes);
  let byteIndex = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const c0 = B64_LOOKUP[base64.charCodeAt(i)];
    const c1 = B64_LOOKUP[base64.charCodeAt(i + 1)];
    const c2 = B64_LOOKUP[base64.charCodeAt(i + 2)];
    const c3 = B64_LOOKUP[base64.charCodeAt(i + 3)];
    const bitmap = c0 << 18 | c1 << 12 | c2 << 6 | c3;
    bytes[byteIndex++] = bitmap >> 16 & 255;
    bytes[byteIndex++] = bitmap >> 8 & 255;
    bytes[byteIndex++] = bitmap & 255;
  }
  return bytes;
}
__name(fallbackBase64ToUint8Array, "fallbackBase64ToUint8Array");
function nativeUint8ArrayToBase64(uint8Array) {
  return uint8Array.toBase64();
}
__name(nativeUint8ArrayToBase64, "nativeUint8ArrayToBase64");
function fallbackUint8ArrayToBase64(uint8Array) {
  assert3(uint8Array.length % 3 === 0, "Uint8Array length must be a multiple of 3");
  let result = "";
  for (let i = 0; i < uint8Array.length; i += 3) {
    const byte1 = uint8Array[i];
    const byte2 = uint8Array[i + 1];
    const byte3 = uint8Array[i + 2];
    const bitmap = byte1 << 16 | byte2 << 8 | byte3;
    result += BASE64_CHARS[bitmap >> 18 & 63] + BASE64_CHARS[bitmap >> 12 & 63] + BASE64_CHARS[bitmap >> 6 & 63] + BASE64_CHARS[bitmap & 63];
  }
  return result;
}
__name(fallbackUint8ArrayToBase64, "fallbackUint8ArrayToBase64");
var uint8ArrayToBase64 = typeof Uint8Array.prototype.toBase64 === "function" ? nativeUint8ArrayToBase64 : fallbackUint8ArrayToBase64;
var base64ToUint8Array = typeof Uint8Array.fromBase64 === "function" ? nativeBase64ToUint8Array : fallbackBase64ToUint8Array;
function float16BitsToNumber(bits) {
  const sign = bits >> 15;
  const exp = bits >> 10 & 31;
  const frac = bits & 1023;
  if (exp === 0) {
    return sign ? -frac * POW2_SUBNORMAL : frac * POW2_SUBNORMAL;
  }
  if (exp === 31) {
    return frac ? NaN : sign ? -Infinity : Infinity;
  }
  const magnitude = POW2[exp] * MANTISSA[frac];
  return sign ? -magnitude : magnitude;
}
__name(float16BitsToNumber, "float16BitsToNumber");
function numberToFloat16Bits(value) {
  if (value === 0)
    return Object.is(value, -0) ? 32768 : 0;
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value))
      return 32256;
    return value > 0 ? 31744 : 64512;
  }
  const sign = value < 0 ? 1 : 0;
  value = Math.abs(value);
  const exp = Math.floor(Math.log2(value));
  let expBiased = exp + 15;
  if (expBiased >= 31) {
    return sign << 15 | 31744;
  }
  if (expBiased <= 0) {
    const frac2 = Math.round(value * Math.pow(2, 14) * 1024);
    return sign << 15 | frac2 & 1023;
  }
  const mantissa = value / Math.pow(2, exp) - 1;
  let frac = Math.round(mantissa * 1024);
  if (frac >= 1024) {
    frac = 0;
    expBiased++;
    if (expBiased >= 31) {
      return sign << 15 | 31744;
    }
  }
  return sign << 15 | expBiased << 10 | frac;
}
__name(numberToFloat16Bits, "numberToFloat16Bits");
var b64Vecs = class {
  /**
   * Encode a single point (x, y, z) to 8 base64 characters using legacy Float16 encoding.
   * Each coordinate is encoded as a Float16 value, resulting in 6 bytes total.
   *
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param z - The z coordinate
   * @returns An 8-character base64 string representing the point
   * @internal
   */
  static _legacyEncodePoint(x, y, z) {
    const buffer = new Uint8Array(6);
    const dataView = new DataView(buffer.buffer);
    setFloat16(dataView, 0, x);
    setFloat16(dataView, 2, y);
    setFloat16(dataView, 4, z);
    return uint8ArrayToBase64(buffer);
  }
  /**
   * Convert an array of VecModels to a base64 string using legacy Float16 encoding.
   * Uses Float16 encoding for each coordinate (x, y, z). If a point's z value is
   * undefined, it defaults to 0.5.
   *
   * @param points - An array of VecModel objects to encode
   * @returns A base64-encoded string containing all points
   * @internal Used only for migrations from legacy format
   */
  static _legacyEncodePoints(points) {
    if (points.length === 0)
      return "";
    const buffer = new Uint8Array(points.length * 6);
    const dataView = new DataView(buffer.buffer);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const offset = i * 6;
      setFloat16(dataView, offset, p.x);
      setFloat16(dataView, offset + 2, p.y);
      setFloat16(dataView, offset + 4, p.z ?? 0.5);
    }
    return uint8ArrayToBase64(buffer);
  }
  /**
   * Convert a legacy base64 string back to an array of VecModels.
   * Decodes Float16-encoded coordinates (x, y, z) from the base64 string.
   *
   * @param base64 - The base64-encoded string containing point data
   * @returns An array of VecModel objects decoded from the string
   * @internal Used only for migrations from legacy format
   */
  static _legacyDecodePoints(base64) {
    const bytes = base64ToUint8Array(base64);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const result = [];
    for (let offset = 0; offset < bytes.length; offset += 6) {
      result.push({
        x: getFloat16(dataView, offset),
        y: getFloat16(dataView, offset + 2),
        z: getFloat16(dataView, offset + 4)
      });
    }
    return result;
  }
  /**
   * Encode an array of VecModels using delta encoding for improved precision.
   * The first point is stored as Float32 (high precision for absolute position),
   * subsequent points are stored as Float16 deltas from the previous point.
   * This provides full precision for the starting position and excellent precision
   * for deltas between consecutive points (which are typically small values).
   *
   * Format:
   * - First point: 3 Float32 values = 12 bytes = 16 base64 chars
   * - Delta points: 3 Float16 values each = 6 bytes = 8 base64 chars each
   *
   * @param points - An array of VecModel objects to encode
   * @returns A base64-encoded string containing delta-encoded points
   * @public
   */
  static encodePoints(points) {
    if (points.length === 0)
      return "";
    const firstPointBytes = 12;
    const deltaBytes = (points.length - 1) * 6;
    const totalBytes = firstPointBytes + deltaBytes;
    const buffer = new Uint8Array(totalBytes);
    const dataView = new DataView(buffer.buffer);
    const first = points[0];
    dataView.setFloat32(0, first.x, true);
    dataView.setFloat32(4, first.y, true);
    dataView.setFloat32(8, first.z ?? 0.5, true);
    let prevX = first.x;
    let prevY = first.y;
    let prevZ = first.z ?? 0.5;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const z = p.z ?? 0.5;
      const offset = firstPointBytes + (i - 1) * 6;
      setFloat16(dataView, offset, p.x - prevX);
      setFloat16(dataView, offset + 2, p.y - prevY);
      setFloat16(dataView, offset + 4, z - prevZ);
      prevX = p.x;
      prevY = p.y;
      prevZ = z;
    }
    return uint8ArrayToBase64(buffer);
  }
  /**
   * Decode a delta-encoded base64 string back to an array of absolute VecModels.
   * The first point is stored as Float32 (high precision), subsequent points are
   * Float16 deltas that are accumulated to reconstruct absolute positions.
   *
   * @param base64 - The base64-encoded string containing delta-encoded point data
   * @returns An array of VecModel objects with absolute coordinates
   * @public
   */
  static decodePoints(base64) {
    if (base64.length === 0)
      return [];
    const bytes = base64ToUint8Array(base64);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const result = [];
    let x = dataView.getFloat32(0, true);
    let y = dataView.getFloat32(4, true);
    let z = dataView.getFloat32(8, true);
    result.push({ x, y, z });
    const firstPointBytes = 12;
    for (let offset = firstPointBytes; offset < bytes.length; offset += 6) {
      x += getFloat16(dataView, offset);
      y += getFloat16(dataView, offset + 2);
      z += getFloat16(dataView, offset + 4);
      result.push({ x, y, z });
    }
    return result;
  }
  /**
   * Get the first point from a delta-encoded base64 string.
   * The first point is stored as Float32 for full precision.
   *
   * @param b64Points - The delta-encoded base64 string
   * @returns The first point as a VecModel, or null if the string is too short
   * @public
   */
  static decodeFirstPoint(b64Points) {
    if (b64Points.length < FIRST_POINT_B64_LENGTH)
      return null;
    const bytes = base64ToUint8Array(b64Points.slice(0, FIRST_POINT_B64_LENGTH));
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
      x: dataView.getFloat32(0, true),
      y: dataView.getFloat32(4, true),
      z: dataView.getFloat32(8, true)
    };
  }
  /**
   * Get the last point from a delta-encoded base64 string.
   * Requires decoding all points to accumulate deltas.
   *
   * @param b64Points - The delta-encoded base64 string
   * @returns The last point as a VecModel, or null if the string is too short
   * @public
   */
  static decodeLastPoint(b64Points) {
    if (b64Points.length < FIRST_POINT_B64_LENGTH)
      return null;
    const bytes = base64ToUint8Array(b64Points);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let x = dataView.getFloat32(0, true);
    let y = dataView.getFloat32(4, true);
    let z = dataView.getFloat32(8, true);
    const firstPointBytes = 12;
    for (let offset = firstPointBytes; offset < bytes.length; offset += 6) {
      x += getFloat16(dataView, offset);
      y += getFloat16(dataView, offset + 2);
      z += getFloat16(dataView, offset + 4);
    }
    return { x, y, z };
  }
};
__name(b64Vecs, "b64Vecs");

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLDrawShape.mjs
var DrawShapeSegment = validation_exports.object({
  type: validation_exports.literalEnum("free", "straight"),
  path: validation_exports.string
});
var drawShapeProps = {
  color: DefaultColorStyle,
  fill: DefaultFillStyle,
  dash: DefaultDashStyle,
  size: DefaultSizeStyle,
  segments: validation_exports.arrayOf(DrawShapeSegment),
  isComplete: validation_exports.boolean,
  isClosed: validation_exports.boolean,
  isPen: validation_exports.boolean,
  scale: validation_exports.nonZeroNumber,
  scaleX: validation_exports.nonZeroFiniteNumber,
  scaleY: validation_exports.nonZeroFiniteNumber
};
var Versions5 = createShapePropsMigrationIds("draw", {
  AddInPen: 1,
  AddScale: 2,
  Base64: 3,
  LegacyPointsConversion: 4
});
var drawShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions5.AddInPen,
      up: (props) => {
        const { points } = props.segments[0];
        if (points.length === 0) {
          props.isPen = false;
          return;
        }
        let isPen = !(points[0].z === 0 || points[0].z === 0.5);
        if (points[1]) {
          isPen = isPen && !(points[1].z === 0 || points[1].z === 0.5);
        }
        props.isPen = isPen;
      },
      down: "retired"
    },
    {
      id: Versions5.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    },
    {
      id: Versions5.Base64,
      up: (props) => {
        props.segments = props.segments.map((segment) => {
          if (segment.path !== void 0)
            return segment;
          const { points, ...rest } = segment;
          const vecModels = Array.isArray(points) ? points : b64Vecs._legacyDecodePoints(points);
          return {
            ...rest,
            path: b64Vecs.encodePoints(vecModels)
          };
        });
        props.scaleX = props.scaleX ?? 1;
        props.scaleY = props.scaleY ?? 1;
      },
      down: (props) => {
        props.segments = props.segments.map((segment) => {
          const { path, ...rest } = segment;
          return {
            ...rest,
            points: b64Vecs.decodePoints(path)
          };
        });
        delete props.scaleX;
        delete props.scaleY;
      }
    },
    {
      id: Versions5.LegacyPointsConversion,
      up: (props) => {
        props.segments = props.segments.map((segment) => {
          if (segment.path !== void 0)
            return segment;
          const { points, ...rest } = segment;
          const vecModels = Array.isArray(points) ? points : b64Vecs._legacyDecodePoints(points);
          return {
            ...rest,
            path: b64Vecs.encodePoints(vecModels)
          };
        });
      },
      down: (_props) => {
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLEmbedShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TLDRAW_APP_RE = /(^\/r\/[^/]+\/?$)/;
var EMBED_DEFINITIONS = [
  {
    hostnames: ["beta.tldraw.com", "tldraw.com", "localhost:3000"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(TLDRAW_APP_RE)) {
        return url;
      }
      return;
    }
  },
  {
    hostnames: ["figma.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/^\/embed\/?$/)) {
        const outUrl = urlObj.searchParams.get("url");
        if (outUrl) {
          return outUrl;
        }
      }
      return;
    }
  },
  {
    hostnames: ["google.*"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (!urlObj)
        return;
      const matches = urlObj.pathname.match(/^\/maps\/embed\/v1\/view\/?$/);
      if (matches && urlObj.searchParams.has("center") && urlObj.searchParams.get("zoom")) {
        const zoom = urlObj.searchParams.get("zoom");
        const [lat, lon] = urlObj.searchParams.get("center").split(",");
        return `https://www.google.com/maps/@${lat},${lon},${zoom}z`;
      }
      return;
    }
  },
  {
    hostnames: ["val.town"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      const matches = urlObj && urlObj.pathname.match(/\/embed\/(.+)\/?/);
      if (matches) {
        return `https://www.val.town/v/${matches[1]}`;
      }
      return;
    }
  },
  {
    hostnames: ["codesandbox.io"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      const matches = urlObj && urlObj.pathname.match(/\/embed\/([^/]+)\/?/);
      if (matches) {
        return `https://codesandbox.io/s/${matches[1]}`;
      }
      return;
    }
  },
  {
    hostnames: ["codepen.io"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const CODEPEN_EMBED_REGEXP = /https:\/\/codepen.io\/([^/]+)\/embed\/([^/]+)/;
      const matches = url.match(CODEPEN_EMBED_REGEXP);
      if (matches) {
        const [_, user, id] = matches;
        return `https://codepen.io/${user}/pen/${id}`;
      }
      return;
    }
  },
  {
    hostnames: ["scratch.mit.edu"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const SCRATCH_EMBED_REGEXP = /https:\/\/scratch.mit.edu\/projects\/embed\/([^/]+)/;
      const matches = url.match(SCRATCH_EMBED_REGEXP);
      if (matches) {
        const [_, id] = matches;
        return `https://scratch.mit.edu/projects/${id}`;
      }
      return;
    }
  },
  {
    hostnames: ["*.youtube.com", "youtube.com", "youtu.be"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (!urlObj)
        return;
      const hostname = urlObj.hostname.replace(/^www./, "");
      if (hostname === "youtube.com") {
        const matches = urlObj.pathname.match(/^\/embed\/([^/]+)\/?/);
        if (matches) {
          return `https://www.youtube.com/watch?v=${matches[1]}`;
        }
      }
      return;
    }
  },
  {
    hostnames: ["calendar.google.*"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      const srcQs = urlObj?.searchParams.get("src");
      if (urlObj?.pathname.match(/\/calendar\/embed/) && srcQs) {
        urlObj.pathname = "/calendar/u/0";
        const keys = Array.from(urlObj.searchParams.keys());
        for (const key of keys) {
          urlObj.searchParams.delete(key);
        }
        urlObj.searchParams.set("cid", srcQs);
        return urlObj.href;
      }
      return;
    }
  },
  {
    hostnames: ["docs.google.*"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj?.pathname.match(/^\/presentation/) && urlObj?.pathname.match(/\/embed\/?$/)) {
        urlObj.pathname = urlObj.pathname.replace(/\/embed$/, "/pub");
        const keys = Array.from(urlObj.searchParams.keys());
        for (const key of keys) {
          urlObj.searchParams.delete(key);
        }
        return urlObj.href;
      }
      return;
    }
  },
  {
    hostnames: ["gist.github.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/\/([^/]+)\/([^/]+)/)) {
        if (!url.split("/").pop())
          return;
        return url;
      }
      return;
    }
  },
  {
    hostnames: ["replit.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/\/@([^/]+)\/([^/]+)/) && urlObj.searchParams.has("embed")) {
        urlObj.searchParams.delete("embed");
        return urlObj.href;
      }
      return;
    }
  },
  {
    hostnames: ["felt.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/^\/embed\/map\//)) {
        urlObj.pathname = urlObj.pathname.replace(/^\/embed/, "");
        return urlObj.href;
      }
      return;
    }
  },
  {
    hostnames: ["open.spotify.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/^\/embed\/(artist|album)\//)) {
        return urlObj.origin + urlObj.pathname.replace(/^\/embed/, "");
      }
      return;
    }
  },
  {
    hostnames: ["vimeo.com", "player.vimeo.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.hostname === "player.vimeo.com") {
        const matches = urlObj.pathname.match(/^\/video\/([^/]+)\/?$/);
        if (matches) {
          return "https://vimeo.com/" + matches[1];
        }
      }
      return;
    }
  },
  {
    hostnames: ["observablehq.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.pathname.match(/^\/embed\/@([^/]+)\/([^/]+)\/?$/)) {
        return `${urlObj.origin}${urlObj.pathname.replace("/embed", "")}#cell-*`;
      }
      if (urlObj && urlObj.pathname.match(/^\/embed\/([^/]+)\/?$/)) {
        return `${urlObj.origin}${urlObj.pathname.replace("/embed", "/d")}#cell-*`;
      }
      return;
    }
  },
  {
    hostnames: ["desmos.com"],
    canEditWhileLocked: true,
    fromEmbedUrl: (url) => {
      const urlObj = safeParseUrl(url);
      if (urlObj && urlObj.hostname === "www.desmos.com" && urlObj.pathname.match(/^\/calculator\/([^/]+)\/?$/) && urlObj.search === "?embed" && urlObj.hash === "") {
        return url.replace("?embed", "");
      }
      return;
    }
  }
];
var embedShapeProps = {
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  url: validation_exports.string
};
var Versions6 = createShapePropsMigrationIds("embed", {
  GenOriginalUrlInEmbed: 1,
  RemoveDoesResize: 2,
  RemoveTmpOldUrl: 3,
  RemovePermissionOverrides: 4
});
var embedShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions6.GenOriginalUrlInEmbed,
      // add tmpOldUrl property
      up: (props) => {
        try {
          const url = props.url;
          const host = new URL(url).host.replace("www.", "");
          let originalUrl;
          for (const localEmbedDef of EMBED_DEFINITIONS) {
            if (localEmbedDef.hostnames.includes(host)) {
              try {
                originalUrl = localEmbedDef.fromEmbedUrl(url);
              } catch (err) {
                console.warn(err);
              }
            }
          }
          props.tmpOldUrl = props.url;
          props.url = originalUrl ?? "";
        } catch {
          props.url = "";
          props.tmpOldUrl = props.url;
        }
      },
      down: "retired"
    },
    {
      id: Versions6.RemoveDoesResize,
      up: (props) => {
        delete props.doesResize;
      },
      down: "retired"
    },
    {
      id: Versions6.RemoveTmpOldUrl,
      up: (props) => {
        delete props.tmpOldUrl;
      },
      down: "retired"
    },
    {
      id: Versions6.RemovePermissionOverrides,
      up: (props) => {
        delete props.overridePermissions;
      },
      down: "retired"
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLFrameShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var frameShapeProps = {
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  name: validation_exports.string,
  // because shape colors are an option, we don't want them to be picked up by the editor as a
  // style prop by default, so instead of a proper style we just supply an equivalent validator.
  // Check `FrameShapeUtil.configure` for how we replace this with the original
  // `DefaultColorStyle` style when the option is turned on.
  color: validation_exports.literalEnum(...DefaultColorStyle.values)
};
var Versions7 = createShapePropsMigrationIds("frame", {
  AddColorProp: 1
});
var frameShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions7.AddColorProp,
      up: (props) => {
        props.color = "black";
      },
      down: (props) => {
        delete props.color;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLGeoShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLHorizontalAlignStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultHorizontalAlignStyle = StyleProp.defineEnum("tldraw:horizontalAlign", {
  defaultValue: "middle",
  values: ["start", "middle", "end", "start-legacy", "end-legacy", "middle-legacy"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLVerticalAlignStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultVerticalAlignStyle = StyleProp.defineEnum("tldraw:verticalAlign", {
  defaultValue: "middle",
  values: ["start", "middle", "end"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLGeoShape.mjs
var GeoShapeGeoStyle = StyleProp.defineEnum("tldraw:geo", {
  defaultValue: "rectangle",
  values: [
    "cloud",
    "rectangle",
    "ellipse",
    "triangle",
    "diamond",
    "pentagon",
    "hexagon",
    "octagon",
    "star",
    "rhombus",
    "rhombus-2",
    "oval",
    "trapezoid",
    "arrow-right",
    "arrow-left",
    "arrow-up",
    "arrow-down",
    "x-box",
    "check-box",
    "heart"
  ]
});
var geoShapeProps = {
  geo: GeoShapeGeoStyle,
  dash: DefaultDashStyle,
  url: validation_exports.linkUrl,
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  growY: validation_exports.positiveNumber,
  scale: validation_exports.nonZeroNumber,
  // Text properties
  labelColor: DefaultLabelColorStyle,
  color: DefaultColorStyle,
  fill: DefaultFillStyle,
  size: DefaultSizeStyle,
  font: DefaultFontStyle,
  align: DefaultHorizontalAlignStyle,
  verticalAlign: DefaultVerticalAlignStyle,
  richText: richTextValidator
};
var geoShapeVersions = createShapePropsMigrationIds("geo", {
  AddUrlProp: 1,
  AddLabelColor: 2,
  RemoveJustify: 3,
  AddCheckBox: 4,
  AddVerticalAlign: 5,
  MigrateLegacyAlign: 6,
  AddCloud: 7,
  MakeUrlsValid: 8,
  AddScale: 9,
  AddRichText: 10,
  AddRichTextAttrs: 11
});
var geoShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: geoShapeVersions.AddUrlProp,
      up: (props) => {
        props.url = "";
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.AddLabelColor,
      up: (props) => {
        props.labelColor = "black";
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.RemoveJustify,
      up: (props) => {
        if (props.align === "justify") {
          props.align = "start";
        }
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.AddCheckBox,
      up: (_props) => {
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.AddVerticalAlign,
      up: (props) => {
        props.verticalAlign = "middle";
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.MigrateLegacyAlign,
      up: (props) => {
        let newAlign;
        switch (props.align) {
          case "start":
            newAlign = "start-legacy";
            break;
          case "end":
            newAlign = "end-legacy";
            break;
          default:
            newAlign = "middle-legacy";
            break;
        }
        props.align = newAlign;
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.AddCloud,
      up: (_props) => {
      },
      down: "retired"
    },
    {
      id: geoShapeVersions.MakeUrlsValid,
      up: (props) => {
        if (!validation_exports.linkUrl.isValid(props.url)) {
          props.url = "";
        }
      },
      down: (_props) => {
      }
    },
    {
      id: geoShapeVersions.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    },
    {
      id: geoShapeVersions.AddRichText,
      up: (props) => {
        props.richText = toRichText(props.text);
        delete props.text;
      }
      // N.B. Explicitly no down state so that we force clients to update.
      // down: (props) => {
      // 	delete props.richText
      // },
    },
    {
      id: geoShapeVersions.AddRichTextAttrs,
      up: (_props) => {
      },
      down: (props) => {
        if (props.richText && "attrs" in props.richText) {
          delete props.richText.attrs;
        }
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLGroupShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var groupShapeProps = {};
var groupShapeMigrations = createShapePropsMigrationSequence({ sequence: [] });

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLHighlightShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var highlightShapeProps = {
  color: DefaultColorStyle,
  size: DefaultSizeStyle,
  segments: validation_exports.arrayOf(DrawShapeSegment),
  isComplete: validation_exports.boolean,
  isPen: validation_exports.boolean,
  scale: validation_exports.nonZeroNumber,
  scaleX: validation_exports.nonZeroFiniteNumber,
  scaleY: validation_exports.nonZeroFiniteNumber
};
var Versions8 = createShapePropsMigrationIds("highlight", {
  AddScale: 1,
  Base64: 2,
  LegacyPointsConversion: 3
});
var highlightShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions8.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    },
    {
      id: Versions8.Base64,
      up: (props) => {
        props.segments = props.segments.map((segment) => {
          if (segment.path !== void 0)
            return segment;
          const { points, ...rest } = segment;
          const vecModels = Array.isArray(points) ? points : b64Vecs._legacyDecodePoints(points);
          return {
            ...rest,
            path: b64Vecs.encodePoints(vecModels)
          };
        });
        props.scaleX = props.scaleX ?? 1;
        props.scaleY = props.scaleY ?? 1;
      },
      down: (props) => {
        props.segments = props.segments.map((segment) => {
          const { path, ...rest } = segment;
          return {
            ...rest,
            points: b64Vecs.decodePoints(path)
          };
        });
        delete props.scaleX;
        delete props.scaleY;
      }
    },
    {
      id: Versions8.LegacyPointsConversion,
      up: (props) => {
        props.segments = props.segments.map((segment) => {
          if (segment.path !== void 0)
            return segment;
          const { points, ...rest } = segment;
          const vecModels = Array.isArray(points) ? points : b64Vecs._legacyDecodePoints(points);
          return {
            ...rest,
            path: b64Vecs.encodePoints(vecModels)
          };
        });
      },
      down: (_props) => {
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLImageShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ImageShapeCrop = validation_exports.object({
  topLeft: vecModelValidator,
  bottomRight: vecModelValidator,
  isCircle: validation_exports.boolean.optional()
});
var imageShapeProps = {
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  playing: validation_exports.boolean,
  url: validation_exports.linkUrl,
  assetId: assetIdValidator.nullable(),
  crop: ImageShapeCrop.nullable(),
  flipX: validation_exports.boolean,
  flipY: validation_exports.boolean,
  altText: validation_exports.string
};
var Versions9 = createShapePropsMigrationIds("image", {
  AddUrlProp: 1,
  AddCropProp: 2,
  MakeUrlsValid: 3,
  AddFlipProps: 4,
  AddAltText: 5
});
var imageShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions9.AddUrlProp,
      up: (props) => {
        props.url = "";
      },
      down: "retired"
    },
    {
      id: Versions9.AddCropProp,
      up: (props) => {
        props.crop = null;
      },
      down: (props) => {
        delete props.crop;
      }
    },
    {
      id: Versions9.MakeUrlsValid,
      up: (props) => {
        if (!validation_exports.linkUrl.isValid(props.url)) {
          props.url = "";
        }
      },
      down: (_props) => {
      }
    },
    {
      id: Versions9.AddFlipProps,
      up: (props) => {
        props.flipX = false;
        props.flipY = false;
      },
      down: (props) => {
        delete props.flipX;
        delete props.flipY;
      }
    },
    {
      id: Versions9.AddAltText,
      up: (props) => {
        props.altText = "";
      },
      down: (props) => {
        delete props.altText;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLLineShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LineShapeSplineStyle = StyleProp.defineEnum("tldraw:spline", {
  defaultValue: "line",
  values: ["cubic", "line"]
});
var lineShapePointValidator = validation_exports.object({
  id: validation_exports.string,
  index: validation_exports.indexKey,
  x: validation_exports.number,
  y: validation_exports.number
});
var lineShapeProps = {
  color: DefaultColorStyle,
  dash: DefaultDashStyle,
  size: DefaultSizeStyle,
  spline: LineShapeSplineStyle,
  points: validation_exports.dict(validation_exports.string, lineShapePointValidator),
  scale: validation_exports.nonZeroNumber
};
var lineShapeVersions = createShapePropsMigrationIds("line", {
  AddSnapHandles: 1,
  RemoveExtraHandleProps: 2,
  HandlesToPoints: 3,
  PointIndexIds: 4,
  AddScale: 5
});
var lineShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: lineShapeVersions.AddSnapHandles,
      up: (props) => {
        for (const handle of Object.values(props.handles)) {
          ;
          handle.canSnap = true;
        }
      },
      down: "retired"
    },
    {
      id: lineShapeVersions.RemoveExtraHandleProps,
      up: (props) => {
        props.handles = objectMapFromEntries(
          Object.values(props.handles).map((handle) => [
            handle.index,
            {
              x: handle.x,
              y: handle.y
            }
          ])
        );
      },
      down: (props) => {
        const handles = Object.entries(props.handles).map(([index, handle]) => ({ index, ...handle })).sort(sortByIndex);
        props.handles = Object.fromEntries(
          handles.map((handle, i) => {
            const id = i === 0 ? "start" : i === handles.length - 1 ? "end" : `handle:${handle.index}`;
            return [
              id,
              {
                id,
                type: "vertex",
                canBind: false,
                canSnap: true,
                index: handle.index,
                x: handle.x,
                y: handle.y
              }
            ];
          })
        );
      }
    },
    {
      id: lineShapeVersions.HandlesToPoints,
      up: (props) => {
        const sortedHandles = Object.entries(props.handles).map(([index, { x, y }]) => ({ x, y, index })).sort(sortByIndex);
        props.points = sortedHandles.map(({ x, y }) => ({ x, y }));
        delete props.handles;
      },
      down: (props) => {
        const indices = getIndices(props.points.length);
        props.handles = Object.fromEntries(
          props.points.map((handle, i) => {
            const index = indices[i];
            return [
              index,
              {
                x: handle.x,
                y: handle.y
              }
            ];
          })
        );
        delete props.points;
      }
    },
    {
      id: lineShapeVersions.PointIndexIds,
      up: (props) => {
        const indices = getIndices(props.points.length);
        props.points = Object.fromEntries(
          props.points.map((point, i) => {
            const id = indices[i];
            return [
              id,
              {
                id,
                index: id,
                x: point.x,
                y: point.y
              }
            ];
          })
        );
      },
      down: (props) => {
        const sortedHandles = Object.values(props.points).sort(sortByIndex);
        props.points = sortedHandles.map(({ x, y }) => ({ x, y }));
      }
    },
    {
      id: lineShapeVersions.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLNoteShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var noteShapeProps = {
  color: DefaultColorStyle,
  labelColor: DefaultLabelColorStyle,
  size: DefaultSizeStyle,
  font: DefaultFontStyle,
  fontSizeAdjustment: validation_exports.positiveNumber,
  align: DefaultHorizontalAlignStyle,
  verticalAlign: DefaultVerticalAlignStyle,
  growY: validation_exports.positiveNumber,
  url: validation_exports.linkUrl,
  richText: richTextValidator,
  scale: validation_exports.nonZeroNumber
};
var Versions10 = createShapePropsMigrationIds("note", {
  AddUrlProp: 1,
  RemoveJustify: 2,
  MigrateLegacyAlign: 3,
  AddVerticalAlign: 4,
  MakeUrlsValid: 5,
  AddFontSizeAdjustment: 6,
  AddScale: 7,
  AddLabelColor: 8,
  AddRichText: 9,
  AddRichTextAttrs: 10
});
var noteShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions10.AddUrlProp,
      up: (props) => {
        props.url = "";
      },
      down: "retired"
    },
    {
      id: Versions10.RemoveJustify,
      up: (props) => {
        if (props.align === "justify") {
          props.align = "start";
        }
      },
      down: "retired"
    },
    {
      id: Versions10.MigrateLegacyAlign,
      up: (props) => {
        switch (props.align) {
          case "start":
            props.align = "start-legacy";
            return;
          case "end":
            props.align = "end-legacy";
            return;
          default:
            props.align = "middle-legacy";
            return;
        }
      },
      down: "retired"
    },
    {
      id: Versions10.AddVerticalAlign,
      up: (props) => {
        props.verticalAlign = "middle";
      },
      down: "retired"
    },
    {
      id: Versions10.MakeUrlsValid,
      up: (props) => {
        if (!validation_exports.linkUrl.isValid(props.url)) {
          props.url = "";
        }
      },
      down: (_props) => {
      }
    },
    {
      id: Versions10.AddFontSizeAdjustment,
      up: (props) => {
        props.fontSizeAdjustment = 0;
      },
      down: (props) => {
        delete props.fontSizeAdjustment;
      }
    },
    {
      id: Versions10.AddScale,
      up: (props) => {
        props.scale = 1;
      },
      down: (props) => {
        delete props.scale;
      }
    },
    {
      id: Versions10.AddLabelColor,
      up: (props) => {
        props.labelColor = "black";
      },
      down: (props) => {
        delete props.labelColor;
      }
    },
    {
      id: Versions10.AddRichText,
      up: (props) => {
        props.richText = toRichText(props.text);
        delete props.text;
      }
      // N.B. Explicitly no down state so that we force clients to update.
      // down: (props) => {
      // 	delete props.richText
      // },
    },
    {
      id: Versions10.AddRichTextAttrs,
      up: (_props) => {
      },
      down: (props) => {
        if (props.richText && "attrs" in props.richText) {
          delete props.richText.attrs;
        }
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLTextShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/styles/TLTextAlignStyle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DefaultTextAlignStyle = StyleProp.defineEnum("tldraw:textAlign", {
  defaultValue: "start",
  values: ["start", "middle", "end"]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLTextShape.mjs
var textShapeProps = {
  color: DefaultColorStyle,
  size: DefaultSizeStyle,
  font: DefaultFontStyle,
  textAlign: DefaultTextAlignStyle,
  w: validation_exports.nonZeroNumber,
  richText: richTextValidator,
  scale: validation_exports.nonZeroNumber,
  autoSize: validation_exports.boolean
};
var Versions11 = createShapePropsMigrationIds("text", {
  RemoveJustify: 1,
  AddTextAlign: 2,
  AddRichText: 3,
  AddRichTextAttrs: 4
});
var textShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions11.RemoveJustify,
      up: (props) => {
        if (props.align === "justify") {
          props.align = "start";
        }
      },
      down: "retired"
    },
    {
      id: Versions11.AddTextAlign,
      up: (props) => {
        props.textAlign = props.align;
        delete props.align;
      },
      down: (props) => {
        props.align = props.textAlign;
        delete props.textAlign;
      }
    },
    {
      id: Versions11.AddRichText,
      up: (props) => {
        props.richText = toRichText(props.text);
        delete props.text;
      }
      // N.B. Explicitly no down state so that we force clients to update.
      // down: (props) => {
      // 	delete props.richText
      // },
    },
    {
      id: Versions11.AddRichTextAttrs,
      up: (_props) => {
      },
      down: (props) => {
        if (props.richText && "attrs" in props.richText) {
          delete props.richText.attrs;
        }
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/shapes/TLVideoShape.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var videoShapeProps = {
  w: validation_exports.nonZeroNumber,
  h: validation_exports.nonZeroNumber,
  time: validation_exports.number,
  playing: validation_exports.boolean,
  autoplay: validation_exports.boolean,
  url: validation_exports.linkUrl,
  assetId: assetIdValidator.nullable(),
  altText: validation_exports.string
};
var Versions12 = createShapePropsMigrationIds("video", {
  AddUrlProp: 1,
  MakeUrlsValid: 2,
  AddAltText: 3,
  AddAutoplay: 4
});
var videoShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: Versions12.AddUrlProp,
      up: (props) => {
        props.url = "";
      },
      down: "retired"
    },
    {
      id: Versions12.MakeUrlsValid,
      up: (props) => {
        if (!validation_exports.linkUrl.isValid(props.url)) {
          props.url = "";
        }
      },
      down: (_props) => {
      }
    },
    {
      id: Versions12.AddAltText,
      up: (props) => {
        props.altText = "";
      },
      down: (props) => {
        delete props.altText;
      }
    },
    {
      id: Versions12.AddAutoplay,
      up: (props) => {
        props.autoplay = true;
      },
      down: (props) => {
        delete props.autoplay;
      }
    }
  ]
});

// ../../node_modules/@tldraw/tlschema/dist-esm/store-migrations.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Versions13 = createMigrationIds("com.tldraw.store", {
  RemoveCodeAndIconShapeTypes: 1,
  AddInstancePresenceType: 2,
  RemoveTLUserAndPresenceAndAddPointer: 3,
  RemoveUserDocument: 4,
  FixIndexKeys: 5
});
var storeMigrations = createMigrationSequence({
  sequenceId: "com.tldraw.store",
  retroactive: false,
  sequence: [
    {
      id: Versions13.RemoveCodeAndIconShapeTypes,
      scope: "storage",
      up: (storage) => {
        for (const [id, record] of storage.entries()) {
          if (record.typeName === "shape" && "type" in record && (record.type === "icon" || record.type === "code")) {
            storage.delete(id);
          }
        }
      }
    },
    {
      id: Versions13.AddInstancePresenceType,
      scope: "storage",
      up(_storage) {
      }
    },
    {
      // remove user and presence records and add pointer records
      id: Versions13.RemoveTLUserAndPresenceAndAddPointer,
      scope: "storage",
      up: (storage) => {
        for (const [id, record] of storage.entries()) {
          if (record.typeName.match(/^(user|user_presence)$/)) {
            storage.delete(id);
          }
        }
      }
    },
    {
      // remove user document records
      id: Versions13.RemoveUserDocument,
      scope: "storage",
      up: (storage) => {
        for (const [id, record] of storage.entries()) {
          if (record.typeName.match("user_document")) {
            storage.delete(id);
          }
        }
      }
    },
    {
      id: Versions13.FixIndexKeys,
      scope: "record",
      up: (record) => {
        if (["shape", "page"].includes(record.typeName) && "index" in record) {
          const recordWithIndex = record;
          if (recordWithIndex.index.endsWith("0") && recordWithIndex.index !== "a0") {
            recordWithIndex.index = recordWithIndex.index.slice(0, -1) + getNRandomBase62Digits(3);
          }
          if (record.typeName === "shape" && recordWithIndex.type === "line") {
            const lineShape = recordWithIndex;
            for (const [_, point] of objectMapEntries(lineShape.props.points)) {
              if (point.index.endsWith("0") && point.index !== "a0") {
                point.index = point.index.slice(0, -1) + getNRandomBase62Digits(3);
              }
            }
          }
        }
      },
      down: () => {
      }
    }
  ]
});
var BASE_62_DIGITS_WITHOUT_ZERO = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var getRandomBase62Digit = /* @__PURE__ */ __name(() => {
  return BASE_62_DIGITS_WITHOUT_ZERO.charAt(
    Math.floor(Math.random() * BASE_62_DIGITS_WITHOUT_ZERO.length)
  );
}, "getRandomBase62Digit");
var getNRandomBase62Digits = /* @__PURE__ */ __name((n) => {
  return Array.from({ length: n }, getRandomBase62Digit).join("");
}, "getNRandomBase62Digits");

// ../../node_modules/@tldraw/tlschema/dist-esm/createTLSchema.mjs
var defaultShapeSchemas = {
  arrow: { migrations: arrowShapeMigrations, props: arrowShapeProps },
  bookmark: { migrations: bookmarkShapeMigrations, props: bookmarkShapeProps },
  draw: { migrations: drawShapeMigrations, props: drawShapeProps },
  embed: { migrations: embedShapeMigrations, props: embedShapeProps },
  frame: { migrations: frameShapeMigrations, props: frameShapeProps },
  geo: { migrations: geoShapeMigrations, props: geoShapeProps },
  group: { migrations: groupShapeMigrations, props: groupShapeProps },
  highlight: { migrations: highlightShapeMigrations, props: highlightShapeProps },
  image: { migrations: imageShapeMigrations, props: imageShapeProps },
  line: { migrations: lineShapeMigrations, props: lineShapeProps },
  note: { migrations: noteShapeMigrations, props: noteShapeProps },
  text: { migrations: textShapeMigrations, props: textShapeProps },
  video: { migrations: videoShapeMigrations, props: videoShapeProps }
};
var defaultBindingSchemas = {
  arrow: { migrations: arrowBindingMigrations, props: arrowBindingProps }
};
function createTLSchema({
  shapes = defaultShapeSchemas,
  bindings = defaultBindingSchemas,
  migrations
} = {}) {
  const stylesById = /* @__PURE__ */ new Map();
  for (const shape of objectMapValues(shapes)) {
    for (const style of getShapePropKeysByStyle(shape.props ?? {}).keys()) {
      if (stylesById.has(style.id) && stylesById.get(style.id) !== style) {
        throw new Error(`Multiple StyleProp instances with the same id: ${style.id}`);
      }
      stylesById.set(style.id, style);
    }
  }
  const ShapeRecordType = createShapeRecordType(shapes);
  const BindingRecordType = createBindingRecordType(bindings);
  const InstanceRecordType = createInstanceRecordType(stylesById);
  return StoreSchema.create(
    {
      asset: AssetRecordType,
      binding: BindingRecordType,
      camera: CameraRecordType,
      document: DocumentRecordType,
      instance: InstanceRecordType,
      instance_page_state: InstancePageStateRecordType,
      page: PageRecordType,
      instance_presence: InstancePresenceRecordType,
      pointer: PointerRecordType,
      shape: ShapeRecordType
    },
    {
      migrations: [
        storeMigrations,
        assetMigrations,
        cameraMigrations,
        documentMigrations,
        instanceMigrations,
        instancePageStateMigrations,
        pageMigrations,
        instancePresenceMigrations,
        pointerMigrations,
        rootShapeMigrations,
        bookmarkAssetMigrations,
        imageAssetMigrations,
        videoAssetMigrations,
        ...processPropsMigrations("shape", shapes),
        ...processPropsMigrations("binding", bindings),
        ...migrations ?? []
      ],
      onValidationFailure,
      createIntegrityChecker
    }
  );
}
__name(createTLSchema, "createTLSchema");

// ../../node_modules/@tldraw/tlschema/dist-esm/misc/TLHandle.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/translations/translations.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/translations/languages.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/tlschema/dist-esm/index.mjs
registerTldrawLibraryVersion(
  "@tldraw/tlschema",
  "4.5.12",
  "esm"
);

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/MicrotaskNotifier.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var MicrotaskNotifier = class {
  listeners = /* @__PURE__ */ new Set();
  notify(...props) {
    queueMicrotask(() => {
      for (const listener of this.listeners) {
        try {
          listener(...props);
        } catch (error3) {
          console.error("Error in MicrotaskNotifier listener", error3);
        }
      }
    });
  }
  register(_listener) {
    let didDelete = false;
    queueMicrotask(() => {
      if (didDelete)
        return;
      this.listeners.add(_listener);
    });
    return () => {
      if (didDelete)
        return;
      didDelete = true;
      this.listeners.delete(_listener);
    };
  }
};
__name(MicrotaskNotifier, "MicrotaskNotifier");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/InMemorySyncStorage.mjs
var TOMBSTONE_PRUNE_BUFFER_SIZE = 1e3;
var MAX_TOMBSTONES = 5e3;
function computeTombstonePruning({
  tombstones,
  documentClock,
  maxTombstones = MAX_TOMBSTONES,
  pruneBufferSize = TOMBSTONE_PRUNE_BUFFER_SIZE
}) {
  if (tombstones.length <= maxTombstones) {
    return null;
  }
  let cutoff = pruneBufferSize + tombstones.length - maxTombstones;
  while (cutoff < tombstones.length && tombstones[cutoff - 1]?.clock === tombstones[cutoff]?.clock) {
    cutoff++;
  }
  const oldestRemaining = tombstones[cutoff];
  const newTombstoneHistoryStartsAtClock = oldestRemaining?.clock ?? documentClock;
  const idsToDelete = tombstones.slice(0, cutoff).map((t) => t.id);
  return { newTombstoneHistoryStartsAtClock, idsToDelete };
}
__name(computeTombstonePruning, "computeTombstonePruning");
var DEFAULT_INITIAL_SNAPSHOT = {
  documentClock: 0,
  tombstoneHistoryStartsAtClock: 0,
  schema: createTLSchema().serialize(),
  documents: [
    {
      state: DocumentRecordType.create({ id: TLDOCUMENT_ID }),
      lastChangedClock: 0
    },
    {
      state: PageRecordType.create({
        id: "page:page",
        name: "Page 1",
        index: "a1"
      }),
      lastChangedClock: 0
    }
  ]
};
var InMemorySyncStorage = class {
  /** @internal */
  documents;
  /** @internal */
  tombstones;
  /** @internal */
  schema;
  /** @internal */
  documentClock;
  /** @internal */
  tombstoneHistoryStartsAtClock;
  notifier = new MicrotaskNotifier();
  onChange(callback) {
    return this.notifier.register(callback);
  }
  constructor({
    snapshot = DEFAULT_INITIAL_SNAPSHOT,
    onChange
  } = {}) {
    const maxClockValue = Math.max(
      0,
      ...Object.values(snapshot.tombstones ?? {}),
      ...Object.values(snapshot.documents.map((d) => d.lastChangedClock))
    );
    this.documents = new AtomMap(
      "room documents",
      snapshot.documents.map((d) => [
        d.state.id,
        { state: devFreeze(d.state), lastChangedClock: d.lastChangedClock }
      ])
    );
    const documentClock = Math.max(maxClockValue, snapshot.documentClock ?? snapshot.clock ?? 0);
    this.documentClock = atom("document clock", documentClock);
    const tombstoneHistoryStartsAtClock = Math.min(
      snapshot.tombstoneHistoryStartsAtClock ?? documentClock,
      documentClock
    );
    this.tombstoneHistoryStartsAtClock = atom(
      "tombstone history starts at clock",
      tombstoneHistoryStartsAtClock
    );
    this.schema = atom("schema", snapshot.schema ?? createTLSchema().serializeEarliestVersion());
    this.tombstones = new AtomMap(
      "room tombstones",
      // If the tombstone history starts now (or we didn't have the
      // tombstoneHistoryStartsAtClock) then there are no tombstones
      tombstoneHistoryStartsAtClock === documentClock ? [] : objectMapEntries(snapshot.tombstones ?? {})
    );
    if (onChange) {
      this.onChange(onChange);
    }
  }
  transaction(callback, opts) {
    const clockBefore = this.documentClock.get();
    const trackChanges = opts?.emitChanges === "always";
    const txn = new InMemorySyncStorageTransaction(this);
    let result;
    let changes;
    try {
      result = transaction(() => {
        return callback(txn);
      });
      if (trackChanges) {
        changes = txn.getChangesSince(clockBefore)?.diff;
      }
    } catch (error3) {
      console.error("Error in transaction", error3);
      throw error3;
    } finally {
      txn.close();
    }
    if (typeof result === "object" && result && "then" in result && typeof result.then === "function") {
      const err = new Error("Transaction must return a value, not a promise");
      console.error(err);
      throw err;
    }
    const clockAfter = this.documentClock.get();
    const didChange = clockAfter > clockBefore;
    if (didChange) {
      this.notifier.notify({ id: opts?.id, documentClock: clockAfter });
    }
    return { documentClock: clockAfter, didChange: clockAfter > clockBefore, result, changes };
  }
  getClock() {
    return this.documentClock.get();
  }
  /** @internal */
  pruneTombstones = (0, import_lodash4.default)(
    () => {
      if (this.tombstones.size > MAX_TOMBSTONES) {
        const tombstones = Array.from(this.tombstones.entries()).map(([id, clock]) => ({ id, clock })).sort((a, b) => a.clock - b.clock);
        const result = computeTombstonePruning({
          tombstones,
          documentClock: this.documentClock.get()
        });
        if (result) {
          this.tombstoneHistoryStartsAtClock.set(result.newTombstoneHistoryStartsAtClock);
          this.tombstones.deleteMany(result.idsToDelete);
        }
      }
    },
    1e3,
    // prevent this from running synchronously to avoid blocking requests
    { leading: false }
  );
  getSnapshot() {
    return {
      tombstoneHistoryStartsAtClock: this.tombstoneHistoryStartsAtClock.get(),
      documentClock: this.documentClock.get(),
      documents: Array.from(this.documents.values()),
      tombstones: Object.fromEntries(this.tombstones.entries()),
      schema: this.schema.get()
    };
  }
};
__name(InMemorySyncStorage, "InMemorySyncStorage");
var InMemorySyncStorageTransaction = class {
  constructor(storage) {
    this.storage = storage;
    this._clock = this.storage.documentClock.get();
  }
  _clock;
  _closed = false;
  /** @internal */
  close() {
    this._closed = true;
  }
  assertNotClosed() {
    assert3(!this._closed, "Transaction has ended, iterator cannot be consumed");
  }
  getClock() {
    return this._clock;
  }
  didIncrementClock = false;
  getNextClock() {
    if (!this.didIncrementClock) {
      this.didIncrementClock = true;
      this._clock = this.storage.documentClock.set(this.storage.documentClock.get() + 1);
    }
    return this._clock;
  }
  get(id) {
    this.assertNotClosed();
    return this.storage.documents.get(id)?.state;
  }
  set(id, record) {
    this.assertNotClosed();
    assert3(id === record.id, `Record id mismatch: key does not match record.id`);
    const clock = this.getNextClock();
    if (this.storage.tombstones.has(id)) {
      this.storage.tombstones.delete(id);
    }
    this.storage.documents.set(id, {
      state: devFreeze(record),
      lastChangedClock: clock
    });
  }
  delete(id) {
    this.assertNotClosed();
    if (!this.storage.documents.has(id))
      return;
    const clock = this.getNextClock();
    this.storage.documents.delete(id);
    this.storage.tombstones.set(id, clock);
    this.storage.pruneTombstones();
  }
  *entries() {
    this.assertNotClosed();
    for (const [id, record] of this.storage.documents.entries()) {
      this.assertNotClosed();
      yield [id, record.state];
    }
  }
  *keys() {
    this.assertNotClosed();
    for (const key of this.storage.documents.keys()) {
      this.assertNotClosed();
      yield key;
    }
  }
  *values() {
    this.assertNotClosed();
    for (const record of this.storage.documents.values()) {
      this.assertNotClosed();
      yield record.state;
    }
  }
  getSchema() {
    this.assertNotClosed();
    return this.storage.schema.get();
  }
  setSchema(schema2) {
    this.assertNotClosed();
    this.storage.schema.set(schema2);
  }
  getChangesSince(sinceClock) {
    this.assertNotClosed();
    const clock = this.storage.documentClock.get();
    if (sinceClock === clock)
      return void 0;
    if (sinceClock > clock) {
      sinceClock = -1;
    }
    const diff = { puts: {}, deletes: [] };
    const wipeAll = sinceClock < this.storage.tombstoneHistoryStartsAtClock.get();
    for (const doc of this.storage.documents.values()) {
      if (wipeAll || doc.lastChangedClock > sinceClock) {
        diff.puts[doc.state.id] = doc.state;
      }
    }
    if (!wipeAll) {
      for (const [id, clock2] of this.storage.tombstones.entries()) {
        if (clock2 > sinceClock) {
          diff.deletes.push(id);
        }
      }
    }
    return { diff, wipeAll };
  }
};
__name(InMemorySyncStorageTransaction, "InMemorySyncStorageTransaction");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/NodeSqliteWrapper.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/RoomSession.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RoomSessionState = {
  /** Session is waiting for the initial connect message from the client */
  AwaitingConnectMessage: "awaiting-connect-message",
  /** Session is disconnected but waiting for final cleanup before removal */
  AwaitingRemoval: "awaiting-removal",
  /** Session is fully connected and actively synchronizing */
  Connected: "connected"
};
var SESSION_START_WAIT_TIME = 1e4;
var SESSION_REMOVAL_WAIT_TIME = 5e3;
var SESSION_IDLE_TIMEOUT = 2e4;

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/SQLiteSyncStorage.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSyncStorage.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function toNetworkDiff(diff) {
  const networkDiff = {};
  for (const [id, put] of objectMapEntriesIterable(diff.puts)) {
    if (Array.isArray(put)) {
      const patch = diffRecord(put[0], put[1]);
      if (patch) {
        networkDiff[id] = [RecordOpType.Patch, patch];
      }
    } else {
      networkDiff[id] = [RecordOpType.Put, put];
    }
  }
  for (const id of diff.deletes) {
    networkDiff[id] = [RecordOpType.Remove];
  }
  return networkDiff;
}
__name(toNetworkDiff, "toNetworkDiff");
function loadSnapshotIntoStorage(txn, schema2, snapshot) {
  snapshot = convertStoreSnapshotToRoomSnapshot(snapshot);
  assert3(snapshot.schema, "Schema is required");
  const docIds = /* @__PURE__ */ new Set();
  for (const doc of snapshot.documents) {
    docIds.add(doc.state.id);
    const existing = txn.get(doc.state.id);
    if ((0, import_lodash2.default)(existing, doc.state))
      continue;
    txn.set(doc.state.id, doc.state);
  }
  for (const id of txn.keys()) {
    if (!docIds.has(id)) {
      txn.delete(id);
    }
  }
  txn.setSchema(snapshot.schema);
  schema2.migrateStorage(txn);
}
__name(loadSnapshotIntoStorage, "loadSnapshotIntoStorage");
function convertStoreSnapshotToRoomSnapshot(snapshot) {
  if ("documents" in snapshot)
    return snapshot;
  return {
    clock: 0,
    documentClock: 0,
    documents: objectMapValues(snapshot.store).map((state) => ({
      state,
      lastChangedClock: 0
    })),
    schema: snapshot.schema,
    tombstones: {}
  };
}
__name(convertStoreSnapshotToRoomSnapshot, "convertStoreSnapshotToRoomSnapshot");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/SQLiteSyncStorage.mjs
function migrateSqliteSyncStorage(storage, {
  documentsTable = "documents",
  tombstonesTable = "tombstones",
  metadataTable = "metadata"
} = {}) {
  let migrationVersion = 0;
  try {
    const row = storage.prepare(`SELECT migrationVersion FROM ${metadataTable} LIMIT 1`).all()[0];
    migrationVersion = row?.migrationVersion ?? 0;
  } catch (_e) {
  }
  if (migrationVersion === 0) {
    migrationVersion++;
    storage.exec(`
			CREATE TABLE ${documentsTable} (
				id TEXT PRIMARY KEY,
				state BLOB NOT NULL,
				lastChangedClock INTEGER NOT NULL
			);

			CREATE INDEX idx_${documentsTable}_lastChangedClock ON ${documentsTable}(lastChangedClock);

			CREATE TABLE ${tombstonesTable} (
				id TEXT PRIMARY KEY,
				clock INTEGER NOT NULL
			);
			CREATE INDEX idx_${tombstonesTable}_clock ON ${tombstonesTable}(clock);

			-- This table is used to store the metadata for the sync storage.
			-- There should only be one row in this table.
			CREATE TABLE ${metadataTable} (
			  migrationVersion INTEGER NOT NULL,
				documentClock INTEGER NOT NULL,
				tombstoneHistoryStartsAtClock INTEGER NOT NULL,
				schema TEXT NOT NULL
			);
			
			INSERT INTO ${metadataTable} (migrationVersion, documentClock, tombstoneHistoryStartsAtClock, schema) VALUES (2, 0, 0, '')
		`);
    migrationVersion++;
  }
  if (migrationVersion === 1) {
    migrationVersion++;
    storage.exec(`
			CREATE TABLE ${documentsTable}_new (
				id TEXT PRIMARY KEY,
				state BLOB NOT NULL,
				lastChangedClock INTEGER NOT NULL
			);
			
			INSERT INTO ${documentsTable}_new (id, state, lastChangedClock)
			SELECT id, CAST(state AS BLOB), lastChangedClock FROM ${documentsTable};
			
			DROP TABLE ${documentsTable};
			
			ALTER TABLE ${documentsTable}_new RENAME TO ${documentsTable};
			
			CREATE INDEX idx_${documentsTable}_lastChangedClock ON ${documentsTable}(lastChangedClock);
		`);
  }
  storage.exec(`UPDATE ${metadataTable} SET migrationVersion = ${migrationVersion}`);
}
__name(migrateSqliteSyncStorage, "migrateSqliteSyncStorage");
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
function encodeState(state) {
  return textEncoder.encode(JSON.stringify(state));
}
__name(encodeState, "encodeState");
function decodeState(state) {
  return JSON.parse(textDecoder.decode(state));
}
__name(decodeState, "decodeState");
var SQLiteSyncStorage = class {
  /**
   * Check if the storage has been initialized (has data in the clock table).
   * Useful for determining whether to load from an external source on first access.
   */
  static hasBeenInitialized(storage) {
    const prefix = storage.config?.tablePrefix ?? "";
    try {
      const schema2 = storage.prepare(`SELECT schema FROM ${prefix}metadata LIMIT 1`).all()[0]?.schema;
      return !!schema2;
    } catch (_e) {
      return false;
    }
  }
  /**
   * Get the current document clock value from storage without fully initializing.
   * Returns null if storage has not been initialized.
   * Useful for comparing storage freshness against external sources.
   */
  static getDocumentClock(storage) {
    const prefix = storage.config?.tablePrefix ?? "";
    try {
      const row = storage.prepare(`SELECT documentClock FROM ${prefix}metadata LIMIT 1`).all()[0];
      if (row && SQLiteSyncStorage.hasBeenInitialized(storage)) {
        return row.documentClock;
      }
      return null;
    } catch (_e) {
      return null;
    }
  }
  // Prepared statements - created once, reused many times
  stmts;
  sql;
  constructor({
    sql,
    snapshot,
    onChange
  }) {
    this.sql = sql;
    const prefix = sql.config?.tablePrefix ?? "";
    const documentsTable = `${prefix}documents`;
    const tombstonesTable = `${prefix}tombstones`;
    const metadataTable = `${prefix}metadata`;
    migrateSqliteSyncStorage(this.sql, { documentsTable, tombstonesTable, metadataTable });
    this.stmts = {
      // Metadata
      getDocumentClock: this.sql.prepare(
        `SELECT documentClock FROM ${metadataTable} LIMIT 1`
      ),
      getTombstoneHistoryStartsAtClock: this.sql.prepare(
        `SELECT tombstoneHistoryStartsAtClock FROM ${metadataTable}`
      ),
      getSchema: this.sql.prepare(`SELECT schema FROM ${metadataTable}`),
      setSchema: this.sql.prepare(`UPDATE ${metadataTable} SET schema = ?`),
      setTombstoneHistoryStartsAtClock: this.sql.prepare(
        `UPDATE ${metadataTable} SET tombstoneHistoryStartsAtClock = ?`
      ),
      incrementDocumentClock: this.sql.prepare(
        `UPDATE ${metadataTable} SET documentClock = documentClock + 1`
      ),
      // Documents
      getDocument: this.sql.prepare(
        `SELECT state FROM ${documentsTable} WHERE id = ?`
      ),
      insertDocument: this.sql.prepare(`INSERT OR REPLACE INTO ${documentsTable} (id, state, lastChangedClock) VALUES (?, ?, ?)`),
      deleteDocument: this.sql.prepare(
        `DELETE FROM ${documentsTable} WHERE id = ?`
      ),
      documentExists: this.sql.prepare(
        `SELECT id FROM ${documentsTable} WHERE id = ?`
      ),
      iterateDocuments: this.sql.prepare(
        `SELECT state, lastChangedClock FROM ${documentsTable}`
      ),
      iterateDocumentEntries: this.sql.prepare(
        `SELECT id, state FROM ${documentsTable}`
      ),
      iterateDocumentKeys: this.sql.prepare(`SELECT id FROM ${documentsTable}`),
      iterateDocumentValues: this.sql.prepare(
        `SELECT state FROM ${documentsTable}`
      ),
      getDocumentsChangedSince: this.sql.prepare(
        `SELECT state FROM ${documentsTable} WHERE lastChangedClock > ?`
      ),
      // Tombstones
      insertTombstone: this.sql.prepare(
        `INSERT OR REPLACE INTO ${tombstonesTable} (id, clock) VALUES (?, ?)`
      ),
      deleteTombstone: this.sql.prepare(
        `DELETE FROM ${tombstonesTable} WHERE id = ?`
      ),
      deleteTombstonesBefore: this.sql.prepare(
        `DELETE FROM ${tombstonesTable} WHERE clock < ?`
      ),
      countTombstones: this.sql.prepare(
        `SELECT count(*) as count FROM ${tombstonesTable}`
      ),
      iterateTombstones: this.sql.prepare(
        `SELECT id, clock FROM ${tombstonesTable} ORDER BY clock ASC`
      ),
      getTombstonesChangedSince: this.sql.prepare(
        `SELECT id FROM ${tombstonesTable} WHERE clock > ?`
      ),
      // Initial setup (only used when loading a snapshot)
      updateMetadata: this.sql.prepare(
        `UPDATE ${metadataTable} SET documentClock = ?, tombstoneHistoryStartsAtClock = ?, schema = ?`
      )
    };
    const hasData = SQLiteSyncStorage.hasBeenInitialized(sql);
    if (snapshot || !hasData) {
      snapshot = convertStoreSnapshotToRoomSnapshot(snapshot ?? DEFAULT_INITIAL_SNAPSHOT);
      const documentClock = snapshot.documentClock ?? snapshot.clock ?? 0;
      const tombstoneHistoryStartsAtClock = snapshot.tombstoneHistoryStartsAtClock ?? documentClock;
      this.sql.exec(`
				DELETE FROM ${documentsTable};
				DELETE FROM ${tombstonesTable};
			`);
      for (const doc of snapshot.documents) {
        this.stmts.insertDocument.run(doc.state.id, encodeState(doc.state), doc.lastChangedClock);
      }
      if (snapshot.tombstones) {
        for (const [id, clock] of objectMapEntries(snapshot.tombstones)) {
          this.stmts.insertTombstone.run(id, clock);
        }
      }
      this.stmts.updateMetadata.run(
        documentClock,
        tombstoneHistoryStartsAtClock,
        JSON.stringify(snapshot.schema)
      );
    }
    if (onChange) {
      this.onChange(onChange);
    }
  }
  notifier = new MicrotaskNotifier();
  onChange(callback) {
    return this.notifier.register(callback);
  }
  transaction(callback, opts) {
    const clockBefore = this.getClock();
    const trackChanges = opts?.emitChanges === "always";
    return this.sql.transaction(() => {
      const txn = new SQLiteSyncStorageTransaction(this, this.stmts);
      let result;
      let changes;
      try {
        result = transaction(() => {
          return callback(txn);
        });
        if (trackChanges) {
          changes = txn.getChangesSince(clockBefore)?.diff;
        }
      } finally {
        txn.close();
      }
      if (typeof result === "object" && result && "then" in result && typeof result.then === "function") {
        throw new Error("Transaction must return a value, not a promise");
      }
      const clockAfter = this.getClock();
      const didChange = clockAfter > clockBefore;
      if (didChange) {
        this.notifier.notify({ id: opts?.id, documentClock: clockAfter });
      }
      return { documentClock: clockAfter, didChange: clockAfter > clockBefore, result, changes };
    });
  }
  getClock() {
    const clockRow = this.stmts.getDocumentClock.all()[0];
    return clockRow?.documentClock ?? 0;
  }
  /** @internal */
  _getTombstoneHistoryStartsAtClock() {
    const clockRow = this.stmts.getTombstoneHistoryStartsAtClock.all()[0];
    return clockRow?.tombstoneHistoryStartsAtClock ?? 0;
  }
  /** @internal */
  _getSchema() {
    const clockRow = this.stmts.getSchema.all()[0];
    assert3(clockRow, "Storage not initialized - clock row missing");
    return JSON.parse(clockRow.schema);
  }
  /** @internal */
  _setSchema(schema2) {
    this.stmts.setSchema.run(JSON.stringify(schema2));
  }
  /** @internal */
  pruneTombstones = (0, import_lodash4.default)(
    () => {
      const tombstoneCount = this.stmts.countTombstones.all()[0].count;
      if (tombstoneCount > MAX_TOMBSTONES) {
        const tombstones = this.stmts.iterateTombstones.all();
        const result = computeTombstonePruning({ tombstones, documentClock: this.getClock() });
        if (result) {
          this.stmts.setTombstoneHistoryStartsAtClock.run(result.newTombstoneHistoryStartsAtClock);
          this.stmts.deleteTombstonesBefore.run(result.newTombstoneHistoryStartsAtClock);
        }
      }
    },
    1e3,
    // prevent this from running synchronously to avoid blocking requests
    { leading: false }
  );
  getSnapshot() {
    return {
      tombstoneHistoryStartsAtClock: this._getTombstoneHistoryStartsAtClock(),
      documentClock: this.getClock(),
      documents: Array.from(this._iterateDocuments()),
      tombstones: Object.fromEntries(this._iterateTombstones()),
      schema: this._getSchema()
    };
  }
  *_iterateDocuments() {
    for (const row of this.stmts.iterateDocuments.iterate()) {
      yield { state: decodeState(row.state), lastChangedClock: row.lastChangedClock };
    }
  }
  *_iterateTombstones() {
    for (const row of this.stmts.iterateTombstones.iterate()) {
      yield [row.id, row.clock];
    }
  }
};
__name(SQLiteSyncStorage, "SQLiteSyncStorage");
var SQLiteSyncStorageTransaction = class {
  constructor(storage, stmts) {
    this.storage = storage;
    this.stmts = stmts;
    this._clock = this.storage.getClock();
  }
  _clock;
  _closed = false;
  _didIncrementClock = false;
  /** @internal */
  close() {
    this._closed = true;
  }
  assertNotClosed() {
    assert3(!this._closed, "Transaction has ended, iterator cannot be consumed");
  }
  getClock() {
    return this._clock;
  }
  getNextClock() {
    if (!this._didIncrementClock) {
      this._didIncrementClock = true;
      this.stmts.incrementDocumentClock.run();
      this._clock = this.storage.getClock();
    }
    return this._clock;
  }
  get(id) {
    this.assertNotClosed();
    const row = this.stmts.getDocument.all(id)[0];
    if (!row)
      return void 0;
    return decodeState(row.state);
  }
  set(id, record) {
    this.assertNotClosed();
    assert3(id === record.id, `Record id mismatch: key does not match record.id`);
    const clock = this.getNextClock();
    this.stmts.deleteTombstone.run(id);
    this.stmts.insertDocument.run(id, encodeState(record), clock);
  }
  delete(id) {
    this.assertNotClosed();
    const exists = this.stmts.documentExists.all(id)[0];
    if (!exists)
      return;
    const clock = this.getNextClock();
    this.stmts.deleteDocument.run(id);
    this.stmts.insertTombstone.run(id, clock);
    this.storage.pruneTombstones();
  }
  *entries() {
    this.assertNotClosed();
    for (const row of this.stmts.iterateDocumentEntries.iterate()) {
      this.assertNotClosed();
      yield [row.id, decodeState(row.state)];
    }
  }
  *keys() {
    this.assertNotClosed();
    for (const row of this.stmts.iterateDocumentKeys.iterate()) {
      this.assertNotClosed();
      yield row.id;
    }
  }
  *values() {
    this.assertNotClosed();
    for (const row of this.stmts.iterateDocumentValues.iterate()) {
      this.assertNotClosed();
      yield decodeState(row.state);
    }
  }
  getSchema() {
    this.assertNotClosed();
    return this.storage._getSchema();
  }
  setSchema(schema2) {
    this.assertNotClosed();
    this.storage._setSchema(schema2);
  }
  getChangesSince(sinceClock) {
    this.assertNotClosed();
    const clock = this.storage.getClock();
    if (sinceClock === clock)
      return void 0;
    if (sinceClock > clock) {
      sinceClock = -1;
    }
    const diff = { puts: {}, deletes: [] };
    const wipeAll = sinceClock < this.storage._getTombstoneHistoryStartsAtClock();
    if (wipeAll) {
      for (const row of this.stmts.iterateDocumentValues.iterate()) {
        const state = decodeState(row.state);
        diff.puts[state.id] = state;
      }
    } else {
      for (const row of this.stmts.getDocumentsChangedSince.iterate(sinceClock)) {
        const state = decodeState(row.state);
        diff.puts[state.id] = state;
      }
      for (const row of this.stmts.getTombstonesChangedSince.iterate(sinceClock)) {
        diff.deletes.push(row.id);
      }
    }
    return { diff, wipeAll };
  }
};
__name(SQLiteSyncStorageTransaction, "SQLiteSyncStorageTransaction");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLRemoteSyncError.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSocketRoom.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/ServerSocketAdapter.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ServerSocketAdapter = class {
  /**
   * Creates a new ServerSocketAdapter instance.
   *
   * opts - Configuration options for the adapter
   */
  constructor(opts) {
    this.opts = opts;
  }
  /**
   * Checks if the underlying WebSocket connection is currently open and ready to send messages.
   *
   * @returns True if the connection is open (readyState === 1), false otherwise
   */
  // eslint-disable-next-line no-restricted-syntax
  get isOpen() {
    return this.opts.ws.readyState === 1;
  }
  /**
   * Sends a sync protocol message to the connected client. The message is JSON stringified
   * before being sent through the WebSocket. If configured, the onBeforeSendMessage callback
   * is invoked before sending.
   *
   * @param msg - The sync protocol message to send
   */
  // see TLRoomSocket for details on why this accepts a union and not just arrays
  sendMessage(msg) {
    const message2 = JSON.stringify(msg);
    this.opts.onBeforeSendMessage?.(msg, message2);
    this.opts.ws.send(message2);
  }
  /**
   * Closes the WebSocket connection with an optional close code and reason.
   *
   * @param code - Optional close code (default: 1000 for normal closure)
   * @param reason - Optional human-readable reason for closing
   */
  close(code, reason) {
    this.opts.ws.close(code, reason);
  }
};
__name(ServerSocketAdapter, "ServerSocketAdapter");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSyncRoom.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/nanoevents/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var createNanoEvents = /* @__PURE__ */ __name(() => ({
  events: {},
  emit(event, ...args) {
    let callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args);
    }
  },
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
}), "createNanoEvents");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/recordDiff.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function diffAndValidateRecord(prevState, newState, recordType, legacyAppendMode = false) {
  const diff = diffRecord(prevState, newState, legacyAppendMode);
  if (!diff)
    return;
  try {
    recordType.validate(newState);
  } catch (error3) {
    throw new TLSyncError(error3.message, TLSyncErrorCloseEventReason.INVALID_RECORD);
  }
  return diff;
}
__name(diffAndValidateRecord, "diffAndValidateRecord");
function applyAndDiffRecord(prevState, diff, recordType, legacyAppendMode = false) {
  const newState = applyObjectDiff(prevState, diff);
  if (newState === prevState)
    return;
  const actualDiff = diffAndValidateRecord(prevState, newState, recordType, legacyAppendMode);
  if (!actualDiff)
    return;
  return [actualDiff, newState];
}
__name(applyAndDiffRecord, "applyAndDiffRecord");
function validateRecord(state, recordType) {
  try {
    recordType.validate(state);
  } catch (error3) {
    throw new TLSyncError(error3.message, TLSyncErrorCloseEventReason.INVALID_RECORD);
  }
}
__name(validateRecord, "validateRecord");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSyncRoom.mjs
var DATA_MESSAGE_DEBOUNCE_INTERVAL = 1e3 / 60;
var timeSince = /* @__PURE__ */ __name((time3) => Date.now() - time3, "timeSince");
var TLSyncRoom = class {
  // A table of connected clients
  sessions = /* @__PURE__ */ new Map();
  lastDocumentClock = 0;
  // eslint-disable-next-line local/prefer-class-methods
  pruneSessions = () => {
    for (const client of this.sessions.values()) {
      switch (client.state) {
        case RoomSessionState.Connected: {
          const hasTimedOut = timeSince(client.lastInteractionTime) > SESSION_IDLE_TIMEOUT;
          if (hasTimedOut || !client.socket.isOpen) {
            this.cancelSession(client.sessionId);
          }
          break;
        }
        case RoomSessionState.AwaitingConnectMessage: {
          const hasTimedOut = timeSince(client.sessionStartTime) > SESSION_START_WAIT_TIME;
          if (hasTimedOut || !client.socket.isOpen) {
            this.removeSession(client.sessionId);
          }
          break;
        }
        case RoomSessionState.AwaitingRemoval: {
          const hasTimedOut = timeSince(client.cancellationTime) > SESSION_REMOVAL_WAIT_TIME;
          if (hasTimedOut) {
            this.removeSession(client.sessionId);
          }
          break;
        }
        default: {
          exhaustiveSwitchError(client);
        }
      }
    }
  };
  presenceStore = new PresenceStore();
  disposables = [interval(this.pruneSessions, 2e3)];
  _isClosed = false;
  /**
   * Close the room and clean up all resources. Disconnects all sessions
   * and stops background processes.
   */
  close() {
    this.disposables.forEach((d) => d());
    this.sessions.forEach((session) => {
      session.socket.close();
    });
    this._isClosed = true;
  }
  /**
   * Check if the room has been closed and is no longer accepting connections.
   *
   * @returns True if the room is closed
   */
  isClosed() {
    return this._isClosed;
  }
  events = createNanoEvents();
  // Storage layer for documents, tombstones, and clocks
  storage;
  serializedSchema;
  documentTypes;
  presenceType;
  log;
  schema;
  constructor(opts) {
    this.schema = opts.schema;
    this.log = opts.log;
    this.onPresenceChange = opts.onPresenceChange;
    this.storage = opts.storage;
    assert3(
      isNativeStructuredClone,
      "TLSyncRoom is supposed to run either on Cloudflare Workersor on a 18+ version of Node.js, which both support the native structuredClone API"
    );
    this.serializedSchema = JSON.parse(JSON.stringify(this.schema.serialize()));
    this.documentTypes = new Set(
      Object.values(this.schema.types).filter((t) => t.scope === "document").map((t) => t.typeName)
    );
    const presenceTypes = new Set(
      Object.values(this.schema.types).filter((t) => t.scope === "presence")
    );
    if (presenceTypes.size > 1) {
      throw new Error(
        `TLSyncRoom: exactly zero or one presence type is expected, but found ${presenceTypes.size}`
      );
    }
    this.presenceType = presenceTypes.values().next()?.value ?? null;
    const { documentClock } = this.storage.transaction((txn) => {
      this.schema.migrateStorage(txn);
    });
    this.lastDocumentClock = documentClock;
    this.disposables.push(
      this.storage.onChange(({ id }) => {
        if (id !== this.internalTxnId) {
          this.broadcastExternalStorageChanges();
        }
      })
    );
  }
  broadcastExternalStorageChanges() {
    this.storage.transaction((txn) => {
      this.broadcastChanges(txn);
      this.lastDocumentClock = txn.getClock();
    });
  }
  /**
   * Send a message to a particular client. Debounces data events
   *
   * @param sessionId - The id of the session to send the message to.
   * @param message - The message to send. UNSAFE Any diffs must have been downgraded already if necessary
   */
  _unsafe_sendMessage(sessionId, message2) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.log?.warn?.("Tried to send message to unknown session", message2.type);
      return;
    }
    if (session.state !== RoomSessionState.Connected) {
      this.log?.warn?.("Tried to send message to disconnected client", message2.type);
      return;
    }
    if (session.socket.isOpen) {
      if (message2.type !== "patch" && message2.type !== "push_result") {
        if (message2.type !== "pong") {
          this._flushDataMessages(sessionId);
        }
        session.socket.sendMessage(message2);
      } else {
        if (session.debounceTimer === null) {
          session.socket.sendMessage({ type: "data", data: [message2] });
          session.debounceTimer = setTimeout(
            () => this._flushDataMessages(sessionId),
            DATA_MESSAGE_DEBOUNCE_INTERVAL
          );
        } else {
          session.outstandingDataMessages.push(message2);
        }
      }
    } else {
      this.cancelSession(session.sessionId);
    }
  }
  // needs to accept sessionId and not a session because the session might be dead by the time
  // the timer fires
  _flushDataMessages(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== RoomSessionState.Connected) {
      return;
    }
    session.debounceTimer = null;
    if (session.outstandingDataMessages.length > 0) {
      session.socket.sendMessage({ type: "data", data: session.outstandingDataMessages });
      session.outstandingDataMessages.length = 0;
    }
  }
  /** @internal */
  removeSession(sessionId, fatalReason) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.log?.warn?.("Tried to remove unknown session");
      return;
    }
    this.sessions.delete(sessionId);
    try {
      if (fatalReason) {
        session.socket.close(TLSyncErrorCloseEventCode, fatalReason);
      } else {
        session.socket.close();
      }
    } catch {
    }
    const presence = this.presenceStore.get(session.presenceId ?? "");
    if (presence) {
      this.presenceStore.delete(session.presenceId);
      this.broadcastPatch({
        puts: {},
        deletes: [session.presenceId]
      });
    }
    this.events.emit("session_removed", { sessionId, meta: session.meta });
    if (this.sessions.size === 0) {
      this.events.emit("room_became_empty");
    }
  }
  cancelSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.state === RoomSessionState.AwaitingRemoval) {
      this.log?.warn?.("Tried to cancel session that is already awaiting removal");
      return;
    }
    this.sessions.set(sessionId, {
      state: RoomSessionState.AwaitingRemoval,
      sessionId,
      presenceId: session.presenceId,
      socket: session.socket,
      cancellationTime: Date.now(),
      meta: session.meta,
      isReadonly: session.isReadonly,
      requiresLegacyRejection: session.requiresLegacyRejection,
      supportsStringAppend: session.supportsStringAppend
    });
    try {
      session.socket.close();
    } catch {
    }
  }
  internalTxnId = "TLSyncRoom.txn";
  /**
   * Broadcast a patch to all connected clients except the one with the sessionId provided.
   *
   * @param diff - The TLSyncForwardDiff with full records (used for migration)
   * @param networkDiff - Optional pre-computed NetworkDiff for sessions not needing migration.
   *                      If not provided, will be computed from recordsDiff.
   * @param sourceSessionId - Optional session ID to exclude from the broadcast
   */
  broadcastPatch(diff, networkDiff, sourceSessionId) {
    const unmigrated = networkDiff ?? toNetworkDiff(diff);
    if (!unmigrated)
      return this;
    this.sessions.forEach((session) => {
      if (session.state !== RoomSessionState.Connected)
        return;
      if (sourceSessionId === session.sessionId)
        return;
      if (!session.socket.isOpen) {
        this.cancelSession(session.sessionId);
        return;
      }
      const diffResult = this.migrateDiffOrRejectSession(
        session.sessionId,
        session.serializedSchema,
        session.requiresDownMigrations,
        diff
      );
      if (!diffResult.ok)
        return;
      this._unsafe_sendMessage(session.sessionId, {
        type: "patch",
        diff: diffResult.value,
        serverClock: this.lastDocumentClock
      });
    });
    return this;
  }
  /**
   * Send a custom message to a connected client. Useful for application-specific
   * communication that doesn't involve document synchronization.
   *
   * @param sessionId - The ID of the session to send the message to
   * @param data - The custom payload to send (will be JSON serialized)
   * @example
   * ```ts
   * // Send a custom notification
   * room.sendCustomMessage('user-123', {
   *   type: 'notification',
   *   message: 'Document saved successfully'
   * })
   *
   * // Send user-specific data
   * room.sendCustomMessage('user-456', {
   *   type: 'user_permissions',
   *   canEdit: true,
   *   canDelete: false
   * })
   * ```
   */
  sendCustomMessage(sessionId, data) {
    this._unsafe_sendMessage(sessionId, { type: "custom", data });
  }
  /**
   * Register a new client session with the room. The session will be in an awaiting
   * state until it sends a connect message with protocol handshake.
   *
   * @param opts - Session configuration
   *   - sessionId - Unique identifier for this session
   *   - socket - WebSocket adapter for communication
   *   - meta - Application-specific metadata for this session
   *   - isReadonly - Whether this session can modify documents
   * @returns This room instance for method chaining
   * @example
   * ```ts
   * room.handleNewSession({
   *   sessionId: crypto.randomUUID(),
   *   socket: new WebSocketAdapter(ws),
   *   meta: { userId: '123', name: 'Alice', avatar: 'url' },
   *   isReadonly: !hasEditPermission
   * })
   * ```
   *
   * @internal
   */
  handleNewSession(opts) {
    const { sessionId, socket, meta, isReadonly } = opts;
    const existing = this.sessions.get(sessionId);
    this.sessions.set(sessionId, {
      state: RoomSessionState.AwaitingConnectMessage,
      sessionId,
      socket,
      presenceId: existing?.presenceId ?? this.presenceType?.createId() ?? null,
      sessionStartTime: Date.now(),
      meta,
      isReadonly: isReadonly ?? false,
      // this gets set later during handleConnectMessage
      requiresLegacyRejection: false,
      supportsStringAppend: true
    });
    return this;
  }
  /**
   * Checks if all connected sessions support string append operations (protocol version 8+).
   * If any client is on an older version, returns false to enable legacy append mode.
   *
   * @returns True if all connected sessions are on protocol version 8 or higher
   */
  getCanEmitStringAppend() {
    for (const session of this.sessions.values()) {
      if (session.state === RoomSessionState.Connected) {
        if (!session.supportsStringAppend) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * When we send a diff to a client, if that client is on a lower version than us, we need to make
   * the diff compatible with their version. This method takes a TLSyncForwardDiff (which has full
   * records) and migrates all records down to the client's schema version, returning a NetworkDiff.
   *
   * For updates (entries with [before, after] tuples), both records are migrated and a patch is
   * computed from the migrated versions, preserving efficient patch semantics even across versions.
   *
   * If a migration fails, the session will be rejected.
   *
   * @param sessionId - The session ID (for rejection on migration failure)
   * @param serializedSchema - The client's schema to migrate to
   * @param requiresDownMigrations - Whether the client needs down migrations
   * @param diff - The TLSyncForwardDiff containing full records to migrate
   * @param unmigrated - Optional pre-computed NetworkDiff for when no migration is needed
   * @returns A NetworkDiff with migrated records, or a migration failure
   */
  migrateDiffOrRejectSession(sessionId, serializedSchema, requiresDownMigrations, diff, unmigrated) {
    if (!requiresDownMigrations) {
      return Result.ok(unmigrated ?? toNetworkDiff(diff) ?? {});
    }
    const result = {};
    for (const [id, put] of objectMapEntriesIterable(diff.puts)) {
      if (Array.isArray(put)) {
        const [from, to] = put;
        const fromResult = this.schema.migratePersistedRecord(from, serializedSchema, "down");
        if (fromResult.type === "error") {
          this.rejectSession(sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
          return Result.err(fromResult.reason);
        }
        const toResult = this.schema.migratePersistedRecord(to, serializedSchema, "down");
        if (toResult.type === "error") {
          this.rejectSession(sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
          return Result.err(toResult.reason);
        }
        const patch = diffRecord(fromResult.value, toResult.value);
        if (patch) {
          result[id] = [RecordOpType.Patch, patch];
        }
      } else {
        const migrationResult = this.schema.migratePersistedRecord(put, serializedSchema, "down");
        if (migrationResult.type === "error") {
          this.rejectSession(sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
          return Result.err(migrationResult.reason);
        }
        result[id] = [RecordOpType.Put, migrationResult.value];
      }
    }
    for (const id of diff.deletes) {
      result[id] = [RecordOpType.Remove];
    }
    return Result.ok(result);
  }
  /**
   * Process an incoming message from a client session. Handles connection requests,
   * data synchronization pushes, and ping/pong for connection health.
   *
   * @param sessionId - The ID of the session that sent the message
   * @param message - The client message to process
   * @example
   * ```ts
   * // Typically called by WebSocket message handlers
   * websocket.onMessage((data) => {
   *   const message = JSON.parse(data)
   *   room.handleMessage(sessionId, message)
   * })
   * ```
   */
  async handleMessage(sessionId, message2) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.log?.warn?.("Received message from unknown session");
      return;
    }
    try {
      switch (message2.type) {
        case "connect": {
          return this.handleConnectRequest(session, message2);
        }
        case "push": {
          return this.handlePushRequest(session, message2);
        }
        case "ping": {
          if (session.state === RoomSessionState.Connected) {
            session.lastInteractionTime = Date.now();
          }
          return this._unsafe_sendMessage(session.sessionId, { type: "pong" });
        }
        default: {
          exhaustiveSwitchError(message2);
        }
      }
    } catch (e) {
      if (e instanceof TLSyncError) {
        this.rejectSession(session.sessionId, e.reason);
      } else {
        throw e;
      }
    }
  }
  /**
   * Reject and disconnect a session due to incompatibility or other fatal errors.
   * Sends appropriate error messages before closing the connection.
   *
   * @param sessionId - The session to reject
   * @param fatalReason - The reason for rejection (optional)
   * @example
   * ```ts
   * // Reject due to version mismatch
   * room.rejectSession('user-123', TLSyncErrorCloseEventReason.CLIENT_TOO_OLD)
   *
   * // Reject due to permission issue
   * room.rejectSession('user-456', 'Insufficient permissions')
   * ```
   */
  rejectSession(sessionId, fatalReason) {
    const session = this.sessions.get(sessionId);
    if (!session)
      return;
    if (!fatalReason) {
      this.removeSession(sessionId);
      return;
    }
    if (session.requiresLegacyRejection) {
      try {
        if (session.socket.isOpen) {
          let legacyReason;
          switch (fatalReason) {
            case TLSyncErrorCloseEventReason.CLIENT_TOO_OLD:
              legacyReason = TLIncompatibilityReason.ClientTooOld;
              break;
            case TLSyncErrorCloseEventReason.SERVER_TOO_OLD:
              legacyReason = TLIncompatibilityReason.ServerTooOld;
              break;
            case TLSyncErrorCloseEventReason.INVALID_RECORD:
              legacyReason = TLIncompatibilityReason.InvalidRecord;
              break;
            default:
              legacyReason = TLIncompatibilityReason.InvalidOperation;
              break;
          }
          session.socket.sendMessage({
            type: "incompatibility_error",
            reason: legacyReason
          });
        }
      } catch {
      } finally {
        this.removeSession(sessionId);
      }
    } else {
      this.removeSession(sessionId, fatalReason);
    }
  }
  forceAllReconnect() {
    for (const session of this.sessions.values()) {
      this.removeSession(session.sessionId);
    }
  }
  broadcastChanges(txn) {
    const changes = txn.getChangesSince(this.lastDocumentClock);
    if (!changes)
      return;
    const { wipeAll, diff } = changes;
    this.lastDocumentClock = txn.getClock();
    if (wipeAll) {
      this.forceAllReconnect();
      return;
    }
    this.broadcastPatch(diff);
  }
  handleConnectRequest(session, message2) {
    let theirProtocolVersion = message2.protocolVersion;
    if (theirProtocolVersion === 5) {
      theirProtocolVersion = 6;
    }
    session.requiresLegacyRejection = theirProtocolVersion === 6;
    if (theirProtocolVersion === 6) {
      theirProtocolVersion++;
    }
    if (theirProtocolVersion === 7) {
      theirProtocolVersion++;
      session.supportsStringAppend = false;
    }
    if (theirProtocolVersion == null || theirProtocolVersion < getTlsyncProtocolVersion()) {
      this.rejectSession(session.sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
      return;
    } else if (theirProtocolVersion > getTlsyncProtocolVersion()) {
      this.rejectSession(session.sessionId, TLSyncErrorCloseEventReason.SERVER_TOO_OLD);
      return;
    }
    if (message2.schema == null) {
      this.rejectSession(session.sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
      return;
    }
    const migrations = this.schema.getMigrationsSince(message2.schema);
    if (!migrations.ok || migrations.value.some((m) => m.scope !== "record" || !m.down)) {
      this.rejectSession(session.sessionId, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
      return;
    }
    const sessionSchema = (0, import_lodash2.default)(message2.schema, this.serializedSchema) ? this.serializedSchema : message2.schema;
    const requiresDownMigrations = migrations.value.length > 0;
    const connect = /* @__PURE__ */ __name(async (msg) => {
      this.sessions.set(session.sessionId, {
        state: RoomSessionState.Connected,
        sessionId: session.sessionId,
        presenceId: session.presenceId,
        socket: session.socket,
        serializedSchema: sessionSchema,
        requiresDownMigrations,
        lastInteractionTime: Date.now(),
        debounceTimer: null,
        outstandingDataMessages: [],
        supportsStringAppend: session.supportsStringAppend,
        meta: session.meta,
        isReadonly: session.isReadonly,
        requiresLegacyRejection: session.requiresLegacyRejection
      });
      this._unsafe_sendMessage(session.sessionId, msg);
    }, "connect");
    const { documentClock, result } = this.storage.transaction((txn) => {
      this.broadcastChanges(txn);
      const docChanges = txn.getChangesSince(message2.lastServerClock);
      const presenceDiff = this.migrateDiffOrRejectSession(
        session.sessionId,
        sessionSchema,
        requiresDownMigrations,
        {
          puts: Object.fromEntries([...this.presenceStore.values()].map((p) => [p.id, p])),
          deletes: []
        }
      );
      if (!presenceDiff.ok)
        return null;
      let docDiff = null;
      if (docChanges && sessionSchema !== this.serializedSchema) {
        const migrated = this.migrateDiffOrRejectSession(
          session.sessionId,
          sessionSchema,
          requiresDownMigrations,
          docChanges.diff
        );
        if (!migrated.ok)
          return null;
        docDiff = migrated.value;
      } else if (docChanges) {
        docDiff = toNetworkDiff(docChanges.diff);
      }
      return {
        type: "connect",
        connectRequestId: message2.connectRequestId,
        hydrationType: docChanges?.wipeAll ? "wipe_all" : "wipe_presence",
        protocolVersion: getTlsyncProtocolVersion(),
        schema: this.schema.serialize(),
        serverClock: txn.getClock(),
        diff: { ...presenceDiff.value, ...docDiff },
        isReadonly: session.isReadonly
      };
    });
    this.lastDocumentClock = documentClock;
    if (result) {
      connect(result);
    }
  }
  handlePushRequest(session, message2) {
    if (session && session.state !== RoomSessionState.Connected) {
      return;
    }
    if (session) {
      session.lastInteractionTime = Date.now();
    }
    const legacyAppendMode = !this.getCanEmitStringAppend();
    const propagateOp = /* @__PURE__ */ __name((changes2, id, op, before, after) => {
      if (!changes2.diffs)
        changes2.diffs = { networkDiff: {}, diff: { puts: {}, deletes: [] } };
      changes2.diffs.networkDiff[id] = op;
      switch (op[0]) {
        case RecordOpType.Put:
          changes2.diffs.diff.puts[id] = op[1];
          break;
        case RecordOpType.Patch:
          assert3(before && after, "before and after are required for patches");
          changes2.diffs.diff.puts[id] = [before, after];
          break;
        case RecordOpType.Remove:
          changes2.diffs.diff.deletes.push(id);
          break;
        default:
          exhaustiveSwitchError(op[0]);
      }
    }, "propagateOp");
    const addDocument = /* @__PURE__ */ __name((storage, changes2, id, _state) => {
      const res = session ? this.schema.migratePersistedRecord(_state, session.serializedSchema, "up") : { type: "success", value: _state };
      if (res.type === "error") {
        throw new TLSyncError(res.reason, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
      }
      const { value: state } = res;
      const doc = storage.get(id);
      if (doc) {
        const recordType = assertExists(getOwnProperty(this.schema.types, doc.typeName));
        const diff = diffAndValidateRecord(doc, state, recordType);
        if (diff) {
          storage.set(id, state);
          propagateOp(changes2, id, [RecordOpType.Patch, diff], doc, state);
        }
      } else {
        const recordType = assertExists(getOwnProperty(this.schema.types, state.typeName));
        validateRecord(state, recordType);
        storage.set(id, state);
        propagateOp(changes2, id, [RecordOpType.Put, state], void 0, void 0);
      }
      return Result.ok(void 0);
    }, "addDocument");
    const patchDocument = /* @__PURE__ */ __name((storage, changes2, id, patch) => {
      const doc = storage.get(id);
      if (!doc)
        return;
      const recordType = assertExists(getOwnProperty(this.schema.types, doc.typeName));
      const downgraded = session ? this.schema.migratePersistedRecord(doc, session.serializedSchema, "down") : { type: "success", value: doc };
      if (downgraded.type === "error") {
        throw new TLSyncError(downgraded.reason, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
      }
      if (downgraded.value === doc) {
        const diff = applyAndDiffRecord(doc, patch, recordType, legacyAppendMode);
        if (diff) {
          storage.set(id, diff[1]);
          propagateOp(changes2, id, [RecordOpType.Patch, diff[0]], doc, diff[1]);
        }
      } else {
        const patched = applyObjectDiff(downgraded.value, patch);
        const upgraded = session ? this.schema.migratePersistedRecord(patched, session.serializedSchema, "up") : { type: "success", value: patched };
        if (upgraded.type === "error") {
          throw new TLSyncError(upgraded.reason, TLSyncErrorCloseEventReason.CLIENT_TOO_OLD);
        }
        const diff = diffAndValidateRecord(doc, upgraded.value, recordType, legacyAppendMode);
        if (diff) {
          storage.set(id, upgraded.value);
          propagateOp(changes2, id, [RecordOpType.Patch, diff], doc, upgraded.value);
        }
      }
    }, "patchDocument");
    const { result, documentClock, changes } = this.storage.transaction(
      (txn) => {
        this.broadcastChanges(txn);
        const docChanges = { diffs: null };
        const presenceChanges = { diffs: null };
        if (this.presenceType && session?.presenceId && "presence" in message2 && message2.presence) {
          if (!session)
            throw new Error("session is required for presence pushes");
          const id = session.presenceId;
          const [type, val] = message2.presence;
          const { typeName } = this.presenceType;
          switch (type) {
            case RecordOpType.Put: {
              addDocument(this.presenceStore, presenceChanges, id, {
                ...val,
                id,
                typeName
              });
              break;
            }
            case RecordOpType.Patch: {
              patchDocument(this.presenceStore, presenceChanges, id, {
                ...val,
                id: [ValueOpType.Put, id],
                typeName: [ValueOpType.Put, typeName]
              });
              break;
            }
          }
        }
        if (message2.diff && !session?.isReadonly) {
          for (const [id, op] of objectMapEntriesIterable(message2.diff)) {
            switch (op[0]) {
              case RecordOpType.Put: {
                if (!this.documentTypes.has(op[1].typeName)) {
                  throw new TLSyncError(
                    "invalid record",
                    TLSyncErrorCloseEventReason.INVALID_RECORD
                  );
                }
                addDocument(txn, docChanges, id, op[1]);
                break;
              }
              case RecordOpType.Patch: {
                patchDocument(txn, docChanges, id, op[1]);
                break;
              }
              case RecordOpType.Remove: {
                const doc = txn.get(id);
                if (!doc) {
                  continue;
                }
                txn.delete(id);
                propagateOp(docChanges, id, op, doc, void 0);
                break;
              }
            }
          }
        }
        return { docChanges, presenceChanges };
      },
      { id: this.internalTxnId, emitChanges: "when-different" }
    );
    this.lastDocumentClock = documentClock;
    let pushResult;
    if (changes && session) {
      result.docChanges.diffs = { networkDiff: toNetworkDiff(changes) ?? {}, diff: changes };
    }
    if ((0, import_lodash2.default)(result.docChanges.diffs?.networkDiff, message2.diff)) {
      pushResult = {
        type: "push_result",
        clientClock: message2.clientClock,
        serverClock: documentClock,
        action: "commit"
      };
    } else if (!result.docChanges.diffs?.networkDiff) {
      pushResult = {
        type: "push_result",
        clientClock: message2.clientClock,
        serverClock: documentClock,
        action: "discard"
      };
    } else if (session) {
      const diff = this.migrateDiffOrRejectSession(
        session.sessionId,
        session.serializedSchema,
        session.requiresDownMigrations,
        result.docChanges.diffs.diff,
        result.docChanges.diffs.networkDiff
      );
      if (diff.ok) {
        pushResult = {
          type: "push_result",
          clientClock: message2.clientClock,
          serverClock: documentClock,
          action: { rebaseWithDiff: diff.value }
        };
      }
    }
    if (session && pushResult) {
      this._unsafe_sendMessage(session.sessionId, pushResult);
    }
    if (result.docChanges.diffs || result.presenceChanges.diffs) {
      this.broadcastPatch(
        {
          puts: {
            ...result.docChanges.diffs?.diff.puts,
            ...result.presenceChanges.diffs?.diff.puts
          },
          deletes: [
            ...result.docChanges.diffs?.diff.deletes ?? [],
            ...result.presenceChanges.diffs?.diff.deletes ?? []
          ]
        },
        {
          ...result.docChanges.diffs?.networkDiff,
          ...result.presenceChanges.diffs?.networkDiff
        },
        session?.sessionId
      );
    }
    if (result.presenceChanges.diffs) {
      queueMicrotask(() => {
        this.onPresenceChange?.();
      });
    }
  }
  /**
   * Handle the event when a client disconnects. Cleans up the session and
   * removes any presence information.
   *
   * @param sessionId - The session that disconnected
   * @example
   * ```ts
   * websocket.onClose(() => {
   *   room.handleClose(sessionId)
   * })
   * ```
   */
  handleClose(sessionId) {
    this.cancelSession(sessionId);
  }
};
__name(TLSyncRoom, "TLSyncRoom");
var PresenceStore = class {
  presences = new AtomMap("presences");
  get(id) {
    return this.presences.get(id);
  }
  set(id, state) {
    this.presences.set(id, state);
  }
  delete(id) {
    this.presences.delete(id);
  }
  values() {
    return this.presences.values();
  }
};
__name(PresenceStore, "PresenceStore");

// ../../node_modules/@tldraw/sync-core/dist-esm/lib/TLSocketRoom.mjs
var TLSocketRoom = class {
  /**
   * Creates a new TLSocketRoom instance for managing collaborative document synchronization.
   *
   * opts - Configuration options for the room
   *   - initialSnapshot - Optional initial document state to load
   *   - schema - Store schema defining record types and validation
   *   - clientTimeout - Milliseconds to wait before disconnecting inactive clients
   *   - log - Optional logger for warnings and errors
   *   - onSessionRemoved - Called when a client session is removed
   *   - onBeforeSendMessage - Called before sending messages to clients
   *   - onAfterReceiveMessage - Called after receiving messages from clients
   *   - onDataChange - Called when document data changes
   *   - onPresenceChange - Called when presence data changes
   */
  constructor(opts) {
    this.opts = opts;
    if (opts.storage && opts.initialSnapshot) {
      throw new Error("Cannot provide both storage and initialSnapshot options");
    }
    const storage = opts.storage ? opts.storage : new InMemorySyncStorage({
      snapshot: convertStoreSnapshotToRoomSnapshot(
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        opts.initialSnapshot ?? DEFAULT_INITIAL_SNAPSHOT
      )
    });
    if ("onDataChange" in opts && opts.onDataChange) {
      this.disposables.add(
        storage.onChange(() => {
          opts.onDataChange?.();
        })
      );
    }
    this.room = new TLSyncRoom({
      onPresenceChange: opts.onPresenceChange,
      schema: opts.schema ?? createTLSchema(),
      log: opts.log,
      storage
    });
    this.storage = storage;
    this.room.events.on("session_removed", (args) => {
      this.sessions.delete(args.sessionId);
      if (this.opts.onSessionRemoved) {
        this.opts.onSessionRemoved(this, {
          sessionId: args.sessionId,
          numSessionsRemaining: this.room.sessions.size,
          meta: args.meta
        });
      }
    });
    this.log = "log" in opts ? opts.log : { error: console.error };
  }
  room;
  sessions = /* @__PURE__ */ new Map();
  log;
  storage;
  disposables = /* @__PURE__ */ new Set();
  /**
   * Returns the number of active sessions.
   * Note that this is not the same as the number of connected sockets!
   * Sessions time out a few moments after sockets close, to smooth over network hiccups.
   *
   * @returns the number of active sessions
   */
  getNumActiveSessions() {
    return this.room.sessions.size;
  }
  /**
   * Handles a new client WebSocket connection, creating a session within the room.
   * This should be called whenever a client establishes a WebSocket connection to join
   * the collaborative document.
   *
   * @param opts - Connection options
   *   - sessionId - Unique identifier for the client session (typically from browser tab)
   *   - socket - WebSocket-like object for client communication
   *   - isReadonly - Whether the client can modify the document (defaults to false)
   *   - meta - Additional session metadata (required if SessionMeta is not void)
   *
   * @example
   * ```ts
   * // Handle new WebSocket connection
   * room.handleSocketConnect({
   *   sessionId: 'user-session-abc123',
   *   socket: webSocketConnection,
   *   isReadonly: !userHasEditPermission
   * })
   * ```
   *
   * @example
   * ```ts
   * // With session metadata
   * room.handleSocketConnect({
   *   sessionId: 'session-xyz',
   *   socket: ws,
   *   meta: { userId: 'user-123', name: 'Alice' }
   * })
   * ```
   */
  handleSocketConnect(opts) {
    const { sessionId, socket, isReadonly = false } = opts;
    const handleSocketMessage = /* @__PURE__ */ __name((event) => this.handleSocketMessage(sessionId, event.data), "handleSocketMessage");
    const handleSocketError = this.handleSocketError.bind(this, sessionId);
    const handleSocketClose = this.handleSocketClose.bind(this, sessionId);
    this.sessions.set(sessionId, {
      assembler: new JsonChunkAssembler(),
      socket,
      unlisten: () => {
        socket.removeEventListener?.("message", handleSocketMessage);
        socket.removeEventListener?.("close", handleSocketClose);
        socket.removeEventListener?.("error", handleSocketError);
      }
    });
    this.room.handleNewSession({
      sessionId,
      isReadonly,
      socket: new ServerSocketAdapter({
        ws: socket,
        onBeforeSendMessage: this.opts.onBeforeSendMessage ? (message2, stringified) => this.opts.onBeforeSendMessage({
          sessionId,
          message: message2,
          stringified,
          meta: this.room.sessions.get(sessionId)?.meta
        }) : void 0
      }),
      meta: "meta" in opts ? opts.meta : void 0
    });
    socket.addEventListener?.("message", handleSocketMessage);
    socket.addEventListener?.("close", handleSocketClose);
    socket.addEventListener?.("error", handleSocketError);
  }
  /**
   * Processes a message received from a client WebSocket. Use this method in server
   * environments where WebSocket event listeners cannot be attached directly to socket
   * instances (e.g., Bun.serve, Cloudflare Workers with WebSocket hibernation).
   *
   * The method handles message chunking/reassembly and forwards complete messages
   * to the underlying sync room for processing.
   *
   * @param sessionId - Session identifier matching the one used in handleSocketConnect
   * @param message - Raw message data from the client (string or binary)
   *
   * @example
   * ```ts
   * // In a Bun.serve handler
   * server.upgrade(req, {
   *   data: { sessionId, room },
   *   upgrade(res, req) {
   *     // Connection established
   *   },
   *   message(ws, message) {
   *     const { sessionId, room } = ws.data
   *     room.handleSocketMessage(sessionId, message)
   *   }
   * })
   * ```
   */
  handleSocketMessage(sessionId, message2) {
    const assembler = this.sessions.get(sessionId)?.assembler;
    if (!assembler) {
      this.log?.warn?.("Received message from unknown session", sessionId);
      return;
    }
    try {
      const messageString = typeof message2 === "string" ? message2 : new TextDecoder().decode(message2);
      const res = assembler.handleMessage(messageString);
      if (!res) {
        return;
      }
      if ("data" in res) {
        if (this.opts.onAfterReceiveMessage) {
          const session = this.room.sessions.get(sessionId);
          if (session) {
            this.opts.onAfterReceiveMessage({
              sessionId,
              message: res.data,
              stringified: res.stringified,
              meta: session.meta
            });
          }
        }
        this.room.handleMessage(sessionId, res.data);
      } else {
        this.log?.error?.("Error assembling message", res.error);
        this.handleSocketError(sessionId);
      }
    } catch (e) {
      this.log?.error?.(e);
      this.room.rejectSession(sessionId, TLSyncErrorCloseEventReason.UNKNOWN_ERROR);
    }
  }
  /**
   * Handles a WebSocket error for the specified session. Use this in server environments
   * where socket event listeners cannot be attached directly. This will initiate cleanup
   * and session removal for the affected client.
   *
   * @param sessionId - Session identifier matching the one used in handleSocketConnect
   *
   * @example
   * ```ts
   * // In a custom WebSocket handler
   * socket.addEventListener('error', () => {
   *   room.handleSocketError(sessionId)
   * })
   * ```
   */
  handleSocketError(sessionId) {
    this.room.handleClose(sessionId);
  }
  /**
   * Handles a WebSocket close event for the specified session. Use this in server
   * environments where socket event listeners cannot be attached directly. This will
   * initiate cleanup and session removal for the disconnected client.
   *
   * @param sessionId - Session identifier matching the one used in handleSocketConnect
   *
   * @example
   * ```ts
   * // In a custom WebSocket handler
   * socket.addEventListener('close', () => {
   *   room.handleSocketClose(sessionId)
   * })
   * ```
   */
  handleSocketClose(sessionId) {
    this.room.handleClose(sessionId);
  }
  /**
   * Returns the current document clock value. The clock is a monotonically increasing
   * integer that increments with each document change, providing a consistent ordering
   * of changes across the distributed system.
   *
   * @returns The current document clock value
   *
   * @example
   * ```ts
   * const clock = room.getCurrentDocumentClock()
   * console.log(`Document is at version ${clock}`)
   * ```
   */
  getCurrentDocumentClock() {
    return this.storage.getClock();
  }
  /**
   * Retrieves a deeply cloned copy of a record from the document store.
   * Returns undefined if the record doesn't exist. The returned record is
   * safe to mutate without affecting the original store data.
   *
   * @param id - Unique identifier of the record to retrieve
   * @returns Deep clone of the record, or undefined if not found
   *
   * @example
   * ```ts
   * const shape = room.getRecord('shape:abc123')
   * if (shape) {
   *   console.log('Shape position:', shape.x, shape.y)
   *   // Safe to modify without affecting store
   *   shape.x = 100
   * }
   * ```
   */
  getRecord(id) {
    return this.storage.transaction((txn) => {
      return structuredClone(txn.get(id));
    }).result;
  }
  /**
   * Returns information about all active sessions in the room. Each session
   * represents a connected client with their current connection status and metadata.
   *
   * @returns Array of session information objects containing:
   *   - sessionId - Unique session identifier
   *   - isConnected - Whether the session has an active WebSocket connection
   *   - isReadonly - Whether the session can modify the document
   *   - meta - Custom session metadata
   *
   * @example
   * ```ts
   * const sessions = room.getSessions()
   * console.log(`Room has ${sessions.length} active sessions`)
   *
   * for (const session of sessions) {
   *   console.log(`${session.sessionId}: ${session.isConnected ? 'online' : 'offline'}`)
   *   if (session.isReadonly) {
   *     console.log('  (read-only access)')
   *   }
   * }
   * ```
   */
  getSessions() {
    return [...this.room.sessions.values()].map((session) => {
      return {
        sessionId: session.sessionId,
        isConnected: session.state === RoomSessionState.Connected,
        isReadonly: session.isReadonly,
        meta: session.meta
      };
    });
  }
  /**
   * Creates a complete snapshot of the current document state, including all records
   * and synchronization metadata. This snapshot can be persisted to storage and used
   * to restore the room state later or revert to a previous version.
   *
   * @returns Complete room snapshot including documents, clock values, and tombstones
   * @deprecated if you need to do this use
   *
   * @example
   * ```ts
   * // Capture current state for persistence
   * const snapshot = room.getCurrentSnapshot()
   * await saveToDatabase(roomId, JSON.stringify(snapshot))
   *
   * // Later, restore from snapshot
   * const savedSnapshot = JSON.parse(await loadFromDatabase(roomId))
   * const newRoom = new TLSocketRoom({ initialSnapshot: savedSnapshot })
   * ```
   */
  getCurrentSnapshot() {
    if (this.storage.getSnapshot) {
      return this.storage.getSnapshot();
    }
    throw new Error("getCurrentSnapshot is not supported for this storage type");
  }
  /**
   * Retrieves all presence records from the document store. Presence records
   * contain ephemeral user state like cursor positions and selections.
   *
   * @returns Object mapping record IDs to presence record data
   * @internal
   */
  getPresenceRecords() {
    const result = {};
    for (const presence of this.room.presenceStore.values()) {
      result[presence.id] = presence;
    }
    return result;
  }
  /**
   * Loads a document snapshot, completely replacing the current room state.
   * This will disconnect all current clients and update the document to match
   * the provided snapshot. Use this for restoring from backups or implementing
   * document versioning.
   *
   * @param snapshot - Room or store snapshot to load
   *
   * @example
   * ```ts
   * // Restore from a saved snapshot
   * const backup = JSON.parse(await loadBackup(roomId))
   * room.loadSnapshot(backup)
   *
   * // All clients will be disconnected and need to reconnect
   * // to see the restored document state
   * ```
   */
  loadSnapshot(snapshot) {
    this.storage.transaction((txn) => {
      loadSnapshotIntoStorage(txn, this.room.schema, snapshot);
    });
  }
  /**
   * Executes a transaction to modify the document store. Changes made within the
   * transaction are atomic and will be synchronized to all connected clients.
   * The transaction provides isolation from concurrent changes until it commits.
   *
   * @param updater - Function that receives store methods to make changes
   *   - store.get(id) - Retrieve a record (safe to mutate, but must call put() to commit)
   *   - store.put(record) - Save a modified record
   *   - store.getAll() - Get all records in the store
   *   - store.delete(id) - Remove a record from the store
   * @returns Promise that resolves when the transaction completes
   *
   * @example
   * ```ts
   * // Update multiple shapes in a single transaction
   * await room.updateStore(store => {
   *   const shape1 = store.get('shape:abc123')
   *   const shape2 = store.get('shape:def456')
   *
   *   if (shape1) {
   *     shape1.x = 100
   *     store.put(shape1)
   *   }
   *
   *   if (shape2) {
   *     shape2.meta.approved = true
   *     store.put(shape2)
   *   }
   * })
   * ```
   *
   * @example
   * ```ts
   * // Async transaction with external API call
   * await room.updateStore(async store => {
   *   const doc = store.get('document:main')
   *   if (doc) {
   *     doc.lastModified = await getCurrentTimestamp()
   *     store.put(doc)
   *   }
   * })
   * ```
   * @deprecated use the storage.transaction method instead
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  async updateStore(updater) {
    if (this.isClosed()) {
      throw new Error("Cannot update store on a closed room");
    }
    const ctx = new StoreUpdateContext(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      Object.fromEntries(this.getCurrentSnapshot().documents.map((d) => [d.state.id, d.state])),
      this.room.schema
    );
    try {
      await updater(ctx);
    } finally {
      ctx.close();
    }
    this.storage.transaction((txn) => {
      for (const [id, record] of Object.entries(ctx.updates.puts)) {
        txn.set(id, record);
      }
      for (const id of ctx.updates.deletes) {
        txn.delete(id);
      }
    });
  }
  /**
   * Sends a custom message to a specific client session. This allows sending
   * application-specific data that doesn't modify the document state, such as
   * notifications, chat messages, or custom commands.
   *
   * @param sessionId - Target session identifier
   * @param data - Custom payload to send (will be JSON serialized)
   *
   * @example
   * ```ts
   * // Send a notification to a specific user
   * room.sendCustomMessage('session-123', {
   *   type: 'notification',
   *   message: 'Your changes have been saved'
   * })
   *
   * // Send a chat message
   * room.sendCustomMessage('session-456', {
   *   type: 'chat',
   *   from: 'Alice',
   *   text: 'Great work on this design!'
   * })
   * ```
   */
  sendCustomMessage(sessionId, data) {
    this.room.sendCustomMessage(sessionId, data);
  }
  /**
   * Immediately removes a session from the room and closes its WebSocket connection.
   * The client will attempt to reconnect automatically unless a fatal reason is provided.
   *
   * @param sessionId - Session identifier to remove
   * @param fatalReason - Optional fatal error reason that prevents reconnection
   *
   * @example
   * ```ts
   * // Kick a user (they can reconnect)
   * room.closeSession('session-troublemaker')
   *
   * // Permanently ban a user
   * room.closeSession('session-banned', 'PERMISSION_DENIED')
   *
   * // Close session due to inactivity
   * room.closeSession('session-idle', 'TIMEOUT')
   * ```
   */
  closeSession(sessionId, fatalReason) {
    this.room.rejectSession(sessionId, fatalReason);
  }
  /**
   * Closes the room and disconnects all connected clients. This should be called
   * when shutting down the room permanently, such as during server shutdown or
   * when the room is no longer needed. Once closed, the room cannot be reopened.
   *
   * @example
   * ```ts
   * // Clean shutdown when no users remain
   * if (room.getNumActiveSessions() === 0) {
   *   await persistSnapshot(room.getCurrentSnapshot())
   *   room.close()
   * }
   *
   * // Server shutdown
   * process.on('SIGTERM', () => {
   *   for (const room of activeRooms.values()) {
   *     room.close()
   *   }
   * })
   * ```
   */
  close() {
    this.room.close();
    this.disposables.forEach((d) => d());
    this.disposables.clear();
  }
  /**
   * Checks whether the room has been permanently closed. Closed rooms cannot
   * accept new connections or process further changes.
   *
   * @returns True if the room is closed, false if still active
   *
   * @example
   * ```ts
   * if (room.isClosed()) {
   *   console.log('Room has been shut down')
   *   // Create a new room or redirect users
   * } else {
   *   // Room is still accepting connections
   *   room.handleSocketConnect({ sessionId, socket })
   * }
   * ```
   */
  isClosed() {
    return this.room.isClosed();
  }
};
__name(TLSocketRoom, "TLSocketRoom");
var StoreUpdateContext = class {
  constructor(snapshot, schema2) {
    this.snapshot = snapshot;
    this.schema = schema2;
  }
  updates = {
    puts: {},
    deletes: /* @__PURE__ */ new Set()
  };
  put(record) {
    if (this._isClosed)
      throw new Error("StoreUpdateContext is closed");
    const recordType = getOwnProperty(this.schema.types, record.typeName);
    if (!recordType) {
      throw new Error(`Missing definition for record type ${record.typeName}`);
    }
    const recordBefore = this.snapshot[record.id] ?? void 0;
    recordType.validate(record, recordBefore);
    if (record.id in this.snapshot && (0, import_lodash2.default)(this.snapshot[record.id], record)) {
      delete this.updates.puts[record.id];
    } else {
      this.updates.puts[record.id] = structuredClone(record);
    }
    this.updates.deletes.delete(record.id);
  }
  delete(recordOrId) {
    if (this._isClosed)
      throw new Error("StoreUpdateContext is closed");
    const id = typeof recordOrId === "string" ? recordOrId : recordOrId.id;
    delete this.updates.puts[id];
    if (this.snapshot[id]) {
      this.updates.deletes.add(id);
    }
  }
  get(id) {
    if (this._isClosed)
      throw new Error("StoreUpdateContext is closed");
    if (hasOwnProperty(this.updates.puts, id)) {
      return structuredClone(this.updates.puts[id]);
    }
    if (this.updates.deletes.has(id)) {
      return null;
    }
    return structuredClone(this.snapshot[id] ?? null);
  }
  getAll() {
    if (this._isClosed)
      throw new Error("StoreUpdateContext is closed");
    const result = Object.values(this.updates.puts);
    for (const [id, record] of Object.entries(this.snapshot)) {
      if (!this.updates.deletes.has(id) && !hasOwnProperty(this.updates.puts, id)) {
        result.push(record);
      }
    }
    return structuredClone(result);
  }
  _isClosed = false;
  close() {
    this._isClosed = true;
  }
};
__name(StoreUpdateContext, "StoreUpdateContext");

// ../../node_modules/@tldraw/sync-core/dist-esm/index.mjs
registerTldrawLibraryVersion(
  "@tldraw/sync-core",
  "4.5.12",
  "esm"
);

// src/schema.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var schema = createTLSchema({
  shapes: defaultShapeSchemas
});

// src/TldrawDurableObject.ts
var TldrawDurableObject = class extends DurableObject {
  room = null;
  roomPromise = null;
  /**
   * Inicialização preguiçosa do room, com `blockConcurrencyWhile` para evitar
   * uma race entre múltiplos eventos (mensagens, close) chegando ao mesmo
   * tempo no DO logo após uma hibernação.
   */
  getOrCreateRoom() {
    if (this.room)
      return Promise.resolve(this.room);
    if (this.roomPromise)
      return this.roomPromise;
    this.roomPromise = this.ctx.blockConcurrencyWhile(async () => {
      if (this.room)
        return this.room;
      const sql = new DurableObjectSqliteSyncWrapper(this.ctx.storage);
      const storage = new SQLiteSyncStorage({ sql });
      this.room = new TLSocketRoom({
        schema,
        storage,
        clientTimeout: Infinity,
        onSessionRemoved: (_room, { sessionId, numSessionsRemaining }) => {
          if (numSessionsRemaining === 0) {
            this.room?.close();
            this.room = null;
            this.roomPromise = null;
          }
          console.log(
            `[tldraw-sync] session ${sessionId} removed (${numSessionsRemaining} remaining)`
          );
        }
      });
      return this.room;
    });
    return this.roomPromise;
  }
  /**
   * Único endpoint do DO: upgrade de WebSocket.
   */
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/connect") {
      return new Response("Not found", { status: 404 });
    }
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 400 });
    }
    const room = await this.getOrCreateRoom();
    const { 0: client, 1: server } = new WebSocketPair();
    const sessionId = crypto.randomUUID();
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ sessionId });
    room.handleSocketConnect({ sessionId, socket: server });
    return new Response(null, { status: 101, webSocket: client });
  }
  /**
   * Mensagem recebida. Pode ser invocada:
   *   - Logo após `fetch` (mesma request) — sessão já está no room.
   *   - Após hibernação — o room foi recriado em `getOrCreateRoom`, mas a
   *     sessão em si não foi preservada (a memória do room não sobrevive
   *     à hibernação; só os dados no SQLite). `room.handleSocketMessage`
   *     loga warning e descarta a mensagem nesse caso; o client detecta
   *     via keepalive e reconecta.
   */
  async webSocketMessage(ws, message2) {
    const attachment = ws.deserializeAttachment();
    if (!attachment?.sessionId) {
      ws.close(1011, "Missing sessionId attachment");
      return;
    }
    const room = await this.getOrCreateRoom();
    room.handleSocketMessage(attachment.sessionId, message2);
  }
  /**
   * WS fechado. No source do `TLSocketRoom`, `handleSocketClose` chama
   * `this.room.handleClose(sessionId)` — equivalente a `handleSocketError`.
   */
  async webSocketClose(ws, _code, _reason, _wasClean) {
    const attachment = ws.deserializeAttachment();
    if (!attachment?.sessionId)
      return;
    const room = await this.getOrCreateRoom();
    room.handleSocketClose(attachment.sessionId);
  }
  /**
   * Erro de WS. Internamente equivalente ao `handleSocketClose`.
   */
  async webSocketError(ws, _error) {
    const attachment = ws.deserializeAttachment();
    if (!attachment?.sessionId)
      return;
    const room = await this.getOrCreateRoom();
    room.handleSocketError(attachment.sessionId);
  }
};
__name(TldrawDurableObject, "TldrawDurableObject");

// src/index.ts
function corsHeaders(env2) {
  return {
    "Access-Control-Allow-Origin": env2.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
var src_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env2) });
    }
    if (url.pathname === "/health") {
      return Response.json(
        { status: "ok", service: "refstash-tldraw-sync" },
        { headers: corsHeaders(env2) }
      );
    }
    const boardMatch = url.pathname.match(
      /^\/api\/boards\/([a-f0-9-]+)\/connect$/
    );
    if (boardMatch) {
      return handleBoardConnect(request, env2, boardMatch[1]);
    }
    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(env2)
    });
  }
};
async function handleBoardConnect(request, env2, boardId) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Missing Authorization header", { status: 401 });
  }
  const token = authHeader.slice(7);
  const payload = await verifyBoardToken(token, env2.COLLAB_JWT_SECRET);
  if (!payload) {
    return new Response("Invalid or expired token", { status: 401 });
  }
  if (payload.boardId !== boardId) {
    return new Response("Token does not match requested board", {
      status: 403
    });
  }
  const doId = env2.TLDRAW_DURABLE_OBJECT.idFromName(`board-${boardId}`);
  const stub = env2.TLDRAW_DURABLE_OBJECT.get(doId);
  return stub.fetch(request);
}
__name(handleBoardConnect, "handleBoardConnect");

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-zIfKRN/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-zIfKRN/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  TldrawDurableObject,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

@tldraw/utils/dist-esm/lib/bind.mjs:
  (*!
   * MIT License: https://github.com/NoHomey/bind-decorator/blob/master/License
   * Copyright (c) 2016 Ivo Stratev
   *)

@tldraw/utils/dist-esm/lib/id.mjs:
  (*!
   * MIT License: https://github.com/ai/nanoid/blob/main/LICENSE
   * Modified code originally from <https://github.com/ai/nanoid>
   * Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>
   *
   * `nanoid` is currently only distributed as an ES module. Some tools (jest, playwright) don't
   * properly support ESM-only code yet, and tldraw itself is distributed as both an ES module and a
   * CommonJS module. By including nanoid here, we can make sure it works well in every environment
   * where tldraw is used. We can also remove some unused features like custom alphabets.
   *)

@tldraw/utils/dist-esm/lib/media/apng.mjs:
  (*!
   * MIT License: https://github.com/vHeemstra/is-apng/blob/main/license
   * Copyright (c) Philip van Heemstra
   *)

@tldraw/utils/dist-esm/lib/media/gif.mjs:
  (*!
   * MIT License
   * Modified code originally from <https://github.com/qzb/is-animated>
   * Copyright (c) 2016 Józef Sokołowski <j.k.sokolowski@gmail.com>
   *)

@tldraw/utils/dist-esm/lib/media/png.mjs:
  (*!
   * MIT License: https://github.com/alexgorbatchev/crc/blob/master/LICENSE
   * Copyright: 2014 Alex Gorbatchev
   * Code: crc32, https://github.com/alexgorbatchev/crc/blob/master/src/calculators/crc32.ts
   *)

@tldraw/utils/dist-esm/lib/media/webp.mjs:
  (*!
   * MIT License: https://github.com/sindresorhus/is-webp/blob/main/license
   * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
   *)

@tldraw/store/dist-esm/lib/ImmutableMap.mjs:
  (*!
   * This file was lovingly and delicately extracted from Immutable.js
   * MIT License: https://github.com/immutable-js/immutable-js/blob/main/LICENSE
   * Copyright (c) 2014-present, Lee Byron and other contributors.
   *)
*/
//# sourceMappingURL=index.js.map
