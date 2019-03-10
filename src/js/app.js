App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
  
    init: function() {
        //Checking whether metamask is installed or not
        if (typeof web3 !== 'undefined'){
           console.log('MetaMask is installed')
           console.log("loaded successfully")
           return App.initWeb3();
        } 
        else{
          swal("ERROR!", "Please Install METAMASK To Continue", "warning")
        }
    },
  
    initWeb3: function() {
       // TODO: refactor conditional
       if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
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
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('initial.json', (initialContract) => {
          // Instantiate a new truffle contract from the artifact
        App.contracts.initialContract = TruffleContract(initialContract);
        // Connect provider to interact with contract
        App.contracts.initialContract.setProvider(App.web3Provider);
        App.contracts.initialContract.deployed().then(function(initialContract) {
          console.log("Contract Address:", initialContract.address);
        })
        //App.listenForEvents();
        App.render();
      })
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.MemberContract.deployed().then(function(instance) {
        FarmerInstance = instance
        instance.GHashEvent({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        })
      })
    },
  
    render: function() {
      
      var add = document.getElementById("address");
       // Load account data
       web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
         console.log(account)
          App.account = account;
          $('#address').html(account);
        }
      })
    },

    loginStudent: function() {          
      var email = $("#email").val()
      var password = $("#password").val()
      var actor = $("#actor").val()
      App.contracts.initialContract.deployed().then( (instance) => {
        initialInstance = instance
        return initialInstance.checkLogin.call(email, password, actor)
      }).then( (result) => {
          console.log(result)
          if(result[0].toNumber() == 1)
          {
            swal("Congratulations!", "Successfully login", "success");
            $("#log-form").trigger("reset")
            // $("#nav-form").hide();

            sessionStorage.setItem("StudentEmail",email);
            sessionStorage.setItem("actor",result[1])
            if(sessionStorage.getItem("actor")=="student")
                window.location = "/dashboard.html"
            else if(sessionStorage.getItem("actor")=="teacher")
                window.location = "/sdashboard.html"
          }
          else
          {
            swal("Error", "Check Username or Password", "warning");
          }
         // location.reload();
      })
    },
    
    regStudent: function() {
        var name = $("#name").val()
        var email = $("#email").val()
        var rollno = $("#rollno").val()
        var password = $("#password").val()
        var actor = $("#actor").val()
        var subject = $("#subject").val()
        if(actor=="student")
        {
          App.contracts.initialContract.deployed().then( (instance) => {
            initialInstance = instance
            return initialInstance.registerStudent.sendTransaction(name, password, email, rollno, actor, {
                from:App.account,
            }).then( (res) => {
                console.log(res)
                swal("Congratulations!", "Sucessfuly Registered!", "success")
                $("#reg-form").trigger('reset')
                window.location = '/index.html';
            })
        })
        }
        else  
        {
          console.log(name,password,email,actor,subject);
          App.contracts.initialContract.deployed().then( (instance) => {
            initialInstance = instance
            return initialInstance.registerTeacher.sendTransaction(name, password, email, actor, subject, {
                from:App.account,
            }).then( (res) => {
                console.log(res)
                swal("Congratulations!", "Sucessfuly Registered!", "success")
                $("#reg-form").trigger('reset')
                window.location = '/index.html';
            })
          })
        }
    },

    logout: function() {
      sessionStorage.removeItem("StudentEmail")
      sessionStorage.removeItem("actor");
      swal("Congratulations!", "Sucessfuly Logout!", "success")
      window.location = '/index.html';
    },
  
  
  }
  
  $(function() {
  
    $(window).on('load', function(){
        App.init();
    });
  });
