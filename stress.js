const axios = require('axios');



function modify({ org_name, daughters = [] }) {
  return { org_name: org_name + Math.round(Math.random() * 5000), daughters: daughters.map(modify) }
}

(async function() {
  for (let k = 0; k < 10; k++) {
    for (let j = 0; j < 500; j++) {
      const original = {
      	"org_name": "Paradise Island" + k,
      	"daughters": [],
      }
      console.log(j);
      for (let i = 0; i < 200; i++) {
        original.daughters.push({ org_name: 'Black Banana' +  Math.random() });
      }
      await axios.post('http://localhost:3000/organizations', [original]);
    }
  }
}())
