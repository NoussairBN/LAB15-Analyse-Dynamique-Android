console.log("[+] Native SSL bypass Frida 17 loaded");

function replaceReturnValue(symbolName, libraryName, value) {
  var address = Module.findExportByName(libraryName, symbolName);

  if (!address) {
    console.log("[*] " + symbolName + " not found in " + libraryName);
    return;
  }

  console.log("[+] Found " + symbolName + " in " + libraryName + " at " + address);

  Interceptor.attach(address, {
    onLeave: function (retval) {
      console.log("[+] " + symbolName + " return value replaced with " + value);
      retval.replace(ptr(value));
    },
  });

  console.log("[+] Hook installed on " + symbolName);
}

replaceReturnValue("SSL_get_verify_result", "libssl.so", 0);
replaceReturnValue("X509_verify_cert", "libcrypto.so", 1);

console.log("[+] Native SSL bypass Frida 17 installed");
