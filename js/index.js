/**
 * author: Eren Erdogan
 */

// Define Var
const apiUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json";
var dataTable; 
var favDataTable; 
const tableEnum = {
    dataTableId: "dataTable",
    favDataTableId: "favDataTable",
};


async function  onLoadBody(){
    dataTable = new DataTable();
    favDataTable = new FavDataTable();
     //jsonVar = await loadDoc();
    let swList = await loadFromApi();
    dataTable.setSwList(swList);    
    HtmlTableGenerator.generateTable("dataTable", dataTable.getSehenwuerdigkeit());
}

async function loadDoc() {
    let xhttp = new XMLHttpRequest();
    let jsonReturnValue 
     xhttp.onreadystatechange =  function() {
      if (this.readyState == 4 && this.status == 200) {
        jsonReturnValue =  JSON.parse(this.responseText);
      }
    };
    xhttp.open("GET", apiUrl , true);
    xhttp.send();
    return jsonReturnValue;
}

async function loadFromApi(){
        const resp = await fetch(apiUrl);
        const jsonData = await resp.json();
        console.log("jsonData: ", jsonData);
        return jsonData;
}

class DataTable{   
    constructor(swList){
        this.swList = swList;
        this.sehenswuerdigkeiten = new Array();
    }
   
    setSwList(swList){
        this.swList = swList;
        this.mapSwListToSehenswuerdigkeiten();
    }
    getJson(){
        return this.swList;
    }
    mapSwListToSehenswuerdigkeiten(){
      for(let i = 0; i < this.swList.features.length; i++) {   
        let id = i+1;
        let name = this.swList.features[i].properties.NAME;
        let adresse = this.swList.features[i].properties.ADRESSE;
        let thumbnail = this.swList.features[i].properties.THUMBNAIL;
        let weitereInf = this.swList.features[i].properties.WEITERE_INF;
        this.sehenswuerdigkeiten.push(new Sehenswuerdigkeit(id, name, adresse, thumbnail, weitereInf));
      }
    }
    getSehenwuerdigkeit(){
        return this.sehenswuerdigkeiten;
    }
}

class FavDataTable{
    constructor(swList){
        this.swList = swList;
        this.sehenswuerdigkeiten = new Array();
    }
    getJson(){
        return this.swList;
    }
    createTable(){
    }
    pushSwToSehenswuerdigkeiten(sehenswuerdigkeitElement){
        if (this.checkIfSwExist(sehenswuerdigkeitElement) != true)
            this.sehenswuerdigkeiten.push(sehenswuerdigkeitElement)
        this.refreshFavDataTableElement();
  
    }
    deleteSwFromSehenswuerdigkeiten(sehenswuerdigkeitElement){
        for(var i=0; i < this.sehenswuerdigkeiten.length;i++){
            if(this.sehenswuerdigkeiten[i].id == sehenswuerdigkeitElement.id){
                this.sehenswuerdigkeiten.splice(i, 1);
                this.refreshFavDataTableElement();
                return true;
            }
        }
    }
    refreshFavDataTableElement(){
        HtmlTableGenerator.generateTable(tableEnum.favDataTableId,this.sehenswuerdigkeiten);
    }
    checkIfSwExist(sehenswuerdigkeitElement){
        for(var i=0; i < this.sehenswuerdigkeiten.length;i++){
            if(this.sehenswuerdigkeiten[i].id == sehenswuerdigkeitElement.id){
                alert("Sehenswürdigkeit " + sehenswuerdigkeitElement.name +"in der Favoritenliste vorhanden");
                return true;
            }
        }
        return false;
    }
}

class Sehenswuerdigkeit{
    constructor(id, name ,adresse, thumbnail, weitereInf){
        this.id = id;
        this.name = name;
        this.adresse = adresse;
        this.thumbnail = thumbnail; 
        this.weitereInf = weitereInf;
    }
}

class HtmlTableGenerator{
    constructor(){}

    static async  generateTable(htmlTableId,sehenswuerdigkeiten){
        let table = document.getElementById(htmlTableId);
        if (tableEnum.favDataTableId == htmlTableId)
            this.clearTable(table);
        this.addThToTablel(table);

        for (let i = 0; i < sehenswuerdigkeiten.length; i++){
            let tr = document.createElement('tr');   
            
            let td0 = document.createElement('td');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            let td5 = document.createElement('td');
            
            td0.appendChild(document.createTextNode(sehenswuerdigkeiten[i].id));
            td1.appendChild(document.createTextNode(sehenswuerdigkeiten[i].name));
            td2.appendChild(document.createTextNode(sehenswuerdigkeiten[i].adresse));
            td3.appendChild(document.createTextNode(sehenswuerdigkeiten[i].thumbnail));
            td4.appendChild(document.createTextNode(sehenswuerdigkeiten[i].weitereInf));
            td5.appendChild(this.createFavIconHtmlElement(htmlTableId, sehenswuerdigkeiten[i]));

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            //tr.appendChild(td3); // tumbnail not in use
            //tr.appendChild(td4); // weitereInf not in use
            tr.appendChild(td5);
            table.appendChild(tr);
        }
    }
    static clearTable(table){
        while(table.hasChildNodes()){
            table.removeChild(table.firstChild);
        }
    }

    static createFavIconHtmlElement(htmlTableId, sehenswuerdigkeitElement){
        let divE = document.createElement('i');
        if (htmlTableId == tableEnum.dataTableId){
            divE.className = "iconHeart";
            divE.addEventListener("click", function(){ addToFavDataTable(sehenswuerdigkeitElement); });
        }
        if(htmlTableId == tableEnum.favDataTableId){
            divE.className = "iconDelete";  
            divE.addEventListener("click", function(){ deleteFromFavDataTable(sehenswuerdigkeitElement); });
        }
        return divE;
    }
    static addThToTablel(table){
        let tr = document.createElement('tr');   
        
        let th0 = document.createElement('th');
        let th1 = document.createElement('th');
        let th2 = document.createElement('th');
        let th3 = document.createElement('th');
        let th4 = document.createElement('th');
        let th5 = document.createElement('th');

        th0.className = "idTableCol";
        th1.className = "nameTableCol";
        th2.className = "adresseTableCol";
        th3.className = "thumbnailTableCol";
        th4.className = "weiterInfTableCol";
        th5.className = "iconTableCol";
        
        tr.appendChild(th0);
        tr.appendChild(th1);
        tr.appendChild(th2);
        //tr.appendChild(th3); // tumbnail not in use
        //tr.appendChild(th3); // weitereInf not in use
        tr.appendChild(th5);

        table.appendChild(tr);
    }
}


//TODO Convert to Class - EventHandlerClass
function addToFavDataTable(sehenswuerdigkeitElement){
    favDataTable.pushSwToSehenswuerdigkeiten(sehenswuerdigkeitElement);
    return false;
}
function deleteFromFavDataTable(sehenswuerdigkeitElement){
    favDataTable.deleteSwFromSehenswuerdigkeiten(sehenswuerdigkeitElement);
    return false;
}

/**
 * Form validation
 */
function onClickNachrichtSenden(){
    let name = document.getElementById("txtName").value;
    if(name != null && name == "" ){
        HtmlModal.setMessage("Name wurde nicht richtig eingegeben!");
        return false;
    }
    let email = document.getElementById("txtEmail").value;
    if(!validateEmail(email)){
        HtmlModal.setMessage("Email wurde nicht richtig eingegeben!");
        return false;
    }
    let telefonnummer = document.getElementById("txtTelefonnummer").value;
    if(!isNumeric(telefonnummer)){
        HtmlModal.setMessage("Telefonnummer wurde nicht richtig eingegeben!");
        return false;
    }
    let password = document.getElementById("txtPasswort").value;
    if(password.length < 4){
        HtmlModal.setMessage("Password wurde nicht richtig eingegeben! Mindestens 4 Zeichen");
        return false;
    }
    let nachricht = document.getElementById("txtNachricht").value;
    HtmlModal.setMessage("Nachricht wurde gesendet: " + "\r\n" 
        + name + "\r\n" 
        + email +  "\r\n" 
        + nachricht );
    alert("Vielen Dank für Ihre Nachricht!");
}
function validateEmail(email){
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return true;
    }
    return false;
}
function isNumeric(telefonnummer){
    if(/^[0-9]+$/.test(telefonnummer)){
      return true;
    }
    return false;
}

class HtmlModal{
    constructor(){}

    static setMessage(message){
        let modalMessage = document.getElementById("modalMessage");
        modalMessage.innerHTML = message; 
        document.getElementById("modal").style.display = "block";      
    }
}