import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
var env = environment;        
if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});
var atScriptInit = document.createElement("script");
atScriptInit.setAttribute("type", "text/javascript");
atScriptInit.textContent = 'AT.init({"campaign_id":'+env.ATCampaignId+', "is_reoccur":'+ env.ATIsRReoccur+',"is_lastclick": '+env.ATIs_LastClick +'} );AT.track();';
document.body.appendChild(atScriptInit);
