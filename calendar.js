const days =['D','L','M','X','J','V','S']
const months=['Enero','Febrero','Marzo','Abril','Mayo','junio','Julio','agosto','Septiembre', 'Octubre','Noviembre', 'Diciembre'];


class Calendar{
  constructor(options){
    
   
    /*ingresar date es opcional por si se quiere que el
     calendario imprima una fecha diferente a la actual*/ 
    this.date = options.date || new Date();
    this.today = new Date();
    this.container = options.container;
    /* la tabla se va generar una ves luego cuando se cambie de mes solo se modificaran los valores
      dentro de cada elemento de la tabla para eso usamos calendarTable */
    this.calendarTable = null; 
    
    this.buildTable();
    this.updateTable();
    this.createButtons();
    this.holiday();
  }
  //siguiente mes
  next(){
    if (this.date.getMonth == 11){
      this.date = new Date(this.date.getFullYear()+1, 0, 1) 
    }
    else{
      this.date = new Date(this.date.getFullYear(),this.date.getMonth() + 1, 1)
    }

  this.updateTable();
  this.createButtons();
  this.holiday();
  }
  //anterior mes
  prev(){
    if (this.date.getMonth == 0){
      this.date = new Date(this.date.getFullYear()-1, 11, 1) 
    }
    else{
      this.date = new Date(this.date.getFullYear(),this.date.getMonth() - 1, 1)
    }

    this.updateTable();
    this.createButtons();
    this.holiday();
  }
  //creo y agrego funcionalidad a los botones
  createButtons(){
    this.buttons = {};

    this.buttons.next = document.createElement('div')
    this.buttons.prev = document.createElement('div')

    this.buttons.next.classList.add('next-arrow')
    this.buttons.prev.classList.add('prev-arrow')
    
    this.container.querySelector('.relative').appendChild(this.buttons.next)
    this.container.querySelector('.relative').appendChild(this.buttons.prev)
    
    this.buttons.next.addEventListener('click',()=> this.next())  
    this.buttons.prev.addEventListener('click',()=> this.prev())
  }
  //actualizar la tabla dependiendo del mes a visualizar
  updateTable(){
    this.calculateDay();
    let firstDayInWeek = this.monthStar.getDay(); //dia de la semanas
    let trs = this.calendarTable.querySelectorAll('tr')

    for (let i = 0; i <= 5; i++) {//filas semanas
      let tr = trs[i]
      let tds = tr.querySelectorAll('td')

      for (let j = 0; j < 7 ; j++) {//columnas dias de semana
        let td = tds[j]
        let day = (i*7)+ j
        if (day >= firstDayInWeek && (day - firstDayInWeek)< this.monthDays){
          td.innerHTML = day - firstDayInWeek + 1}
        else{
          td.innerHTML = ''
        }
        //dia actual
        if ((day - firstDayInWeek + 1) == this.today.getDate() && this.today.getFullYear() == this.date.getFullYear() && months[this.date.getMonth()] == months[this.today.getMonth()]){
          td.classList.add('today')}
        else{
          td.classList.remove('today')
        }
      } 
    }
    this.container.querySelector('header').innerHTML = `${months[this.date.getMonth()]}, ${this.date.getFullYear()}`
    this.container.querySelector('header').classList.add('relative')
  };

  //calcular cuando comienza y termina el mes y cuantos dias tiene
  calculateDay(){
    this.monthStar = new Date(this.date.getFullYear(),this.date.getMonth(), 1)
    this.monthEnd = new Date(this.date.getFullYear(),this.date.getMonth()+1, 1)
    this.monthDays =  Math.floor((this.monthEnd - this.monthStar) / (1000 * 60 *60 * 24)) //llevo el resultado de milisegundos a dias
    //uso floor por que en algunos meses el resultado da decimales
  };

  buildTable(){
    let table = document.createElement('table')
    let thead = document.createElement('thead')
    

    for(let i=0; i<7; i++){//head de la tabla(dias de semana)
      let td = document.createElement('td')
      td.innerHTML = days[i]
      thead.appendChild(td)
    }
    /*hasta 6 por que si un mes empieza el sabado
     puede necesitar mas de 5 filas donde se coloquen los elemntos */
    for (let i = 0; i <= 5; i++) {// filas de semana
      let tr = document.createElement('tr')
      for (let j = 0; j < 7; j++) {// dias de semana
        let td = document.createElement('td')
        tr.appendChild(td)
      } 
      table.appendChild(tr)
    }
    
    this.calendarTable = table;

    table.appendChild(thead)
    
    let body = document.createElement('div')
    body.classList.add('body')
    body.appendChild(table)
    
    this.container.appendChild(document.createElement('header'))
    this.container.appendChild(body)
    this.container.classList.add('shipnow-calendar')
  }

  holiday(){// pintar los dias feriados
    let firstDayInWeek = this.monthStar.getDay();
    let trs = this.calendarTable.querySelectorAll('tr')
    
    //api no trae los del year 2020+ (aun)
    fetch(`http://nolaborables.com.ar/api/v2/feriados/${this.date.getFullYear()}`)
    .then((response) => {
      //clearHoliday aqui por que afuera al pasar los meses muy rrapido se repintaria mal
      this.clearHoliday(trs);
      return response.json();
    })
    .then(holiday => {
  
      holiday.forEach(holiday => {
        
        if (this.date.getMonth() + 1 == holiday.mes){
          for (let i = 0; i <= 5; i++) {//filas semanas
            let tr = trs[i]
            let tds = tr.querySelectorAll('td')
      
            for (let j = 0; j < 7 ; j++) {//columnas dias de semana
              let td = tds[j]
              let day = (i*7)+ j
            
              if ((day - firstDayInWeek + 1) == holiday.dia) 
                td.classList.add('holiday')
              
            }
          } 
        }
      }); 
    });
  }

//quita la clase holiday en las posiciones del mes anterior
  clearHoliday(trs){
    for (let i = 0; i <= 5; i++) {//filas semanas
      let tr = trs[i]
      let tds = tr.querySelectorAll('td')

      for (let j = 0; j < 7 ; j++) {//columnas dias de semana
        let td = tds[j]
        td.classList.remove('holiday') 
      }
    } 
  }
}