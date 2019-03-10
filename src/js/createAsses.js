
ass = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
  
    init: function() {
        //Checking whether metamask is installed or not
        if (typeof web3 !== 'undefined'){
           console.log('MetaMask is installed')
           console.log("loaded successfully")
           return ass.initWeb3();
        } 
        else{
          swal("ERROR!", "Please Install METAMASK To Continue", "warning")
        }
    },
  
    initWeb3: function() {
       // TODO: refactor conditional
       if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        ass.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        ass.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(ass.web3Provider);
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
      return ass.initContract();
    },
  
    initContract: function() {
      $.getJSON('initial.json', (initialContract) => {
          // Instantiate a new truffle contract from the artifact
        ass.contracts.initialContract = TruffleContract(initialContract);
        // Connect provider to interact with contract
        ass.contracts.initialContract.setProvider(ass.web3Provider);
        ass.contracts.initialContract.deployed().then(function(initialContract) {
          console.log("Contract Address:", initialContract.address);
        })
        //App.listenForEvents();
        //ass.render();
      })
    },

    createAsses: function() {
        var ass_name = $("#name").val()
        var deadline = Math.round(new Date().getTime()/1000.0 + 604800)
        var ass_no  = (Math.random() + '').substring(2,10)+ (Math.random() + '').substring(2,10)
        var tag1 = $("#customCheck1").val() 
        var tag2 = $("#customCheck2").val()
        var tag3 = $("#customCheck3").val()
        var tag4 = $("#customCheck4").val()
        var json= new Object();
        if(tag1)
            json['tag1'] = tag1;
        if(tag2)
            json['tag2'] = tag2;
        if(tag3)
            json['tag3'] = tag3
        if(tag4)
            json['tag4'] = tag4

       
        ass.contracts.initialContract.deployed().then( (instance) => {
            initialInstance = instance
            return initialInstance.createAsses.sendTransaction(ass_name, ass_no, deadline, {
                from:web3.eth.accounts[0]
            }).then( (res) => {
                console.log(res)
                swal("Congratulations!", "Sucessfuly Alloted", "success")
            })
        })
    }
    
    
  
    
  
  }
  
  $(function() {
  
    $(window).on('load', function(){
        ass.init();
    });
  });
