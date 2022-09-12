import React from 'react'
import {Pie} from 'react-chartjs-2/'
import Spacing from './spacing'
import {colors} from './constants'

const PieChart = ({inventory = {}}) => {
  const {available, assigned, redeemed} = inventory
  const data = {
    labels: [`${available} Available`, `${assigned} Assigned`, `${redeemed} Redeemed`],
    datasets: [
      {
        data: [available, assigned, redeemed],
        backgroundColor: [colors.green, colors.yellow, colors.blue],
        hoverBackgroundColor: [colors.darkGreen, colors.darkYellow, colors.darkBlue]
      }
    ]
  }

  const options = {
    legend: {
      labels: {
        fontColor: colors.white,
        fontSize: 16
      }
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItems, data) {
          return data.labels[tooltipItems.index]
        }
      }
    }
  }

  return (
    <Spacing margin="md">
      <Pie width={250} height={250} data={data} options={options} />
    </Spacing>
  )
}

export default PieChart
