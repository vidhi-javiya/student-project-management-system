import React from "react";
import "./DashboardCards.css";

import {
  Assignment,
  Task,
  CheckCircle,
  PendingActions,
  Event,
} from "@mui/icons-material";


import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";


import { Doughnut, Bar } from "react-chartjs-2";


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);



const DashboardCards = () => {



const cards = [

{
title:"Active Projects",
count:"35",
icon:<Assignment/>,
color:"blue"
},


{
title:"Completed Projects",
count:"120",
icon:<CheckCircle/>,
color:"green"
},


{
title:"Pending Tasks",
count:"25",
icon:<PendingActions/>,
color:"orange"
},


{
title:"Upcoming Deadlines",
count:"8",
icon:<Event/>,
color:"purple"
},


{
title:"Total Tasks",
count:"180",
icon:<Task/>,
color:"success"
}


];





const projectData = {


labels:[

"Active Projects",
"Completed Projects",
"Pending Projects"

],


datasets:[

{

data:[35,120,25],


backgroundColor:[

"#2563eb",
"#22c55e",
"#f97316"

],


borderWidth:3,


borderColor:"#ffffff"

}

]


};







const taskData = {


labels:[

"Low Priority",
"Medium Priority",
"High Priority"

],



datasets:[


{

label:"Tasks",


data:[50,80,50],


backgroundColor:[

"#22c55e",
"#3b82f6",
"#ef4444"

],


borderRadius:8

}


]


};







const doughnutOptions = {


responsive:true,

maintainAspectRatio:false,


cutout:"65%",


plugins:{


legend:{


position:"bottom"


}


}


};







const barOptions = {


responsive:true,


maintainAspectRatio:false,


plugins:{


legend:{


display:false


}


},



scales:{


y:{


beginAtZero:true


}


}


};









return (

<>



{/* Dashboard Cards */}



<div className="cards">


{

cards.map((card,index)=>(


<div className="card" key={index}>


<div className={`icon ${card.color}`}>

{card.icon}

</div>



<h2>

{card.count}

</h2>



<p>

{card.title}

</p>



</div>


))


}



</div>









{/* Charts */}



<div className="chart-container">





<div className="chart-card">


<h3>

Project Statistics

</h3>



<div className="chart">


<Doughnut

data={projectData}

options={doughnutOptions}

/>


</div>



</div>









<div className="chart-card">


<h3>

Task Priority Statistics

</h3>



<div className="chart">


<Bar

data={taskData}

options={barOptions}

/>


</div>



</div>





</div>









{/* Upcoming Deadlines */}













</>

);


};



export default DashboardCards;