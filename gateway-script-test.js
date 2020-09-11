console.emerg('Starting Hello World Gatewayscript');

// This script writes out a keypair and signs/validates the "data" string

var hm = require('header-metadata');
var crypto = require('crypto');


//The key to storing a PEM in a variable is that PEMs require multiple lines as per the format. Additional infomation source https://serverfault.com/questions/466683/can-an-ssl-certificate-be-on-a-single-line-in-a-file-no-line-breaks 
//The -----BEGIN PRIVATE KEY----- must be on the line above the base64 encoded blob below. This also applies to the bottom END PRIVATE KEY.
//By using \n\ i was able to force the new lines within the variable. 
// On the below key i have used a \ to continue lines (looks a bit neater) however its possible to dump it onto a single line like the  certificate example i use below

var keyPem = '-----BEGIN PRIVATE KEY-----\n\
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzYjXC8jxlSd0H\
TatTGZgweBpeB1XP0Ng3NgH9TWP1PpsF23qbFhWrrM+izCHkYUooWPT/ZTdLNvQg\
otE4kyYnegjuad5Vbt2R0ia3gplkFhkIry4UaHN1pcLzMGZt7BN0FHbFx3rQF9Gg\
pryaSb4tI/CY17EcF/WiU8rpz46DIl9f/m2oJmCk62lc5w6tTAjO1zffNIy9wIwx\
i8x3maYqAOJmooNxTL5p3MYu+ip5As/sPT2TZ7VOFg6qVSyw0aDHaQu0vSu3gMVi\
I6NzIJtdRXPB7eKU25/RaYFI0AkJBf6gSjsRVYUZVe824VJy9+dF8gaxsDTMVRH5\
6Gu3bvgrAgMBAAECggEAQgI9rkLdHpiTkQBvruCYNB299iPU2+gJ6CcjjEZSJgin\
mvwsnaz+xHGO5mUfg56ZX0d8wA5Kzo6mPuwq+RqMy7IIX1Lt0Zo+Rk6CmLyiHUZU\
Z/GujyvwcLZSipKg3ookjm6JVjYVZ0WcifVRKaVBKfMzscqNDb1zUgxreqY51t7M\
kn9tKGSCVVqs8PP/DlLgu/UfY5Rc43WhkZ8OG3XYgDG0VMGArKkQ0uNFGaNnF13g\
k46oLmizlgdDvF1gzhiweHu6WbneBf84vpJrz79caMSah20+U3Lhr9QWNLX3gtmj\
i3W2lxxtMM0Mz3ENXTvOTZqAtjtM9vorcLn0xdERAQKBgQDtr8Zmwf31XFkE1Zl4\
KD3o+PGXGV4ckkxVq51a9FY27/+Tvw9CgtyiGCwRynnYSPgjtjte+xPhJkzU2ALZ\
dJZr+vmNVOBrB1ylG/AvW6Iy4vjXe6AkcHamBus4d3k7t+/d8GcAOx7kpb8HwZHc\
iv3KBFP/jdlXqV2HZoISs0ukywKBgQDBNHGbunKHHk/fq669WOrOcwbsupaHWwbH\
aNa12VVPp/TyBSQILhGz/emwIwU3tG0ZUlZT/VV2qzdlAj+sEfdeOn5TN9yAJep6\
D6WbY1a0e3o4s8WM4SpIMEEpLO0ytLsxPEB0EOfQrLgBx3QYovb6IDEMGaX/zavO\
kXlloS7uIQKBgQCk7ifZ/hrfOyl6NU29Fw9+rd/WXX/0i3/0opUaHBoHHRpXx2gr\
WusGf4d1AO7zqg6lmToxekAdJ5qAxzOS+Ve3rfukmpTvL7iVyYEtG4S9ksnhnKNP\
JcrvAjYOhLjXO5dyhfKzMlMJjgm0tBkm1DuvBrnSxvdd4ORJpFP17fw7aQKBgFHg\
JKkHCVPjb5vtCJ8rWE5nBq85n2L7G1NURXFJCdM47R/HN+7TfyMU3nyLSsHBj15k\
uzrap+YjRtVib5M/BeKDzVb83E/eQZC6osbIAU146mGvJW+/WAjBkkudw2NyncWO\
sA2/wE15dH0khjmOjjWPgNmM4QEXqtBea+C6vsWhAoGAEmzTqojlPrN+huBaC/Lv\
5okNuebYVqlDVAqvo+FId47NyAXoV5gWwnXXLJavaxY82VKwraHv3e+hBvMJ2n6W\
6rNVhUrB9QxYnG++c3SweDX62ZEkeSyAllhnvxPQ82PPQNOfchBPVqRR8nl6ZKbD\
0DU6SVCh94AlmJnNBI/y4VU=\n\
-----END PRIVATE KEY-----';

console.emerg('output private key:', keyPem);

//Adding buffers for the certificate & private key
var privateKey = {
  "key": new Buffer(keyPem)
}

var certPem = '-----BEGIN CERTIFICATE-----\n\
MIIDwzCCAqugAwIBAgIIOqm/iUvMORMwDQYJKoZIhvcNAQELBQAwRjELMAkGA1UEBhMCVUsxCzAJBgNVBAgMAkdCMRQwEgYDVQQKDAt0ZXN0LXNpZ25lcjEUMBIGA1UEAwwLdGVzdC1zaWduZXIwHhcNMjAwOTExMTAzNDI3WhcNMjEwOTExMTAzNDI3WjBGMQswCQYDVQQGEwJVSzELMAkGA1UECAwCR0IxFDASBgNVBAoMC3Rlc3Qtc2lnbmVyMRQwEgYDVQQDDAt0ZXN0LXNpZ25lcjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALNiNcLyPGVJ3QdNq1MZmDB4Gl4HVc/Q2Dc2Af1NY/U+mwXbepsWFausz6LMIeRhSihY9P9lN0s29CCi0TiTJid6CO5p3lVu3ZHSJreCmWQWGQivLhRoc3WlwvMwZm3sE3QUdsXHetAX0aCmvJpJvi0j8JjXsRwX9aJTyunPjoMiX1/+bagmYKTraVznDq1MCM7XN980jL3AjDGLzHeZpioA4maig3FMvmncxi76KnkCz+w9PZNntU4WDqpVLLDRoMdpC7S9K7eAxWIjo3Mgm11Fc8Ht4pTbn9FpgUjQCQkF/qBKOxFVhRlV7zbhUnL350XyBrGwNMxVEfnoa7du+CsCAwEAAaOBtDCBsTAMBgNVHRMEBTADAQH/MB0GA1UdDgQWBBSXHZkKh5MmAvCqrjuZxtfdvAbh0jB1BgNVHSMEbjBsgBSXHZkKh5MmAvCqrjuZxtfdvAbh0qFKpEgwRjELMAkGA1UEBhMCVUsxCzAJBgNVBAgMAkdCMRQwEgYDVQQKDAt0ZXN0LXNpZ25lcjEUMBIGA1UEAwwLdGVzdC1zaWduZXKCCDqpv4lLzDkTMAsGA1UdDwQEAwICvDANBgkqhkiG9w0BAQsFAAOCAQEAf/lCMZQd/8JWSZdVBoYzDTQD9MXJtlyrh6T0lvgZAs+oIu4ICGgvnAKaSksEY3s0Hg/l0HgOwB7fpuD9U2en5E0n9bicyDT4iYfE38BUCkqc9ndqXr2jY+yLSkrKI5OQl0NPEenoswmB2mVKlO+2iBwLKYbKiCNGr24GMr8ya/EPF+Ib4ht3uFWjNNL4MONDeuI8fMtAcy6UObRJHkm9jRRXoShr66ssga/ch9iet+0xzOxqedgmhS1a4BFJcHXtGOmzo6nncaqPB7FmdSpKSimKNY/FDM3ClFEhnZZ53jk8tV6/8wYoaWEQmWRyuQsX7fQyQ+/5SRSybhP9xA13wA==\n\
-----END CERTIFICATE-----';

var publicCert = {
  "key": new Buffer(certPem)
}
console.emerg('output certificate:', keyPem);

//Notes i would imagine its possible to put the entire thing on one line or simple pass down the base64 and concat in the -----BEGIN CERTIFICATE-----\n\ \n\-----END CERTIFICATE-----

//Sign Payload of 'This is text to sign'
var sign = crypto.createSign('rsa-sha256');


sign.update('This is text to sign').sign(privateKey, function (error, signature) {
  if (error) {
    console.error("sign error " + error);
  } else {

    //On successful sign, print out blob as base64
    console.emerg("signature with rsa-sha256 is " + signature.toString('base64'));


    //verify the signature we have just written For a success 'This is the text to sign' must match the one used above. These are split so you can test failure
    var verify = crypto.createVerify('rsa-sha256');
    verify.update('This is text to sign').verify(publicCert, signature, function (error) {
      if (error) {
        console.error("verification fail: " + error);
      } else {
        console.emerg("Successfully Validated Data")
        session.output.write('Successfully validated signature');
      }
    });
  }
});
