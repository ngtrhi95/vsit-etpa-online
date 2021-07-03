link gốc tham khảo <a href="https://github.com/angular/universal-starter/">Universal Starter</a>
trước khi build trên local để dev thì xem qua file .angular-cli.json
- các lệnh hay chạy là 'npm run buildDev' và 'npm run buildProd'
- lệnh build trên server là 'npm run buildDevIIS' và 'npm run buildProdIIS'
- các cài đặt cần quan tâm trên IIS là
1. phải có iisnode
2. trong thư mục gốc trên IIS phải có thư mục '/dist' và file web.config
3. lệnh build trong jenkin
3.1 === cmd /c call npm run buildDevIIS
3.2 === cmd /c call xcopy "D:\JENSKIN\VSITPRO_ONLINE_FRONTEND_SOURCE_DEV\dist" "D:\Build\VSITPRO_PUBLISH_DEV\VsitPro.Online.Frontend\dist" /s/h/e/k/f/c/Y
4. nội dung file web.config
===========================
<configuration>
    <system.webServer>
        <handlers>
            <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
        </handlers>
        <rewrite>
            <rules>
                <rule name="apiRule">
                <match url="/*" />
                <action type="Rewrite" url="dist/server.js" />
                </rule>
            </rules>
        </rewrite>
        <webSocket enabled="false" />
    </system.webServer>
</configuration>

===========================