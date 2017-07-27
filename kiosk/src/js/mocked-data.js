var accountData = { inboxList: {}, sentList: {}, trashList: {} },
    messageList = {};

function mockData_API() {

    var uniqueID, bodyClip, date, time, attachment, postage, person, subject, messageLength, unread,
        categoryList = { 0: 'inboxList', 1: 'sentList', 2: 'trashList' };


    var subjectList = ['Hello', 'Greetings!', 'Thank You!', 'I Miss You', 'Good To Hear From You!'],
        personList = ['James Smith', 'Michael Smith', 'Robert Smith', 'Maria Garcia', 'David Smith', 'Maria Rodriguez', 'Mary Smith', 'Maria Hernandez', 'Maria Martinez', 'James Johnson'];

    var bodyText = 'Sisältöä puuttuu porkkanat, nautittavuus magna meri cu kartonki, usein ullamcorper paljastaminen hunajaa.Älä lyhyt, mutta maa on läsnä.Paahdettu kutsuttiin vuonna.Ensin, ja ennen kaikkea ekologinen, oli julistanut, että johtajat että se ei ole.Ei sana täyttää minulle mitään.Hän nähden reprimique minun mukavuutta, mutta avoin Plato hunajaa. Vuodesta tuskin hyväksytään helpon käytön nuorten syytään kokeilu täältä.Olenko tehnyt mitään milloin tahansa, eikä käsitellyistä tapauksista, se tuo käytännössä keskipisteen, ensimmäinen nro esikatselun etu heidän tarinansa.Kiitosta kuullessaan komennon käytät nostrud elävä, mutta hunaja et.Hunajaa rauhoittaa aseeton riski, jotain mereen surut, joka lähtee hänestä, se kaadu.Kreikkalaiset asetettu.Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä.Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät.Älä kirjoitettu on vastuuvapauden atomien sijoittajia.Ei myöskään maailmalle jälleen conclusionemque.Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana.Jalkapallo rauhoittaa Vulputate saavuttamiseksi.Pian majesteetti, mutta on aina iriure.Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin.Olkoon tämä tapahtua tai et koskaan.Puu heidän oikeutensa optimistinen.Mikä johtuu liikkuu.Vetoan elimissä.Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä.Hän on facilisi vähennyskelpoisia.Kreikkalaiset asetettu.Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä.Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät.Älä kirjoitettu on vastuuvapauden atomien sijoittajia.Ei myöskään maailmalle jälleen conclusionemque.Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana.Jalkapallo rauhoittaa Vulputate saavuttamiseksi.Pian majesteetti, mutta on aina iriure.Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin.Olkoon tämä tapahtua tai et koskaan.Puu heidän oikeutensa optimistinen.Mikä johtuu liikkuu.Vetoan elimissä.Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä.Hän on facilisi vähennyskelpoisia.';

    for (j = 0; j < Object.keys(categoryList).length; j++) {
        accountData[categoryList[j]] = {};
        messageLength = Math.floor((Math.random() * 20) + 0);

        for (i = 0; i < messageLength; i++) {
            uniqueID = Math.floor((Math.random() * 1000000000000) + 1);
            person = Math.floor((Math.random() * personList.length) + 1);
            subject = Math.floor((Math.random() * subjectList.length) + 1);
            bodyClip = Math.floor((Math.random() * 2232) + 1);
            date = ('0' + Math.floor((Math.random() * 11) + 1)).slice(-2) + '/' + ('0' + Math.floor((Math.random() * 27) + 1)).slice(-2) + '/' + Math.floor((Math.random() * 7) + 2011);
            time = Math.floor((Math.random() * 12) + 1) + ':' + ('0' + Math.floor(Math.random() * 60)).slice(-2) + ' PM';
            attachment = Math.round(Math.random()) == 1 ? 'img-0034.jpg' : '';
            postage = Math.round(Math.random());
            unread = Math.round(Math.random());
            if (categoryList[j] == 'sentList') {
                postage = '';
                unread = 0;
            } else if (categoryList[j] == 'trashList') {
                unread = 0;
            }
            accountData[categoryList[j]][uniqueID.toString()] = { person: personList[person - 1], subject: subjectList[subject - 1], date: date, time: time, returnPostage: postage, attachment: attachment, body: bodyText.substr(0, bodyClip), unread: unread, threadedMessages: {} };
        }
    }
}

function callCategory_API(categoryName) {

    categoryName = categoryName.toLowerCase();

    if (categoryName == 'inbox') {
        messageList = accountData.inboxList;
    } else if (categoryName == 'sent') {
        messageList = accountData.sentList;
    } else if (categoryName == 'trash') {
        messageList = accountData.trashList;
    }

}

function moveMessage_API(messageID, fromCategory, toCategory) {
    if (fromCategory.toLowerCase() == 'inbox') {
        accountData.trashList[messageID] = accountData.inboxList[messageID];
        delete accountData.inboxList[messageID];
    } else if (fromCategory.toLowerCase() == 'sent') {
        delete accountData.sentList[messageID];
    } else if (fromCategory.toLowerCase() == 'trash' && toCategory == '') {
        delete accountData.trashList[messageID];
    } else if (fromCategory.toLowerCase() == 'trash' && toCategory.toLowerCase() == 'inbox') {
        accountData.inboxList[messageID] = accountData.trashList[messageID];
        delete accountData.trashList[messageID];
    }
}

function sendMessage_API(messageID, bodyContent) {
    var threadPosition = 0,
        fakeDate = ('0' + Math.floor((Math.random() * 11) + 1)).slice(-2) + '/' + ('0' + Math.floor((Math.random() * 27) + 1)).slice(-2) + '/' + Math.floor((Math.random() * 7) + 2011),
        fakeTime = Math.floor((Math.random() * 12) + 1) + ':' + ('0' + Math.floor(Math.random() * 60)).slice(-2) + ' PM';

    /*var tempBody = bodyContent + '<br><br>' + accountData.inboxList[messageID]['body'],
        tempMessage = accountData.inboxList[messageID];*/

    if (accountData.sentList[messageID] === undefined) {
        accountData.sentList[messageID] = $.extend({}, accountData.inboxList[messageID]);
    }

    if (Object.keys(accountData.sentList[messageID]['threadedMessages']).length) {
        threadPosition = Object.keys(accountData.sentList[messageID]['threadedMessages']).length;
        accountData.sentList[messageID]['threadedMessages'][threadPosition] = $.extend({}, { attachment: accountData.sentList[messageID]['attachment'], date: accountData.sentList[messageID]['date'], time: accountData.sentList[messageID]['time'], body: accountData.sentList[messageID]['body'] });
    } else {
        accountData.sentList[messageID]['threadedMessages'][threadPosition] = $.extend({}, { attachment: accountData.inboxList[messageID]['attachment'], date: accountData.inboxList[messageID]['date'], time: accountData.inboxList[messageID]['time'], body: accountData.inboxList[messageID]['body'] });
    }

    accountData.inboxList[messageID]['threadedMessages'] = {};

    accountData.sentList[messageID]['date'] = fakeDate;
    accountData.sentList[messageID]['time'] = fakeTime;
    accountData.sentList[messageID]['returnPostage'] = 0;
    accountData.sentList[messageID]['returnPostage'] = 0;
    accountData.sentList[messageID]['attachment'] = '';
    accountData.sentList[messageID]['unread'] = 0;
    accountData.sentList[messageID]['body'] = bodyContent;

    //accountData.inboxList[messageID]['returnPostage'] = 0;
}

function callImage_API(image) {
    return imageList[image];
}
