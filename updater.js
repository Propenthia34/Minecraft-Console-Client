const fs = require('fs-extra');
const { spawn } = require('child_process');

const source = process.argv[2];
const destination = process.argv[3];

setTimeout(() => {
    try {
        fs.copySync(source, destination, { overwrite: true });

        fs.removeSync(source);

        console.log('Guncelleme tamamlandi. Uygulama yeniden baslatiliyor...');
        const bat = spawn('cmd.exe', ['/c', 'start.bat'], { detached: true, stdio: 'ignore' });
        bat.unref();
    } catch (e) {
        console.error('Guncelleme islemi sirasinda bir hata olustu:', e);
    } finally {
        process.exit();
    }
}, 2000);
