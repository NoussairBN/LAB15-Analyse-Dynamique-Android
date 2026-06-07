Java.perform(function () {
  console.log("[+] OkHttp SSL pinning bypass loaded");

  try {
    var CertificatePinner = Java.use("okhttp3.CertificatePinner");

    CertificatePinner.check.overloads.forEach(function (overload) {
      overload.implementation = function () {
        console.log("[+] OkHttp CertificatePinner patched");
        return;
      };
    });
  } catch (e) {
    console.log("[-] OkHttp CertificatePinner hook failed: " + e);
  }

  try {
    var OkHostnameVerifier = Java.use("okhttp3.internal.tls.OkHostnameVerifier");

    OkHostnameVerifier.verify.overloads.forEach(function (overload) {
      overload.implementation = function () {
        console.log("[+] OkHttp hostname verifier patched");
        return true;
      };
    });
  } catch (e) {
    console.log("[*] OkHttp hostname verifier not found: " + e);
  }

  console.log("[+] OkHttp bypass installed");
});
