# CrageNetwork Minecraft Console Client

Bu proje, bir Minecraft sunucusuna komut satırı üzerinden bot olarak bağlanmanızı sağlayan basit bir istemcidir.

## Gereksinimler

Projenin çalışabilmesi için bilgisayarınızda **Node.js**'in kurulu olması gerekmektedir.
*   [Node.js'i indir](https://nodejs.org/) (LTS sürümünü kullanmanız tavsiye edilir.)

## Kurulum

1.  **Projeyi İndirin:**
    Bu sayfadaki "Code" butonuna tıklayıp "Download ZIP" seçeneği ile projeyi bilgisayarınıza indirin ve arşivi bir klasöre çıkartın.

2.  **Gerekli Paketleri Yükleyin:**
    Proje klasörünün içinde bir komut istemi (CMD) veya terminal açın ve aşağıdaki komutu çalıştırın. Bu komut, projenin ihtiyaç duyduğu tüm kütüphaneleri (`mineflayer`, `chalk` vb.) yükleyecektir.
    ```bash
    npm install
    ```

## Kullanım

1.  Kurulum tamamlandıktan sonra, proje klasöründeki `start.bat` dosyasına çift tıklayarak programı başlatın.
2.  Açılan konsol ekranı sizden sırasıyla Minecraft **kullanıcı adınızı** ve **şifrenizi** girmenizi isteyecektir.
    *   **Önemli Not:** Bu bilgiler, sunucuya giriş yapmak için kullanılır. Güvenliğiniz için bu bilgileri paylaşırken dikkatli olunuz.
3.  Bilgileri doğru bir şekilde girdikten sonra, bot sunucuya bağlanacak ve kullanıma hazır olacaktır. Açılan yeni konsol penceresi üzerinden sunucuya mesajlar ve komutlar gönderebilirsiniz.
