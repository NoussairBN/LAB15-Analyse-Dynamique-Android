Java.perform(function () {
  console.log("[+] Script SSL Pinning Bypass charge");

  function ok(tag) {
    console.log("[+] SSL bypass: " + tag);
  }

  try {
    var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
    var SSLContext = Java.use("javax.net.ssl.SSLContext");

    var TrustManager = Java.registerClass({
      name: "com.lab15.AcceptAllTrustManager",
      implements: [X509TrustManager],
      methods: {
        checkClientTrusted: function () {},
        checkServerTrusted: function () {},
        getAcceptedIssuers: function () {
          return [];
        },
      },
    });

    var TrustManagers = [TrustManager.$new()];

    SSLContext.init.overload(
      "[Ljavax.net.ssl.KeyManager;",
      "[Ljavax.net.ssl.TrustManager;",
      "java.security.SecureRandom"
    ).implementation = function (keyManagers, trustManagers, secureRandom) {
      ok("SSLContext.init patche");
      return this.init(keyManagers, TrustManagers, secureRandom);
    };
  } catch (e) {
    console.log("[-] SSLContext hook failed: " + e);
  }

  ["com.android.org.conscrypt.TrustManagerImpl", "org.conscrypt.TrustManagerImpl"].forEach(function (className) {
    try {
      var TrustManagerImpl = Java.use(className);

      if (TrustManagerImpl.verifyChain) {
        TrustManagerImpl.verifyChain.implementation = function (
          untrustedChain,
          trustAnchorChain,
          host,
          clientAuth,
          ocspData,
          tlsSctData
        ) {
          ok(className + ".verifyChain patche");
          return untrustedChain;
        };
      }

      if (TrustManagerImpl.checkTrustedRecursive) {
        TrustManagerImpl.checkTrustedRecursive.implementation = function () {
          ok(className + ".checkTrustedRecursive patche");
          return Java.use("java.util.ArrayList").$new();
        };
      }

      ok(className + " patche");
    } catch (e) {}
  });

  try {
    var CertificatePinner = Java.use("okhttp3.CertificatePinner");
    CertificatePinner.check.overloads.forEach(function (overload) {
      overload.implementation = function () {
        ok("OkHttp CertificatePinner patche");
        return;
      };
    });
  } catch (e) {
    console.log("[*] OkHttp CertificatePinner non trouve ou deja patche");
  }

  try {
    var WebViewClient = Java.use("android.webkit.WebViewClient");
    WebViewClient.onReceivedSslError.implementation = function (view, handler, error) {
      ok("WebViewClient patche");
      handler.proceed();
    };
  } catch (e) {
    console.log("[*] WebViewClient hook non applique");
  }

  console.log("[+] Universal SSL pinning bypass installe");
});
