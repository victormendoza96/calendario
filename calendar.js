const days =['D','L','M','X','J','V','S']

class calendar{
  constructor(options){
    /*ingresar date es opcional por si se quiere que el
     calendario imprima una fecha diferente a la actual*/ 
    this.date = options.date || new Date();
    this.container = options.container;
    /* la tabla se va generar una ves luego cuando se cambie de mes solo se modificaran los valores
      dentro de cada elemento de la tabla para eso usamos calendarTable */
    this.calendarTable = null; 
    this.buildTable();
  }

  //actualizar la tabla dependiendo del mes a visualizar
  
  updateTable(){
    this.claculateDay();
  };

  //calcular cuando comienza y termina el mes y cuantos dias tiene
  calculateDay(){
    this.monthStar = new Date(this.date.getFullYear(),this.date.getMonth(),1 )
    this.monthEnd = new Date(this.date.getFullYear(),this.date.getMonth()+1,1 )
    this.monthDays =  Math.floor((this.monthEnd - this.monthStar) / (1000 * 60 *60 * 24))
  };

  buildTable(){
    let table = document.createElement('table')
    let thead = document.createElement('thead')
    

    for(let i=0; i<7; i++){
      let td = document.createElement('td')
      td.innerHTML = days[i]
      thead.appendChild(td)
    }
    /*hasta 6 por que si un mes empieza el sabado
     puede necesitar mas de 5 filas donde se coloquen los elemntos */
    for (let i = 0; i <= 6; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j <= 6; j++) {
        let td = document.createElement('td')
        tr.appendChild(td)
      } 
      table.appendChild(tr)
    }
     
    table.appendChild(thead)
    this.container.appendChild(table)
  }

}