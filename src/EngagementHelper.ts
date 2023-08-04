// EngagementHelper.js
import Highcharts, { Point , Options } from "highcharts"


interface Message {
  count : string , 
  timeBucket : string , 
  channelId : string
}

interface Channel {
   id : string , 
   name : string
}

interface ChannelsWithMultipleDates {
   [key : string] : number
}


const plotEvents = {  
  mouseOver(this : Point){
    const activePoint = this.series.chart.hoverPoint
    const xvalue = activePoint?.x
    activePoint?.series.chart.xAxis[0].addPlotLine({
      value : xvalue , 
      color : "white" , 
      width : 1 , 
      zIndex : 10 , 
      id : "active-x-grid-line"
    })
  },
  mouseOut(this : Point){
   this.series.chart.xAxis[0].removePlotLine("active-x-grid-line")
  }
} 


const engagementMessageOverTimeChartOptions = (messageCountList : Message[], channels : Channel[]) => {
  // channels with messages on more than one date
  const channelsWithMultipleDates   = messageCountList.reduce((acc : ChannelsWithMultipleDates, msg) => {
    
    if (acc[msg.channelId]) {
      acc[msg.channelId]++;
    } else {
      acc[msg.channelId] = 1;
    }
    return acc;
  }, {});


  // const uniqueDates = new Set(messageCountList.map(msg => new Date(msg.timeBucket).getTime()))

  // console.log(Array.from(uniqueDates).map(timestamp => Highcharts.dateFormat("%d-%b" , timestamp)))

  

  //  channels that have messages on more than one date
  const relevantChannels = channels.filter(
    (channel : Channel) => channelsWithMultipleDates[channel.id] > 1
  );


  const seriesData   = relevantChannels.map((channel) => {
    const data = messageCountList
      .filter((msg) => msg.channelId === channel.id)
      .map((msg) => [new Date(msg.timeBucket).getTime(), parseInt(msg.count)]);
    
    return {
      name: channel.name,
      data,
    };
  });



  // Define Highcharts options
  const options : Options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "",
      },
      // categories : Array.from(uniqueDates).map(timestamp => Highcharts.dateFormat("%d-%b" , timestamp)),
      grid : {
        enabled : false ,
        
      }, 
    
    },
    yAxis: {
        title: {
          text: "",
        }, 
    },
    colors : ["#008F8D"] , 
    tooltip: {
      className : "tooltip-custom",
      formatter: function () {
        return (
          `<strong >${this.series.name}</strong><br>` +
          `<p > ${this.y} messages on ${Highcharts.dateFormat("%d-%b", parseInt(this?.x))} </p>`
        );
      },
      
    },
    plotOptions : {
      series : {
        point : {
          events : plotEvents ,
        }
      }
    },
    series: seriesData,
  };

  return options;
};

const engagementHelper = {
  engagementMessageOverTimeChartOptions,
};

export default engagementHelper;
