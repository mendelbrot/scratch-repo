import React from 'react'
import PrimaryButton from './buttons/primary-button'

import FlexItem from './flex/flex-item'
import PieChart from './pie-chart'

const PrizeItem = ({id, imageSrc, inventory, name, redeemPrize}) => (
  <FlexItem margin="sm">
    <h5>{name}</h5>
    <img width={250} height={250} src={imageSrc} alt="prize item" />
    <PieChart inventory={inventory} />
    <PrimaryButton onClick={() => redeemPrize(id)}>
      Redeem One Prize
    </PrimaryButton>
  </FlexItem>
)

export default PrizeItem
