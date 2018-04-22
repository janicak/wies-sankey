import { csvArrayToObject, sankeyData } from './data';

const linkColorOpacity = '0.3';
const otherColor = 'rgb(135, 135, 135)';
const rgbToRgba = (rgb, opacity) => (
  rgb.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
);

export const display = {
  cols: ['Organization Type', 'Role Type', 'Expenditure Type', 'Focus Area', 'Program'],
  nodeOrderColorKey: {
    ['USC - Dornsife']: 'USC', ['USC - Other']: 'USC',
    ['Other College / University']: 'Other College / University', ['Other Organization']: 'Other Organization',
    ['Faculty']: 'Faculty', ['Graduate Student']: 'Graduate Student',
    ['Undergraduate Student']: 'Undergraduate Student', ['Other Participant']: 'Other Participant',
    ['Basic Research']: 'Research', ['Applied Research']: 'Research',
    ['Mentorship']: 'Education', ['Fellowship']: 'Education', ['Class']: 'Education', ['Internship']: 'Education',
    ['NSF REU']: 'Outreach', ['Other Outreach']: 'Outreach', ['Other Activity']: 'Other Activity',
    ['Coastal Megacity Research']: 'Coastal Megacity', ['Coastal Megacity Education']: 'Coastal Megacity',
    ['Coastal Megacity Outreach']: 'Coastal Megacity',
    ['Healthy Oceans Research']: 'Healthy Oceans', ['Healthy Oceans Education']: 'Healthy Oceans',
    ['Healthy Oceans Outreach']: 'Healthy Oceans',
    ['Island Sustainability Research']: 'Island Sustainability',
    ['Island Sustainability Education']: 'Island Sustainability', ['Island Sustainability Outreach']: 'Island Sustainability',
    ['Other Research']: 'Other Program', ['Other Education']: 'Other Program',
    ['Coastal Megacity']: 'Coastal Megacity', ['Healthy Oceans']: 'Healthy Oceans',
    ['Island Sustainability']: 'Island Sustainability', ['Other Program']: 'Other Program'
  },
  colorScheme: {
    ['USC']: { color: 'rgb(229, 57, 57)', linkColor: rgbToRgba('rgb(229, 57, 57)', linkColorOpacity) },
    ['Other College / University']: { color: 'rgb(221, 190, 95)', linkColor: rgbToRgba('rgb(221, 190, 95)', linkColorOpacity) },
    ['Other Organization']: { color: otherColor, linkColor: rgbToRgba(otherColor, linkColorOpacity) },
    ['Faculty']: { color: 'rgb(206, 101, 204)', linkColor: rgbToRgba('rgb(206, 101, 204)', linkColorOpacity) },
    ['Graduate Student']: { color: 'rgb(146, 206, 97)', linkColor: rgbToRgba('rgb(146, 206, 97)', linkColorOpacity) },
    ['Undergraduate Student']: { color: 'rgb(97, 206, 198)', linkColor: rgbToRgba('rgb(97, 206, 198)', linkColorOpacity) },
    ['Other Participant']: { color: otherColor, linkColor: rgbToRgba(otherColor, linkColorOpacity) },
    ['Research']: { color: 'rgb(119, 124, 229)', linkColor: rgbToRgba('rgb(119, 124, 229)', linkColorOpacity) },
    ['Education']: { color: 'rgb(185, 191, 97)', linkColor: rgbToRgba('rgb(185, 191, 97)', linkColorOpacity) },
    ['Outreach']: { color: 'rgb(214, 128, 104)', linkColor: rgbToRgba('rgb(214, 128, 104)', linkColorOpacity) },
    ['Other Activity']: { color: otherColor, linkColor: rgbToRgba(otherColor, linkColorOpacity) },
    ['Coastal Megacity']: { color: 'rgb(108, 204, 120)', linkColor: rgbToRgba('rgb(108, 204, 120)', linkColorOpacity) },
    ['Healthy Oceans']: { color: 'rgb(127, 160, 239)', linkColor: rgbToRgba('rgb(127, 160, 239)', linkColorOpacity) },
    ['Island Sustainability']: { color: 'rgb(234, 218, 164)', linkColor: rgbToRgba('rgb(234, 218, 164)', linkColorOpacity) },
    ['Other Program']:  { color: otherColor, linkColor: rgbToRgba(otherColor, linkColorOpacity) }
  }
};

export const graph = (nodes, links, customdata) => ({
  data: [{
    type: "sankey",
    showlegend: false,
    arrangement: 'fixed',
    domain: {
      x: [0,1],
      y: [0,1]
    },
    orientation: "h",
    valueformat: ".1f",
    valuesuffix: " Activities",
    node: {
      ...nodes,
      pad: 5,
      thickness: 20,
      line: {
        color: "black",
        width: 0.5
      },
    },
    link: {
      ...links
    },
    customdata
  }],
  layout: {
    //title: "WIES Participant Activity Breakdown",
    width: 0,
    height: 0,
    font: {
      size: 12
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
      pad: 0
    }
  },
  config: {
    displayModeBar: false
  },
  display
});
