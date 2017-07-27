var accountData = { inboxList: {}, sentList: {}, trashList: {} },
    messageList = {},
    stampCount,
    contactList = {},
    inmateList = {},
    creditCardList = {},
    transactionHistory = {},
    stateListJSON = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "District Of Columbia", "abbreviation": "DC" }, { "name": "Federated States Of Micronesia", "abbreviation": "FM" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virgin Islands", "abbreviation": "VI" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }];

function mockData_API() {

    var uniqueID, bodyClip, date, time, attachment, person, subject, messageLength, unread, stampPrice, transactionType, transactionQuantity,
        categoryList = { 0: 'inboxList', 1: 'sentList', 2: 'trashList' };


    var subjectList = ['Hello', 'Greetings!', 'Thank You!', 'I Miss You', 'Good To Hear From You!'],
        personList = ['James Smith', 'Michael Smith', 'Robert Smith', 'Maria Garcia', 'David Smith', 'Maria Rodriguez', 'Mary Smith', 'Maria Hernandez', 'Maria Martinez', 'James Johnson'],
        facilityList = ['United States Penitentiary Marion', 'Rikers Island', 'Louisiana State Penitentiary', 'Leavenworth Federal Penitentiary', 'Folsom State Prison', 'Attica Correctional Facility', 'United States Penitentiary Atlanta', 'Sing, Sing', 'San Quentin State Prison', 'ADX Florence Facility'];

    var bodyText = 'Sisältöä puuttuu porkkanat, nautittavuus magna meri cu kartonki, usein ullamcorper paljastaminen hunajaa. Älä lyhyt, mutta maa on läsnä. Paahdettu kutsuttiin vuonna. Ensin, ja ennen kaikkea ekologinen, oli julistanut, että johtajat että se ei ole. Ei sana täyttää minulle mitään. Hän nähden reprimique minun mukavuutta, mutta avoin Plato hunajaa. Vuodesta tuskin hyväksytään helpon käytön nuorten syytään kokeilu täältä. Olenko tehnyt mitään milloin tahansa, eikä käsitellyistä tapauksista, se tuo käytännössä keskipisteen, ensimmäinen nro esikatselun etu heidän tarinansa. Kiitosta kuullessaan komennon käytät nostrud elävä, mutta hunaja et. Hunajaa rauhoittaa aseeton riski, jotain mereen surut, joka lähtee hänestä, se kaadu. Kreikkalaiset asetettu. Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä. Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät. Älä kirjoitettu on vastuuvapauden atomien sijoittajia. Ei myöskään maailmalle jälleen conclusionemque. Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana. Jalkapallo rauhoittaa Vulputate saavuttamiseksi. Pian majesteetti, mutta on aina iriure. Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin. Olkoon tämä tapahtua tai et koskaan. Puu heidän oikeutensa optimistinen. Mikä johtuu liikkuu. Vetoan elimissä. Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä. Hän on facilisi vähennyskelpoisia. Kreikkalaiset asetettu. Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä. Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät. Älä kirjoitettu on vastuuvapauden atomien sijoittajia. Ei myöskään maailmalle jälleen conclusionemque. Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana. Jalkapallo rauhoittaa Vulputate saavuttamiseksi. Pian majesteetti, mutta on aina iriure. Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin. Olkoon tämä tapahtua tai et koskaan. Puu heidän oikeutensa optimistinen. Mikä johtuu liikkuu. Vetoan elimissä. Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä. Hän on facilisi vähennyskelpoisia. Sisältöä puuttuu porkkanat, nautittavuus magna meri cu kartonki, usein ullamcorper paljastaminen hunajaa. Älä lyhyt, mutta maa on läsnä. Paahdettu kutsuttiin vuonna. Ensin, ja ennen kaikkea ekologinen, oli julistanut, että johtajat että se ei ole. Ei sana täyttää minulle mitään. Hän nähden reprimique minun mukavuutta, mutta avoin Plato hunajaa. Vuodesta tuskin hyväksytään helpon käytön nuorten syytään kokeilu täältä. Olenko tehnyt mitään milloin tahansa, eikä käsitellyistä tapauksista, se tuo käytännössä keskipisteen, ensimmäinen nro esikatselun etu heidän tarinansa. Kiitosta kuullessaan komennon käytät nostrud elävä, mutta hunaja et. Hunajaa rauhoittaa aseeton riski, jotain mereen surut, joka lähtee hänestä, se kaadu. Kreikkalaiset asetettu. Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä. Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät. Älä kirjoitettu on vastuuvapauden atomien sijoittajia. Ei myöskään maailmalle jälleen conclusionemque. Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana. Jalkapallo rauhoittaa Vulputate saavuttamiseksi. Pian majesteetti, mutta on aina iriure. Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin. Olkoon tämä tapahtua tai et koskaan. Puu heidän oikeutensa optimistinen. Mikä johtuu liikkuu. Vetoan elimissä. Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä. Hän on facilisi vähennyskelpoisia. Kreikkalaiset asetettu. Vaihtoehto neglegentur ei tulkita, ja paransi heitä, hän, joka asettaa yhden osan niistä. Radiant valtuudet tietämättömiä on toivomisen varaa, ovat lakkasi tuomasta väkivaltaisuudet maan näyttävät. Älä kirjoitettu on vastuuvapauden atomien sijoittajia. Ei myöskään maailmalle jälleen conclusionemque. Mistä voimme löytää kivun jalkapallon, ei pri tritani uhkana. Jalkapallo rauhoittaa Vulputate saavuttamiseksi. Pian majesteetti, mutta on aina iriure. Se voi tuskin parempi tyttö tarinoita on yksi peli, mutta hylättiin. Olkoon tämä tapahtua tai et koskaan. Puu heidän oikeutensa optimistinen. Mikä johtuu liikkuu. Vetoan elimissä. Tulee rauhoittaa on auttanut sitä, mutta hän ei halua niitä. Hän on facilisi vähennyskelpoisia.';

    for (j = 0; j < Object.keys(categoryList).length; j++) {
        accountData[categoryList[j]] = {};
        messageLength = Math.floor((Math.random() * 20) + 0);

        for (i = 0; i < messageLength; i++) {
            uniqueID = Math.floor((Math.random() * 1000000000000) + 1);
            person = Math.floor((Math.random() * personList.length) + 1);
            subject = Math.floor((Math.random() * subjectList.length) + 1);
            bodyClip = Math.floor((Math.random() * bodyText.length) + 1);
            date = ('0' + Math.floor((Math.random() * 11) + 1)).slice(-2) + '/' + ('0' + Math.floor((Math.random() * 27) + 1)).slice(-2) + '/' + Math.floor((Math.random() * 7) + 2011);
            time = Math.floor((Math.random() * 12) + 1) + ':' + ('0' + Math.floor(Math.random() * 60)).slice(-2) + ' PM';
            attachment = Math.round(Math.random()) == 1 ? 'img-0034.jpg' : '';
            unread = Math.round(Math.random());
            if (categoryList[j] == 'sentList') {
                unread = 0;
            } else if (categoryList[j] == 'trashList') {
                unread = 0;
            }
            accountData[categoryList[j]][uniqueID.toString()] = { person: personList[person - 1], subject: subjectList[subject - 1], date: date, time: time, attachment: attachment, body: bodyText.substr(0, bodyClip), unread: unread, threadedMessages: {} };
        }
    }

    for (i = 0; i <= Math.floor((Math.random() * 25)) - 5; i++) {
        uniqueContactID = Math.floor((Math.random() * 1000000000000) + 1);
        stampPrice = Math.floor((Math.random() * 100) + 10) / 100;
        contactList[uniqueContactID.toString()] = { contact: personList[Math.floor((Math.random() * personList.length))], facility: facilityList[Math.floor((Math.random() * facilityList.length))], stamps: { 10: (Math.round(stampPrice * 10 * 100) / 100).toFixed(2), 25: (Math.round(stampPrice * 25 * 100 * 0.9) / 100).toFixed(2), 50: (Math.round(stampPrice * 50 * 100 * 0.75) / 100).toFixed(2) } }
    }

    for (i = 0; i <= Math.floor((Math.random() * 25)) - 5; i++) {
        uniqueContactID = Math.floor((Math.random() * 1000000000000) + 1);
        stampPrice = Math.floor((Math.random() * 100) + 1) / 100;
        inmateList[uniqueContactID.toString()] = { contact: personList[Math.floor((Math.random() * personList.length))], facility: facilityList[Math.floor((Math.random() * facilityList.length))], stamps: { 10: (Math.round(stampPrice * 10 * 100) / 100).toFixed(2), 25: (Math.round(stampPrice * 25 * 100 * 0.9) / 100).toFixed(2), 50: (Math.round(stampPrice * 50 * 100 * 0.75) / 100).toFixed(2) } };
    }

    accountData['drafts'] = {};

    for (i = 0; i <= Math.floor((Math.random() * 2)); i++) {
        var cardNumber = '';

        for (j = 0; j <= 15; j++) {
            cardNumber += Math.floor((Math.random() * 9));
        }
        creditCardList[i] = { number: cardNumber }
    }

    for (i = 0; i <= Math.floor((Math.random() * 25)) - 5; i++) {
        transactionType = Math.round(Math.random()) == 1 ? 'debit' : 'credit';
        transactionQuantity = Math.floor((Math.random() * 10) + 1);
        stampTransaction_internal(transactionType, transactionQuantity);
    }

    stampCount = Math.floor((Math.random() * 25));

}

function callCategory_API(categoryName) {

    categoryName = categoryName.toLowerCase();

    switch (categoryName) {
        case 'inbox':
            messageList = accountData.inboxList;
            break;
        case 'sent':
            messageList = accountData.sentList;
            break;
        case 'drafts':
            messageList = accountData.draftList;
            break;
        case 'trash':
            messageList = accountData.trashList;
            break;
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

function sendMessage_API(sendInfo) {
    var threadPosition = 0,
        newMessage,
        oldMessage,
        dt,
        date,
        time;

    dt = new Date();
    date = dt.getMonth() + '/' + dt.getDay() + '/' + dt.getFullYear();
    time = (dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours()) + ':' + ('0' + dt.getMinutes()).slice(-2) + (dt.getHours() > 11 ? ' PM' : ' AM');

    if (sendInfo.hasOwnProperty('messageID')) {
        //*****Replying*****
        if (accountData.sentList[sendInfo.messageID] === undefined) {
            //*****First Reply*****
            oldMessage = accountData.inboxList[sendInfo.messageID];
            accountData.sentList[sendInfo.messageID] = $.extend(true, {}, oldMessage);
            newMessage = accountData.sentList[sendInfo.messageID];
            newMessage.threadedMessages[threadPosition] = { date: oldMessage.date, time: oldMessage.time, attachment: oldMessage.attachment, body: oldMessage.body };
            newMessage.date = date;
            newMessage.time = time;
            newMessage.attachment = sendInfo.attachment;
            newMessage.body = sendInfo.body;
        } else {
            //*****Threaded Message*****
            oldMessage = accountData.sentList[sendInfo.messageID];
            threadPosition = Object.keys(oldMessage.threadedMessages).length;
            oldMessage.threadedMessages[threadPosition] = { date: oldMessage.date, time: oldMessage.time, attachment: oldMessage.attachment, body: oldMessage.body };
            oldMessage.attachment = sendInfo.attachment;
            oldMessage.body = sendInfo.body;
        }
    } else {
        createMessage_internal(sendInfo);
    }
    stampTransaction_internal('debit', sendInfo.stampQuantity);
}

function callImage_API(image) {
    return imageList[image];
}

function queryStamps_API() {
    return stampCount;
}

function queryContacts_API() {
    return contactList;
}

function returnContact_API(contactID) {
    return contactList[contactID];
}

function removeContact_API(uniqueID) {
    delete contactList[uniqueID];
}

function addContact_API(uniqueID) {
    contactList[uniqueID] = inmateList[uniqueID];
}

function searchInmates_API(searchParameters) {
    return inmateList;
}

function returnUnread_API() {
    var unreadCount = 0;

    $.each(accountData.inboxList, function(i, value) {
        unreadCount += value.unread;
    });

    return unreadCount;
}

function createMessage_internal(messageObject) {
    var uniqueID,
        dt,
        date,
        time;

    uniqueID = Math.floor((Math.random() * 1000000000000) + 1);
    dt = new Date();
    date = dt.getMonth() + '/' + dt.getDay() + '/' + dt.getFullYear();
    time = (dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours()) + ':' + ('0' + dt.getMinutes()).slice(-2) + (dt.getHours() > 11 ? ' PM' : ' AM');

    accountData.sentList[uniqueID] = { person: contactList[messageObject.contactID].contact, subject: messageObject.subject, date: date, time: time, attachment: messageObject.attachment, body: messageObject.body, unread: false, threadedMessages: {} };
}

function returnCreditCards_API() {
    var obscuredObject = {};

    $.each(creditCardList, function(i, value) {
        obscuredObject[i] = value;
        obscuredObject[i].number = '**** **** **** ' + obscuredObject[i].number.slice(-4);
    });

    return obscuredObject;
}

function stampTransaction_internal(transactionType, quantity) {
    var transactionID,
        dt,
        date,
        time;

    transactionID = ('0000' + Math.floor((Math.random() * 1000) + 1)).slice(-4) + ('0000' + Math.floor((Math.random() * 1000) + 1)).slice(-4) + ('0000' + Math.floor((Math.random() * 1000) + 1)).slice(-4);
    dt = new Date();
    date = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    time = (dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours()) + ':' + ('0' + dt.getMinutes()).slice(-2) + (dt.getHours() > 11 ? ' PM' : ' AM');

    transactionHistory[transactionID] = { transactionType: transactionType, quantity: quantity, date: date, time: time };
    quantity = transactionType == 'debit' ? (quantity * -1) : quantity;
    stampCount += parseInt(quantity);
}

function purchaseStamps_API(formInformation) {
    stampTransaction_internal('credit', formInformation.stampCount);
}

function returnTransactionHistory_API() {
    return transactionHistory;
}