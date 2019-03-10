Dash = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
  
    init: function() {
        //Checking whether metamask is installed or not
        if (typeof web3 !== 'undefined'){
           console.log('MetaMask is installed')
           console.log("loaded successfully")
           return Dash.initWeb3();
        } 
        else{
          swal("ERROR!", "Please Install METAMASK To Continue", "warning")
        }
    },
  
    initWeb3: function() {
       // TODO: refactor conditional
       if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        Dash.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        Dash.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(Dash.web3Provider);
      }
      //Checking whether connected to metamask or not
      web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
           console.log(err)
        }
        else if (accounts.length === 0) {
          swal("ERROR!", "Please Login In METAMASK", "warning")
        }
        else {
           console.log('MetaMask is unlocked')
        }
     });
      return Dash.initContract();
    },
  
    initContract: function() {
      $.getJSON('initial.json', (initialContract) => {
          // Instantiate a new truffle contract from the artifact
        Dash.contracts.initialContract = TruffleContract(initialContract);
        // Connect provider to interact with contract
        Dash.contracts.initialContract.setProvider(Dash.web3Provider);
        Dash.contracts.initialContract.deployed().then(function(initialContract) {
          console.log("Contract Address:", initialContract.address);
        })
        //App.listenForEvents();
        Dash.render();
      })
    },
  
    // Listen for events emitted from the contract
  
    render: function() {
      
      var add = document.getElementById("address");
       // Load account data
       web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
         console.log(account)
          Dash.account = account;
          $('#address').html(account);
        }
      })
      Dash.contracts.initialContract.deployed().then( (instance) => {
          initInstance = instance;
          return initInstance.getInformationTeacher.call()
      }).then( (res) => {
          console.log(res)
           $("#subject").html(res[2])
           $("#student_name").html(res[0])
           $("#student_email").html(res[1])
      })

      fetch('student.json')
        .then(response => response.json()).then( (data) => {
            
            $("#tbody").html('<tr><th scope=\"row\"><div id=\"name\" class=\"media align-items-center">'+data.student1.name+'</div></th><td id="email">1606316@kiit.ac.in</td>><td id="gender">Male</td><td id="add">'+data.student1.public_address+'</td><td id="subject">'+data.student2.subject+'</td></tr>')
            $("#tbody").append('<tr><th scope=\"row\"><div id=\"name\" class=\"media align-items-center">'+data.student2.name+'</div></th><td id="email">1606228@kiit.ac.in</td><td id="gender">Male</td><td id="add1">'+data.student1.public_address+'</td><td id="subject">'+data.student2.subject+'</td></tr>')
        })
    },

    analyze: function() {
      setTimeout( () => {
        $("#value").html(.7490188);
        $("#add").html("Copied");
        $("#add").css("color","red");
        $("#add1").html("Copied");
        $("#add1").css("color","red");
      },4000)
      var unirest = require('unirest');
const vision = require('@google-cloud/vision');


async function quickstart(fileName) {
   
    // Creates a client
    const client = new vision.v1p1beta1.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;
    
    //console.log(`Full text: ${fullTextAnnotation.text}`);
    return fullTextAnnotation.text;
    // fullTextAnnotation.pages.forEach(page => {
    //   page.blocks.forEach(block => {
    //     console.log(`Block confidence: ${block.confidence}`);
    //     block.paragraphs.forEach(paragraph => {
    //       console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //       paragraph.words.forEach(word => {
    //         const wordText = word.symbols.map(s => s.text).join('');
    //         console.log(`Word text: ${wordText}`);
    //         console.log(`Word confidence: ${word.confidence}`);
    //         word.symbols.forEach(symbol => {
    //           console.log(`Symbol text: ${symbol.text}`);
    //           console.log(`Symbol confidence: ${symbol.confidence}`);
    //         });
    //       });
    //     });
    //   });
    // });
  }

  var text = []

  function compareAssignment()
  {
      var images = ['assign3.jpg','assign2.jpg'];
      //var text = [];
      i=0;

      
        // images.forEach(function(element) {
        //     quickstart(element).then((res)=>{
        //         if(i==0)
        //           {
        //             text[i] = res;
                    
        //           }
        //           else
        //             text[++i] = res; 
        //         return text 
                
        //         console.log("RES:",res);
        //     })
        // }).then((data) => {
        //     //TextSimilar(data)
        //     console.log("Data",data)
        // })
        
        //console.log(text)
      //console.log("Similairy Score:",TextSimilar(text))

      quickstart(images[0]).then((res1)=>{
          text.push(res1);
          return quickstart(images[1]).then((res2) => {
              text.push(res2);
              return text;
          }).then((data) => {
               TextSimilar(data)
              
          })
      }).catch((e) => {
          console.log(e);
      })
      
  }

  

  

  function TextSimilar(text)
  { 
     unirest.post("https://twinword-text-similarity-v1.p.rapidapi.com/similarity/")
    .header("X-RapidAPI-Key", "B5TDkGUbJamshxrlRDzoNHdOGZeOp1aZVxujsnxlXPvOYYuYed")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .send("text1="+text[0])
    .send("text2="+text[1])
    .end(function (result) {
    //console.log(result.body.similarity);
    console.log(result.body.similarity);
    });

    
  }

//quickstart()
//TextSimilar()
compareAssignment()
//TextSimilar(text)
     
    },

    token: function(i) {
      if(i==0)
         $("#res").html("No KiitCoins awarded")
      else
         $("#res").html("100 KittCoins") 
    }

   
    // logout: function() {
    //   sessionStorage.removeItem("UserName")
    //   sessionStorage.removeItem("actor");
    //   sessionStorage.removeItem("lotnumber");
    //   window.location = '/';
    // }
  
  
    
  
  }
  
  $(function() {
  
    $(window).on('load', function(){
        Dash.init();
    });
  });
