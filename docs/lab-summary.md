# Resume du lab

## Sujet

Analyse dynamique Android et contournement du SSL pinning avec Frida.

## Cible

- Application : SSL Pinning Demo
- Package : `tech.httptoolkit.pinning_demo`
- Environnement : Android Emulator `emulator-5554`

## Commandes principales

```powershell
python --version
pip --version
adb --version
adb devices
adb shell settings put global http_proxy 10.0.2.2:8080
adb shell settings get global http_proxy
frida-ps -Uai
frida-ps -Uai | Select-String -Pattern "pinning|ssl|https|demo|okhttp"
frida -U -p <PID_APP> -l .\scripts\sslpin_bypass_universal.js
frida -U -p <PID_APP> -l .\scripts\sslpin_bypass_universal.js -l .\scripts\sslpin_okhttp_fix.js
frida -U -p <PID_APP> -l .\scripts\sslpin_bypass_native.js
```

## Resultat

Les hooks Frida ont ete charges avec succes. Les requetes HTTPS de test vers `sha256.badssl.com` et `ecc384.badssl.com` sont visibles dans Burp Suite avec un statut `200`.

## Nettoyage recommande

Apres le lab :

```powershell
adb shell settings put global http_proxy :0
```

Supprimer aussi le certificat CA utilisateur de l'emulateur si l'environnement n'est plus utilise pour les tests.
