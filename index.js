const taskContainer=document.querySelector(".task__container");
const navContainer=document.querySelector("#nav-container");
let globalstore=[];
const generateNewCard= (taskData) =>
    `<div class="col-md-6 col-lg-4 mb-4" >
    <div class="card text-center">
        <div class="card-header d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this,arguments)"><i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this,arguments)"></i></button>
            <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this,arguments)"><i class="far fa-trash-alt" id=${taskData.id} onclick="deleteCard.apply(this,arguments)"></i></button>
        </div>
        <div style="width:100%; height:300px;">
        <img src=${taskData.imageUrl} alt="..."  style="width:100%; height:100%;">
        </div>
        <div class="card-body">
          <h5 class="card-title">${taskData.taskTitle}</h5>
          <p class="card-text">${taskData.taskDescription}</p>
          <a href="#" class="btn btn-primary">${taskData.taskType}</a>
        </div>
        <div class="card-footer text-muted float-right">
            <button type="button" id=${taskData.id} onclick="openTask.apply(this,arguments)" class="btn btn-outline-primary float-end">Open Task</button>
        </div>
      </div>
  </div>`;
 

  const loadInitialCardData= () =>{
      const getData=localStorage.getItem("tasky");
      const {cards}=JSON.parse(getData);
      cards.map((cardObject)=>{
          globalstore.push(cardObject);
          taskContainer.insertAdjacentHTML("beforeend",generateNewCard(cardObject));
        });
  };

const saveChanges= () =>{
    const taskData={
        id:`${Date.now()}`,
        imageUrl:document.getElementById("imageurl").value,
        taskTitle:document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDescription:document.getElementById("taskdescription").value,
    };
    taskContainer.insertAdjacentHTML("beforeend",generateNewCard(taskData));
    globalstore.push(taskData);

    localStorage.setItem("tasky",JSON.stringify({cards:globalstore}));
};

const deleteCard= (event) =>{
     event=window.event;
     const targetId=event.target.id;
     const tagname=event.target.tagName;
     globalstore=globalstore.filter((cardObject)=>cardObject.id!==targetId);
     if(tagname==="BUTTON"){
         taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
     }
     else{
        taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
     }
    localStorage.setItem("tasky",JSON.stringify({cards:globalstore})); 
}

const editCard= (event)=>{
    event=window.event;
    const targetId=event.target.id;
    const tagname=event.target.tagName;
    let parentElement;
    if(tagname==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
       parentElement=event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.innerHTML="Save Changes";
    submitButton.setAttribute("onclick","saveEditChanges.apply(this,arguments)");
}

const saveEditChanges=(event)=>{
    event=window.event;
    const targetId=event.target.id;
    const tagname=event.target.tagName;
    let parentElement;
    if(tagname==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
       parentElement=event.target.parentNode.parentNode.parentNode;
    }
    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];
    
    
    const updatedData={
        taskTitle:taskTitle.innerHTML,
        taskType:taskType.innerHTML,
        taskDescription:taskDescription.innerHTML,
    };
     

    globalstore=globalstore.map((cardObject)=>{
        if(cardObject.id===targetId){
            return{
                    id:cardObject.id,
                    imageUrl:cardObject.imageUrl,
                    taskTitle:updatedData.taskTitle,
                    taskType:updatedData.taskType,
                    taskDescription:updatedData.taskDescription,
            };
        } 
        return cardObject;
    });
    
    localStorage.setItem("tasky",JSON.stringify({cards:globalstore}));

    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.innerHTML="Open task";
    submitButton.setAttribute("onclick","openTask.apply(this,arguments)");
}

const openTask=(event)=>{
    event=window.event;
    const targetId=event.target.id; 
    const taskArray=globalstore.filter((cardObject)=>cardObject.id===targetId);
    taskArray.map((taskObject)=>{
        document.getElementById("gettasktitle").value=taskObject.taskTitle;
        document.getElementById("getimageurl").value=taskObject.imageUrl;
        document.getElementById("gettaskdescription").value=taskObject.taskDescription;
        document.getElementById("gettasktype").value=taskObject.taskType;   
      });
      var modal=new bootstrap.Modal(document.querySelector("#taskModal"));
      modal.show();

}