pragma solidity ^0.5.0;

contract initial {
    /*=======================STRUCTURES==========================*/
    
    struct Student
    {
        string student_email;
        uint student_rollno;
        string student_name;
        string student_password;
        string gender;
        string actor;
        address student_address;

    }

    struct Teacher
    {
        string teacher_email;
        string teacher_name;
        string teacher_password;
        string teacher_subject;
        string gender;
        string actor;
        address teacher_address;

    }

    struct Assignment
    {
        uint ass_no;
        string ass_name;
        uint deadline;
    }
    
    /*=======================MAPPING==========================*/
    
    //Mapping for address to Student deatails stored in Student structure
    mapping(address => Student) private allStudents;
    //Mapping for address to Teacher deatails stored in Teacher structure
    mapping(address => Teacher) private allTeachers;
    //balance
    mapping(address => uint256) public balanceOf;
    //
    mapping(uint => address) public studentAddress;
    //
    mapping(uint => Assignment) public AllAssignment;
    
    uint[] public AssignmentNumber;
    /*=======================FUNCTIONS==========================*/
   
    function transfer(uint rollno, uint256 _value) public payable returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[studentAddress[rollno]] += _value;

        //event
        //Transfer(msg.sender, _to, _value);

        return true;
    }

    function studentsAddress(uint _rollno) external returns(address){
        return studentAddress[_rollno];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // allowance[_from][msg.sender] -= _value;

        // Transfer(_from, _to, _value);
        return true;
    }
    
    // internal function to compare strings 
    function stringsEqual(string memory _a, string memory _b) public pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        if(a.length != b.length)
            return false;
        for (uint i=0; i < a.length; i++)
        {
            if(a[i] != b[i])
                return false;
        }
        return true;
    }

    function registerStudent(string memory name, string memory password, string memory email, uint rollno, string memory actor) public returns(uint)
    {
        allStudents[msg.sender].student_name = name;
        allStudents[msg.sender].student_email = email;
        allStudents[msg.sender].student_password = password;
        allStudents[msg.sender].student_rollno = rollno;
        allStudents[msg.sender].actor = actor;  
        return 1;
    }

    //Function for checking login
    function checkLogin(string memory email, string memory password, string memory actor) 
    public payable returns(uint, string memory) 
    {
        if(stringsEqual(actor, "student"))       
        {   
            if(stringsEqual(allStudents[msg.sender].student_email,email) && stringsEqual(allStudents[msg.sender].student_password,password))
            {
                return (1,allStudents[msg.sender].actor);
            }
            return (0,"null");
        }
        else
        {
            if(stringsEqual(allTeachers[msg.sender].teacher_email,email) && stringsEqual(allTeachers[msg.sender].teacher_password,password))
            {
                return (1,allTeachers[msg.sender].actor);
            }
            return (0,"null");
        }
    }

    function registerTeacher(string memory name, string memory password, string memory email, string memory actor, string memory subject)
    public returns(uint)
    {
        allTeachers[msg.sender].teacher_name = name;
        allTeachers[msg.sender].teacher_email = email;
        allTeachers[msg.sender].teacher_password = password;
        allTeachers[msg.sender].actor = actor;
        allTeachers[msg.sender].teacher_subject = subject;
        return 1;
    }

    function getInformationStudent() public returns(string memory, string memory,uint)
    {
        return(allStudents[msg.sender].student_name,allStudents[msg.sender].student_email,allStudents[msg.sender].student_rollno);
    }

    function getInformationTeacher() public returns(string memory, string memory, string memory)
    {
        return(allTeachers[msg.sender].teacher_name, allTeachers[msg.sender].teacher_email, allTeachers[msg.sender].teacher_subject);
    }
      
    function createAsses(string memory name, uint no, uint deadline) public payable returns(uint)
    {
        AllAssignment[no].ass_name = name;
        AllAssignment[no].ass_no = no;
        AllAssignment[no].deadline = deadline;
        AssignmentNumber.push(no);
        return 1;
    }

    function getAssignment() public returns(string memory, uint ,uint) 
    {
        return (AllAssignment[AssignmentNumber[0]].ass_name, AllAssignment[AssignmentNumber[0]].ass_no, AllAssignment[AssignmentNumber[0]].deadline);
    }

    
}