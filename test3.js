
const puppeteer = require ('puppeteer')

const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { mail } = require('./pass.json');
const { pass } = require('./pass.json');
var mes = 'error404'



async function main() {
  console.log('lancement du navigateur')
  console.log('flag1')
    const naviga = await puppeteer.launch({headless: true});
    console.log('flag2')
    const page = await naviga.newPage ();
    console.log('ouverture et login sur la page')   
    await page.goto ('https://www.formation-occ.com/index.php', {waitUntil: 'networkidle2'});
    await page.screenshot ({path: 'unsplash1.png'});
   
    await page.type ('#inputUsername', mail);
    await page.type ('#inputPassword', pass);
    
    await page.click ('input.btn.btn-default');
    console.log('succes login')
    await page.screenshot ({path: 'unsplash11.png'});
    await page.waitForTimeout(2000);
    const pageAttendance= await page.evaluate(() => {
        return !!document.querySelector('#attendancebutton') // !! converts anything to boolean
      })
      if (pageAttendance) { 
        console.log('Le bouton de pointage existe')
        await page.click('#attendancebutton');
        await page.waitForTimeout(2000);
        const pageSuccess= await page.evaluate(() => {
          return !!document.querySelector('.alert.alert-success') 
        })  
        if (pageSuccess) {
          console.log('pointage reussi')
          mes = "pointage reussi"
        }
        else {
          console.log('error')
          mes = "error"
        }
      } else {
        console.log('pas de bouton de pointage')
        console.log('forcage...')
        await page.goto ('https://www.formation-occ.com/index.php?event_attendance=&status=0', {waitUntil: 'networkidle2'});
        const pageClicked = await page.evaluate(() => {
            return !!document.querySelector('.alert.alert-danger') 
         })
         if (pageClicked) { 
            console.log('pointage deja effectué')
            mes = "pointage deja effectué"
        } else {
            console.log('Error')
            mes = "Error"
        }




      }
    
    
    
    await page.waitForTimeout(4000);
     
    // Create a new client instance
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    // When the client is ready, run this code (only once)
    client.once('ready', () => {
	    console.log('discord open');
        client.channels.cache.get("876384374956892203").send(`message <@305441379872407552> : ${mes}`).then(() => {
		    client.destroy();
      console.log('message sent!');
	});
});
client.login(token);
    console.log('fermeture du navigateur')
    await page.screenshot ({path: 'unsplash3.png'});
    await naviga.close ();
    
    
}
main()