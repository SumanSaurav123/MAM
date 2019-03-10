
assm = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
  
    init: function() {
        //Checking whether metamask is installed or not
        if (typeof web3 !== 'undefined'){
           console.log('MetaMask is installed')
           console.log("loaded successfully")
           return assm.initWeb3();
        } 
        else{
          swal("ERROR!", "Please Install METAMASK To Continue", "warning")
        }
    },
  
    initWeb3: function() {
       // TODO: refactor conditional
       if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        assm.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        assm.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(assm.web3Provider);
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
      return assm.initContract();
    },
  
    initContract: function() {
      $.getJSON('initial.json', (initialContract) => {
          // Instantiate a new truffle contract from the artifact
        assm.contracts.initialContract = TruffleContract(initialContract);
        // Connect provider to interact with contract
        assm.contracts.initialContract.setProvider(assm.web3Provider);
        assm.contracts.initialContract.deployed().then(function(initialContract) {
          console.log("Contract Address:", initialContract.address);
        })
        //App.listenForEvents();
        assm.render();
      })
    },

   render: function() {

    assm.contracts.initialContract.deployed().then( (instance) => {
        initInstance = instance;
        return initInstance.getAssignment.call()
    }).then( (res) => {
        console.log(res)
        $("#tbody").html('<tr><th scope=\"row\"><div id=\"name\" class=\"media align-items-center">'+res[0]+'</div></th><td id="email">'+res[1].toNumber()+'</td>><td id="gender"> <i class="bg-warning"></i> pending</td><td id="address">'+EpochToDate(res[2].toNumber())+'</td><td id="subject">c++</td></tr>')
    })
   }
    
    
  
    
  
  }
  function formatDate(date)
    {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return  day+'/'+monthIndex+'/'+year;
    }

  function EpochToDate(epoch) {
    if (epoch < 10000000000)
        epoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    var epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone   
    let d = new Date(epoch);
         
    var date = formatDate(new Date(epoch));
    return date;
}
  $(function() {
  
    $(window).on('load', function(){
        assm.init();
    });
  });
