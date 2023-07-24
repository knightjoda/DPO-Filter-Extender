// ==UserScript==
// @name         DPO Filter Extender
// @version      1.0
// @description  Adds some filter functions to the DPO filter builder
// @author       Josiah Beckett
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @match        https://www.donorperfect.net/prod/verifystandardfilter.asp*
// @icon
// @grant        none
// @run-at       document-body
// ==/UserScript==
// this function loops through each criteria element as they are added
$(document).arrive(".criteria", function(newElem) {
    // adjusting the width of the criteria box
    let tbody = newElem.closest('table');
    tbody.width = "1100"
    // some other general setup, create values for the regex to use to check for dates in the criteria , get the element id of the loaded criteria, get the current criteria and set up the div for the custom options. 
    let date_regex = new RegExp('[0-9]{2}/[0-9]{2}/[0-9]{4}');
    let id = newElem.id;
    let currentcriteria = document.getElementById(id).value;
    let div = document.createElement("div");
    div.id = id+"_div"
    newElem.size = "135"
    //check if the current criteria for this loop contains aa date or the word date
    if (currentcriteria.match(date_regex) || currentcriteria.includes('date')){
        //check if the current criteria contains the between comparison operator
        if(currentcriteria.includes("BETWEEN") == true){
            //set up the filter config elements within our custom div
            let modebutton = document.createElement('input');
            modebutton.type = "button";
            modebutton.value = "Mode";
            modebutton.onclick = function(){swapmode()};
            let id = newElem.id;
            let timeperiod1 = '<select id='+id+'_time1'+'> <option value="Year">Years</option> <option value="FiscalYear">Fiscal Years</option> <option value="Quarter">Quarters</option> <option value="Month">Months</option> <option value="Week">Weeks</option> </select>'
            let firstorlast1 = '<select id='+id+'_firstorlast1'+'> <option value="First">First</option> <option value="Last">Last</option> </select>'
            let firstorlast2 = '<select id='+id+'_firstorlast2'+'> <option value="First">First</option> <option value="Last">Last</option> </select>'
            let button = document.createElement('input');
            button.type = "button";
            button.value = "Update";
            button.id = id+'_button';
            button.onclick = function(){updatebetweencriteria(id)};
            let mod1 = document.createElement('input');
            mod1.type ="number";
            mod1.value = 0;
            mod1.id = id+'_mod1';
            mod1.style ="width: 3.5em";
            let mod2 = document.createElement('input');
            mod2.type ="number";
            mod2.value = 0;
            mod2.id = id+'_mod2';
            mod2.style ="width: 3.5em";
            let timeperiod2 = '<select id='+id+'_time2'+'> <option value="Year">Years</option> <option value="FiscalYear">Fiscal Years</option> <option value="Quarter">Quarters</option> <option value="Month">Months</option> <option value="Week">Weeks</option> </select>'
            div.innerHTML = 'BETWEEN the'+ firstorlast1 +'day of'+ mod1.outerHTML + timeperiod1 +'ago/from now. AND the'+ firstorlast2 +'day of'+ mod2.outerHTML + timeperiod2+'ago/from now';
            div.appendChild(button);
            //div.appendChild(modebutton);
            $(newElem).before(div);
        }
        //for any other comparison operator than between, this sets up the elements in the div
        else{
            let id = newElem.id;
            let modebutton = document.createElement('input');
            modebutton.type = "button";
            modebutton.value = "Mode";
            modebutton.onclick = function(){swapmode(id)};
            let timeperiod1 = '<select id='+id+'_time1'+'> <option value="Year">Years</option> <option value="FiscalYear">Fiscal Years</option> <option value="Quarter">Quarters</option> <option value="Month">Months</option> <option value="Week">Weeks</option> </select>'
            let firstorlast1 = '<select id='+id+'_firstorlast1'+'> <option value="First">First</option> <option value="Last">Last</option> </select>'
            let button = document.createElement('input');
            button.type = "button";
            button.value = "Update";
            button.id = id+'_button';
            button.onclick = function(){updatecriteria(id)};
            let mod1 = document.createElement('input');
            mod1.type ="number";
            mod1.value = 0;
            mod1.id = id+'_mod1';
            mod1.style ="width: 3.5em";

            div.innerHTML = 'The' + firstorlast1 +'day of' + mod1.outerHTML + timeperiod1 + 'ago/from now';
            div.appendChild(button);
            //div.appendChild(modebutton);
            $(newElem).before(div);

        }
    }

});
//a function to swap modes, to be implemented later
function swapmode(id){
let div = id+"_div";
alert(div);
//document.getElementById(div).innerHTML = ""
}
// function to update the criteria with our new criteria for all comparison operators except between
function updatecriteria(id){
//get current filter value
let currentfilter = document.getElementById(id).value;
//get the field name the filter is checking (this assumes the field name is the first word space delimitated)
let fieldname = currentfilter.split(' ')[0];
//same as above but for the comparison operator, assumes the comparison operator is the second word
let comparisonoperator = currentfilter.split(' ')[1];
//get the selected time period to compare against 
let timevalue = document.getElementById(id+'_time1').value;
//get the number of time periods to modify by 
let modvalue = parseInt(document.getElementById(id+'_mod1').value);
//get the first or last selected value
let firstorlast1value = document.getElementById(id+'_firstorlast1').value
//establish the new filter variable in scope
let newfilter = '';
//if the number to modify by is not 0 or null use an Nth function
if(modvalue){
    newfilter = fieldname+' '+ comparisonoperator+' dpo.'+firstorlast1value+'DayOfNth'+timevalue+'('+modvalue+')';
}
//if the number to modify by is 0 or null use an current function
else{
    newfilter = fieldname+' '+ comparisonoperator+' dpo.'+firstorlast1value+'DayOfCurrent'+timevalue+'()';
}
//finally update the filter value
document.getElementById(id).value = newfilter;
};
// function to update the criteria with our new criteria for the between comparison operator
function updatebetweencriteria(id){
//get current filter value
let currentfilter = document.getElementById(id).value;
//get the field name the filter is checking (this assumes the field name is the first word space delimitated)
let fieldname = currentfilter.split(' ')[0];
//get the first selected time period to compare against 
let timevalue1 = document.getElementById(id+'_time1').value;
//get the second selected time period to compare against 
let timevalue2 = document.getElementById(id+'_time2').value;
//get the first number of time periods to modify by 
let modvalue1 = parseInt(document.getElementById(id+'_mod1').value);
//get the second number of time periods to modify by 
let modvalue2 = parseInt(document.getElementById(id+'_mod2').value);
//get the first of the first or last selected value
let firstorlast1value = document.getElementById(id+'_firstorlast1').value
//get the second of the first or last selected value
let firstorlast2value = document.getElementById(id+'_firstorlast2').value
//establish the new filter variables in scope
let newfilter = '';
let Nth1 = '';
let Nth2 = '';
//if the first number to modify by is not 0 or null use an Nth function, else use current
if(modvalue1){
    Nth1 = 'Nth';
}else{
    Nth1 = 'Current';
    modvalue1 = ''
}
//if the second number to modify by is not 0 or null use an Nth function, else use current
if(modvalue2){
    Nth2 = 'Nth';
}else{
    Nth2 = 'Current';
    modvalue2 = ''
}
//finally update the filter value
newfilter = fieldname+' BETWEEN dpo.'+firstorlast1value+'DayOf'+Nth1+timevalue1+'('+modvalue1+') AND dpo.'+firstorlast2value+'DayOf'+Nth2+timevalue2+'('+modvalue2+')';
document.getElementById(id).value = newfilter;
}
