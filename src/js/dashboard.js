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
          return initInstance.getInformationStudent.call()
      }).then( (res) => {
           $("#rollno").html(res[2].toNumber())
           $("#student_name").html(res[0])
           $("#student_email").html(res[1])
      })
    },

   
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
