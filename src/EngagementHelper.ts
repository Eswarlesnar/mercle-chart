// EngagementHelper.js
import Highcharts, { Point , Options, TooltipFormatterContextObject  } from "highcharts"


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
    });
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
      styledMode : true
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "",
      },
      grid : {
        enabled : false ,
      }, 
      tickInterval : 24*3600*1000
    },
    yAxis: {
        title: {
          text: "",
        }, 
        tickWidth : 2,
    },
    colors : ["#008F8D"] , 
    tooltip: {
      className : "tooltip-custom",
      formatter: function (this : TooltipFormatterContextObject) {
        //dateFormat typescript is complaining about s
        const dateString = this.x?.toString() ?? "N/A"
        return (
          `<strong >${this.series.name}</strong><br>` +
          `<p > ${this.y} messages on ${ Highcharts.dateFormat("%d-%b", parseInt(dateString))} </p>`
        );
      },
    
      
    },
    plotOptions : {
      series : {
        marker : {
          enabled : false
        },
        point : {
          events : plotEvents ,
        }, 
      }
    },
    // @ts-ignore
    series: seriesData,
  };

  return options;
};


const engagementHelper = {
  engagementMessageOverTimeChartOptions,
};

export default engagementHelper;
