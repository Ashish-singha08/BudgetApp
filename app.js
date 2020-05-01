//budget controller
var budgetController =(function() {
    
    var Expenses=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    
    Expenses.prototype.calPercent=function(totalInc){
        
        if(totalInc>0){
        this.percentage = Math.round((this.value/totalInc)*100);
        }else{
            this.percentage=-1;
            }
    };
    
    Expenses.prototype.getPrecent=function(){
        return this.percentage;
    }
    
    
    var Incomes = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    
    var calculateTotal = function(type){
      
        var sum =0;
        
        data.allItems[type].forEach(function(current){
           
            sum+= current.value;
            
            
        });
        
        data.totals[type]=sum;
    };
    
    var data ={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percent :-1
    };
    
    return  {
        addItem: function(type,des,val){
            
            var newItem,Id;
            //new ID for new element
            if(data.allItems[type].length>0){
            Id=data.allItems[type][data.allItems[type].length-1].id+1;
            }else{
                Id=0;
            }
            
            //new elemnt
            if(type==='exp'){
                newItem = new Expenses(Id,des,val);
            }else if(type ==='inc'){
                newItem =new Incomes(Id,des,val);
            }
            
            //push new elemnt into data structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type,id){
            var ids,index;
            //map return a new array
            
            //HERE WE HAVE CRETED A EW ARRAY OG IDS OF ALL THE ITEMS TO GET THE INDEX OF REQUIRED ELEMENT
         ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index=ids.indexOf(id);
            
            
            
            // HERE WE WILL DELETE A ELEMENT BY USING SPLICE METHOD WHICH REQUIRE A ARRAY INDEX AND THE QUANTITY 
            if(index!==-1){
            data.allItems[type].splice(index,1);
            }
        },
        
        calculateBudget: function(){
          
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            //calculate the budget :income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the precenatge of incomethat we spent
            
            if(data.totals.inc >0){
            data.percent= Math.round((data.totals.exp/data.totals.inc)*100);
            }
        },
        calculatePrecent: function(){
            
            data.allItems['exp'].forEach(function(cur){
                cur.calPercent(data.totals.inc);
            });
            
            
        },
        getpercent: function(cur){
           var allPercent=data.allItems['exp'].map(function(cur){
               return cur.getPrecent();
           }) ;
            
            return allPercent;
        },
        getbudget: function(){
            return {
                budAvailable: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percent
            }
        },
        
        testing: function(){
            console.log(data);
        }
     
    };
       
    
    
    
    
})();

//ui controller
var UIController=(function(){
   
    var DOMstrings ={
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputButton:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container: '.container',
        percent:'.item__percentage',
        dateLabel : '.budget__title--month'
    }
    
    var formatNumber=function(num,type){
            var numSplit,sign;
            num= Math.abs(num);
            
            num= num.toFixed(2);
            
            numSplit = num.split('.');
            
            int =numSplit[0];
            
            if(int.length>3){
               int= int.substr(0,int.length-3)+ ',' + int.substr(int.length-3,3);
            }
            
            dec=numSplit[1];
            
            type=== 'exp'?sign='-':sign='+';
            
            return sign + ' '+ int + '.'+dec;
            
        };
    
    return {
      getInput: function(){
          
          return{
          
           type: document.querySelector(DOMstrings.inputType).value,
           description: document.querySelector(DOMstrings.inputDescription).value,
          value : parseFloat( document.querySelector(DOMstrings.inputValue).value)
              
              
          };
      }  ,
        
        
        addListItem: function(obj,type){
            var html,newHtml,element;
            
            
            if(type ==='inc'){
                element = DOMstrings.incomeContainer;
           html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
                
            }
            
            else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
            
            }
            
            
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        delListItem: function(selectorId){
           var element= document.getElementById(selectorId)
           element.parentNode.removeChild(element);
        },
        
        clearFields: function(){
            var fields , fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);//thi willreturn a list of seleted item but not the array
            
            
            //slice method is used to make a copy of the array but we cant use directly over the list
            
            
            // thats wht we are using the below method
           fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current,index,array){
                current.value="";
            });
            fieldsArray[0].focus();
        },
        
        displayBudget : function(obj){
             var type;
            var temp = obj.budAvailable>0?type==='inc':type==='exp';
            document.querySelector(DOMstrings.budgetLabel).textContent= formatNumber(obj.budAvailable,type);
            document.querySelector(DOMstrings.incomeLabel).textContent= formatNumber( obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent=  formatNumber(obj.totalExp,'exp');
           
            
            if(obj.percentage>0){
               document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage+'%';  
            }
            else{
                 document.querySelector(DOMstrings.percentageLabel).textContent= '---';
            }
            
            
        },
        
        displayPercent : function(perarr){
            
          var fields=  document.querySelectorAll(DOMstrings.percent);
            
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current,index,array){
                
                if(perarr[index]>0){
                current.textContent= perarr[index]+'%';
                }else{
                    current.textContent='--';
                }
            });
            
            
            
            
        },
        
        displayMonth: function(){
            var year,now,month,monarr;
            now = new Date();
            monarr =['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
             year = now.getFullYear();
            month = now.getUTCMonth();
            document.querySelector(DOMstrings.dateLabel).textContent=  monarr[month-1] +' of '+ year;
        },
        changeType: function(){
           var fieldArray;
            var fields= document.querySelectorAll(  DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' +DOMstrings.inputValue);            
            
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current,index,array){
                current.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        
        getDOMstrings: function(){
        return DOMstrings;
    }
          
    };
    
    
    
    
    
})();

//GLOBAL APP CONTROLLER

var controller =(function(budget,UICtrl){
    /// OUR EVENT LISTENER FUNCTION, ALL EVENTS WILL BE INSIDE IT
    var eventListeners= function(){
        var DOM = UICtrl.getDOMstrings();
         document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(event){
        
        
       // here we have also used which property bcz keycode property does not work on some old browser
        if(event.keycode===13||event.which===13){
           ctrlAddItem();
        }
           
    });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDelItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
    }
   
    
     var updatePrecent=function(){
         
         //cal the percentage
         budget.calculatePrecent();
         
         //read percent from the budget controller
         var perarr= budget.getpercent();
         
         
         //update the ui
         UICtrl.displayPercent(perarr);
        
     }
    var updateBudget = function(){
        //1.calculate budget
        
        budget.calculateBudget();
        
        //2. return the budget
        
       var budgetIs = budget.getbudget();
        
        //3.display budget on the ui
        
       UICtrl.displayBudget(budgetIs);
    };
    
    var ctrlAddItem=function(){
        
        var input,newItem;
          //1. get the field imput data
        input = UICtrl.getInput();
        if(input.description!=="" &&!isNaN(input.value)&& input.value>0){
        //2. add item to budget controller
         newItem = budget.addItem(input.type,input.description,input.value);
        
        //3.add the item to the user interface
        
        UICtrl.addListItem(newItem,input.type);
        
        //3-2 clear the fields
        
        UICtrl.clearFields();
        
        //4 calculate and update budget
        
        updateBudget();
            
            
            updatePrecent();
        }
        
    };
    
    var ctrlDelItem = function(event){
        var itemId,Id,type,splitId;
    
        
        
        itemId= event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
            
            splitId = itemId.split('-');
            type=splitId[0];
            Id= parseInt(splitId[1]);
            //1. delte item fro data structure
            budget.deleteItem(type,Id);
            
            //2.delete from ui
            
            UICtrl.delListItem(itemId);
            
            //3. update and show budget
            
             updateBudget();
            
            updatePrecent();
        }
        
    };
     return{
         init:function(){
            UICtrl.displayBudget({
                budAvailable:0,
                totalInc:0,
                totalExp:0,
                percentage:0
            });
             eventListeners();
             UICtrl.displayMonth();
         }
     }
    
})(budgetController,UIController);


controller.init();


