
const modal = document.querySelector('.modal-overlay')
Modal = {
  open(){
    // Abrir modal
   // Adicionar a class active ao modal
  modal.classList.toggle('active')
  }
  /*close(){
    // fechar o modal
   // remover a class active do modal
   modal.classList.remove('active')
  }
  */
}
// Local Storage
const  Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
  },
  set(transaction){
    localStorage.setItem("dev.finances:transaction", JSON.stringify(transaction))
  }
}


const Transaction = {
  all: Storage.get(), 
  add(transaction){
      Transaction.all.push(transaction)
      app.reload()
  },
  remove(index){
    document.querySelector('#data-table tbody tr').addEventListener('click', () =>{
      const a = document.querySelector('#data-table tbody tr')
        a.classList.add("selecionado")
        console.log(index);
     })
    setTimeout(() => {
      this.all.splice(index,1)
      app.reload()
    },1000)
  },
  //soma as entradas
  incomes() {
    let income = 0;
    // pega todas as transaçoes 
    // para cada trasacao
    Transaction.all.forEach(transaction =>{
    // se ela for maior que zero
    if(transaction.amount > 0){
      // soma a uma variavel a retorna a variavel
      income += transaction.amount;
    }
    })
    
    return income 
  },

  // soma as saidas
  expenses(){
    let expense = 0;
    // pega todas as transaçoes 
    // para cada trasacao
    Transaction.all.forEach(transaction =>{
    // se ela for menor que zero
    if(transaction.amount < 0){
      // soma a uma variavel a retorna a variavel
      expense += transaction.amount;
    }
    })
    
    return expense
    
  },

  //  soma total = entradas - saidas 
  total(){
    // entradas - saidas 
    return Transaction.incomes() + Transaction.expenses()
    // pq mais -+ = -

  }
}
// eu preciso pega as minha transaçoes do meu js e coloca no html
// ou seja subtituir os dados do html com os dados do js
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction,index){
    const tr = document.createElement('tr')
    const div = document.createElement('div')
    div.classList.add('separar')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

     DOM.transactionsContainer.appendChild(tr)
     DOM.transactionsContainer.appendChild(div)
  },
  innerHTMLTransaction(transaction,index){
    const CSSclass = transaction.amount > 0 ? "income" : "expense"
    
    const amount = Utils.formatCurreny(transaction.amount)

    const html = `
     <td class="description">${transaction.description}</td>
     <td class="${CSSclass}">${amount}</td>
     <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove(${index})" src="./assets/assets/minus.svg" alt="">
    </td>
    `
    return html
    
  },
  updateBalance(){
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurreny(Transaction.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurreny(Transaction.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurreny(Transaction.total())
  },
  clearTransaction(){
    // this so pode ser usado se a funçap tive detro da clase ou objeto  
    //this.transactionsContainer.innerHTML= ""
    // ou pode usa 
    DOM.transactionsContainer.innerHTML = ""
  }
}

// configuraçoes uteis 
const Utils = {
  formatAmout(value){
    value =  Number(value) * 100
   // value =  Number(value.replace(/\,\./g, ""))
    return value
  },
  formatDate(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurreny(value){
    const signal = Number(value) < 0 ? "-" :""
    
    value = String(value).replace(/\D/g,"")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR",{
      style:  "currency",
      currency: "BRL"
    })

    return  signal + value;

  }
}
// configuraçoes do form
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues() {
     return {
       description: this.description.value,
       amount: this.amount.value,
       date: this.date.value
     }
  },
  validateFields(){
    const {description, amount,date} = Form.getValues()
    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw  new Error("Por favor, preenchar todos os campos")
    }
    
  },
  formatValues(){
     let {description,amount,date} = Form.getValues()
     amount = Utils.formatAmout(amount)
     date = Utils.formatDate(date)
     return{
       description,
       amount,
       date
     }
  },
  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
 
  submit(event){
   
   event.preventDefault();
   // verificar se todos as informaçoes foram preenchidas
   try {
    Form.validateFields()
    // formata os dados para salva
    const transaction = Form.formatValues()
    // salvar
    Transaction.add(transaction)
    // apagar os dados do formulario
    Form.clearFields()
    // fechar o modal 
    Modal.open()
    // Atualiza a aplicação 
    // nao precisa pq ja tem no Transaction.add  o app.reload()
   } catch (error) {
     alert(error.message)
   }
   
  }
}

// ===== Chamada das funçoes ==== 
const app ={
  init(){
  // criar o valores da tabela  

  // criar todos os elementos da tabela que ja existe da tela 
  // lembrete o Transaction.add tem que ser antes pois se nao nao mostra na tela 
  // foi criada a funçao reload para que nao precise se precopa com isso
  Transaction.all.forEach((transaction,index) => {
  DOM.addTransaction(transaction,index)
  console.log(Transaction.all.length);
  })
  
  
  // desenha no html as entrada saida e o total e faz autolizaçao ou update
  DOM.updateBalance()
  Storage.set(Transaction.all)
  },
  reload(){
    DOM.clearTransaction()
    app.init()
  }
}
app.init()



