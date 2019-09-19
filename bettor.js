const puppeteer = require('puppeteer')
var fs = require('fs')
const cheerio = require('cheerio');
var canGoTOSANDagain=true
var sandLoginLink='https://www.tipico.de/en/live-betting/'
let datamSandPage=0
let dataSandPageScores=0
var request = require("request");
var counter=0
var notAvailablelistTEAModds={
    gameState:[],
    gameTime:[],
    team1Name:[],
    team2Name:[],
    gameScore:[],
    odd1:[],
    oddx:[],
    odd2:[],
    nextGoalX:[]
    }

// var loginim='makasin'
// var passwordum='Lehlulush09'
var notINweekendCanBET=false
var loginim='makasin'
var passwordum='Lehlulush09'
function main(browser){

    (async () => {
    
    var balansdata=fs.readFileSync(__dirname+'/data_files/BALANS.txt', 'utf8');
    var jbalans=JSON.parse(balansdata);
    
    let page = 0
    if(canGoTOSANDagain){
      try {
        page=await browser.newPage();
      } catch (error) {
        // console.log(error)
      }
    }
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
    if(false){
    try {
      await page.setRequestInterception(true); 
    } catch (error) {
    //   console.log(error)
    }
    var sonCookies=''
    var SIGNATURE_VALUE=0
    var startinglogin=false
    try {
        page.on('request', request => {
            if(request.url().indexOf('https://www.tipico.de/login')>-1){
                console.log('login request ON  REQUEST');

                let postdata=request.postData()
                postdata=postdata.replace('signature=','signature='+SIGNATURE_VALUE)
                
                let headers = request.headers();
                var overrides={
                    method: 'POST',
                    postData: 'loc=%2Fen%2Flive-betting%2F&viewId=%2Fprogram%2Fconference.xhtml&casinoLogin=true&paymentLogin=false&deliverTicket=0&saveGameId=&saveCatId=&openPopUpGame=false&openPopUpGameName=&queryString=language%3Den&telekomLoginRedirect=false&ioBlackBox=&login=makasin&password=Lehlulush09', 
                    headers: headers
                }
                headers['authority']= 'www.tipico.de'
                headers['method']= 'POST'
                headers['path']= '/login'
                headers['scheme']= 'https'
                headers['accept']= 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
                headers['accept-encoding']= 'gzip, deflate, br'
                headers['accept-language']= 'en-US,en;q=0.9'
                headers['cache-control']= 'max-age=0'
                headers['content-length']= postdata.length
                headers['content-type']= 'application/x-www-form-urlencoded'
				
                headers['origin']= 'https://www.tipico.de'
                headers['referer']= 'https://www.tipico.de/en/live-betting/'
                headers['upgrade-insecure-requests']=1
                headers['user-agent']='Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36'
				
                overrides.postData = postdata
                overrides.headers = headers
                request.cotinue(overrides);
                return;
            }
            // non-navigation requests.
            if (!request.isNavigationRequest()||request.url().indexOf('https://www.tipico.de/en/live-betting')==-1) {
                request.cotinue();
                // console.log('1');
                return;
            }
            let headers = request.headers();
            if(request.url().indexOf('https://www.tipico.de/en/live-betting')>-1 && !startinglogin){
                if(sonCookies.trim().length>0){
                    console.log('2');
                    headers['authority']='www.tipico.de'
                    headers['method']='GET'
                    headers['path']='/en/live-betting/'
                    headers['scheme']='https'
                    headers['accept']='text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
                    headers['accept-encoding']='gzip, deflate, br'
                    headers['accept-language']='en-US,en;q=0.9'
                    headers['cache-control']='max-age=0'
                    headers['referer']= 'https://www.tipico.de/en/live-betting/'
                }
                headers['upgrade-insecure-requests']=1
                headers['user-agent']='Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36'
                request.cotinue({ headers });
                console.log('request.cotinue');
                return
            }
            if(startinglogin){
                request.cotinue();
                return
            }
    
            if(false){
            var scoresLink='https://www.tipico.de/program/scoresPopup.faces'
            var gutballScoresLink='https://www.tipico.de/spring/complete/www_tipico_de_program_scoresPopup_faces30'
            if(request.url().indexOf('https://www.tipico.de/spring/complete/www_tipico_de_program_scoresPopup_faces30')>-1){
                headers['authority']='www.tipico.de'
                headers['method']= 'POST'
                headers['path']= '/spring/complete/www_tipico_de_program_scoresPopup_faces30'
                headers['scheme']= 'https'
                headers['accept']= 'text/html, */*; q=0.01'
                headers['accept-encoding']= 'gzip, deflate, br'
                headers['accept-language']= 'en-US,en;q=0.9'
                headers['cache-control']= 'no-cache'
                headers['content-type']= 'application/x-www-form-urlencoded; charset=UTF-8'
                headers['origin']= 'https://www.tipico.de'
                headers['referer']= 'https://www.tipico.de/program/scoresPopup.faces'
                headers['user-agent']='Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36'
                headers['_']= '@resultsContent/scores/content%3FnavType%3DRESULTS%26groupId%3D1101'
                request.cotinue({ headers })
            }
            }
        });
        page.on('response', async response => {
            let urlum= 0
            try {
                urlum=await response.url()
            } catch (error) {
            // console.log(error)
            }
            if(urlum.indexOf('https://www.tipico.de/spring/complete/www_tipico_de_program_scoresPopup_faces30')>-1){return}
            if(dataSandPageScores!=0||urlum.indexOf('https://www.tipico.de/spring/update/www_tipico_de_en_live_betting_30')==-1){return}
            if(sandLoginLink!=0 && dataSandPageScores==0){
                try {
                    dataSandPageScores= await response.text() 
                } catch (error) {
                    // console.log(error)
                }
                while (!dataSandPageScores || dataSandPageScores==0) {
                    // console.log('response')
                    try {
                        dataSandPageScores= await response.text() 
                    } catch (error) {
                        // console.log(error) x
                    }
                    try {
                        await timeout(1000)
                    } catch (error) {
                        
                    }
                }
            }
        });
    } catch (error) {
        console.log('request response ERROR',error);        
    }
    }

    counter+=1
    var waitedForNavigation=false
    while (!waitedForNavigation && canGoTOSANDagain) {
        lastListIndexToGo=0
        try {
            // 'https://www.tipico.de'
            waitedForNavigation=await page.goto(sandLoginLink);
        } catch (error) {
            waitedForNavigation=false
        }
        try {
            await timeout(1000) 
        } catch (error) {
            
        }
    }
    
    if(false){
    const cookies=await page.cookies()
    while(!cookies){
        await timeout(1000)
    }
    var lazimliCookies={
        'SLAVE_ID':0,'JSESSIONID':0,'bm_sz':0,'bm_mi':0,'_abck':0,'ak_bmsc':0,'_gcl_au':0,'LiveSportsVisit':0,'_ga':0,
        '_gid,_dc_gtm_UA-81410573-18':0,'bounceClientVisit2724v':0,'liveagent_oref':0,'liveagent_ptid':0,
        'liveagent_sid':0,'liveagent_vc':0
    }
    
    for (let index = 0; index < cookies.length; index++) {
        const element = cookies[index];
        if(element['name'].indexOf('SIGNATURE_VALUE')>-1){
            SIGNATURE_VALUE=element['value']
        }
        for (const key in lazimliCookies) {
            if(element['name'].indexOf(key)>-1){
                lazimliCookies[key]=element['value']
                break
            }
        }
    }
    for (const key in lazimliCookies) {
        var tempc=key+'='+lazimliCookies[key]+'; '
        sonCookies+=tempc
    }
    console.log(sonCookies);
    console.log(cookies);
    }

    var lotToBet=1
    counter+=1
    var canLogin=true
    if(canLogin){
        var loginHappened=false
        while(!loginHappened){
            waitedForNavigation=false
            while (!waitedForNavigation && canGoTOSANDagain && false) {
                try {
                    // 'https://www.tipico.de'
                    waitedForNavigation=await page.goto(sandLoginLink);
                } catch (error) {
                    waitedForNavigation=false
                }
                try {
                    await timeout(1000) 
                } catch (error) {
                    
                }
            }
            try {
                await page.waitForSelector('.login-button',{visible:true}) 
            } catch (error) {
            //   console.log(error)
            }
            let loginbuttonselel=0
            var loginbuttonselelHappenedTime1=0
            while (loginbuttonselel==0 || !loginbuttonselel) {
                await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                console.log('login-button selel');
                loginbuttonselelHappenedTime1+=1
                if(loginbuttonselelHappenedTime1>=3)process.exit();
                try {
                    loginbuttonselel=await page.$('.login-button')   
                } catch (error) {
                    
                }
                try {
                    await timeout(1000)
                } catch (error) {
                    
                }
            }
            await page.$eval('.login-button', el => el.click()); 
            await timeout(1000)
            loginbuttonselelHappenedTime1=0
            loginbuttonselel=0
            while (loginbuttonselel==0 || !loginbuttonselel) {
                loginbuttonselelHappenedTime1+=1
                if(loginbuttonselelHappenedTime1>=3)process.exit();
                await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                console.log('login-button2 selel');
                try {
                    loginbuttonselel=await page.$('#loginButton')   
                } catch (error) {
                    
                }
                try {
                    await timeout(1000)
                } catch (error) {
                    
                }
            }
            await timeout(1000)
            try {
                await page.type('#login',loginim) 
            } catch (error) {
            //   console.log(error)
                loginHappened=false
                continue
            }
            await timeout(1000)
            try {
                await page.type('#password',passwordum) 
            } catch (error) {
            //   console.log(error)
                loginHappened=false
                continue
            }
            await timeout(1000)
            await page.$eval('#loginButton', el => el.click()); 
            await timeout(10000)
            loginHappened=true
            if(true){
                let urlum=await page.url()
                while (!urlum) {
                    await timeout(1000)
                }
                if(urlum.indexOf('https://www.tipico.de/login')>-1){
                    loginHappened=false
                    loginbuttonselel=0
                    while (loginbuttonselel==0 || !loginbuttonselel) {
                        console.log('login-button3 selel');
                        try {
                            loginbuttonselel=await page.$('#home > main > div > div > section > form > div:nth-child(2) > input[type="text"]:nth-child(2)')   
                        } catch (error) {
                            
                        }
                        try {
                            await timeout(1000)
                        } catch (error) {
                            
                        }
                    }
                    try {
                        await page.type('#home > main > div > div > section > form > div:nth-child(2) > input[type="text"]:nth-child(2)',loginim) 
                    } catch (error) {
                    //   console.log(error)
                        loginHappened=false
                        continue
                    }
                    await timeout(1000)
                    try {
                        await page.type('#home > main > div > div > section > form > div:nth-child(2) > input[type="password"]:nth-child(4)',passwordum) 
                    } catch (error) {
                    //   console.log(error)
                        loginHappened=false
                        continue
                    }
                    await timeout(1000)
                    await page.$eval('#home > main > div > div > section > form > div:nth-child(2) > button', el => el.click()); 
                    await timeout(1000)
                }
                var loginbuttonselelHappenedTime=0
                let livebettingselel=0
                while(!livebettingselel || livebettingselel==0){
                    while (livebettingselel==0 || !loginbuttonselel) {
                        await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                        console.log('login-button selel');
                        loginbuttonselelHappenedTime+=1
                        if(loginbuttonselelHappenedTime>=3)process.exit();
                        try {
                            livebettingselel=await page.$('#main-menu > a:nth-child(5)')   
                        } catch (error) {
                            livebettingselel=0
                        }
                        try {
                            await timeout(1000)
                        } catch (error) {
                            
                        }
                    }
                    try {
                        await page.$eval('#main-menu > a:nth-child(5)', el => el.click());    
                    } catch (error) {
                        livebettingselel=0
                    }
                }
            }
            await timeout(1000)
        }
        let balance=await page.$('.credit-balance.nav-button.my-account > .value')
        await timeout(1000)
        while(!balance){
            balance=await page.$('.credit-balance.nav-button.my-account > .value')
            await timeout(1000)
        }
        let balanceText=await page.evaluate((next) => next.textContent,balance)
        while (!balanceText) {
            await timeout(1000)
        }
        balanceText=parseFloat(balanceText.replace('€','').replace(',','.'))
        console.log('balansim: ',balanceText,'lotum: ',lotToBet)

        if(balanceText<parseFloat(2)){
            console.log('balansim cox little:',balanceText,new Date().toLocaleString());
            await timeout(60000*3)
            process.exit()
        }

        var today = new Date()
        var eday = today.getDate()

        if(eday!=parseInt(jbalans['eday']) && parseInt(jbalans['eday'])-eday==1){
            console.log('NOT IN NEW DAY',new Date().toLocaleString());
            resetFiles()
            await timeout(60000*3)
            process.exit()
        }
        if(parseFloat(balanceText)-parseFloat(jbalans['balans'])>parseFloat(1) && parseInt(jbalans['eday'])==eday){
            console.log('daily 2+ PNL OLDU',new Date().toLocaleString());
            jbalans['balans']=balanceText
            jbalans['eday']=eday+1
            fs.writeFileSync(__dirname+'/data_files/BALANS.txt', JSON.stringify(jbalans))
            await timeout(60000*3)
            process.exit()
        }
    }

    var firstTeamSel='div.c_2 > div:nth-child(1)'
    var firstScoreSel='#jq-event-id-234820510 > div.c_2 > div.score'
    
    try {
        datamSandPage=await page.evaluate(() => document.body.outerHTML)    
    } catch (error) {
        
    }
    counter+=1
    while (!datamSandPage || datamSandPage==0) {
        try {
            datamSandPage=await page.evaluate(() => document.body.outerHTML)    
        } catch (error) {
            
        }
        try {
            await timeout(1000)
        } catch (error) {
            
        }
    }
    if(false){
    while((dataSandPageScores && dataSandPageScores.indexOf('<div class="score ">')==-1) || !datamSandPage || dataSandPageScores==0){
        try {
            await page._client.send("Page.stopLoading"); 
        } catch (error) {
            // console.log(error)
        }
        try {
            await timeout(1000)
        } catch (error) {
            
        }
        dataSandPageScores=0
        waitedForNavigation=false
        while (!waitedForNavigation && canGoTOSANDagain) {
            try {
                waitedForNavigation=await page.goto(sandLoginLink);
            } catch (error) {
                waitedForNavigation=false
            }
            try {
                await timeout(1000) 
            } catch (error) {
                
            }
        }
        try {
            await timeout(1000)
        } catch (error) {
            
        }
    }
    }
    try {
        datamSandPage=await page.evaluate(() => document.body.outerHTML)
    } catch (error) {
        
    }
    counter+=1
    while (!datamSandPage || datamSandPage.indexOf('main_space border_ccc')==-1) {
        try {
            datamSandPage=await page.evaluate(() => document.body.outerHTML)
        } catch (error) {
            
        }
        try {
            await timeout(1000)
        } catch (error) {
            
        }
        console.log('NO score');
    }
    
    var futballHeaderExist=false
    // main cheerio worker
    if(false){
        
        var listTEAModds={
            gameState:[],
            gameTime:[],
            team1Name:[],
            team2Name:[],
            gameScore:[],
            odd1:[],
            oddx:[],
            odd2:[],
            nextGoalX:[],
            datem:[]
            }
        var gameStates={
            firstMinute0:'fM0',        
            first45away:'f45a',
            first45draw: 'f45d'
        }
        counter+=1
        console.log(new Date().toLocaleString())
        var today = new Date()
        var eday = today.getDate()
        var emonth=(today.getMonth()+1)
        var fulltime=today.getFullYear()+'-'+emonth+'-'+eday

        $ = cheerio.load(datamSandPage)
        $('.jq-event-row').each(function(c1, element){
            if(!$(element).parent().parent().find('.jq-header-row').attr('id'))return
            var divID=$(element).parent().parent().find('.jq-header-row').attr('id').trim()
            if(divID!='_program_conference_runningheader_sportId_soccer'){return false}
            else if(!futballHeaderExist){
                futballHeaderExist=true
                console.log('Futball games exist');
            }

            var timem= $(element).find('div.c_1').eq(0).text().indexOf("'")>-1 ? parseInt($(element).find('div.c_1').eq(0).text().replace("'",'')):$(element).find('div.c_1').eq(0).text()
            if($(element).find('div.c_1').eq(0).text().trim().length==0)timem='1st half'
            if($(element).find('div.c_1').eq(0).text().indexOf('HT')>-1)timem=$(element).find('div.c_1').eq(0).text().trim()
				
            var odds=$(element).find('div.c_3').eq(0)
            var odds1=$(odds).find(':nth-child(1)').text().trim()
            var oddsx=$(odds).find(':nth-child(2)').text().trim()
            var odds2=$(odds).find(':nth-child(3)').text().trim()
            if(odds2.length==0)lastOUunder='match paused or finished'
            
            var team1=$(element).find('div.c_2').eq(0).find('div:nth-child(1)').text().trim()
            var team2=$(element).find('div.c_2').eq(0).find('div:nth-child(3)').text().trim()
            var teamscore=$(element).find('div.c_2').eq(0).find('div:nth-child(2)').text().trim()
            

            var lastOU=$(element).find('div.c_3').eq(3)
            var lastOUtype=$(lastOU).find('.darkgrey').text().trim()
			
            var lastOUover=$(lastOU).find(':nth-child(2)').text().trim()
            var lastOUunder=$(lastOU).find(':nth-child(3)').text().trim()
            var underOverText='uo type: '+String(lastOUtype)+' '+String(lastOUover)+'-'+String(lastOUunder)

            var nGoal=$(element).find('div.c_3').eq(2)
            var nGoalX=$(nGoal).find(':nth-child(2)').text().trim()
			
            if(true && teamscore=='0:0' && timem!='HT' && parseInt(timem)<5){
                console.log('FIRST 45',timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,new Date().toLocaleString());
            }
            if(true && timem!='HT' && parseInt(timem)>45 && parseInt(timem)<50 && teamscore=='0:0'){
                console.log('second 45',timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,underOverText,new Date().toLocaleString());
            }

            if(timem!='HT'){
				
                if(parseInt(timem)>45 && parseInt(timem)<60 && teamscore=='0:1' && oddsx.length>0 && false){
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
					
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                    if(jdata.team1Name.indexOf(team1)!=jdata.team1Name.indexOf(team2)){
                        console.log(timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,new Date().toLocaleString());
                    }
                }
				
                if(parseInt(timem)>45 && parseInt(timem)<60 && teamscore=='1:1' && nGoalX.length>0 && false){
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
					
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                    if(jdata.team1Name.indexOf(team1)!=jdata.team1Name.indexOf(team2)){
                        console.log(timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,new Date().toLocaleString());
                    }
                }
				
                if(parseInt(timem)>45 && parseInt(timem)<60 && teamscore=='0:0' && nGoalX.length>0 && false){
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
                    listTEAModds.gameState.push(gameStates.firstMinute0)
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                    if(jdata.team1Name.indexOf(team1)!=jdata.team1Name.indexOf(team2)){
                        console.log(timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,new Date().toLocaleString());
                    }
                }
				
                if(parseInt(timem)<16 && parseInt(timem)<60 && teamscore=='0:0' && nGoalX.length>0){
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
                    listTEAModds.gameState.push(gameStates.firstMinute0)
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                    if(jdata.team1Name.indexOf(team1)!=jdata.team1Name.indexOf(team2)){
                        console.log('yoxla',timem,team1,teamscore,team2,odds1,oddsx,odds2,nGoalX,new Date().toLocaleString());
                    }
                }

                if(false){
                if(teamscore=='0:1' && oddsx.length>0 && notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)){
					
                    while (notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)) {
                        var deleteIndex=notAvailablelistTEAModds.team1Name.indexOf(team1)
                        notAvailablelistTEAModds.team1Name.splice(deleteIndex,1)
                        notAvailablelistTEAModds.team2Name.splice(deleteIndex,1) 
                    }
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
                    listTEAModds.gameState.push(gameStates.firstMinute0)
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                }
                if(teamscore=='1:1' && nGoalX.length>0 && notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)){
					
                    while (notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)) {
                        var deleteIndex=notAvailablelistTEAModds.team1Name.indexOf(team1)
                        notAvailablelistTEAModds.team1Name.splice(deleteIndex,1)
                        notAvailablelistTEAModds.team2Name.splice(deleteIndex,1) 
                    }
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
                    listTEAModds.gameState.push(gameStates.firstMinute0)
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                }
                if(teamscore=='0:0' && nGoalX.length>0 && notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)){
					
                    while (notAvailablelistTEAModds.team1Name.indexOf(team1)>-1 && notAvailablelistTEAModds.team2Name.indexOf(team2)>-1 && notAvailablelistTEAModds.team1Name.indexOf(team1)==notAvailablelistTEAModds.team2Name.indexOf(team2)) {
                        var deleteIndex=notAvailablelistTEAModds.team1Name.indexOf(team1)
                        notAvailablelistTEAModds.team1Name.splice(deleteIndex,1)
                        notAvailablelistTEAModds.team2Name.splice(deleteIndex,1) 
                    }
                    listTEAModds.team1Name.push(team1)
                    listTEAModds.team2Name.push(team2)
                    listTEAModds.gameState.push(gameStates.firstMinute0)
                    listTEAModds.gameTime.push(timem)
                    listTEAModds.gameScore.push(teamscore)
                    listTEAModds.odd1.push(odds1)
                    listTEAModds.oddx.push(oddsx)
                    listTEAModds.odd2.push(odds2)
                    listTEAModds.nextGoalX.push(nGoalX)
					
                    listTEAModds.datem.push(fulltime)
                }
                }
            }
            if(false){
                if($(element).find('div.c_1').length>1){
                    var lastOU=$(element).find('div.c_3:last-child')
                    if($(lastOU).hasClass('ext_more'))lastOU=$(lastOU).prev();
                    var lastOUtype=$(lastOU).find('span').text().trim()
                    var lastOUover=$(lastOU).find(':nth-child(2)').text().trim()
                    var lastOUunder=$(lastOU).find(':nth-child(3)').text().trim()
                    if(lastOUunder.length==0)lastOUunder='match paused or finished'

					
                    var mainLastOU=$(element).find('div.c_1').eq(1)

                    mainLastOU=$(mainLastOU).prev();
                    if($(mainLastOU).hasClass('next_more'))mainLastOU=$(mainLastOU).prev();
                    var mainLastOUtype=$(mainLastOU).find('span').text().trim()
                    var mainLastOUover=$(mainLastOU).find(':nth-child(2)').text().trim()
                    var mainLastOUunder=$(mainLastOU).find(':nth-child(3)').text().trim()
                    if(mainLastOUunder.length==0)mainLastOU='match paused or finished'
					
                    $(element).find('div.c_2').each(function(c3, team_element){
                        if(c3==0){
                            var team1=$(team_element).find('div:nth-child(1)').text().trim()
                            var team2=$(team_element).find('div:nth-child(3)').text().trim()
                            var teamscore=$(team_element).find('div:nth-child(2)').text().trim()
                            console.log('MAIN',timem,team1,teamscore,team2,mainLastOUtype,mainLastOUover,mainLastOUunder);
                        }
                        else{
                            var team1=$(element).find('div.c_2').find('div:nth-child(1)').text().trim()
                            var team2=$(element).find('div.c_2').find('div:nth-child(3)').text().trim()
                            var teamscore=$(element).find('div.c_2').find('div:nth-child(2)').text().trim()
                            console.log('1st half',timem,team1,teamscore,team2,lastOUtype,lastOUover,lastOUunder);
                        }
						
                    })
					
                }
                if($(element).find('div.c_1').length==1){
					
                    var lastOU=$(element).find('div.c_3:last-child')
                    if($(lastOU).hasClass('next_more'))lastOU=$(lastOU).prev();
                    var lastOUtype=$(lastOU).find('span').text().trim()
                    var lastOUover=$(lastOU).find(':nth-child(2)').text().trim()
                    var lastOUunder=$(lastOU).find(':nth-child(3)').text().trim()
                    if(lastOUunder.length==0)lastOUunder='match paused or finished'
					
                    var team1=$(element).find('div.c_2').find('div:nth-child(1)').text().trim()
                    var team2=$(element).find('div.c_2').find('div:nth-child(3)').text().trim()
                    var teamscore=$(element).find('div.c_2').find('div:nth-child(2)').text().trim()
                    console.log('only match',timem,team1,teamscore,team2,lastOUtype,lastOUover,lastOUunder);
					
                }
            }
			
        })

    }

    var listTEAModdsMain={
        gameTime:[],
        team1Name:[],
        team2Name:[],
        gameScore:[],
        nextGoalX:[],
        datem:[],
        datemHour:[]
        }
    counter+=1
    const startClicking=true
    if(startClicking){

        var gameStates={
            firstMinute0:'fM0',        
            first45away:'f45a',
            first45draw: 'f45d'
        }
        var betAmount='#editorForm\3a amountDisplay'
        betAmount='#ticket_content > div:nth-child(8) > div:nth-child(2) > input'
        betAmount='#editorForm:amountDisplay'
        betAmount='#ticket_content > .col.bg_midgrey > .right > input'
        var betDeleteButton='#ticket_content > table.event_head > tbody > tr > td.close > div > img'
        var betPlaceButton='#editorForm\3a reactionRepeat\3a 0\3a cmdReaction'
        betPlaceButton='.ticket_button_flex'
        var betTEAMname='#ticket_content > table.event_head > tbody > tr > td:nth-child(2)'
        var parentProbablyFutbal='.border_ccc'
        var betPlaceLogin='#casinoLogin'
        var betPlacePass='#password_2'
        var betPlaceLoginSubmit='#casinoLoginForm > div.div_center > div > a'
		
        while (true) {
            if(true){
                waitedForNavigation=false
                while (!waitedForNavigation && canGoTOSANDagain) {
                    try {
                        waitedForNavigation=await page.goto(sandLoginLink);
                    } catch (error) {
                        waitedForNavigation=false
                    }
                    try {
                        await timeout(1000) 
                    } catch (error) {
                        
                    }
                    console.log('navigation try');
                }
                datamSandPage=0
                try {
                    datamSandPage=await page.evaluate(() => document.body.outerHTML)
                } catch (error) {
                    
                }
                var noScoreCount=0
                counter+=1
                while (!datamSandPage || datamSandPage.indexOf('main_space border_ccc')==-1) {
                    try {
                        datamSandPage=await page.evaluate(() => document.body.outerHTML)
                    } catch (error) {
                        
                    }
                    try {
                        await timeout(1000)
                    } catch (error) {
                        
                    }
                    console.log('NO score 2');
                    noScoreCount+=1
                    if(noScoreCount>5){
                        process.exit()
                    }
                }
            }

            listTEAModdsMain.team1Name.length=0
            listTEAModdsMain.team2Name.length=0
			
            listTEAModdsMain.gameTime.length=0
            listTEAModdsMain.gameScore.length=0
            listTEAModdsMain.nextGoalX.length=0
            listTEAModdsMain.datem.length=0
            listTEAModdsMain.datemHour.length=0
			
            liveBetCountTextM=-1
            counter+=1
            var checkCashout=false
            if(checkCashout && liveBetCountTextM>0){
                let myBets=await page.$('#main-menu > div > a.my-account.nav-button')
                while (!myBets) {
                    console.log('myBets wait');
                    await timeout(1000)
                }
                try {
                    await page.evaluate(el => el.click(), myBets);   
                } catch (error) {
                    
                }
                await timeout(1000)
				
                let chashoutsel= await page.$('.tab_box_2')
                await timeout(1000)
                while (!chashoutsel) {
                    console.log('chashoutsel wait');
                    await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                    await timeout(1000)
                }
                try {
                    await page.evaluate(el => el.querySelectorAll('.tab_2_select')[1].getElementsByTagName('a')[0].click(), chashoutsel);    
                } catch (error) {
                    
                } 
                await timeout(2000)
                let allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                await timeout(1000)
				
                if(allBetsCOLength!=0){
                    for (let indexc = 0; indexc < allBetsCOLength; indexc++) {
                        let nextBetCO=await page.$('#mybettings'+' > .mybets:nth-child('+(1+indexc)+')')
                        await timeout(1000)
                        if(!!nextBetCO)continue

                        let nextTimeCO=await page.evaluate((next) => next.querySelectorAll(".jq-event-row-cont")[0].getElementsByTagName('span')[0].textContent,nextBetCO)   
                        await timeout(1000)
                        let nextScoreCO=await page.evaluate((next) => next.querySelectorAll(".sheet_c6")[0].getElementsByTagName('span')[0].textContent,nextBetCO)
                        await timeout(1000)
                        let nextButtonCO=await page.evaluate((next) => next.querySelectorAll(".cashout")[0],nextBetCO)
                        await timeout(1000)
                        let nextOLDvalueCO=await page.evaluate((next) => next.querySelectorAll(".vanish.sheet_c5")[0],nextBetCO)
                        await timeout(1000)
                        let nextCURRENTvalueCO=await page.evaluate((next) => next.querySelectorAll(".text")[0],nextBetCO)
                        await timeout(1000)
                        
                        if(!nextTimeCO || !nextScoreCO || !nextButtonCO || !nextCURRENTvalueCO || !nextOLDvalueCO){
                            console.log('one of nextCO not available');
                            allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                            await timeout(1000)
                            if(allBetsCOLength==0){
                                indexc=0
                                console.log('no co yet after');
                                break
                            }
							
                            indexc=0
                            continue
                        }
                        nextOLDvalueCO=parseFloat(nextOLDvalueCO.replace(',','.'))
                        nextCURRENTvalueCO=parseFloat(nextCURRENTvalueCO.replace('€','').replace('Cashout for ','').replace(',','.'))
                        nextTimeCO=nextTimeCO.trim()
                        nextTimeCO= nextTimeCO.indexOf("'")>-1 ? nextTimeCO.replace("'",''):nextTimeCO
                        var scoreDange=nextScoreCO.indexOf('0:1 (0:0)')>-1 || nextScoreCO.indexOf('1:0 (0:0)')>-1
                        if(nextTimeCO.indexOf('HT')==-1 && (parseInt(nextTimeCO)>85 && parseInt(nextTimeCO)<90) && scoreDange && nextCURRENTvalueCO>parseFloat(1.1)){
                            try {
                                await page.evaluate(el => el.click(), nextButtonCO);
                            } catch (error) {
                                
                            }
                            let COconfitm=await page.$('.confirm')
                            while (!COconfitm) {
                                console.log('COconfitm wait');
                                await timeout(1000)
                            }
                            try {
                                await page.evaluate(el => el.click(), COconfitm);
                            } catch (error) {
                                
                            }
                            allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                            await timeout(1000)
                            if(allBetsCOLength==0){
                                indexc=0
                                console.log('no co yet after 2');
                                break
                            }
							
                            indexc=0
                        }

                    }
                }
            }
            
            var num=2
			
            let allFutballLength=0
            try {
                allFutballLength=await page.$eval('#_program_conference_runningheader_sportId_soccer', el => el.parentElement.querySelectorAll(".e_active").length);
            } catch (error) {
                
            }
            await timeout(1000)
            counter+=1
            var noFootball=false
            while (!allFutballLength) {
				
                console.log('no futball game');
                noFootball=true
				
                await timeout(20000)
                break
                
                try {
                    allFutballLength=await page.$eval('#_program_conference_runningheader_sportId_soccer', el => el.parentElement.querySelectorAll(".e_active").length);
                } catch (error) {
                    
                }
                await timeout(60000)
            }
            if(noFootball)continue;
            allFutballLength=(allFutballLength-1)/2
			
            var szdataMtemp=fs.readFileSync(__dirname+'/data_files/subZERO2.txt', 'utf8');
            var jszdataMtemp=JSON.parse(szdataMtemp);
            if(allFutballLength<=3 && jszdataMtemp.team1Name.length>20){
                var liveBetCountTextTempWaitCount=0
                let liveBetCount2=await page.$('#main-menu > div > a.my-account.nav-button > span.value')
                await timeout(1000)
                while(!liveBetCount2){
                    liveBetCount2c=await page.$('#main-menu > div > a.my-account.nav-button > span.value')
                    await timeout(1000)
                    console.log('livebetcount2 wait');
                }
                let liveBetCountTextTemp=await page.evaluate((next) => next.textContent,liveBetCount2)
                while (!liveBetCountTextTemp) {
                    liveBetCountTextTempWaitCount+=1
                    await timeout(1000)
                    if(liveBetCountTextTempWaitCount>3)break;
                }
                if(liveBetCountTextTempWaitCount<3){
                    liveBetCountTextTemp=liveBetCountTextTemp.trim()
                    if(parseInt(liveBetCountTextTemp)<1)
                    console.log('reseting, few games',allFutballLength);
                    resetFiles()
                    process.exit()
                }
            }
            console.log(allFutballLength,'ALL FUTBALLLLLLLLL GAMESSSS');
            console.log(new Date().toLocaleString());
			
            var somethingINLOGs=true
            var data=fs.readFileSync(__dirname+'/data_files/logMAIN.txt', 'utf8');
            var jdata=JSON.parse(data);
            var changedToSingleBet=false
            for (let index = 0; index < allFutballLength; index++) {
				
                counter+=1
                var gameProbablyEnded=false
                let nextGame=0
                try {
                    nextGame=await page.$(parentProbablyFutbal+' > .e_active:nth-child('+(num+index)+')')
                } catch (error) {
                    console.log('nextgae error restarting');
                    var scount=0
                    await browser.close();
                    while (true) {
                        scount+=1
                        await timeout(1000)
                        if(scount==2){
                            break
                            // process.exit()
                        }
                    }
                }
				
                let nextTime=0
                try {
                    nextTime=await page.evaluate((next) => next.querySelectorAll(".c_1")[0].textContent,nextGame)
                } catch (error) {
                    gameProbablyEnded=true
                    // console.log(error);
                    
                }
				
                if(gameProbablyEnded){
                    console.log('nextTime')
					
                    continue
                }
                nextTime=nextTime.trim()
				
                nextTime= nextTime.indexOf("'")>-1 ? nextTime.replace("'",''):nextTime
            
                let tscore=0
                try {
                    tscore=await page.evaluate((next) => next.querySelectorAll(".score")[0].innerText,nextGame)
                } catch (error) {
                    gameProbablyEnded=true
                }
				
                tscore=tscore.trim()
				
                let team1=0
                try {
                    team1=await page.evaluate((next) => next.querySelectorAll(".c_2")[0].querySelectorAll('.team')[0].innerText,nextGame)
                } catch (error) {
                    gameProbablyEnded=true
                }
                while (!team1 || team1==0) {
                    try {
                        await timeout(1000)
                    } catch (error) {
                        
                    }
                    console.log('team1 wait');
                }
                team1=team1.trim()
                let team2=0
                try {
                    team2=await page.evaluate((next) => next.querySelectorAll(".c_2")[0].querySelectorAll('.team')[1].innerText,nextGame)
                } catch (error) {
                    gameProbablyEnded=true
                }
                while (!team2 || team2==0) {
                    try {
                        await timeout(1000)
                    } catch (error) {
                        
                    }
                    console.log('team2 wait');
                }
                team2=team2.trim()

                if(gameProbablyEnded){
                    console.log(1)
					
                    continue
                }
				
                let underOverType2=0
                try {
					
                    underOverType2=await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("span")[0].textContent,nextGame)
					
                    gameNotAvailable=false
                } catch (error) {
                    gameNotAvailable=true
                }
                if(gameNotAvailable || !underOverType2){
					
                    console.log(72)
                    continue
                }
				
                if(tscore=='0:0'){
                    
                    var szdata=fs.readFileSync(__dirname+'/data_files/subZERO.txt', 'utf8');
                    var jszdata=JSON.parse(szdata); 
					
                    if(nextTime.indexOf('HT')==-1 && parseInt(nextTime)>1 && parseInt(nextTime)<45 && jszdata.team1Name.indexOf(team1)==-1){
                        let szGoal=0
                        try {
                            szGoal=await page.evaluate(el => el.querySelectorAll(".c_3")[2].getElementsByTagName("button")[1].textContent,nextGame)
                            gameNotAvailable=false
                        } catch (error) {
                            gameNotAvailable=true
                        }
						
                        if(gameNotAvailable || !szGoal)szGoal=0;
                        if(szGoal!=0){
                            szGoal=szGoal.trim();
                            var today = new Date()
                            var eday = today.getDate()
                            var emonth=(today.getMonth()+1)
                            var fulltime=today.getFullYear()+'-'+emonth+'-'+eday
                            var hourAndMinute = today.getHours()+':'+today.getMinutes()
							
                            jszdata.team1Name.push(team1)
                            jszdata.team2Name.push(team2)
                            jszdata.gameTime.push(nextTime)
                            jszdata.gameScore.push(tscore)
                            jszdata.oddx.push(szGoal)
                            jszdata.datem.push(fulltime)
                            jszdata.datemHour.push(hourAndMinute)
							
                            try {
                                fs.writeFileSync(__dirname+'/data_files/subZERO.txt', JSON.stringify(jszdata))
								
                                console.log('subZERO written');
                            } catch (error) {
                                console.log('subZERO written not written');
                            }
                        } 
                    }
                    var szdata2=fs.readFileSync(__dirname+'/data_files/subZERO2.txt', 'utf8');
                    var jszdata2=JSON.parse(szdata2); 
					
                    if( nextTime.indexOf('HT')>-1 && jszdata2.team1Name.indexOf(team1)==-1 && jszdata.team1Name.indexOf(team1)>-1){
                        let szGoal=0
                        try {
                            szGoal=await page.evaluate(el => el.querySelectorAll(".c_3")[2].getElementsByTagName("button")[1].textContent,nextGame)
                            gameNotAvailable=false
                        } catch (error) {
                            gameNotAvailable=true
                        }
                        if(gameNotAvailable || !szGoal)szGoal=0;
                        if(szGoal!=0){
                            szGoal=szGoal.trim();
                            var today = new Date()
                            var eday = today.getDate()
                            var emonth=(today.getMonth()+1)
                            var fulltime=today.getFullYear()+'-'+emonth+'-'+eday
                            var hourAndMinute = today.getHours()+':'+today.getMinutes()
							
                            jszdata2.team1Name.push(team1)
                            jszdata2.team2Name.push(team2)
                            jszdata2.gameTime.push(nextTime)
                            jszdata2.gameScore.push(tscore)
                            jszdata2.oddx.push(szGoal)
                            jszdata2.datem.push(fulltime)
                            jszdata2.datemHour.push(hourAndMinute)
							
                            try {
                                fs.writeFileSync(__dirname+'/data_files/subZERO2.txt', JSON.stringify(jszdata2))
								
                                console.log('subZERO 2 written');
                            } catch (error) {
                                console.log('subZERO 2 written not written');
                            }
                        } 
                    }
                }
                var szdataM=fs.readFileSync(__dirname+'/data_files/subZERO.txt', 'utf8');
                var jszdataM=JSON.parse(szdataM); 
                if(jszdataM.team1Name.indexOf(team1)==-1){
                    console.log('not in szdata',team1);
                    console.log(722)
                    continue
                }
                
				
                var overUnderISzeroFoundINDEX=-1
                var overUnderISzero=false
                if(tscore=='0:0' && underOverType2.trim().indexOf('0')>-1 && false){
                    try {
                        await page.evaluate(el => el.querySelectorAll(".c_3.next_more")[0].click(), nextGame);    
                        overUnderISzero=true
                    } catch (error) {
                        overUnderISzero=false
                    }
                    if(overUnderISzero){
                        let allcbMoreLength=0
                        try {
                            allcbMoreLength=await page.$eval('#result-main', el => el.parentElement.querySelectorAll(".e_active").length);
                        } catch (error) {
                            allcbMoreLength=-1
                        }
                        if(allcbMoreLength==-1)overUnderISzero=false;
                        var cbNotAvailable=false
                        for (let indexcb = 0; indexcb < allcbMoreLength; indexcb++) {
                            cbNotAvailable=true
                            let nextCB=0
                            try {
                                nextCB=await page.$(parentProbablyFutbal+' > .e_active:nth-child('+(1+indexcb)+')')
                                cbNotAvailable=false
                            } catch (error) {
                                cbNotAvailable=true
                            }
                            if(cbNotAvailable)continue;
                            let cbText=0
                            try {
                                cbText=await page.evaluate(el => el.querySelectorAll(".result-set-header")[0].getElementsByTagName("span")[0].textContent,nextCB)    
                                cbNotAvailable=false
                            } catch (error) {
                                cbNotAvailable=true
                            }
                            if(cbNotAvailable)continue;
                            if(cbText.indexOf('Over/Under (1,5) rest of the game')>-1){
                                let cbUnderText=0
                                try {
                                    cbUnderText=await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].textContent,nextCB)    
                                    cbNotAvailable=false
                                } catch (error) {
                                    cbNotAvailable=true
                                }
                                if(cbNotAvailable)continue;
                                cbUnderText=cbUnderText.trim()
                                if(parseFloat(cbUnderText)>parseFloat(1.46)){
                                    overUnderISzeroFoundINDEX=indexcb
                                    cbNotAvailable=false
                                    break
                                }
                            }
                        }
                    }
					
                    if(!overUnderISzero || overUnderISzeroFoundINDEX==-1){
                        await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full73.png', fullPage: true});
                        console.log(gameNotAvailable,underOverType2,nextTime,team1);
                        console.log(73)
                        continue
                    }
                }
				
                if(tscore=='0:0' && nextTime.indexOf('HT')==-1 && parseInt(nextTime)>45 && parseInt(nextTime)<60){console.log(index,'score: '+tscore+' core','time: '+nextTime,team1,team2);}
                
                var doAwayWin=true
                if(doAwayWin){
                    var htdata=fs.readFileSync(__dirname+'/data_files/logMAINHT.txt', 'utf8');
                    var jhtdata=JSON.parse(htdata); 
					
                    if( (nextTime.indexOf('HT')==-1 && parseInt(nextTime)<45 && parseInt(nextTime)<45.5) && jhtdata.team1Name.indexOf(team1)>-1){
                        console.log(2)
                        console.log('htya yazilmama sebei asahgidaki, ',team1,' vs '+team2);
                        console.log(jhtdata.team1Name.indexOf(team1),jhtdata.team2Name.indexOf(team2),nextTime.trim());
                        var yazilmamaSebeb={
                            t1:team1,
                            t2:team2,
                            ind1:jhtdata.team1Name.indexOf(team1),
                            ind2:jhtdata.team2Name.indexOf(team2)
                        }
                        fs.writeFileSync(__dirname+'/data_files/yazilmamaSebeb.txt', JSON.stringify(yazilmamaSebeb))
                        continue
                    }
                    else if( (tscore=='0:0') && (nextTime.indexOf('HT')>-1)){
						
                        console.log('befor oddx ht');
                        let oddx=0
                        try {
							
                            oddx=await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[0].textContent,nextGame)
							
                            gameNotAvailable=false
                        } catch (error) {
                            gameNotAvailable=true
                        }
                        if(gameNotAvailable || !oddx)oddx=0;
                        if(oddx!=0)oddx=oddx.trim();
                        console.log('befor underOverType ht');
                        let underOverType=0
                        try {
							
                            underOverType=await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("span")[0].textContent,nextGame)
							
                            gameNotAvailable=false
                        } catch (error) {
                            gameNotAvailable=true
                        }
                        if(gameNotAvailable || !underOverType)underOverType=0;
                        if(underOverType!=0)underOverType=underOverType.trim();
                        console.log('writing htdata');
                        var today = new Date()
                        var eday = today.getDate()
                        var emonth=(today.getMonth()+1)
                        var fulltime=today.getFullYear()+'-'+emonth+'-'+eday
                        var hourAndMinute = today.getHours()+':'+today.getMinutes()
						
                        jhtdata.team1Name.push(team1)
                        jhtdata.team2Name.push(team2)
                        jhtdata.gameTime.push(nextTime)
                        jhtdata.gameScore.push(tscore)
                        jhtdata.oddx.push(underOverType+' : '+oddx)
                        jhtdata.datem.push(fulltime)
                        jhtdata.datemHour.push(hourAndMinute)
                        var htfileWasWritten=false
                        try {
                            fs.writeFileSync(__dirname+'/data_files/logMAINHT.txt', JSON.stringify(jhtdata))
                            htfileWasWritten=true
                        } catch (error) {
                            htfileWasWritten=false
							
                        }
                        if(!htfileWasWritten){console.log('HTFILE WAS NOT WRITTEN SOME ERROR',new Date().toLocaleString());}
                    }
					
                    if(nextTime.indexOf('HT')>-1){
                        console.log(3)
                        continue
                    }
					
                    if(tscore!='0:1' || tscore!='1:0' || (jhtdata.team1Name.indexOf(team1)==-1 || jhtdata.team2Name.indexOf(team2)==-1)){
                        console.log(4)   
                        continue
                    }
                }
				
                if(jdata.team1Name.indexOf(team1)>-1 && jdata.team1Name.indexOf(team1)==jdata.team1Name.indexOf(team2)){
                    console.log(5)    
                    continue
                }
                if(jdata.team1Name.indexOf(team1)>-1 || jdata.team2Name.indexOf(team2)>-1){
                    console.log(52)    
                    continue
                }
				
                var nextGoalX_sel=nextGame+' > .c_3:nth-child(3) > .c_but:nth-child(2)'
				
                var gameNotAvailable=false
                let notavailableLength=0
                try {
					
                    notavailableLength=await page.evaluate(el => el.querySelectorAll(".c_3")[3].querySelectorAll(".c_but_off").length, nextGame);
					
                } catch (error) {
                    gameNotAvailable=true
                }
                if(notavailableLength && notavailableLength>0){gameNotAvailable=true}
                if(gameNotAvailable){
                    console.log(6)
                    continue
                }
                let nGoal0=0
                try {
                    nGoal0=await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[1].textContent,nextGame)
					
                    gameNotAvailable=false
                } catch (error) {
                    gameNotAvailable=true
                }

                let nGoalG=0
                try {
					
                    nGoalG=await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[0].textContent,nextGame)
					
                    gameNotAvailable=false
                } catch (error) {
                    gameNotAvailable=true
                }
				
                if(gameNotAvailable || !nGoal0 || !nGoalG){
                    console.log(gameNotAvailable,nGoal0,nGoalG);
                    console.log(7)
                    continue
                }
				
                nGoal0=nGoal0.trim()
                nGoal0=nGoal0.replace(',','.')

                nGoalG=nGoalG.trim()
                nGoalG=nGoalG.replace(',','.')
				
                if(underOverType2.trim().indexOf('0')==-1){
                    console.log('underOverType2 not yet zero');
                    fs.writeFileSync(__dirname+'/data_files/blyaaattt.txt', JSON.stringify(jdata))
                    continue
                }
                console.log('aaaa',team1,tscore,team2,underOverType2.trim(),nGoal0);
                
                var overUnderISzeroFoundINDEX2=-1
                if(notINweekendCanBET){
                if(overUnderISzeroFoundINDEX!=-1 && false){
                    overUnderISzero=false
                    try {
                        await page.evaluate(el => el.querySelectorAll(".c_3.next_more")[0].click(), nextGame);    
                        overUnderISzero=true
                    } catch (error) {
                        overUnderISzero=false
                    }
                    if(overUnderISzero){
                        let allcbMoreLength=0
                        try {
                            allcbMoreLength=await page.$eval('#result-main', el => el.parentElement.querySelectorAll(".e_active").length);
                        } catch (error) {
                            allcbMoreLength=-1
                        }
                        if(allcbMoreLength==-1)overUnderISzero=false;
                        var cbNotAvailable=false
                        for (let indexcb = 0; indexcb < allcbMoreLength; indexcb++) {
                            cbNotAvailable=true
                            let nextCB=0
                            try {
                                nextCB=await page.$(parentProbablyFutbal+' > .e_active:nth-child('+(1+indexcb)+')')
                                cbNotAvailable=false
                            } catch (error) {
                                cbNotAvailable=true
                            }
                            if(cbNotAvailable)continue;
                            let cbText=0
                            try {
                                cbText=await page.evaluate(el => el.querySelectorAll(".result-set-header")[0].getElementsByTagName("span")[0].textContent,nextCB)    
                                cbNotAvailable=false
                            } catch (error) {
                                cbNotAvailable=true
                            }
                            if(cbNotAvailable)continue;
                            if(cbText.indexOf('Over/Under (1,5) rest of the game')>-1){
                                let cbUnderText=0
                                try {
                                    cbUnderText=await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].textContent,nextCB)    
                                    cbNotAvailable=false
                                } catch (error) {
                                    cbNotAvailable=true
                                }
                                if(cbNotAvailable)continue;
                                cbUnderText=cbUnderText.trim()
                                if(parseFloat(cbUnderText)>parseFloat(1.46)){
                                    overUnderISzeroFoundINDEX2=indexcb
                                    cbNotAvailable=false
                                    try {
                                        await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].click(),nextCB)    
                                        cbNotAvailable=false
                                    } catch (error) {
                                        cbNotAvailable=true
                                    }
                                    break
                                }
                            }
                        }
                    }
                    if(overUnderISzeroFoundINDEX2==-1){
                        gameNotAvailable=true
                        break
                    }
                }
                else {
                    try {
						
                            await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[0].click(), nextGame);
							
                        gameNotAvailable=false
                    } catch (error) {
                        gameNotAvailable=true
                    }
                }
                }
				
                if(gameNotAvailable){
					
                    console.log(8)
                    continue
                }
                else{
                    console.log('pushing');
					
                    await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                    console.log(gameProbablyEnded,gameNotAvailable);
					
                    var today = new Date()
                    var eday = today.getDate()
                    var emonth=(today.getMonth()+1)
                    var fulltime=today.getFullYear()+'-'+emonth+'-'+eday
                    var hourAndMinute = today.getHours()+':'+today.getMinutes()

                    // list save
                    listTEAModdsMain.team1Name.push(team1)
                    listTEAModdsMain.team2Name.push(team2)
					
                    listTEAModdsMain.gameTime.push(nextTime)
                    listTEAModdsMain.gameScore.push(tscore)
					
                    listTEAModdsMain.nextGoalX.push(underOverType2.trim()+' : '+nGoal0+' / '+nGoalG)
					
                    listTEAModdsMain.datem.push(fulltime)
                    listTEAModdsMain.datemHour.push(hourAndMinute)
                    console.log(index,nextTime,team1,tscore,team2,nGoal0,hourAndMinute);
                }
				
                if(notINweekendCanBET){
                while(gameNotAvailable){
                    var overUnderISzeroFoundINDEX2=-1
                    if(overUnderISzeroFoundINDEX!=-1 && false){
                        overUnderISzero=false
                        try {
                            await page.evaluate(el => el.querySelectorAll(".c_3.next_more")[0].click(), nextGame);    
                            overUnderISzero=true
                        } catch (error) {
                            overUnderISzero=false
                        }
                        if(overUnderISzero){
                            let allcbMoreLength=0
                            try {
                                allcbMoreLength=await page.$eval('#result-main', el => el.parentElement.querySelectorAll(".e_active").length);
                            } catch (error) {
                                allcbMoreLength=-1
                            }
                            if(allcbMoreLength==-1)overUnderISzero=false;
                            var cbNotAvailable=false
                            for (let indexcb = 0; indexcb < allcbMoreLength; indexcb++) {
                                cbNotAvailable=true
                                let nextCB=0
                                try {
                                    nextCB=await page.$(parentProbablyFutbal+' > .e_active:nth-child('+(1+indexcb)+')')
                                    cbNotAvailable=false
                                } catch (error) {
                                    cbNotAvailable=true
                                }
                                if(cbNotAvailable)continue;
                                let cbText=0
                                try {
                                    cbText=await page.evaluate(el => el.querySelectorAll(".result-set-header")[0].getElementsByTagName("span")[0].textContent,nextCB)    
                                    cbNotAvailable=false
                                } catch (error) {
                                    cbNotAvailable=true
                                }
                                if(cbNotAvailable)continue;
                                if(cbText.indexOf('Over/Under (1,5) rest of the game')>-1){
                                    let cbUnderText=0
                                    try {
                                        cbUnderText=await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].textContent,nextCB)    
                                        cbNotAvailable=false
                                    } catch (error) {
                                        cbNotAvailable=true
                                    }
                                    if(cbNotAvailable)continue;
                                    cbUnderText=cbUnderText.trim()
                                    if(parseFloat(cbUnderText)>parseFloat(1.46)){
                                        overUnderISzeroFoundINDEX2=indexcb
                                        cbNotAvailable=false
                                        try {
                                            await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].click(),nextCB)    
                                            cbNotAvailable=false
                                        } catch (error) {
                                            cbNotAvailable=true
                                        }
                                        break
                                    }
                                }
                            }
                        }
                        if(overUnderISzeroFoundINDEX2==-1){
                            gameNotAvailable=true
                            break
                        }
                    }
                    else {
                        try {
							
                                await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[0].click(), nextGame);
								
                            gameNotAvailable=false
                        } catch (error) {
                            console.log(error);
                            gameNotAvailable=true
                        }
                    }
                    await timeout(1000)
                    console.log('button bas wait');
                    
                }
                try {
                    await timeout(1000)
                } catch (error) {
                    
                }
                }
				
                if(notINweekendCanBET){
                let betAmountExist=await page.$(betAmount)
                await timeout(1000)
                var betAmountExistCount=0
                while (!betAmountExist) {
                    gameNotAvailable=true
                    if(gameNotAvailable){
                        var overUnderISzeroFoundINDEX2=-1
                        if(overUnderISzeroFoundINDEX!=-1 && false){
                            overUnderISzero=false
                            try {
                                await page.evaluate(el => el.querySelectorAll(".c_3.next_more")[0].click(), nextGame);    
                                overUnderISzero=true
                            } catch (error) {
                                overUnderISzero=false
                            }
                            if(overUnderISzero){
                                let allcbMoreLength=0
                                try {
                                    allcbMoreLength=await page.$eval('#result-main', el => el.parentElement.querySelectorAll(".e_active").length);
                                } catch (error) {
                                    allcbMoreLength=-1
                                }
                                if(allcbMoreLength==-1)overUnderISzero=false;
                                var cbNotAvailable=false
                                for (let indexcb = 0; indexcb < allcbMoreLength; indexcb++) {
                                    cbNotAvailable=true
                                    let nextCB=0
                                    try {
                                        nextCB=await page.$(parentProbablyFutbal+' > .e_active:nth-child('+(1+indexcb)+')')
                                        cbNotAvailable=false
                                    } catch (error) {
                                        cbNotAvailable=true
                                    }
                                    if(cbNotAvailable)continue;
                                    let cbText=0
                                    try {
                                        cbText=await page.evaluate(el => el.querySelectorAll(".result-set-header")[0].getElementsByTagName("span")[0].textContent,nextCB)    
                                        cbNotAvailable=false
                                    } catch (error) {
                                        cbNotAvailable=true
                                    }
                                    if(cbNotAvailable)continue;
                                    if(cbText.indexOf('Over/Under (1,5) rest of the game')>-1){
                                        let cbUnderText=0
                                        try {
                                            cbUnderText=await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].textContent,nextCB)    
                                            cbNotAvailable=false
                                        } catch (error) {
                                            cbNotAvailable=true
                                        }
                                        if(cbNotAvailable)continue;
                                        cbUnderText=cbUnderText.trim()
                                        if(parseFloat(cbUnderText)>parseFloat(1.46)){
                                            overUnderISzeroFoundINDEX2=indexcb
                                            cbNotAvailable=false
                                            try {
                                                await page.evaluate(el => el.querySelectorAll(".result-set-odds")[0].getElementsByTagName('td')[1].getElementsByTagName("div")[0].click(),nextCB)    
                                                cbNotAvailable=false
                                            } catch (error) {
                                                cbNotAvailable=true
                                            }
                                            break
                                        }
                                    }
                                }
                            }
                            if(overUnderISzeroFoundINDEX2==-1){
                                gameNotAvailable=true
                                break
                            }
                        }
                        else{
                            try {
								
                                    await page.evaluate(el => el.querySelectorAll(".c_3")[3].getElementsByTagName("button")[0].click(), nextGame);
									
                                gameNotAvailable=false
                            } catch (error) {
                                console.log(error);
                                gameNotAvailable=true
                            }
                        }
                        await timeout(2000)
                    }
					
                    if(gameNotAvailable){
                        console.log(82)
                        continue
                    }
                    console.log('betAmountExist wait');
                    betAmountExistCount+=1
                    if(betAmountExistCount>=2){
						
                        console.log('restarting betAmountExist wait too long');
                        process.exit()
                    }
                    await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-fullBET.png', fullPage: true});
                    betAmountExist=await page.$(betAmount)
                    await timeout(1000)
                }
                try {
                    await page.type(betAmount,String(lotToBet))
                    await timeout(1000)
                    await page.type(betAmount,String.fromCharCode(13))
                    await timeout(1000)                    
                } catch (error) {
                    console.log('error in betamount');
                    process.exit()
                }


                counter+=1
                if(!changedToSingleBet && !gameNotAvailable && nGoal0){
                    // change bet to single bets
                    let singleBetB=await page.$('#ticket_but_single > a')
                    await timeout(1000)
                    while (!singleBetB) {
                        singleBetB=await page.$('#ticket_but_single > a')
                        await timeout(1000)
                        console.log('singleBet wait');
                    }
                    changedToSingleBet=true
                    await page.$eval('#ticket_but_single > a',el => el.click());
                    await page.evaluate(el => el.click(), singleBetB);
					
                    await timeout(1000)
                }
                if(changedToSingleBet){
                    let singleBetClassattr=await page.$eval('#ticket_but_single', el => el.querySelectorAll('a')[0].getAttribute('class'));
                    await timeout(1000)
                    while (!singleBetClassattr) {
                        await timeout(1000)
                        console.log('singleBet wait');
                    }
                    if(singleBetClassattr.indexOf('white')==-1 && singleBetClassattr.indexOf('roll_red')>-1){
                        await page.$eval('#ticket_but_single > a',el => el.click());
                        singleBetB=await page.$('#ticket_but_single > a')
                        await timeout(1000)
                        while (!singleBetB) {
                            singleBetB=await page.$('#ticket_but_single > a')
                            await timeout(1000)
                            console.log('singleBet wait');
                        }
                        await page.evaluate(el => el.click(), singleBetB);
                        await timeout(2000)
                    }
                    singleBetClassattr=await page.$eval('#ticket_but_single', el => el.querySelectorAll('a')[0].getAttribute('class'));
                    var tCounter=0
                    while(singleBetClassattr.indexOf('white')==-1 && singleBetClassattr.indexOf('roll_red')>-1){
                        singleBetClassattr=await page.$eval('#ticket_but_single', el => el.querySelectorAll('a')[0].getAttribute('class'));
                        await timeout(1000)
                        console.log('blyat combi-de qalir');
                        var today = new Date()
                        var hourAndMinute = String(today.getHours())+String(today.getMinutes())
						
                        tCounter+=1
                        if(tCounter>=2){
                            process.exit()
                        }
                    }
                }

                await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                console.log('screen captured');

                if(changedToSingleBet){
                    let ocnlickattr=await page.$eval('.ticket_button_flex', el => el.querySelectorAll('a')[0].getAttribute('onclick'));
                    while (!ocnlickattr) {
                        console.log('ocnlickattr wait');
                        await timeout(1000)
                    }
                    if(ocnlickattr.indexOf('REMOVE_NON_OPEN')>-1){
                        console.log('Removing unavailable bets starting all over');

                        let redUnavailableSpan=await page.$('.red')
                        await timeout(1000)
                        while (redUnavailableSpan) {
                            let allbetLength=await page.$eval('#ticket_content', el => el.querySelectorAll(".event_head").length);
                            while (!allbetLength) {
                                await timeout(1000)
                                console.log('allbetLength wait');
                            }
                            for (let indexb = 0; indexb < allbetLength; indexb++) {
                                console.log('before .warning_inline or .red 1');
								
                                let nextRedofBetLength=0
                                try {
                                    nextRedofBetLength=await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event")[value].querySelectorAll(".red")[0].length,indexb);
                                } catch (error) {
                                    nextRedofBetLength=-1
                                }
                                await timeout(1000)
                                console.log('after .warning_inline or .red 1');
                                // --------------------------
                                process.exit()
                                // --------------------------
                                if(!nextRedofBetLength || nextRedofBetLength==0 || nextRedofBetLength==-1)continue
								
                                let teams=await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event_head")[value].querySelectorAll("td")[1].textContent,indexb);
                                await timeout(1000)
                                teams=teams.trim()
                                var team1d=teams.slice(0,teams.indexOf('-')).replace('-','').trim()
                                var team2d=teams.slice(teams.indexOf('-'),).replace('-','').trim()
                                if(listTEAModdsMain.team1Name.indexOf(team1d)>-1 && listTEAModdsMain.team2Name.indexOf(team2d)>-1 && listTEAModdsMain.team1Name.indexOf(team1d)==listTEAModdsMain.team2Name.indexOf(team2d)){
                                    var deleteIndexd=listTEAModdsMain.team1Name.indexOf(team1d)
									
                                    listTEAModdsMain.gameTime.splice(deleteIndexd,1)
                                    listTEAModdsMain.team1Name.splice(deleteIndexd,1)
                                    listTEAModdsMain.team2Name.splice(deleteIndexd,1)
                                    listTEAModdsMain.gameScore.splice(deleteIndexd,1)
									
                                    listTEAModdsMain.nextGoalX.splice(deleteIndexd,1)
									
                                    listTEAModdsMain.datem.splice(deleteIndexd,1)
                                    listTEAModdsMain.datemHour.splice(deleteIndexd,1)
                                }
								
                                await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event_head")[value].querySelectorAll(".cursor.right")[0].click(),indexb);
                                await timeout(1000)
                                allbetLength=await page.$eval('#ticket_content', el => el.querySelectorAll(".event_head").length);
                                while (!allbetLength) {
                                    await timeout(1000)
                                    console.log('allbetLength wait 2');
                                }
								
                            }

                            if(false){
                            let redParent=await page.$eval('.red', el => el.parentElement.parentElement.parentElement.parentElement) 
                            await timeout(1000)
                            let redClosePrent = await page.evaluateHandle(el => el.previousElementSibling, redParent); 
                            await timeout(1000)
                            let teams=await page.evaluate(el => el.querySelectorAll('td:nth-child(2)').textContent,redClosePrent);
                            await timeout(1000)
                            teams=teams.trim()
                            for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
                                const team1d = listTEAModdsMain.team1Name[index];
                                const team2d = listTEAModdsMain.team2Name[index];
                                if(teams.indexOf(team1)>-1 && teams.indexOf(team2)>-1){
									
                                    listTEAModdsMain.gameTime.splice(deleteIndex,1)
                                    listTEAModdsMain.team1Name.splice(deleteIndex,1)
                                    listTEAModdsMain.team2Name.splice(deleteIndex,1)
                                    listTEAModdsMain.gameScore.splice(deleteIndex,1)
									
                                    listTEAModdsMain.nextGoalX.splice(deleteIndex,1)
									
                                    listTEAModdsMain.datem.splice(deleteIndex,1)
                                    listTEAModdsMain.datemHour.splice(deleteIndex,1)
                                }
                            }
                            await page.evaluate(el => el.querySelectorAll('.cursor.right').click(),redClosePrent);
                            await timeout(1000)
                            }
                            redUnavailableSpan=await page.$('.red')
                            await timeout(1000)
                        }
                        if(false){
                            changedToSingleBet=false
							
                            await page.$eval('.remove_all', el => el.click());
                            await timeout(1000)
							
                            listTEAModdsMain.team1Name.length=0
                            listTEAModdsMain.team2Name.length=0
							
                            listTEAModdsMain.gameTime.length=0
                            listTEAModdsMain.gameScore.length=0
                            listTEAModdsMain.nextGoalX.length=0
                            listTEAModdsMain.datem.length=0
                            listTEAModdsMain.datemHour.length=0
                            break
                        }
                    }
                    else{
                        console.log('onclickattr normal')
                    }
                }
                }
            }
			
            counter+=1
            if(notINweekendCanBET){
            if(changedToSingleBet){
                let ocnlickattr=await page.$eval('.ticket_button_flex', el => el.querySelectorAll('a')[0].getAttribute('onclick'));
                while (!ocnlickattr) {
                    console.log('ocnlickattr wait 2');
                    await timeout(1000)
                }
                if(ocnlickattr.indexOf('REMOVE_NON_OPEN')>-1){
                    console.log('restartin as some bets disappeared');
                    let redUnavailableSpan=await page.$('.red')
                    await timeout(1000)
                    while (redUnavailableSpan) {
                        let allbetLength=await page.$eval('#ticket_content', el => el.querySelectorAll(".event_head").length);
                        while (!allbetLength) {
                            await timeout(1000)
                            console.log('allbetLength wait');
                        }
                        for (let indexb = 0; indexb < allbetLength; indexb++) {
                            console.log('before .warning_inline or .red 2');
							
                            let nextRedofBetLength=0
                            try {
                                nextRedofBetLength=await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event")[value].querySelectorAll(".red")[0].length,indexb);
                            } catch (error) {
                                nextRedofBetLength=-1
                            }
                            await timeout(1000)
                            console.log('after .warning_inline or .red 2');
                            // --------------------------
                            process.exit()
                            // --------------------------
                            if(!nextRedofBetLength || nextRedofBetLength==0 || nextRedofBetLength==-1)continue
							
                            let teams=await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event_head")[value].querySelectorAll("td")[1].textContent,indexb);
                            await timeout(1000)
                            teams=teams.trim()
                            var team1d=teams.slice(0,teams.indexOf('-')).replace('-','').trim()
                            var team2d=teams.slice(teams.indexOf('-'),).replace('-','').trim()
                            if(listTEAModdsMain.team1Name.indexOf(team1d)>-1 && listTEAModdsMain.team2Name.indexOf(team2d)>-1 && listTEAModdsMain.team1Name.indexOf(team1d)==listTEAModdsMain.team2Name.indexOf(team2d)){
                                var deleteIndexd=listTEAModdsMain.team1Name.indexOf(team1d)
								
                                listTEAModdsMain.gameTime.splice(deleteIndexd,1)
                                listTEAModdsMain.team1Name.splice(deleteIndexd,1)
                                listTEAModdsMain.team2Name.splice(deleteIndexd,1)
                                listTEAModdsMain.gameScore.splice(deleteIndexd,1)
								
                                listTEAModdsMain.nextGoalX.splice(deleteIndexd,1)
								
                                listTEAModdsMain.datem.splice(deleteIndexd,1)
                                listTEAModdsMain.datemHour.splice(deleteIndexd,1)
                            }
							
                            await page.$eval('#ticket_content', (el,value) => el.querySelectorAll(".event_head")[value].querySelectorAll(".cursor.right")[0].click(),indexb);
                            await timeout(1000)
                            allbetLength=await page.$eval('#ticket_content', el => el.querySelectorAll(".event_head").length);
                            while (!allbetLength) {
                                await timeout(1000)
                                console.log('allbetLength wait 2');
                            }
							
                            if(indexb!=0)indexb-=1;
                        }
                        
                        if(false && false){
                        for (let indexb = 0; indexb < allbetLength; indexb++) {
							
                            const nextRedofBet=await page.$('#ticket_content > .event:nth-child('+(indexb+1)+')')
                            await timeout(1000)
                            let nextRedofBetLength=await page.evaluate( el => el.querySelectorAll(".red").length,nextRedofBet)
                            await timeout(1000)
                            if(!nextRedofBetLength || nextRedofBetLength==0)continue
                            const nextBet=await page.$('#ticket_content > .event_head:nth-child('+(indexb+1)+')')
                            await timeout(1000)
                            const teams=await page.evaluate((next) => next.querySelectorAll("td")[1].textContent,nextBet)
                            await timeout(1000)
                            teams=teams.trim()
                            var team1d=teams.slice(0,teams.indexOf('-')).replace('-','').trim()
                            var team2d=teams.slice(teams.indexOf('-'),).replace('-','').trim()
                            if(listTEAModdsMain.team1Name.indexOf(team1d)>-1 && listTEAModdsMain.team2Name.indexOf(team2d)>-1 && listTEAModdsMain.team1Name.indexOf(team1d)==listTEAModdsMain.team2Name.indexOf(team2d)){
                                var deleteIndexd=listTEAModdsMain.team1Name.indexOf(team1d)
								
                                listTEAModdsMain.gameTime.splice(deleteIndexd,1)
                                listTEAModdsMain.team1Name.splice(deleteIndexd,1)
                                listTEAModdsMain.team2Name.splice(deleteIndexd,1)
                                listTEAModdsMain.gameScore.splice(deleteIndexd,1)
								
                                listTEAModdsMain.nextGoalX.splice(deleteIndexd,1)
								
                                listTEAModdsMain.datem.splice(deleteIndexd,1)
                                listTEAModdsMain.datemHour.splice(deleteIndexd,1)
                            }
                            await page.evaluate(el => el.querySelectorAll('.cursor.right').click(),nextBet);
                            await timeout(1000)
                            allbetLength=await page.$eval('#ticket_content', el => el.querySelectorAll(".event_head").length);
                            while (!allbetLength) {
                                await timeout(1000)
                                console.log('allbetLength wait 2');
                            }
                            if(index!=0)index-=1;
                        }
                        }

                        if(false){
                        let redParent=await page.$eval('.red', el => el.parentElement.parentElement.parentElement.parentElement) 
                        await timeout(1000)
                        let redClosePrent = await page.evaluateHandle(el => el.previousElementSibling, redParent); 
                        await timeout(1000)
                        let teams=await page.evaluate(el => el.querySelectorAll('td:nth-child(2)').textContent,redClosePrent);
                        await timeout(1000)
                        teams=teams.trim()
                        for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
                            const team1d = listTEAModdsMain.team1Name[index];
                            const team2d = listTEAModdsMain.team2Name[index];
                            if(teams.indexOf(team1)>-1 && teams.indexOf(team2)>-1){
								
                                listTEAModdsMain.gameTime.splice(deleteIndex,1)
                                listTEAModdsMain.team1Name.splice(deleteIndex,1)
                                listTEAModdsMain.team2Name.splice(deleteIndex,1)
                                listTEAModdsMain.gameScore.splice(deleteIndex,1)
								
                                listTEAModdsMain.nextGoalX.splice(deleteIndex,1)
								
                                listTEAModdsMain.datem.splice(deleteIndex,1)
                                listTEAModdsMain.datemHour.splice(deleteIndex,1)
                            }
                        }
                        await page.evaluate(el => el.querySelectorAll('.cursor.right').click(),redClosePrent);
                        await timeout(1000)
                        }
                        redUnavailableSpan=await page.$('.red')
                        await timeout(1000)
                    }
                    if(false){
                        await page.$eval('.remove_all', el => el.click());
                        await timeout(1000)
						
                        listTEAModdsMain.team1Name.length=0
                        listTEAModdsMain.team2Name.length=0
						
                        listTEAModdsMain.gameTime.length=0
                        listTEAModdsMain.gameScore.length=0
                        listTEAModdsMain.nextGoalX.length=0
                        listTEAModdsMain.datem.length=0
                        listTEAModdsMain.datemHour.length=0
                        continue
                        var shutdownSeconds=0
                        while (shutdownSeconds<20) {
                            await timeout(1000)
                            shutdownSeconds+=1
                            if(seconds==10){
                                process.exit()
                            }
                        }
                    }
                }
                else{
					

                    a=0
                    var startRealBetting=true
                    if(startRealBetting){
						

                        counter+=1
                        let betClickExist=await page.$('.ticket_button_flex > a')
                        await timeout(1000)
                        while (!betClickExist) {
                            betClickExist=await page.$('.ticket_button_flex > a')
                            await timeout(1000)
                            console.log('betClickE wait');
                        }
                        var errorRealBetClick=false
                        try {
                            await page.$eval('.ticket_button_flex > a', el => el.click());   
							
                            try {
                                await page.evaluate(el => el.click(), betClickExist);
                                console.log('was able to click 2nd time');
								
                            } catch (error) {
                                
                            }
                        } catch (error) {
							
                            errorRealBetClick=true
                            console.log('BET CANNOT BE CLICKED WHYYY?');
                            console.log(error)
                            while (true) {
                                counter+=1
                                await timeout(1000)
                            }
							
                        }
                        while(errorRealBetClick){
                            counter+=1
                            await timeout(1000)
                        }
						
                        await timeout(1000)
                        counter+=1
                        let betfinishedSlip=await page.$('.rich-messages-label.cf')
						
                        await timeout(1000)
                        var betfinishedSlipCount=0
                        while (!betfinishedSlip) {
							
                            var errorRealBetClick=false
                            try {
                                await page.$eval('.ticket_button_flex > a', el => el.click());   
								
                                try {
                                    await page.evaluate(el => el.click(), betClickExist);
                                    console.log('was able to click 2nd time');
                                } catch (error) {
                                    
                                }
                            } catch (error) {
								
                                errorRealBetClick=true
                                console.log('BET CANNOT BE CLICKED WHYYY?');
                                console.log(error)
								
                            }
							

                            betfinishedSlipCount+=1
                            betfinishedSlip=await page.$('.rich-messages-label.cf')
                            try {
                                await timeout(1000)
                            } catch (error) {
                                
                            }
                            await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-fullBFINISHb.png', fullPage: true});
                            console.log('betfinishedSlip wait');
                            if(betfinishedSlipCount>=3){
								

                                console.log('betfinishedSlip wait too long restart');
                                counter+=1
                                const save_file2=true
                                if(save_file2){
                                    var data=fs.readFileSync(__dirname+'/data_files/logMAIN.txt', 'utf8');
                                    var jdata=JSON.parse(data); 
									
                                    if(data.length==0)return;
									
                                    var zapaslistTEAModds=listTEAModdsMain
									
                                    for (let index = 0; index < zapaslistTEAModds.team1Name.length; index++) {
                                        const listTeam1 = zapaslistTEAModds.team1Name[index]
                                        const listTeam2 = zapaslistTEAModds.team2Name[index]
                                        if(jdata['team1Name'].indexOf(listTeam1.trim())>-1 && jdata['team2Name'].indexOf(listTeam2.trim())>-1 && jdata['team1Name'].indexOf(listTeam1.trim())==jdata['team2Name'].indexOf(listTeam2.trim())){
											
                                            const deleteIndex=listTEAModdsMain.team1Name.indexOf(listTeam1)
                                            console.log(listTeam1,'DELETING');
											
                                            listTEAModdsMain.gameTime.splice(deleteIndex,1)
                                            listTEAModdsMain.team1Name.splice(deleteIndex,1)
                                            listTEAModdsMain.team2Name.splice(deleteIndex,1)
                                            listTEAModdsMain.gameScore.splice(deleteIndex,1)
											
                                            listTEAModdsMain.nextGoalX.splice(deleteIndex,1)
											
                                            listTEAModdsMain.datem.splice(deleteIndex,1)
                                            listTEAModdsMain.datemHour.splice(deleteIndex,1)
                                        }
                                    }
                                    for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
                                        console.log('pushing 2');
										
                                        jdata.team1Name.push(listTEAModdsMain.team1Name[index])
                                        jdata.team2Name.push(listTEAModdsMain.team2Name[index])
										
                                        jdata.gameTime.push(listTEAModdsMain.gameTime[index])
                                        jdata.gameScore.push(listTEAModdsMain.gameScore[index])
										
                                        jdata.oddx.push(listTEAModdsMain.nextGoalX[index])
										
                                        jdata.datem.push(listTEAModdsMain.datem[index]) 
                                        jdata.datemHour.push(listTEAModdsMain.datemHour[index]) 
                                    }
                                    var fileWasWritten=false
                                    try {
                                        fs.writeFileSync(__dirname+'/data_files/logMAIN.txt', JSON.stringify(jdata))
                                        fileWasWritten=true
                                        console.log('FILE WRITTEN X SEC WAIT',new Date().toLocaleString());
                                        
                                    } catch (error) {
                                        fileWasWritten=false
                                        console.log('ERROR FILE WAS NOT WRITTEN and LIST: ')
                                        console.log(listTEAModdsMain.team1Name,listTEAModdsMain.nextGoalX,listTEAModdsMain.datemHour);
										
                                    }
                                    if(!fileWasWritten){console.log('FILE WAS NOT WRITTEN SOME ERROR',new Date().toLocaleString());}
                                    while (!fileWasWritten) {
                                        counter+=1
                                        await timeout(1000)
                                    }
									
                                    continueInterval=true
									
                                }
                                await timeout(1000)
                                process.exit()
                            }
                        }
                        // // reset betslip
                        try {
                            await page.$eval('.rich-messages-label.cf > a:nth-child(2)', el => el.click());
                        } catch (error) {
                            console.log('cannot click BET RESET in slip after betting');
                            console.log(error);
                        }
						
                    }
                }
            }
            }

            await timeout(1000)
            counter+=1
            const save_file=true
            if(save_file){
                var data=fs.readFileSync(__dirname+'/data_files/logMAIN.txt', 'utf8');
                var jdata=JSON.parse(data); 
				
                if(data.length==0)return;
				
                var zapaslistTEAModds=listTEAModdsMain
				
                for (let index = 0; index < zapaslistTEAModds.team1Name.length; index++) {
                    const listTeam1 = zapaslistTEAModds.team1Name[index]
                    const listTeam2 = zapaslistTEAModds.team2Name[index]
                    if(jdata['team1Name'].indexOf(listTeam1.trim())>-1 && jdata['team2Name'].indexOf(listTeam2.trim())>-1 && jdata['team1Name'].indexOf(listTeam1.trim())==jdata['team2Name'].indexOf(listTeam2.trim())){
						
                        const deleteIndex=listTEAModdsMain.team1Name.indexOf(listTeam1)
                        console.log(listTeam1,'DELETING');
						
                        listTEAModdsMain.gameTime.splice(deleteIndex,1)
                        listTEAModdsMain.team1Name.splice(deleteIndex,1)
                        listTEAModdsMain.team2Name.splice(deleteIndex,1)
                        listTEAModdsMain.gameScore.splice(deleteIndex,1)
						
                        listTEAModdsMain.nextGoalX.splice(deleteIndex,1)
						
                        listTEAModdsMain.datem.splice(deleteIndex,1)
                        listTEAModdsMain.datemHour.splice(deleteIndex,1)
                    }
                }
                for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
                    console.log('pushing 2');
					
                    jdata.team1Name.push(listTEAModdsMain.team1Name[index])
                    jdata.team2Name.push(listTEAModdsMain.team2Name[index])
					
                    jdata.gameTime.push(listTEAModdsMain.gameTime[index])
                    jdata.gameScore.push(listTEAModdsMain.gameScore[index])
					
                    jdata.oddx.push(listTEAModdsMain.nextGoalX[index])
					
                    jdata.datem.push(listTEAModdsMain.datem[index]) 
                    jdata.datemHour.push(listTEAModdsMain.datemHour[index]) 
                }
                var fileWasWritten=false
                try {
                    fs.writeFileSync(__dirname+'/data_files/logMAIN.txt', JSON.stringify(jdata))
                    fileWasWritten=true
                    console.log('FILE WRITTEN X SEC WAIT',new Date().toLocaleString());
                    
                } catch (error) {
                    fileWasWritten=false
                    console.log('ERROR FILE WAS NOT WRITTEN and LIST: ')
                    console.log(listTEAModdsMain.team1Name,listTEAModdsMain.nextGoalX,listTEAModdsMain.datemHour);
					
                }
                if(!fileWasWritten){console.log('FILE WAS NOT WRITTEN SOME ERROR',new Date().toLocaleString());}
                while (!fileWasWritten) {
                    counter+=1
                    await timeout(1000)
                }
				
                continueInterval=true
				
            }
            await timeout(1000)
            counter+=1
			
            var checkPNLenough=true
            if(checkPNLenough){
                let balance=await page.$('.credit-balance.nav-button.my-account > .value')
                await timeout(1000)
                while(!balance){
                    balance=await page.$('.credit-balance.nav-button.my-account > .value')
                    await timeout(1000)
                }
				
                let balanceText=await page.evaluate((next) => next.textContent,balance)
                while (!balanceText) {
                    await timeout(1000)
                }
				
                balanceText=parseFloat(balanceText.replace('€','').replace(',','.'))
				
                let liveBetCount=await page.$('#main-menu > div > a.my-account.nav-button > span.value')
                await timeout(1000)
                while(!liveBetCount){
                    liveBetCount=await page.$('#main-menu > div > a.my-account.nav-button > span.value')
                    await timeout(1000)
                }
				
                let liveBetCountText=await page.evaluate((next) => next.textContent,liveBetCount)
                while (!liveBetCountText) {
                    await timeout(1000)
                }
                liveBetCountText=liveBetCountText.trim()
				
                console.log('balansim: ',balanceText,'lotum: ',lotToBet,'liveBets: ',liveBetCountText)
        
                if(balanceText<parseFloat(2)){
                    console.log('balansim cox little:',balanceText,new Date().toLocaleString());
                    await timeout(60000*3)
                    process.exit()
                }

                var today = new Date()
                var eday = today.getDate()
                if(eday!=parseInt(jbalans['eday']) && parseInt(jbalans['eday'])-eday==1){
                    console.log('NOT IN NEW DAY',new Date().toLocaleString());
                    await timeout(60000*3)
                    process.exit()
                }
                if(parseFloat(balanceText)-parseFloat(jbalans['balans'])>parseFloat(1) && parseInt(jbalans['eday'])==eday){
                    console.log('daily 2+ PNL OLDU',new Date().toLocaleString());
                    jbalans['balans']=balanceText
                    jbalans['eday']=eday+1
                    fs.writeFileSync(__dirname+'/data_files/BALANS.txt', JSON.stringify(jbalans))
                    await timeout(60000*3)
                    process.exit()
                }
                if(eday-parseInt(jbalans['eday'])>=1){
                    console.log('went to NEW DAY without enough pnl',new Date().toLocaleString());
                    jbalans['eday']=eday
                    fs.writeFileSync(__dirname+'/data_files/BALANS.txt', JSON.stringify(jbalans))
                }
            }

            counter+=1
            if(checkCashout && liveBetCountTextM>0){
                let myBets=await page.$('#main-menu > div > a.my-account.nav-button')
                while (!myBets) {
                    console.log('myBets wait');
                    await timeout(1000)
                }
                try {
                    await page.evaluate(el => el.click(), myBets);   
                } catch (error) {
                    
                }
                await timeout(1000)
				
                let chashoutsel= await page.$('.tab_box_2')
                await timeout(1000)
                while (!chashoutsel) {
                    console.log('chashoutsel wait');
                    await page.screenshot({path: 'C:/Users/user2/Desktop/cartv sual/screenshot-full.png', fullPage: true});
                    await timeout(1000)
                }
                try {
                    await page.evaluate(el => el.querySelectorAll('.tab_2_select')[1].getElementsByTagName('a')[0].click(), chashoutsel);    
                } catch (error) {
                    
                } 
                await timeout(2000)
                let allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                await timeout(1000)
				
                if(allBetsCOLength!=0){
                    for (let indexc = 0; indexc < allBetsCOLength; indexc++) {
                        let nextBetCO=await page.$('#mybettings'+' > .mybets:nth-child('+(1+indexc)+')')
                        await timeout(1000)
                        if(!!nextBetCO)continue

                        let nextTimeCO=await page.evaluate((next) => next.querySelectorAll(".jq-event-row-cont")[0].getElementsByTagName('span')[0].textContent,nextBetCO)   
                        await timeout(1000)
                        let nextScoreCO=await page.evaluate((next) => next.querySelectorAll(".sheet_c6")[0].getElementsByTagName('span')[0].textContent,nextBetCO)
                        await timeout(1000)
                        let nextButtonCO=await page.evaluate((next) => next.querySelectorAll(".cashout")[0],nextBetCO)
                        await timeout(1000)
                        let nextOLDvalueCO=await page.evaluate((next) => next.querySelectorAll(".vanish.sheet_c5")[0],nextBetCO)
                        await timeout(1000)
                        let nextCURRENTvalueCO=await page.evaluate((next) => next.querySelectorAll(".text")[0],nextBetCO)
                        await timeout(1000)
                        
                        if(!nextTimeCO || !nextScoreCO || !nextButtonCO || !nextCURRENTvalueCO || !nextOLDvalueCO){
                            console.log('one of nextCO not available');
                            allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                            await timeout(1000)
                            if(allBetsCOLength==0){
                                indexc=0
                                console.log('no co yet after');
                                break
                            }
							
                            indexc=0
                            continue
                        }
                        nextOLDvalueCO=parseFloat(nextOLDvalueCO.replace(',','.'))
                        nextCURRENTvalueCO=parseFloat(nextCURRENTvalueCO.replace('€','').replace('Cashout for ','').replace(',','.'))
                        nextTimeCO=nextTimeCO.trim()
                        nextTimeCO= nextTimeCO.indexOf("'")>-1 ? nextTimeCO.replace("'",''):nextTimeCO
                        var scoreDange=nextScoreCO.indexOf('0:1 (0:0)')>-1 || nextScoreCO.indexOf('1:0 (0:0)')>-1
                        if(nextTimeCO.indexOf('HT')==-1 && (parseInt(nextTimeCO)>85 && parseInt(nextTimeCO)<90) && scoreDange && nextCURRENTvalueCO>parseFloat(1.1)){
                            try {
                                await page.evaluate(el => el.click(), nextButtonCO);
                            } catch (error) {
                                
                            }
                            let COconfitm=await page.$('.confirm')
                            while (!COconfitm) {
                                console.log('COconfitm wait');
                                await timeout(1000)
                            }
                            try {
                                await page.evaluate(el => el.click(), COconfitm);
                            } catch (error) {
                                
                            }
                            allBetsCOLength=await page.$eval('#mybettings', el => el.querySelectorAll(".mybets").length);
                            await timeout(1000)
                            if(allBetsCOLength==0){
                                indexc=0
                                console.log('no co yet after 2');
                                break
                            }
							
                            indexc=0
                        }

                    }
                }
            }

            counter+=1
            await timeout(20000)
        }
		
    }
	
    if(false){
        if(true){
			
            if(data.length==0)return;
			
            var zapaslistTEAModds=listTEAModdsMain
            for (let index = 0; index < zapaslistTEAModds.team1Name.length; index++) {
                const listTeam1 = zapaslistTEAModds.team1Name[index]
                const listTeam2 = zapaslistTEAModds.team2Name[index]
                if(jdata['team1Name'].indexOf(listTeam1)>-1 && jdata['team2Name'].indexOf(listTeam2)>-1 && jdata['team1Name'].indexOf(listTeam1)==jdata['team2Name'].indexOf(listTeam2)){
					
                    const deleteIndex=listTEAModdsMain.team1Name.indexOf(listTeam1)
					
                    listTEAModdsMain.gameTime.splice(deleteIndex,1)
                    listTEAModdsMain.team1Name.splice(deleteIndex,1)
                    listTEAModdsMain.team2Name.splice(deleteIndex,1)
                    listTEAModdsMain.gameScore.splice(deleteIndex,1)
					
                    listTEAModdsMain.nextGoalX.splice(deleteIndex,1)
					
                    listTEAModdsMain.datem.splice(deleteIndex,1)
                    listTEAModdsMain.datemHour.splice(deleteIndex,1)
                }
                
            }
            for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
				
                jdata.team1Name.push(listTEAModdsMain.team1Name[index])
                jdata.team2Name.push(listTEAModdsMain.team2Name[index])
				
                jdata.gameTime.push(listTEAModdsMain.gameTime[index])
                jdata.gameScore.push(listTEAModdsMain.gameScore[index])
				
                jdata.nextGoalX.push(listTEAModdsMain.nextGoalX[index])   
				
                jdata.datem.push(listTEAModdsMain.datem[index]) 
                jdata.datemHour.push(listTEAModdsMain.datemHour[index]) 
            }
            var fileWasWritten=false
            try {
                fs.writeFileSync(__dirname+'/data_files/logMAIN.txt', JSON.stringify(jdata))
                fileWasWritten=true
            } catch (error) {
                fileWasWritten=false
                for (let index = 0; index < listTEAModdsMain.team1Name.length; index++) {
                    var nextTime=listTEAModdsMain.gameTime[index]
                    var team1=listTEAModdsMain.team1Name[index]
                    var team2=listTEAModdsMain.team2Name[index]
                    var tscore=listTEAModdsMain.gameScore[index]
                    var nextGoalX=listTEAModdsMain.nextGoalX[index]
					
                    var datem=listTEAModdsMain.datem[index]
                    var datemHour=listTEAModdsMain.datemHour[index]
                    console.log(nextTime,team1,tscore,team2,nextGoalX,datem,datemHour);
                }
            }
            if(!fileWasWritten){console.log('FILE WAS NOT WRITTEN SOME ERROR',new Date().toLocaleString());}
            while (!fileWasWritten) {
                await timeout(1000)
            }
			
            continueInterval=true
			
        }
        if(false){
            fs.readFile(__dirname+'/data_files/log.txt', 'utf8', function(err, data) {
                if (err) throw err;
                if(data.length==0)return;
                var jdata=JSON.parse(data); 
                var zapaslistTEAModds=listTEAModds
                for (let index = 0; index < zapaslistTEAModds.team1Name.length; index++) {
                    const listTeam1 = zapaslistTEAModds.team1Name[index]
                    const listTeam2 = zapaslistTEAModds.team2Name[index]
                    if(jdata['team1Name'].indexOf(listTeam1)>-1 && jdata['team2Name'].indexOf(listTeam2)>-1){
						
                        const deleteIndex=listTEAModds.team1Name.indexOf(listTeam1)
                        listTEAModds.gameState.splice(deleteIndex,1)
                        listTEAModds.gameTime.splice(deleteIndex,1)
                        listTEAModds.team1Name.splice(deleteIndex,1)
                        listTEAModds.team2Name.splice(deleteIndex,1)
                        listTEAModds.gameScore.splice(deleteIndex,1)
                        listTEAModds.odd1.splice(deleteIndex,1)
                        listTEAModds.oddx.splice(deleteIndex,1)
                        listTEAModds.odd2.splice(deleteIndex,1)
                        listTEAModds.nextGoalX.splice(deleteIndex,1)
                    }
                    
                }
                for (let index = 0; index < listTEAModds.team1Name.length; index++) {
					
                    jdata.team1Name.push(listTEAModds.team1Name[index])
                    jdata.team2Name.push(listTEAModds.team2Name[index])
					
                    jdata.gameTime.push(listTEAModds.gameTime[index])
                    jdata.gameScore.push(listTEAModds.gameScore[index])
                    jdata.odd1.push(listTEAModds.odd1[index])
                    jdata.osddx.push(listTEAModds.oddx[index])
                    jdata.odd2.push(listTEAModds.odd2[index])
                    jdata.nextGoalX.push(listTEAModds.nextGoalX[index])   
                }
				
                continueInterval=true
                setTimeout(() => {
                    schedule()
                }, 30000);
				
            });
        }
    }
	
    try {
        await browser.close();
		
      } catch (error) {
        // console.log(error)
      }

    var seconds=0
    while (true) {
        seconds+=1
        await timeout(1000)
        if(seconds==2){process.exit()}
    }

    try {
        await timeout(1000);
    } catch (error) {
        
    }
	
    })();
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function resetFiles(){
    noFootball=true
    var listTEAModdsMainTemp={
        gameTime:[],
        team1Name:[],
        team2Name:[],
        gameScore:[],
        oddx:[],
        datem:[],
        datemHour:[]
    }
    var listTEAModdsMainHTTemp={
        gameTime:[],
        team1Name:[],
        team2Name:[],
        gameScore:[],
        oddx:[],
        datem:[],
        datemHour:[]
    }
    fs.writeFileSync(__dirname+'/data_files/logMAINHT.txt', JSON.stringify(listTEAModdsMainHTTemp))
    fs.writeFileSync(__dirname+'/data_files/logMAIN.txt', JSON.stringify(listTEAModdsMainTemp))
    fs.writeFileSync(__dirname+'/data_files/resetDONE.txt', JSON.stringify(listTEAModdsMainTemp))
    fs.writeFileSync(__dirname+'/data_files/subZERO.txt', JSON.stringify(listTEAModdsMainTemp))
    fs.writeFileSync(__dirname+'/data_files/subZERO2.txt', JSON.stringify(listTEAModdsMainTemp))
}

function schedule_timeoutDONTWORK(){
    setTimeout(() => {
        schedule()
    }, 10000);    
}
function schedule(){
    datamSandPage=0
    dataSandPageScores=0
    try {
        (async () => {
            let browser = 0
			
            try {
				
                browser=await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
				
            } catch (error) {
                // console.log(error)
            }
			
            try{
                main(browser)
            }
            catch(error){
                // console.log(error)
                try {
                  await browser.close();
                } catch (error) {
                //   console.log(error)
                }
				
                process.exit()
            }
          })();       
    } catch (error) {
        // console.log(error);
        process.exit()
    }
}
setInterval(function() {
    if(zapasCounter!=counter)zapasCounter=counter
    else if(zapasCounter==counter){
        console.log('stuck restarting');
        process.exit()
    }
}, 2*60000);
schedule()
var zapasCounter=0
var continueInterval=true
var minutes = 0.5, the_interval = minutes * 60 * 1000;