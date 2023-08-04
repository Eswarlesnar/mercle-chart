// EngagementHelper.js
import Highcharts from "highcharts"
import { Options } from "./App";


// EngagementHelper.js

const engagementMessageOverTimeChartOptions = (messageCountList, channels) => {
  // Extract channelIds with messages on more than one date
  const channelsWithMultipleDates = messageCountList.reduce((acc, msg) => {
    if (acc[msg.channelId]) {
      acc[msg.channelId]++;
    } else {
      acc[msg.channelId] = 1;
    }
    return acc;
  }, {});

  // Filter channels that have messages on more than one date
  const relevantChannels = channels.filter(
    (channel) => channelsWithMultipleDates[channel.id] > 1
  );


  console.log(relevantChannels, "relevantChanels")

  // Prepare data for Highcharts
  const seriesData = relevantChannels.map((channel) => {
    const data = messageCountList
      .filter((msg) => msg.channelId === channel.id)
      .map((msg) => [new Date(msg.timeBucket).getTime(), parseInt(msg.count)]);
    console.log(data , "dtat")
    return {
      name: channel.name,
      data,
    };
  });

  console.log(seriesData)

  // Define Highcharts options
  const options : Options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "Engagement: Messages Over Time",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Message Count",
      },
      
    },
    colors : ["#008F8D"] , 
    tooltip: {
      className : "tooltip-custom",
      formatter: function () {
        return (
          `<strong >${this.series.name}</strong><br>` +
          `<p > ${this.y} messages on ${Highcharts.dateFormat("%d-%b", this.x)} </p>`
        );
      },
    },
    series: seriesData,
  };

  return options;
};

const engagementHelper = {
  engagementMessageOverTimeChartOptions,
};

export default engagementHelper;
