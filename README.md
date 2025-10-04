# Crage Network Konsol İstemcisi (Bot)

Bu proje, Crage Network Minecraft sunucusuna bir bot olarak bağlanmanızı sağlayan basit bir konsol istemcisidir. Bot, sunucuda AFK kalmamanızı, otomatik olarak hayatta kalma (survival) sunucusuna geçmenizi ve sohbeti konsol üzerinden takip edip mesaj göndermenizi sağlar.

## Özellikler

-   **Otomatik Bağlanma:** Sunucuyla bağlantı koptuğunda otomatik olarak yeniden bağlanır.
-   **Otomatik Giriş:** Belirttiğiniz şifre ile sunucuya otomatik olarak giriş yapar.
-   **Otomatik Survival:** Giriş yaptıktan sonra otomatik olarak `/server survival` komutunu çalıştırır ve her 30 saniyede bir bu komutu tekrarlar.
-   **Anti-AFK:** Sunucudan atılmamak için periyodik olarak rastgele hareketler yapar.
-   **Otomatik Güncelleme:** Uygulama her başladığında ve ardından her 30 dakikada bir yeni bir sürüm olup olmadığını kontrol eder. Yeni bir sürüm varsa, kendini otomatik olarak günceller ve yeniden başlatır.
-   **Etkileşimli Konsol:** Konsol üzerinden sunucuya doğrudan mesaj gönderebilirsiniz.

## Gereksinimler

-   [Node.js](https://nodejs.org/en/) (LTS sürümünü indirmeniz tavsiye edilir)

## Kurulum ve Başlatma

Bu adımları dikkatlice takip ederek botu kolayca çalıştırabilirsiniz.

### Adım 1: Projeyi İndirme

1.  Bu projenin GitHub sayfasının sağ üst köşesindeki yeşil **"< > Code"** butonuna tıklayın.
2.  Açılan menüden **"Download ZIP"** seçeneğine tıklayın.
3.  İndirdiğiniz ZIP dosyasını bilgisayarınızda kolayca erişebileceğiniz bir klasöre (örneğin, Masaüstü) çıkarın.

### Adım 2: Gerekli Kütüphaneleri Yükleme

1.  Projeyi çıkardığınız klasörün içine girin.
2.  Klasörün içindeyken, üstteki adres çubuğuna `cmd` yazıp Enter'a basarak bir komut istemi (siyah ekran) açın.
3.  Açılan siyah ekrana aşağıdaki komutu yazın ve Enter'a basın:
    ```bash
    npm install
    ```
    Bu komut, botun çalışması için gerekli olan tüm kütüphaneleri (`mineflayer`, `axios` vb.) `node_modules` adında bir klasör oluşturarak içine yükleyecektir. Bu işlem internet hızınıza bağlı olarak bir veya iki dakika sürebilir.

### Adım 3: `start.bat` Dosyasını Düzenleme

1.  Klasörün içinde bulunan `start.bat` dosyasına sağ tıklayın ve **"Düzenle"** seçeneğini seçin.
2.  Dosyanın içinde aşağıdaki gibi bir satır göreceksiniz:
    ```batch
    node cragenetwork.js KULLANICI_ADINIZ SIFRENIZ
    ```
3.  Bu satırdaki `KULLANICI_ADINIZ` kısmını kendi Minecraft kullanıcı adınızla, `SIFRENIZ` kısmını ise Crage Network sunucusuna giriş yaptığınız şifrenizle değiştirin.
    -   **Örnek:** Eğer kullanıcı adınız `Ahmet123` ve şifreniz `123456` ise, satır şu şekilde görünmelidir:
        ```batch
        node cragenetwork.js Ahmet123 123456
        ```
4.  Dosyayı kaydedip kapatın.

### Adım 4: Botu Çalıştırma

Artık tek yapmanız gereken `start.bat` dosyasına çift tıklayarak botu başlatmak. Bot otomatik olarak sunucuya bağlanacak, giriş yapacak ve görevlerini yerine getirmeye başlayacaktır.

## Proje Dosyaları Hakkında

-   **`start.bat`:** Botu doğru kullanıcı adı ve şifre ile başlatan ana betiktir.
-   **`cragenetwork.js`:** Botun tüm ana mantığını içeren dosyadır.
-   **`updater.js`:** Otomatik güncelleme işlemi sırasında dosya kopyalama ve yeniden başlatma işlemlerini yapan yardımcı betiktir.
-   **`package.json`:** Projenin kullandığı kütüphaneleri listeleyen dosyadır. `npm install` komutu bu dosyayı okur.
-   **`version.json`:** Otomatik güncelleme sisteminin mevcut sürümünüzü takip etmek için kullandığı dosyadır. Lütfen bu dosyayı silmeyin.
