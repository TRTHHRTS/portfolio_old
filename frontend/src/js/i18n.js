export const localization = {
    ru: {
        back_btn: 'Вернуться в портфолио',
        menu: {
            main: 'Главная',
            blog: 'Новости',
            instruction: 'Инструкция',
            policy: 'Политика конфиденциальности'
        },
        title: 'Home Theatre Server - удаленное управление домашним кинотеатром. Мобильное приложение на Android',
        hts: {
            download_info: 'HomeTheaterServer (для Windows)',
            download: 'Загрузить',
            desc: '<b>HomeTheatre</b> - приложение для удаленного управления домашним кинотеатром. С помощью вашего Android-смартфона вы сможете управлять просмотром не вставая с дивана!\n' +
                'Для работы мобильного приложения необходим сервер <b>Home Theater Server</b>. Скачайте его по ссылке ниже. В архиве лежит ReadMe.txt, прочитайте его для успешной настройки сервера.',
            download_text: 'Если вы еще не скачали Home Theater Remote, сделайте это на '
        },
        hts2: {
            title: 'Новая версия Home Theater Server 2!',
            download_info: 'Версия от {date} - для Windows',
            gp: 'Вы можете скачать последнюю версию приложения HTRemote на {link}.',
            policy: 'Политика конфиденциальности',
            setting: 'Настройка MPC-HC',
            mpc: 'В настройках Media Player Classic - Home Cinema ' +
                '(Вид->Настройки...->Web-интерфейс) установите галочку "Слушать порт:" и пропишите порт "13579" (или любой другой на ваше усмотрение). '
        },
        instruction: {
            title: 'Инструкция по настройке сервера',
            i1: '1. Сначала необходимо настроить HTS_GUI.exe.',
            i2: '2. Затем в настройках Media Player Classic - Home Cinema (Вид->Настройки->WEB-интерфейс) ' +
                'нужно поставить галочку "Слушать порт:" и прописать порт "13579", а также установить ' +
                '(если не стоит) галочку "Разрешить доступ только с локального компьютера" (для вашей безопасности).',
            i2_5: 'Программа корректно работает только для двух языков: русского и английского.',
            i3: '3. Далее необходимо запустить HTS.exe, в консоли должно появиться ' +
                'сообщение об успешном запуске сервера по адресу, который вы указали в настройках.',
            i4: '4. Затем можно прописать настройки соединения в мобильном приложении.'
        }
    },
    en: {
        back_btn: 'Back to portfolio',
        menu: {
            main: 'Main',
            blog: 'News',
            instruction: 'Instruction',
            policy: 'Privacy policy'
        },
        title: 'Home Theatre Server - the remote control of your home theater. Mobile application for Android',
        hts: {
            download_info: 'HomeTheaterServer (for Windows)',
            download: 'Download',
            desc: '<b>HomeTheatre</b> is an app to remote control your home theater. Using your Android smartphone you will be able to control the watching from your sofa.\n' +
                'For operating mobile application <b>Home Theater Server</b> is required. Download it from the link below. There is ReadMe.txt in the archive, read it for a successful server setup.',
            download_text: 'If you have no HomeTheaterRemote app, download it at '
        },
        hts2: {
            title: 'New Home Theater Server 2!',
            download_info: 'Last version ({date}) - for Windows',
            gp: 'You can download the latest version of HTRemote android app at {link}.',
            policy: 'Privacy policy',
            setting: 'MPC-HC settings',
            mpc: 'In the Media Player Classic - Home Cinema settings ' +
                '(View->Options...->Web Interface) check the box "listen on port" and write the port "13579" (or whatever you want). '
        },
        instruction: {
            title: 'Server setting up instruction',
            i1: '1. At first you need to configure HTS_GUI.exe.',
            i2: '2. Then in the settings of Media Player Classic - Home Cinema ' +
                '(View->Options...->Web Interface) check the box "listen on port" and write the port "13579". ' +
                'Check the box "Allow access only from localhost only" if it is unckecked (for your safety).',
            i2_5: 'The program works correctly only for two languages: Russian and English.',
            i3: '3. Then run the HTS.exe. In the console you should see the message about ' +
                'successful server startup at the address you specified in the server settings.',
            i4: '4. Then you can specify the connection settings in the mobile app.'
        }
    }
};