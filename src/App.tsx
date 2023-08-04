import HighchartsReact  from 'highcharts-react-official'
import * as Highcharts from "highcharts"
import {messageCountList , channels} from './data.ts'
import engagementHelper from "./EngagementHelper.ts"
import './App.css'



const App = (props: HighchartsReact.Props) =>  {

  const options  = engagementHelper.engagementMessageOverTimeChartOptions(messageCountList, channels)
 
 return <HighchartsReact 
   highcharts = {Highcharts} options = {options}  {...props}/>
}

export default App
