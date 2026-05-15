// DevX Code — runtime errors → parent iframe (postMessage) ou React Native WebView
/* eslint-disable no-console */
(function devxPreviewBridge() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__DEVX_PREVIEW_BRIDGE_V2__) return;
  window.__DEVX_PREVIEW_BRIDGE_V2__ = true;

  var lastPost = 0;
  function post(payload) {
    try {
      var now = Date.now();
      if (payload && payload.type === 'console-react-error') {
        if (now - lastPost < 500) return;
      }
      lastPost = now;
      var body = Object.assign({ source: 'devx-preview' }, payload);
      if (window.parent !== window) {
        window.parent.postMessage(body, '*');
      } else if (
        window.ReactNativeWebView &&
        typeof window.ReactNativeWebView.postMessage === 'function'
      ) {
        window.ReactNativeWebView.postMessage(JSON.stringify(body));
      }
    } catch (e) {
      /* ignore */
    }
  }

  window.addEventListener('error', function (ev) {
    // Preferir ev.error: no WebView (WKWebView) ev.message costuma ser só "Script error." sem detalhe.
    var msg =
      (ev.error && ev.error.message) ||
      ev.message ||
      (ev.error ? String(ev.error) : '') ||
      'Erro desconhecido';
    var stack = ev.error && ev.error.stack ? String(ev.error.stack) : undefined;
    var s = String(msg).trim();
    if (/^script error.?$/i.test(s) && !stack) {
      return;
    }
    post({
      type: 'runtime-error',
      message: s,
      stack: stack,
      filename: ev.filename,
      lineno: ev.lineno,
      colno: ev.colno,
    });
  });

  window.addEventListener('unhandledrejection', function (ev) {
    var r = ev.reason;
    var msg = r && r.message ? String(r.message) : String(r);
    var stack = r && r.stack ? String(r.stack) : undefined;
    post({ type: 'unhandled-rejection', message: msg, stack: stack });
  });

  var origError = console.error;
  console.error = function () {
    origError.apply(console, arguments);
    try {
      var text = Array.prototype.slice.call(arguments).map(function (a) {
        if (typeof a === 'string') return a;
        if (a && a.message) return a.message + (a.stack ? '\n' + a.stack : '');
        try {
          return JSON.stringify(a);
        } catch (e) {
          return String(a);
        }
      }).join(' ');
      if (
        /Element type is invalid|not a valid|Warning:\s*React|Uncaught Error|ReferenceError|TypeError|SyntaxError|Invariant Violation|Cannot find native module|native module|Module not found|requireNativeModule|ExpoSQLite|expo-/i.test(
          text,
        )
      ) {
        post({ type: 'console-react-error', message: text.slice(0, 12000) });
      }
    } catch (e) {
      /* ignore */
    }
  };
})();
