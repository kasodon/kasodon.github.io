

//Fetch Currencies
const apiURL = `https://free.currencyconverterapi.com/api/v5/currencies`;   
let countriesCurrencies;
const dbPromise = idb.open('countries-currencies', 1, upgradeDB => {

  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
      upgradeDB.createObjectStore('rates', {keyPath: 'id'});
  }
});
fetch(apiURL)
  .then( response => {
  return response.json();
})
  .then(currencies => {
  dbPromise.then(db => {
    if(!db) return;
    countriesCurrencies = [currencies.results];
    const tx = db.transaction('objs', 'readwrite');
    const store = tx.objectStore('objs');
    let i = 0;
    countriesCurrencies.forEach(function(currency) {
      for (let value in currency) {
        store.put(currency[value]);
      }
    });
    return tx.complete;
  });
});

//Append Currencies to Select
dbPromise.then(db => {
  return db.transaction('objs')
    .objectStore('objs').getAll();
}).then(results => {
        results.forEach(x=> {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option');
            opt.value = x.id;
            opt.text = `${x.currencyName} (${x.id})`;
            
            opt2 = opt.cloneNode(true);
            select.add(opt);
            select2.add(opt2);
            
        });
        console.log(results);
    });




//Fetch Currencies

const curr = currency => {
    let e = document.getElementById('select');
    let sel = e.options[e.selectedIndex].value;
    let e2 = document.getElementById('select2');
    let sel2 = e2.options[e2.selectedIndex].value;
    let amounts = document.getElementById("amount").value;
    let query = `${sel}_${sel2}`;
    console.log(sel2);
    console.log(sel);
    const rateURL = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`; 
    let newrates;
fetch(rateURL)
  .then( response => {
  return response.json();
})
  .then(data => {
    data.id= `${query}`;
    newrates = data;
    let rate = newrates[query];
    conversion = amounts * rate;
    console.log(conversion);
    document.getElementById('answer').innerHTML = `Amount: ${conversion}`;
    
  dbPromise.then(db => {  
    if(!db) return;
    const tx = db.transaction('rates', 'readwrite');
    const store = tx.objectStore('rates');
    store.put(newrates);
    return tx.complete;  
  });
    
}).catch(oldrate =>{
    dbPromise.then(db => {
  return db.transaction('rates')
    .objectStore('rates').getAll(query);
}).then(results =>{
        let rate = results[0][query];
        conversion = amounts * rate;
        console.log(conversion); 
        document.getElementById('answer').innerHTML = `Amount: ${conversion}`;
    })
});
    }


    


